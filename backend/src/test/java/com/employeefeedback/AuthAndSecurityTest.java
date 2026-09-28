package com.employeefeedback;

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
import com.employeefeedback.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class AuthAndSecurityTest {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }

    @Test
    @DisplayName("1. Employee registration succeeds with EMPLOYEE role")
    void testEmployeeRegistration() {
        RegisterRequest req = new RegisterRequest("Alice Smith", "alice", "alice@example.com", "Password123", "Engineering");
        LoginResponse res = authService.registerEmployee(req);

        assertNotNull(res.getToken());
        assertEquals("alice", res.getUsername());
        assertEquals(Role.EMPLOYEE, res.getRole());

        User user = userRepository.findByUsername("alice").orElseThrow();
        assertEquals(Role.EMPLOYEE, user.getRole());
        assertTrue(user.getPasswordHash().startsWith("$2a$") || user.getPasswordHash().startsWith("$2b$"));
    }

    @Test
    @DisplayName("2. Employee login succeeds with correct credentials")
    void testEmployeeLoginSuccess() {
        RegisterRequest req = new RegisterRequest("Bob Jones", "bobjones", "bob@example.com", "SecretPass1", "Marketing");
        authService.registerEmployee(req);

        LoginRequest loginReq = new LoginRequest("bobjones", "SecretPass1");
        LoginResponse loginRes = authService.login(loginReq);

        assertNotNull(loginRes.getToken());
        assertEquals("bobjones", loginRes.getUsername());
        assertEquals(Role.EMPLOYEE, loginRes.getRole());
    }

    @Test
    @DisplayName("3. Invalid login throws UnauthorizedException")
    void testInvalidLogin() {
        RegisterRequest req = new RegisterRequest("Charlie", "charlie", "charlie@example.com", "CorrectPass", "Sales");
        authService.registerEmployee(req);

        LoginRequest wrongPass = new LoginRequest("charlie", "WrongPassword");
        assertThrows(UnauthorizedException.class, () -> authService.login(wrongPass));

        LoginRequest nonExistentUser = new LoginRequest("ghost_user", "CorrectPass");
        assertThrows(UnauthorizedException.class, () -> authService.login(nonExistentUser));
    }

    @Test
    @DisplayName("4. HR registration with invalid code is rejected")
    void testHrRegistrationWithInvalidCode() {
        HRRegisterRequest hrReq = new HRRegisterRequest(
                "HR Candidate", "hrcand", "hrcand@example.com", "Password123", "People Ops", "INVALID_CODE_123"
        );

        BadRequestException ex = assertThrows(BadRequestException.class, () -> authService.registerHR(hrReq));
        assertEquals("Invalid HR verification code.", ex.getMessage());
        assertFalse(userRepository.existsByUsername("hrcand"));
    }

    @Test
    @DisplayName("5. HR registration with valid code succeeds with HR role")
    void testHrRegistrationWithValidCode() {
        HRRegisterRequest hrReq = new HRRegisterRequest(
                "HR Manager", "hrmanager", "hr@example.com", "Password123", "Human Resources", "HR_SECRET_ACCESS_2025"
        );

        LoginResponse res = authService.registerHR(hrReq);
        assertNotNull(res.getToken());
        assertEquals(Role.HR, res.getRole());

        User user = userRepository.findByUsername("hrmanager").orElseThrow();
        assertEquals(Role.HR, user.getRole());
    }

    @Test
    @DisplayName("6. HR login succeeds")
    void testHrLogin() {
        HRRegisterRequest hrReq = new HRRegisterRequest(
                "HR Admin", "hradmin", "hradmin@example.com", "Password123", "Human Resources", "HR_SECRET_ACCESS_2025"
        );
        authService.registerHR(hrReq);

        LoginRequest loginReq = new LoginRequest("hradmin", "Password123");
        LoginResponse res = authService.login(loginReq);

        assertNotNull(res.getToken());
        assertEquals(Role.HR, res.getRole());
    }

    @Test
    @DisplayName("13. Valid JWT is verified and extracts claims correctly")
    void testValidJwt() {
        User user = new User("Test User", "testjwt", "testjwt@example.com", "hash", "Product", Role.EMPLOYEE);
        user.setId(99L);

        String token = jwtService.generateToken(user);
        assertNotNull(token);
        assertTrue(jwtService.validateToken(token));
        assertEquals("testjwt", jwtService.extractUsername(token));
        assertEquals("EMPLOYEE", jwtService.extractRole(token));
        assertEquals(99L, jwtService.extractUserId(token));
    }

    @Test
    @DisplayName("14. Invalid JWT format or corrupted token is rejected")
    void testInvalidJwt() {
        assertFalse(jwtService.validateToken("invalid.token.string"));
        assertFalse(jwtService.validateToken(""));
        assertFalse(jwtService.validateToken(null));
    }
}
