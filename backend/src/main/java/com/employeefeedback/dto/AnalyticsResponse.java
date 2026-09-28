package com.employeefeedback.dto;

import java.util.List;
import java.util.Map;

public class AnalyticsResponse {

    private long totalFeedback;
    private long positiveCount;
    private long neutralCount;
    private long negativeCount;
    private long urgentCount;
    private Map<String, Long> sentimentDistribution;
    private Map<String, Long> departmentDistribution;
    private Map<String, Long> urgencyDistribution;
    private Map<String, Long> topicDistribution;
    private List<ConcernCount> recurringConcerns;
    private String organizationalInsight;

    public static class ConcernCount {
        private String concern;
        private long count;

        public ConcernCount() {
        }

        public ConcernCount(String concern, long count) {
            this.concern = concern;
            this.count = count;
        }

        public String getConcern() {
            return concern;
        }

        public void setConcern(String concern) {
            this.concern = concern;
        }

        public long getCount() {
            return count;
        }

        public void setCount(long count) {
            this.count = count;
        }
    }

    public AnalyticsResponse() {
    }

    public long getTotalFeedback() {
        return totalFeedback;
    }

    public void setTotalFeedback(long totalFeedback) {
        this.totalFeedback = totalFeedback;
    }

    public long getPositiveCount() {
        return positiveCount;
    }

    public void setPositiveCount(long positiveCount) {
        this.positiveCount = positiveCount;
    }

    public long getNeutralCount() {
        return neutralCount;
    }

    public void setNeutralCount(long neutralCount) {
        this.neutralCount = neutralCount;
    }

    public long getNegativeCount() {
        return negativeCount;
    }

    public void setNegativeCount(long negativeCount) {
        this.negativeCount = negativeCount;
    }

    public long getUrgentCount() {
        return urgentCount;
    }

    public void setUrgentCount(long urgentCount) {
        this.urgentCount = urgentCount;
    }

    public Map<String, Long> getSentimentDistribution() {
        return sentimentDistribution;
    }

    public void setSentimentDistribution(Map<String, Long> sentimentDistribution) {
        this.sentimentDistribution = sentimentDistribution;
    }

    public Map<String, Long> getDepartmentDistribution() {
        return departmentDistribution;
    }

    public void setDepartmentDistribution(Map<String, Long> departmentDistribution) {
        this.departmentDistribution = departmentDistribution;
    }

    public Map<String, Long> getUrgencyDistribution() {
        return urgencyDistribution;
    }

    public void setUrgencyDistribution(Map<String, Long> urgencyDistribution) {
        this.urgencyDistribution = urgencyDistribution;
    }

    public Map<String, Long> getTopicDistribution() {
        return topicDistribution;
    }

    public void setTopicDistribution(Map<String, Long> topicDistribution) {
        this.topicDistribution = topicDistribution;
    }

    public List<ConcernCount> getRecurringConcerns() {
        return recurringConcerns;
    }

    public void setRecurringConcerns(List<ConcernCount> recurringConcerns) {
        this.recurringConcerns = recurringConcerns;
    }

    public String getOrganizationalInsight() {
        return organizationalInsight;
    }

    public void setOrganizationalInsight(String organizationalInsight) {
        this.organizationalInsight = organizationalInsight;
    }
}
