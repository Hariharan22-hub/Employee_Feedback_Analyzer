package com.employeefeedback.service;

import com.employeefeedback.dto.AnalyticsResponse;
import com.employeefeedback.repository.FeedbackRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final FeedbackRepository feedbackRepository;

    public AnalyticsService(FeedbackRepository feedbackRepository) {
        this.feedbackRepository = feedbackRepository;
    }

    @Transactional(readOnly = true)
    public AnalyticsResponse getAnalytics() {
        AnalyticsResponse resp = new AnalyticsResponse();

        long total = feedbackRepository.count();
        resp.setTotalFeedback(total);

        if (total == 0) {
            resp.setPositiveCount(0);
            resp.setNeutralCount(0);
            resp.setNegativeCount(0);
            resp.setUrgentCount(0);
            resp.setSentimentDistribution(Collections.emptyMap());
            resp.setDepartmentDistribution(Collections.emptyMap());
            resp.setUrgencyDistribution(Collections.emptyMap());
            resp.setTopicDistribution(Collections.emptyMap());
            resp.setRecurringConcerns(Collections.emptyList());
            resp.setOrganizationalInsight("No feedback data available yet. Insights will automatically populate when employees submit feedback.");
            return resp;
        }

        long positive = feedbackRepository.countBySentiment("POSITIVE");
        long neutral = feedbackRepository.countBySentiment("NEUTRAL");
        long negative = feedbackRepository.countBySentiment("NEGATIVE");
        long highUrgency = feedbackRepository.countByUrgency("HIGH");
        long critUrgency = feedbackRepository.countByUrgency("CRITICAL");

        resp.setPositiveCount(positive);
        resp.setNeutralCount(neutral);
        resp.setNegativeCount(negative);
        resp.setUrgentCount(highUrgency + critUrgency);

        // Groupings
        resp.setSentimentDistribution(mapGroupResults(feedbackRepository.countBySentimentGroup()));
        resp.setDepartmentDistribution(mapGroupResults(feedbackRepository.countByDepartmentGroup()));
        resp.setUrgencyDistribution(mapGroupResults(feedbackRepository.countByUrgencyGroup()));
        resp.setTopicDistribution(mapGroupResults(feedbackRepository.countByTopicGroup()));

        // Recurring concerns
        List<Object[]> concernRows = feedbackRepository.findTopKeyConcerns();
        List<AnalyticsResponse.ConcernCount> topConcerns = concernRows.stream()
                .limit(5)
                .map(row -> new AnalyticsResponse.ConcernCount((String) row[0], ((Number) row[1]).longValue()))
                .collect(Collectors.toList());
        resp.setRecurringConcerns(topConcerns);

        // Derive organizational insight summary
        resp.setOrganizationalInsight(generateSummaryInsight(total, positive, negative, highUrgency + critUrgency, topConcerns));

        return resp;
    }

    private Map<String, Long> mapGroupResults(List<Object[]> rows) {
        Map<String, Long> map = new LinkedHashMap<>();
        for (Object[] row : rows) {
            String key = row[0] != null ? row[0].toString() : "Unspecified";
            Long count = row[1] != null ? ((Number) row[1]).longValue() : 0L;
            map.put(key, count);
        }
        return map;
    }

    private String generateSummaryInsight(long total, long positive, long negative, long urgent, List<AnalyticsResponse.ConcernCount> topConcerns) {
        double posPercent = (double) positive / total * 100;
        double negPercent = (double) negative / total * 100;

        StringBuilder sb = new StringBuilder();
        if (posPercent >= 60.0) {
            sb.append("Overall organizational morale is strongly favorable with ").append(String.format("%.1f%%", posPercent)).append(" positive sentiment. ");
        } else if (negPercent >= 40.0) {
            sb.append("Attention required: ").append(String.format("%.1f%%", negPercent)).append(" of employee feedback indicates friction or negative sentiment. ");
        } else {
            sb.append("Workplace sentiment remains balanced across departments. ");
        }

        if (urgent > 0) {
            sb.append("There are ").append(urgent).append(" submissions flagged as high or critical urgency requiring timely HR follow-up. ");
        }

        if (!topConcerns.isEmpty()) {
            sb.append("Primary recurring theme: '").append(topConcerns.get(0).getConcern()).append("' with ")
                    .append(topConcerns.get(0).getCount()).append(" mentions.");
        }

        return sb.toString();
    }
}
