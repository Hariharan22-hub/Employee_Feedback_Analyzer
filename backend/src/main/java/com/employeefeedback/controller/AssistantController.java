package com.employeefeedback.controller;

import com.employeefeedback.dto.AskAssistantRequest;
import com.employeefeedback.dto.AskAssistantResponse;
import com.employeefeedback.service.RagService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/assistant")
public class AssistantController {

    private final RagService ragService;

    public AssistantController(RagService ragService) {
        this.ragService = ragService;
    }

    @PreAuthorize("hasRole('HR')")
    @PostMapping("/ask")
    public ResponseEntity<AskAssistantResponse> askAssistant(@Valid @RequestBody AskAssistantRequest request) {
        AskAssistantResponse response = ragService.askQuestion(request.getQuestion());
        return ResponseEntity.ok(response);
    }
}
