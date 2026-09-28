package com.employeefeedback;

import com.employeefeedback.dto.FeedbackRequest;
import com.employeefeedback.dto.FeedbackResponse;
import com.employeefeedback.model.Feedback;
import com.employeefeedback.model.Role;
import com.employeefeedback.model.User;
import com.employeefeedback.repository.FeedbackRepository;
import com.employeefeedback.repository.UserRepository;
import com.employeefeedback.service.FeedbackService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class FeedbackServiceTest {

    @Autowired
    private FeedbackService feedbackService;

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private UserRepository userRepository;

    private User employee;

    @BeforeEach
    void setup() {
        feedbackRepository.deleteAll();
        userRepository.deleteAll();

        employee = new User("John Doe", "johndoe", "john@example.com", "hash123", "Engineering", Role.EMPLOYEE);
        employee = userRepository.save(employee);
    }

    @Test
    @DisplayName("16 & 18. Feedback submission persists to database with AI analysis fields")
    void testSubmitFeedbackAndPersistence() {
        FeedbackRequest req = new FeedbackRequest(
                "Engineering",
                "The team is struggling to meet project deadlines due to high workload.",
                false
        );

        FeedbackResponse resp = feedbackService.submitFeedback(req, employee.getId());

        assertNotNull(resp.getId());
        assertEquals("Engineering", resp.getDepartment());
        assertNotNull(resp.getSentiment());
        assertNotNull(resp.getEmotion());
        assertNotNull(resp.getUrgency());
        assertNotNull(resp.getSummary());
        assertNotNull(resp.getRecommendation());

        // Verify in database
        Feedback persisted = feedbackRepository.findById(resp.getId()).orElseThrow();
        assertEquals("Engineering", persisted.getDepartment());
        assertEquals(employee.getId(), persisted.getEmployee().getId());
        assertFalse(persisted.isAnonymous());
    }

    @Test
    @DisplayName("Anonymous feedback conceals employee identity from HR view")
    void testAnonymousFeedbackPrivacy() {
        FeedbackRequest req = new FeedbackRequest(
                "Operations",
                "Concerns regarding team communication and process transparency.",
                true
        );

        FeedbackResponse created = feedbackService.submitFeedback(req, employee.getId());
        assertTrue(created.isAnonymous());

        // When retrieved via HR view
        List<FeedbackResponse> hrViewList = feedbackService.getOrganizationalFeedbacksForHR(null, null, null, null, null);
        assertEquals(1, hrViewList.size());
        FeedbackResponse hrFeedback = hrViewList.get(0);

        assertNull(hrFeedback.getEmployeeId(), "Employee ID must be null for HR on anonymous feedback");
        assertEquals("Anonymous Employee", hrFeedback.getEmployeeName(), "Employee name must be anonymized for HR");
    }
}
