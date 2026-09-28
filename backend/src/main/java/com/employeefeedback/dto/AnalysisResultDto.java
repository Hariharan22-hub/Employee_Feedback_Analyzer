package com.employeefeedback.dto;

public class AnalysisResultDto {
    private String sentiment; // POSITIVE, NEUTRAL, NEGATIVE
    private Double sentimentScore; // 0.0 to 1.0 or -1.0 to 1.0
    private String emotion; // Happy, Frustrated, Angry, Concerned, Satisfied, Disappointed, Neutral
    private String intent; // Complaint, Suggestion, Appreciation, Request, Concern, Query, General
    private String topic; // Workload, Management, Compensation, Work Environment, Career Growth, Team Collaboration, Communication, Leave, Benefits, Recognition, Workplace Culture, Other
    private String urgency; // LOW, MEDIUM, HIGH, CRITICAL
    private String summary;
    private String recommendation;
    private String keyConcern;

    public AnalysisResultDto() {
    }

    public AnalysisResultDto(String sentiment, Double sentimentScore, String emotion, String intent,
                             String topic, String urgency, String summary, String recommendation, String keyConcern) {
        this.sentiment = sentiment;
        this.sentimentScore = sentimentScore;
        this.emotion = emotion;
        this.intent = intent;
        this.topic = topic;
        this.urgency = urgency;
        this.summary = summary;
        this.recommendation = recommendation;
        this.keyConcern = keyConcern;
    }

    public String getSentiment() {
        return sentiment;
    }

    public void setSentiment(String sentiment) {
        this.sentiment = sentiment;
    }

    public Double getSentimentScore() {
        return sentimentScore;
    }

    public void setSentimentScore(Double sentimentScore) {
        this.sentimentScore = sentimentScore;
    }

    public String getEmotion() {
        return emotion;
    }

    public void setEmotion(String emotion) {
        this.emotion = emotion;
    }

    public String getIntent() {
        return intent;
    }

    public void setIntent(String intent) {
        this.intent = intent;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public String getUrgency() {
        return urgency;
    }

    public void setUrgency(String urgency) {
        this.urgency = urgency;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getRecommendation() {
        return recommendation;
    }

    public void setRecommendation(String recommendation) {
        this.recommendation = recommendation;
    }

    public String getKeyConcern() {
        return keyConcern;
    }

    public void setKeyConcern(String keyConcern) {
        this.keyConcern = keyConcern;
    }
}
