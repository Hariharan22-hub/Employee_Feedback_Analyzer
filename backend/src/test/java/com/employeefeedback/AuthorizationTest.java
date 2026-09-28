package com.employeefeedback;

import com.employeefeedback.dto.FeedbackRequest;
import com.employeefeedback.dto.FeedbackResponse;
import com.employeefeedback.model.Role;
import com.employeefeedback.model.User;
import com.employeefeedback.repository.FeedbackRepository;
import com.employeefeedback.repository.UserRepository;
import com.employeefeedback.security.JwtService;
import com.employeefeedback.service.FeedbackService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AuthorizationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private FeedbackService feedbackService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private User employeeUser;
    private User employeeUser2;
    private User hrUser;
    private String employeeToken;
    private String hrToken;

    @BeforeEach
    void setup() {
        feedbackRepository.deleteAll();
        userRepository.deleteAll();

        employeeUser = new User("Emp One", "emp1", "emp1@example.com", passwordEncoder.encode("pass123"), "Engineering", Role.EMPLOYEE);
        employeeUser = userRepository.save(employeeUser);

        employeeUser2 = new User("Emp Two", "emp2", "emp2@example.com", passwordEncoder.encode("pass123"), "Design", Role.EMPLOYEE);
        employeeUser2 = userRepository.save(employeeUser2);

        hrUser = new User("HR Admin", "hradmin", "hr@example.com", passwordEncoder.encode("pass123"), "HR", Role.HR);
        hrUser = userRepository.save(hrUser);

        employeeToken = "Bearer " + jwtService.generateToken(employeeUser);
        hrToken = "Bearer " + jwtService.generateToken(hrUser);
    }

    @Test
    @DisplayName("7 & 8. Employee sees only their own feedback and never another employee's")
    void testEmployeeFeedbackIsolation() {
        // Employee 1 submits feedback
        feedbackService.submitFeedback(new FeedbackRequest("Engineering", "Workload is very high this quarter.", false), employeeUser.getId());

        // Employee 2 submits feedback
        feedbackService.submitFeedback(new FeedbackRequest("Design", "Figma licenses need upgrading.", false), employeeUser2.getId());

        // When Employee 1 queries feedback, only 1 record returned
        List<FeedbackResponse> emp1List = feedbackService.getEmployeeFeedbacks(employeeUser.getId());
        assertEquals(1, emp1List.size());
        assertEquals("Engineering", emp1List.get(0).getDepartment());

        // When Employee 2 queries feedback, only 1 record returned
        List<FeedbackResponse> emp2List = feedbackService.getEmployeeFeedbacks(employeeUser2.getId());
        assertEquals(1, emp2List.size());
        assertEquals("Design", emp2List.get(0).getDepartment());
    }

    @Test
    @DisplayName("9 & 10. Employee accessing HR API endpoints receives 403 Forbidden")
    void testEmployeeForbiddenOnHrEndpoints() throws Exception {
        mockMvc.perform(get("/api/hr/feedback")
                        .header("Authorization", employeeToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());

        mockMvc.perform(get("/api/hr/analytics")
                        .header("Authorization", employeeToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());

        mockMvc.perform(get("/api/assistant/ask")
                        .header("Authorization", employeeToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("11 & 12. HR user accessing organizational feedback and analytics receives 200 OK")
    void testHrAllowedOnHrEndpoints() throws Exception {
        mockMvc.perform(get("/api/hr/feedback")
                        .header("Authorization", hrToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/hr/analytics")
                        .header("Authorization", hrToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }
}
