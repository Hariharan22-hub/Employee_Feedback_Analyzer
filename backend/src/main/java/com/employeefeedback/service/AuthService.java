package com.employeefeedback.service;

import com.employeefeedback.dto.HRRegisterRequest;
import com.employeefeedback.dto.LoginRequest;
import com.employeefeedback.dto.LoginResponse;
import com.employeefeedback.dto.RegisterRequest;
import com.employeefeedback.exception.BadRequestException;
import com.employeefeedback.exception.UnauthorizedException;
import com.employeefeedback.model.Role;
import com.employeefeedback.model.User;
import com.employeefeedback.repository.UserRepository;
import com.employeefeedback.security.JwtService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Value("${app.security.hr-registration-code:HR_SECRET_ACCESS_2025}")
    private String hrRegistrationCode;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @Transactional
    public LoginResponse registerEmployee(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username is already taken: " + request.getUsername());
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered: " + request.getEmail());
        }

        User user = new User(
                request.getName().trim(),
                request.getUsername().trim().toLowerCase(),
                request.getEmail().trim().toLowerCase(),
                passwordEncoder.encode(request.getPassword()),
                request.getDepartment().trim(),
                Role.EMPLOYEE // Forced server-side: frontend cannot escalate
        );

        User savedUser = userRepository.save(user);
        String token = jwtService.generateToken(savedUser);

        return new LoginResponse(
                token,
                savedUser.getId(),
                savedUser.getUsername(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getDepartment(),
                savedUser.getRole()
        );
    }

    @Transactional
    public LoginResponse registerHR(HRRegisterRequest request) {
        // Enforce HR registration authorization code check
        if (request.getHrCode() == null || !request.getHrCode().trim().equals(hrRegistrationCode.trim())) {
            throw new BadRequestException("Invalid HR registration code. HR account creation rejected.");
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username is already taken: " + request.getUsername());
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered: " + request.getEmail());
        }

        User user = new User(
                request.getName().trim(),
                request.getUsername().trim().toLowerCase(),
                request.getEmail().trim().toLowerCase(),
                passwordEncoder.encode(request.getPassword()),
                request.getDepartment().trim(),
                Role.HR // Verified with secret code
        );

        User savedUser = userRepository.save(user);
        String token = jwtService.generateToken(savedUser);

        return new LoginResponse(
                token,
                savedUser.getId(),
                savedUser.getUsername(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getDepartment(),
                savedUser.getRole()
        );
    }

    public LoginResponse login(LoginRequest request) {
        try {
            // Find user first to resolve username if email was provided
            User user = userRepository.findByUsernameOrEmail(request.getUsernameOrEmail(), request.getUsernameOrEmail())
                    .orElseThrow(() -> new UnauthorizedException("Invalid username/email or password"));

            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getUsername(), request.getPassword())
            );

            String token = jwtService.generateToken(user);

            return new LoginResponse(
                    token,
                    user.getId(),
                    user.getUsername(),
                    user.getName(),
                    user.getEmail(),
                    user.getDepartment(),
                    user.getRole()
            );
        } catch (BadCredentialsException e) {
            throw new UnauthorizedException("Invalid username/email or password");
        }
    }
}
