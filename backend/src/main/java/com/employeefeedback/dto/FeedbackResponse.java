package com.employeefeedback.dto;

import com.employeefeedback.model.Feedback;
import java.time.LocalDateTime;

public class FeedbackResponse {

    private Long id;
    private Long employeeId;
    private String employeeName;
    private String department;
    private String text;
    private boolean anonymous;

    private String sentiment;
    private Double sentimentScore;
    private String emotion;
    private String intent;
    private String topic;
    private String urgency;
    private String summary;
    private String recommendation;
    private String keyConcern;
    private LocalDateTime createdAt;

    public FeedbackResponse() {
    }

    public static FeedbackResponse fromEntity(Feedback feedback, boolean isHrView) {
        FeedbackResponse resp = new FeedbackResponse();
        resp.setId(feedback.getId());
        resp.setDepartment(feedback.getDepartment());
        resp.setText(feedback.getText());
        resp.setAnonymous(feedback.isAnonymous());
        resp.setSentiment(feedback.getSentiment());
        resp.setSentimentScore(feedback.getSentimentScore());
        resp.setEmotion(feedback.getEmotion());
        resp.setIntent(feedback.getIntent());
        resp.setTopic(feedback.getTopic());
        resp.setUrgency(feedback.getUrgency());
        resp.setSummary(feedback.getSummary());
        resp.setRecommendation(feedback.getRecommendation());
        resp.setKeyConcern(feedback.getKeyConcern());
        resp.setCreatedAt(feedback.getCreatedAt());

        if (feedback.isAnonymous()) {
            if (isHrView) {
                resp.setEmployeeId(null);
                resp.setEmployeeName("Anonymous Employee");
            } else {
                resp.setEmployeeId(feedback.getEmployee() != null ? feedback.getEmployee().getId() : null);
                resp.setEmployeeName("You (Anonymous to HR)");
            }
        } else {
            if (feedback.getEmployee() != null) {
                resp.setEmployeeId(feedback.getEmployee().getId());
                resp.setEmployeeName(feedback.getEmployee().getName());
            }
        }
        return resp;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    public String getEmployeeName() {
        return employeeName;
    }

    public void setEmployeeName(String employeeName) {
        this.employeeName = employeeName;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public boolean isAnonymous() {
        return anonymous;
    }

    public void setAnonymous(boolean anonymous) {
        this.anonymous = anonymous;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
