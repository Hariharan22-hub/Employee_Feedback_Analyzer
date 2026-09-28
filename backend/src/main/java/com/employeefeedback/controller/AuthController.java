package com.employeefeedback.controller;

import com.employeefeedback.dto.HRRegisterRequest;
import com.employeefeedback.dto.LoginRequest;
import com.employeefeedback.dto.LoginResponse;
import com.employeefeedback.dto.RegisterRequest;
import com.employeefeedback.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<LoginResponse> registerEmployee(@Valid @RequestBody RegisterRequest request) {
        LoginResponse response = authService.registerEmployee(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/hr-register")
    public ResponseEntity<LoginResponse> registerHR(@Valid @RequestBody HRRegisterRequest request) {
        LoginResponse response = authService.registerHR(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
}
