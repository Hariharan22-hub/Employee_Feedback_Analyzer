package com.employeefeedback.service;

import com.employeefeedback.dto.AnalysisResultDto;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.*;

@Service
public class GeminiService {

    private static final Logger logger = LoggerFactory.getLogger(GeminiService.class);

    @Value("${app.gemini.api-key:}")
    private String geminiApiKey;

    @Value("${app.gemini.model:gemini-2.5-flash}")
    private String geminiModel;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    public AnalysisResultDto analyzeFeedback(String text, String department) {
        if (geminiApiKey == null || geminiApiKey.trim().isEmpty() || geminiApiKey.contains("your_gemini_api_key")) {
            logger.warn("Gemini API key is not configured. Falling back to intelligent heuristic analyzer.");
            return generateHeuristicAnalysis(text, department);
        }

        try {
            return callGeminiForFeedbackAnalysis(text, department);
        } catch (Exception e) {
            logger.error("Gemini API invocation failed: {}. Falling back to resilient heuristic analysis.", e.getMessage());
            return generateHeuristicAnalysis(text, department);
        }
    }

    public String generateAnswerWithContext(String question, String context) {
        if (geminiApiKey == null || geminiApiKey.trim().isEmpty() || geminiApiKey.contains("your_gemini_api_key")) {
            return generateHeuristicRagAnswer(question, context);
        }

        try {
            return callGeminiForRagAnswer(question, context);
        } catch (Exception e) {
            logger.error("Gemini RAG generation failed: {}. Using context-based synthesis.", e.getMessage());
            return generateHeuristicRagAnswer(question, context);
        }
    }

    private AnalysisResultDto callGeminiForFeedbackAnalysis(String text, String department) throws Exception {
        String prompt = """
                You are an enterprise AI workplace feedback analyzer. Analyze the following employee workplace feedback:
                Department: %s
                Feedback: "%s"

                Respond ONLY with a valid, raw JSON object (no markdown code blocks, no backticks, no explanatory text) with exactly these keys:
                {
                  "sentiment": "POSITIVE" | "NEUTRAL" | "NEGATIVE",
                  "sentimentScore": <double between -1.0 and 1.0>,
                  "emotion": "Happy" | "Frustrated" | "Angry" | "Concerned" | "Satisfied" | "Disappointed" | "Neutral",
                  "intent": "Complaint" | "Suggestion" | "Appreciation" | "Request" | "Concern" | "Query" | "General feedback",
                  "topic": "Workload" | "Management" | "Compensation" | "Work Environment" | "Career Growth" | "Team Collaboration" | "Communication" | "Leave" | "Benefits" | "Recognition" | "Workplace Culture" | "Other",
                  "urgency": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
                  "summary": "<concise 1-2 sentence factual summary>",
                  "recommendation": "<actionable HR recommendation>",
                  "keyConcern": "<2-4 word theme label e.g. Workload Burnout or Remote Policy or Health Benefits>"
                }
                """.formatted(department, text.replace("\"", "\\\""));

        String responseBody = invokeGeminiApi(prompt);
        String cleanedJson = cleanJsonResponse(responseBody);

        return objectMapper.readValue(cleanedJson, AnalysisResultDto.class);
    }

    private String callGeminiForRagAnswer(String question, String context) throws Exception {
        String prompt = """
                You are an authoritative HR Knowledge Assistant. Answer the employee/HR question accurately based ONLY on the provided organizational policies.
                
                Policy Context:
                %s

                Question:
                %s

                Guidelines:
                - Formulate a clear, direct, professional answer.
                - State the exact rules, limits, days, or procedures mentioned in the policy.
                - If the question cannot be answered from the provided policy context, state politely that the specific policy does not cover it and advise consulting the HR department directly.
                - Keep the response structured and easy to read.
                """.formatted(context, question);

        return invokeGeminiApi(prompt);
    }

    private String invokeGeminiApi(String prompt) throws Exception {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/" + geminiModel + ":generateContent?key=" + geminiApiKey;

        Map<String, Object> part = Map.of("text", prompt);
        Map<String, Object> content = Map.of("parts", List.of(part));
        Map<String, Object> requestPayload = Map.of("contents", List.of(content));

        String requestJson = objectMapper.writeValueAsString(requestPayload);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Content-Type", "application/json")
                .timeout(Duration.ofSeconds(15))
                .POST(HttpRequest.BodyPublishers.ofString(requestJson))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            // Try with gemini-1.5-flash if gemini-2.5-flash returned 404 or error
            if (response.statusCode() == 404 && !"gemini-1.5-flash".equals(geminiModel)) {
                String fallbackUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + geminiApiKey;
                HttpRequest fallbackReq = HttpRequest.newBuilder()
                        .uri(URI.create(fallbackUrl))
                        .header("Content-Type", "application/json")
                        .timeout(Duration.ofSeconds(15))
                        .POST(HttpRequest.BodyPublishers.ofString(requestJson))
                        .build();
                HttpResponse<String> fbResponse = httpClient.send(fallbackReq, HttpResponse.BodyHandlers.ofString());
                if (fbResponse.statusCode() == 200) {
                    return extractCandidateText(fbResponse.body());
                }
            }
            throw new RuntimeException("Gemini API HTTP Error " + response.statusCode() + ": " + response.body());
        }

        return extractCandidateText(response.body());
    }

    private String extractCandidateText(String apiResponseBody) throws Exception {
        JsonNode root = objectMapper.readTree(apiResponseBody);
        JsonNode candidates = root.path("candidates");
        if (candidates.isArray() && !candidates.isEmpty()) {
            JsonNode parts = candidates.get(0).path("content").path("parts");
            if (parts.isArray() && !parts.isEmpty()) {
                return parts.get(0).path("text").asText();
            }
        }
        throw new RuntimeException("No text candidates found in Gemini response: " + apiResponseBody);
    }

    private String cleanJsonResponse(String raw) {
        String cleaned = raw.trim();
        if (cleaned.startsWith("```json")) {
            cleaned = cleaned.substring(7);
        } else if (cleaned.startsWith("```")) {
            cleaned = cleaned.substring(3);
        }
        if (cleaned.endsWith("```")) {
            cleaned = cleaned.substring(0, cleaned.length() - 3);
        }
        return cleaned.trim();
    }

    /**
     * Resilient fallback heuristic analyzer when Gemini API is unavailable or unconfigured.
     */
    public AnalysisResultDto generateHeuristicAnalysis(String text, String department) {
        String lower = text.toLowerCase(Locale.ROOT);

        // Determine sentiment & emotion
        String sentiment = "NEUTRAL";
        double score = 0.0;
        String emotion = "Neutral";
        String urgency = "LOW";
        String intent = "General feedback";
        String topic = "Other";
        String keyConcern = "General Workplace Feedback";

        // Urgency signals
        if (lower.contains("urgent") || lower.contains("harass") || lower.contains("resign") ||
                lower.contains("toxic") || lower.contains("burnout") || lower.contains("critical") ||
                lower.contains("safety hazard") || lower.contains("illegal") || lower.contains("severe")) {
            urgency = "HIGH";
            if (lower.contains("harass") || lower.contains("toxic") || lower.contains("safety hazard") || lower.contains("severe")) {
                urgency = "CRITICAL";
            }
        } else if (lower.contains("struggling") || lower.contains("deadline") || lower.contains("delay") ||
                lower.contains("overtime") || lower.contains("problem") || lower.contains("concern") || lower.contains("issue")) {
            urgency = "MEDIUM";
        }

        // Topic detection
        if (lower.contains("workload") || lower.contains("deadline") || lower.contains("overtime") || lower.contains("exhaust") || lower.contains("burnout")) {
            topic = "Workload";
            keyConcern = "Workload Pressure";
        } else if (lower.contains("manager") || lower.contains("leadership") || lower.contains("boss") || lower.contains("supervis")) {
            topic = "Management";
            keyConcern = "Leadership Communication";
        } else if (lower.contains("pay") || lower.contains("salary") || lower.contains("compensation") || lower.contains("bonus") || lower.contains("raise")) {
            topic = "Compensation";
            keyConcern = "Compensation & Benefits";
        } else if (lower.contains("remote") || lower.contains("wfh") || lower.contains("hybrid") || lower.contains("office") || lower.contains("desk")) {
            topic = "Work Environment";
            keyConcern = "Workplace Environment";
        } else if (lower.contains("leave") || lower.contains("vacation") || lower.contains("pto") || lower.contains("sick")) {
            topic = "Leave";
            keyConcern = "Leave Policy";
        } else if (lower.contains("promotion") || lower.contains("growth") || lower.contains("career") || lower.contains("learning")) {
            topic = "Career Growth";
            keyConcern = "Career Advancement";
        } else if (lower.contains("team") || lower.contains("colleague") || lower.contains("peer") || lower.contains("collaboration")) {
            topic = "Team Collaboration";
            keyConcern = "Team Collaboration";
        }

        // Sentiment & Emotion
        boolean hasNegative = lower.contains("struggling") || lower.contains("hard") || lower.contains("unfair") ||
                lower.contains("poor") || lower.contains("bad") || lower.contains("frustrat") ||
                lower.contains("angry") || lower.contains("stress") || lower.contains("difficult") ||
                lower.contains("unhappy") || lower.contains("disappoint") || lower.contains("slow");

        boolean hasPositive = lower.contains("great") || lower.contains("good") || lower.contains("appreciat") ||
                lower.contains("thank") || lower.contains("love") || lower.contains("happy") ||
                lower.contains("excel") || lower.contains("enjoy") || lower.contains("support");

        if (hasNegative && !hasPositive) {
            sentiment = "NEGATIVE";
            score = urgency.equals("CRITICAL") || urgency.equals("HIGH") ? -0.8 : -0.5;
            if (lower.contains("angry") || lower.contains("furious") || lower.contains("toxic")) {
                emotion = "Angry";
            } else if (lower.contains("frustrat") || lower.contains("struggling") || lower.contains("delay")) {
                emotion = "Frustrated";
            } else if (lower.contains("disappoint")) {
                emotion = "Disappointed";
            } else {
                emotion = "Concerned";
            }
        } else if (hasPositive && !hasNegative) {
            sentiment = "POSITIVE";
            score = 0.8;
            emotion = lower.contains("thank") || lower.contains("appreciat") ? "Satisfied" : "Happy";
        } else {
            sentiment = "NEUTRAL";
            score = 0.1;
            emotion = "Neutral";
        }

        // Intent
        if (lower.contains("suggest") || lower.contains("recommend") || lower.contains("propose") || lower.contains("would be great if")) {
            intent = "Suggestion";
        } else if (lower.contains("please") || lower.contains("can we") || lower.contains("request")) {
            intent = "Request";
        } else if (hasNegative) {
            intent = "Complaint";
        } else if (hasPositive) {
            intent = "Appreciation";
        }

        String summary = "Employee in " + department + " shares feedback regarding " + topic.toLowerCase() + ": \"" +
                (text.length() > 90 ? text.substring(0, 87) + "..." : text) + "\"";

        String recommendation;
        if ("NEGATIVE".equals(sentiment) || "HIGH".equals(urgency) || "CRITICAL".equals(urgency)) {
            recommendation = "Schedule a confidential review session with " + department + " leadership to address " + topic.toLowerCase() + " concerns and implement remedial support.";
        } else if ("POSITIVE".equals(sentiment)) {
            recommendation = "Acknowledge and reinforce the positive workplace practices observed in the " + department + " team.";
        } else {
            recommendation = "Review employee input regarding " + topic.toLowerCase() + " during upcoming departmental operational check-ins.";
        }

        return new AnalysisResultDto(sentiment, score, emotion, intent, topic, urgency, summary, recommendation, keyConcern);
    }

    private String generateHeuristicRagAnswer(String question, String context) {
        StringBuilder sb = new StringBuilder();
        sb.append("Based on the company HR policy documentation:\n\n");

        String[] lines = context.split("\n");
        int matchedLines = 0;
        for (String line : lines) {
            String trimmed = line.trim();
            if (!trimmed.isEmpty() && !trimmed.startsWith("#")) {
                sb.append("• ").append(trimmed).append("\n");
                matchedLines++;
                if (matchedLines >= 5) break;
            }
        }

        if (matchedLines == 0) {
            sb.append("Please refer to the complete organizational policy repository or contact HR People Partners directly for tailored assistance.");
        } else {
            sb.append("\nFor detailed formal procedures or special accommodations, please contact your department HR Business Partner.");
        }

        return sb.toString();
    }
}
