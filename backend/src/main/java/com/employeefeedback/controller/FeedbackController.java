package com.employeefeedback.controller;

import com.employeefeedback.dto.FeedbackRequest;
import com.employeefeedback.dto.FeedbackResponse;
import com.employeefeedback.dto.UserDto;
import com.employeefeedback.model.User;
import com.employeefeedback.security.CustomUserDetailsService;
import com.employeefeedback.service.FeedbackService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class FeedbackController {

    private final FeedbackService feedbackService;
    private final CustomUserDetailsService userDetailsService;

    public FeedbackController(FeedbackService feedbackService, CustomUserDetailsService userDetailsService) {
        this.feedbackService = feedbackService;
        this.userDetailsService = userDetailsService;
    }

    private User getAuthenticatedUser(Authentication authentication) {
        return userDetailsService.getUserEntity(authentication.getName());
    }

    // --- EMPLOYEE ENDPOINTS ---

    @PostMapping("/feedback")
    public ResponseEntity<FeedbackResponse> submitFeedback(@Valid @RequestBody FeedbackRequest request,
                                                           Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        FeedbackResponse response = feedbackService.submitFeedback(request, user.getId());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/employee/feedback")
    public ResponseEntity<List<FeedbackResponse>> getMyFeedback(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        List<FeedbackResponse> myFeedbacks = feedbackService.getEmployeeFeedbacks(user.getId());
        return ResponseEntity.ok(myFeedbacks);
    }

    @GetMapping("/employee/me")
    public ResponseEntity<Map<String, Object>> getMyProfile(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        long count = feedbackService.getEmployeeFeedbackCount(user.getId());

        Map<String, Object> profile = new HashMap<>();
        profile.put("id", user.getId());
        profile.put("name", user.getName());
        profile.put("username", user.getUsername());
        profile.put("email", user.getEmail());
        profile.put("department", user.getDepartment());
        profile.put("role", user.getRole().name());
        profile.put("feedbackCount", count);
        profile.put("createdAt", user.getCreatedAt());

        return ResponseEntity.ok(profile);
    }

    // --- HR ENDPOINTS ---

    @PreAuthorize("hasRole('HR')")
    @GetMapping("/hr/feedback")
    public ResponseEntity<List<FeedbackResponse>> getOrganizationalFeedback(
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String sentiment,
            @RequestParam(required = false) String urgency,
            @RequestParam(required = false) String topic,
            @RequestParam(required = false) String search) {

        List<FeedbackResponse> list = feedbackService.getOrganizationalFeedbacksForHR(
                department, sentiment, urgency, topic, search
        );
        return ResponseEntity.ok(list);
    }

    @PreAuthorize("hasRole('HR')")
    @GetMapping("/hr/feedback/{id}")
    public ResponseEntity<FeedbackResponse> getFeedbackDetail(@PathVariable Long id) {
        FeedbackResponse response = feedbackService.getFeedbackByIdForHR(id);
        return ResponseEntity.ok(response);
    }
}
