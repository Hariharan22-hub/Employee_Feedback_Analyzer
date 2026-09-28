package com.employeefeedback.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {

    @Value("${app.gemini.api-key:}")
    private String geminiApiKey;

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> status = new HashMap<>();
        status.put("status", "UP");
        status.put("application", "Employee Feedback Analyzer");
        status.put("backend", "Java 21 / Spring Boot 3");
        status.put("database", "SQLite");
        status.put("geminiConfigured", geminiApiKey != null && !geminiApiKey.isBlank() && !geminiApiKey.contains("your_gemini_api_key"));
        status.put("timestamp", LocalDateTime.now());
        return ResponseEntity.ok(status);
    }
}
