package com.employeefeedback;

import com.employeefeedback.dto.AnalysisResultDto;
import com.employeefeedback.dto.AskAssistantResponse;
import com.employeefeedback.service.GeminiService;
import com.employeefeedback.service.RagService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class AiAndRagTest {

    @Autowired
    private GeminiService geminiService;

    @Autowired
    private RagService ragService;

    @Test
    @DisplayName("19 & 20. AI Analysis extracts sentiment, emotion, topic, urgency, summary, recommendation")
    void testAiFeedbackAnalysis() {
        String feedback = "The workload has increased significantly and the team is struggling to meet deadlines.";
        AnalysisResultDto result = geminiService.analyzeFeedback(feedback, "Engineering");

        assertNotNull(result);
        assertEquals("NEGATIVE", result.getSentiment());
        assertTrue(result.getSentimentScore() <= 0.0);
        assertEquals("Workload", result.getTopic());
        assertTrue("MEDIUM".equals(result.getUrgency()) || "HIGH".equals(result.getUrgency()));
        assertNotNull(result.getSummary());
        assertNotNull(result.getRecommendation());
        assertNotNull(result.getKeyConcern());
    }

    @Test
    @DisplayName("AI Analysis handles positive appreciation feedback")
    void testAiPositiveAnalysis() {
        String feedback = "I really appreciate the support and mentorship from my manager and team.";
        AnalysisResultDto result = geminiService.analyzeFeedback(feedback, "Product");

        assertNotNull(result);
        assertEquals("POSITIVE", result.getSentiment());
        assertTrue(result.getSentimentScore() > 0.0);
        assertNotNull(result.getRecommendation());
    }

    @Test
    @DisplayName("21 & 22. RAG Knowledge retrieval accurately matches policy documents and returns answer with sources")
    void testRagKnowledgeRetrieval() {
        // Query about leave
        AskAssistantResponse leaveResp = ragService.askQuestion("What is the annual paid vacation and sick leave policy?");
        assertNotNull(leaveResp.getAnswer());
        assertFalse(leaveResp.getSources().isEmpty());
        assertTrue(leaveResp.getSources().stream().anyMatch(s -> s.toLowerCase().contains("leave")),
                "Sources should include leave policy");

        // Query about remote work / WFH
        AskAssistantResponse wfhResp = ragService.askQuestion("How many days per week can employees work remotely from home?");
        assertNotNull(wfhResp.getAnswer());
        assertFalse(wfhResp.getSources().isEmpty());
        assertTrue(wfhResp.getSources().stream().anyMatch(s -> s.toLowerCase().contains("work from home")),
                "Sources should include work from home policy");
    }
}
