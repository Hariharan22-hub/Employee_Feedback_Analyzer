package com.employeefeedback.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "feedbacks")
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User employee;

    @Column(nullable = false)
    private String department;

    @Column(nullable = false, length = 4000)
    private String text;

    @Column(nullable = false)
    private boolean anonymous = false;

    // AI Analysis Attributes
    private String sentiment; // POSITIVE, NEUTRAL, NEGATIVE
    private Double sentimentScore;
    private String emotion; // Happy, Frustrated, Angry, Concerned, Satisfied, Disappointed, Neutral
    private String intent; // Complaint, Suggestion, Appreciation, Request, Concern, Query, General
    private String topic; // Workload, Management, Compensation, Work Environment, Career Growth, Team Collaboration, Communication, Leave, Benefits, Recognition, Workplace Culture, Other
    private String urgency; // LOW, MEDIUM, HIGH, CRITICAL

    @Column(length = 2000)
    private String summary;

    @Column(length = 2000)
    private String recommendation;

    private String keyConcern;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    public Feedback() {
    }

    public Feedback(User employee, String department, String text, boolean anonymous) {
        this.employee = employee;
        this.department = department;
        this.text = text;
        this.anonymous = anonymous;
    }

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getEmployee() {
        return employee;
    }

    public void setEmployee(User employee) {
        this.employee = employee;
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
