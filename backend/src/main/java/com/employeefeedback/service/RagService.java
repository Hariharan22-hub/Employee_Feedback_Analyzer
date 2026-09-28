package com.employeefeedback.service;

import com.employeefeedback.dto.AskAssistantResponse;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RagService {

    private static final Logger logger = LoggerFactory.getLogger(RagService.class);

    private final GeminiService geminiService;
    private final List<DocumentChunk> documentChunks = new ArrayList<>();
    private final Map<String, Double> idfMap = new HashMap<>();

    public static class DocumentChunk {
        private final String sourceName;
        private final String content;
        private final Map<String, Double> tfMap;
        private double vectorMagnitude;

        public DocumentChunk(String sourceName, String content) {
            this.sourceName = sourceName;
            this.content = content;
            this.tfMap = new HashMap<>();
            computeTf();
        }

        private void computeTf() {
            List<String> tokens = tokenize(content);
            if (tokens.isEmpty()) return;
            for (String t : tokens) {
                tfMap.put(t, tfMap.getOrDefault(t, 0.0) + 1.0);
            }
            for (Map.Entry<String, Double> entry : tfMap.entrySet()) {
                entry.setValue(entry.getValue() / tokens.size());
            }
        }

        public String getSourceName() {
            return sourceName;
        }

        public String getContent() {
            return content;
        }

        public Map<String, Double> getTfMap() {
            return tfMap;
        }

        public double getVectorMagnitude() {
            return vectorMagnitude;
        }

        public void setVectorMagnitude(double vectorMagnitude) {
            this.vectorMagnitude = vectorMagnitude;
        }
    }

    public RagService(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @PostConstruct
    public void initializeKnowledgeBase() {
        try {
            PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
            Resource[] resources = resolver.getResources("classpath:knowledge_base/*.txt");

            if (resources.length == 0) {
                logger.warn("No policy files discovered in classpath:knowledge_base/*.txt");
                return;
            }

            for (Resource resource : resources) {
                String filename = resource.getFilename();
                String content;
                try (BufferedReader reader = new BufferedReader(new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {
                    content = reader.lines().collect(Collectors.joining("\n"));
                }

                // Split policy into coherent paragraphs / sections
                String[] sections = content.split("(?=\\n\\d+\\.\\s+)");
                for (String section : sections) {
                    String trimmed = section.trim();
                    if (!trimmed.isEmpty()) {
                        documentChunks.add(new DocumentChunk(filename, trimmed));
                    }
                }
            }

            // Compute Inverse Document Frequency (IDF)
            int totalChunks = documentChunks.size();
            Map<String, Integer> docFreq = new HashMap<>();

            for (DocumentChunk chunk : documentChunks) {
                for (String term : chunk.getTfMap().keySet()) {
                    docFreq.put(term, docFreq.getOrDefault(term, 0) + 1);
                }
            }

            for (Map.Entry<String, Integer> entry : docFreq.entrySet()) {
                double idf = Math.log(1.0 + ((double) totalChunks / (1.0 + entry.getValue()))) + 1.0;
                idfMap.put(entry.getKey(), idf);
            }

            // Precompute vector magnitude for each chunk
            for (DocumentChunk chunk : documentChunks) {
                double sumSquares = 0.0;
                for (Map.Entry<String, Double> entry : chunk.getTfMap().entrySet()) {
                    double tfIdf = entry.getValue() * idfMap.getOrDefault(entry.getKey(), 1.0);
                    sumSquares += tfIdf * tfIdf;
                }
                chunk.setVectorMagnitude(Math.sqrt(sumSquares));
            }

            logger.info("Knowledge base initialized with {} policy chunks from {} documents.", documentChunks.size(), resources.length);

        } catch (Exception e) {
            logger.error("Failed to initialize RAG knowledge base: {}", e.getMessage(), e);
        }
    }

    public AskAssistantResponse askQuestion(String question) {
        if (documentChunks.isEmpty()) {
            return new AskAssistantResponse(
                    question,
                    "Knowledge base is currently empty or indexing. Please contact HR administrator.",
                    List.of()
            );
        }

        // Vectorize query
        List<String> queryTokens = tokenize(question);
        Map<String, Double> queryTf = new HashMap<>();
        for (String token : queryTokens) {
            queryTf.put(token, queryTf.getOrDefault(token, 0.0) + 1.0);
        }
        for (Map.Entry<String, Double> entry : queryTf.entrySet()) {
            entry.setValue(entry.getValue() / queryTokens.size());
        }

        double queryMagnitude = 0.0;
        Map<String, Double> queryTfIdf = new HashMap<>();
        for (Map.Entry<String, Double> entry : queryTf.entrySet()) {
            double tfIdf = entry.getValue() * idfMap.getOrDefault(entry.getKey(), 1.0);
            queryTfIdf.put(entry.getKey(), tfIdf);
            queryMagnitude += tfIdf * tfIdf;
        }
        queryMagnitude = Math.sqrt(queryMagnitude);

        // Compute Cosine Similarity for each chunk
        List<ScoredChunk> scoredChunks = new ArrayList<>();
        for (DocumentChunk chunk : documentChunks) {
            double dotProduct = 0.0;
            for (Map.Entry<String, Double> qEntry : queryTfIdf.entrySet()) {
                Double chunkTf = chunk.getTfMap().get(qEntry.getKey());
                if (chunkTf != null) {
                    double chunkTfIdf = chunkTf * idfMap.getOrDefault(qEntry.getKey(), 1.0);
                    dotProduct += qEntry.getValue() * chunkTfIdf;
                }
            }

            double similarity = 0.0;
            if (queryMagnitude > 0 && chunk.getVectorMagnitude() > 0) {
                similarity = dotProduct / (queryMagnitude * chunk.getVectorMagnitude());
            }

            scoredChunks.add(new ScoredChunk(chunk, similarity));
        }

        // Sort descending by similarity
        scoredChunks.sort((a, b) -> Double.compare(b.similarity, a.similarity));

        // Select top chunks
        List<ScoredChunk> topMatches = scoredChunks.stream()
                .limit(3)
                .collect(Collectors.toList());

        // Extract context and unique sources
        StringBuilder contextBuilder = new StringBuilder();
        Set<String> uniqueSources = new LinkedHashSet<>();

        for (ScoredChunk match : topMatches) {
            contextBuilder.append("--- SOURCE: ").append(match.chunk.getSourceName()).append(" ---\n")
                    .append(match.chunk.getContent()).append("\n\n");
            uniqueSources.add(match.chunk.getSourceName().replace("_", " ").replace(".txt", ""));
        }

        // Generate response using Gemini RAG context
        String answer = geminiService.generateAnswerWithContext(question, contextBuilder.toString());

        return new AskAssistantResponse(question, answer, new ArrayList<>(uniqueSources));
    }

    private static final Set<String> STOP_WORDS = Set.of(
            "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for", "with", "by", "about",
            "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "do", "does", "did",
            "what", "when", "where", "how", "who", "which", "why", "of", "can", "could", "would", "should"
    );

    public static List<String> tokenize(String text) {
        if (text == null) return List.of();
        String cleaned = text.toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9\\s]", " ");
        String[] words = cleaned.split("\\s+");
        List<String> tokens = new ArrayList<>();
        for (String w : words) {
            String trimmed = w.trim();
            if (trimmed.length() > 2 && !STOP_WORDS.contains(trimmed)) {
                tokens.add(trimmed);
            }
        }
        return tokens;
    }

    private static class ScoredChunk {
        final DocumentChunk chunk;
        final double similarity;

        ScoredChunk(DocumentChunk chunk, double similarity) {
            this.chunk = chunk;
            this.similarity = similarity;
        }
    }
}
