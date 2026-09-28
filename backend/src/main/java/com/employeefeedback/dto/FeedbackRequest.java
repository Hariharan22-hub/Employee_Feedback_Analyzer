package com.employeefeedback.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class FeedbackRequest {

    @NotBlank(message = "Department is required")
    private String department;

    @NotBlank(message = "Feedback text cannot be empty")
    @Size(min = 10, max = 4000, message = "Feedback must be between 10 and 4000 characters")
    private String text;

    private boolean anonymous = false;

    public FeedbackRequest() {
    }

    public FeedbackRequest(String department, String text, boolean anonymous) {
        this.department = department;
        this.text = text;
        this.anonymous = anonymous;
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
}
