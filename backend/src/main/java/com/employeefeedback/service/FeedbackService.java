package com.employeefeedback.service;

import com.employeefeedback.dto.AnalysisResultDto;
import com.employeefeedback.dto.FeedbackRequest;
import com.employeefeedback.dto.FeedbackResponse;
import com.employeefeedback.exception.ResourceNotFoundException;
import com.employeefeedback.model.Feedback;
import com.employeefeedback.model.User;
import com.employeefeedback.repository.FeedbackRepository;
import com.employeefeedback.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final UserRepository userRepository;
    private final GeminiService geminiService;

    public FeedbackService(FeedbackRepository feedbackRepository,
                           UserRepository userRepository,
                           GeminiService geminiService) {
        this.feedbackRepository = feedbackRepository;
        this.userRepository = userRepository;
        this.geminiService = geminiService;
    }

    @Transactional
    public FeedbackResponse submitFeedback(FeedbackRequest request, Long userId) {
        User employee = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee user not found with id: " + userId));

        Feedback feedback = new Feedback(
                employee,
                request.getDepartment().trim(),
                request.getText().trim(),
                request.isAnonymous()
        );

        // Run AI Analysis
        AnalysisResultDto analysis = geminiService.analyzeFeedback(request.getText(), request.getDepartment());

        feedback.setSentiment(analysis.getSentiment());
        feedback.setSentimentScore(analysis.getSentimentScore());
        feedback.setEmotion(analysis.getEmotion());
        feedback.setIntent(analysis.getIntent());
        feedback.setTopic(analysis.getTopic());
        feedback.setUrgency(analysis.getUrgency());
        feedback.setSummary(analysis.getSummary());
        feedback.setRecommendation(analysis.getRecommendation());
        feedback.setKeyConcern(analysis.getKeyConcern());

        Feedback saved = feedbackRepository.save(feedback);

        return FeedbackResponse.fromEntity(saved, false);
    }

    @Transactional(readOnly = true)
    public List<FeedbackResponse> getEmployeeFeedbacks(Long employeeId) {
        return feedbackRepository.findByEmployeeIdOrderByCreatedAtDesc(employeeId)
                .stream()
                .map(f -> FeedbackResponse.fromEntity(f, false))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<FeedbackResponse> getOrganizationalFeedbacksForHR(
            String department,
            String sentiment,
            String urgency,
            String topic,
            String search
    ) {
        List<Feedback> allFeedbacks = feedbackRepository.findAllByOrderByCreatedAtDesc();

        return allFeedbacks.stream()
                .filter(f -> department == null || department.isBlank() || f.getDepartment().equalsIgnoreCase(department.trim()))
                .filter(f -> sentiment == null || sentiment.isBlank() || (f.getSentiment() != null && f.getSentiment().equalsIgnoreCase(sentiment.trim())))
                .filter(f -> urgency == null || urgency.isBlank() || (f.getUrgency() != null && f.getUrgency().equalsIgnoreCase(urgency.trim())))
                .filter(f -> topic == null || topic.isBlank() || (f.getTopic() != null && f.getTopic().equalsIgnoreCase(topic.trim())))
                .filter(f -> {
                    if (search == null || search.isBlank()) return true;
                    String s = search.toLowerCase(Locale.ROOT);
                    boolean matchText = f.getText() != null && f.getText().toLowerCase(Locale.ROOT).contains(s);
                    boolean matchSummary = f.getSummary() != null && f.getSummary().toLowerCase(Locale.ROOT).contains(s);
                    boolean matchConcern = f.getKeyConcern() != null && f.getKeyConcern().toLowerCase(Locale.ROOT).contains(s);
                    boolean matchDept = f.getDepartment() != null && f.getDepartment().toLowerCase(Locale.ROOT).contains(s);
                    return matchText || matchSummary || matchConcern || matchDept;
                })
                .map(f -> FeedbackResponse.fromEntity(f, true))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public FeedbackResponse getFeedbackByIdForHR(Long feedbackId) {
        Feedback feedback = feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new ResourceNotFoundException("Feedback not found with id: " + feedbackId));

        return FeedbackResponse.fromEntity(feedback, true);
    }

    @Transactional(readOnly = true)
    public long getEmployeeFeedbackCount(Long employeeId) {
        return feedbackRepository.countByEmployeeId(employeeId);
    }
}
