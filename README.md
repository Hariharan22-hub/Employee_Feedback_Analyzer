# Employee Feedback Analyzer

> An enterprise-grade, AI-powered workplace feedback management and organizational intelligence platform built completely from scratch using **Java 21**, **Spring Boot 3**, **Spring Security**, **JWT**, **SQLite**, and **React**.

---

## 1. Problem Statement
Modern organizations receive high volumes of workplace feedback across dispersed departments. Manually processing submissions creates severe operational bottlenecks:
- **Delayed & Inconsistent Analysis**: Manual review of feedback is time-intensive and subjective.
- **Difficulty Detecting Recurring Concerns**: Disconnected feedback makes it challenging for HR leaders to trace persistent issues (e.g., workload pressure, managerial communication, compensation).
- **Missed Urgency & Safety Risks**: Critical workplace issues (harassment, severe burnout, ethics breaches) risk remaining buried.
- **Privacy & Retaliation Apprehension**: Employees hesitate to provide candid feedback without robust anonymity protections and strict isolation.

**Employee Feedback Analyzer** solves these problems with an automated, AI-driven architecture featuring role-based access control, Google Gemini feedback intelligence, local heuristic fallbacks, and a semantic HR policy knowledge assistant.

---

## 2. High-Level Architecture

```
                    USERS (Web Browser)
                            |
           +----------------+----------------+
           |                                 |
       EMPLOYEE                              HR
           |                                 |
           +----------------+----------------+
                            |
                            v
               React Frontend (Vite)
                            |
                            | REST API / JSON
                            v
             Java 21 Spring Boot Backend
                            |
    +-----------------------+-----------------------+
    |                       |                       |
    v                       v                       v
Authentication          AI Layer                Data Layer
    |                       |                       |
Spring Security         Gemini AI               Spring Data JPA
    |                       |                       |
JWT + BCrypt          RAG / Policies            Hibernate
                                                    |
                                                    v
                                                 SQLite
```

---

## 3. Technology Stack

### Backend
- Java 21
- Spring Boot 3
- Spring Security
- Spring Data JPA
- JWT
- BCrypt
- SQLite
- Maven

### Frontend
- React
- Vite
- Lucide React
- CSS

### AI Layer
- Google Gemini API
- Java-based fallback analyzer

### RAG Engine
- TF-IDF
- Cosine similarity
- Java knowledge-base retrieval

---

## 4. Key Features
- Employee registration/login
- HR registration with secure verification code
- JWT authentication
- Role-based authorization
- Employee feedback submission
- Anonymous feedback
- AI feedback analysis
- HR analytics
- HR Assistant
- RAG-based policy retrieval
- Password visibility toggle

---

## 5. Security & Authorization

| Capability | Employee | HR | Unauthenticated |
| :--- | :---: | :---: | :---: |
| Public Employee Registration | Yes | N/A | Yes |
| Protected HR Registration (with Code) | N/A | Yes | Code Required |
| Submit Workplace Feedback | Yes | Yes | No (401) |
| View Own Feedback History | Yes | Yes (Own) | No (401) |
| View Organizational Feedback | No (403) | Yes | No (401) |
| View HR Analytics | No (403) | Yes | No (401) |
| Use HR Policy Assistant | No (403) | Yes | No (401) |
| Anonymous Submissions | Masked to HR | Masked to HR | N/A |

---

## 6. Project Structure

```
Employee Feedback Analyzer/
├── backend/
│   ├── pom.xml
│   └── src/
│       ├── main/
│       │   ├── java/com/employeefeedback/
│       │   │   ├── EmployeeFeedbackApplication.java
│       │   │   ├── controller/
│       │   │   │   ├── AuthController.java
│       │   │   │   ├── FeedbackController.java
│       │   │   │   ├── AnalyticsController.java
│       │   │   │   ├── AssistantController.java
│       │   │   │   └── HealthController.java
│       │   │   ├── service/
│       │   │   │   ├── AuthService.java
│       │   │   │   ├── FeedbackService.java
│       │   │   │   ├── GeminiService.java
│       │   │   │   ├── RagService.java
│       │   │   │   └── AnalyticsService.java
│       │   │   ├── model/
│       │   │   │   ├── User.java
│       │   │   │   ├── Feedback.java
│       │   │   │   └── Role.java
│       │   │   ├── repository/
│       │   │   │   ├── UserRepository.java
│       │   │   │   └── FeedbackRepository.java
│       │   │   ├── dto/
│       │   │   ├── security/
│       │   │   │   ├── SecurityConfig.java
│       │   │   │   ├── JwtService.java
│       │   │   │   ├── JwtAuthenticationFilter.java
│       │   │   │   └── CustomUserDetailsService.java
│       │   │   └── exception/
│       │   │       ├── GlobalExceptionHandler.java
│       │   │       └── ResourceNotFoundException.java
│       │   └── resources/
│       │       ├── application.properties
│       │       └── knowledge_base/
│       │           ├── leave_policy.txt
│       │           ├── attendance_policy.txt
│       │           ├── work_from_home_policy.txt
│       │           ├── grievance_policy.txt
│       │           └── code_of_conduct.txt
│       └── test/
│           └── java/com/employeefeedback/
│               ├── AuthAndSecurityTest.java
│               ├── AuthorizationTest.java
│               ├── FeedbackServiceTest.java
│               └── AiAndRagTest.java
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── AuthLanding.jsx
│   │   │   ├── EmployeeDashboard.jsx
│   │   │   ├── HRDashboard.jsx
│   │   │   ├── HRFeedbackManagement.jsx
│   │   │   ├── HRAnalyticsPage.jsx
│   │   │   ├── HRAssistantPage.jsx
│   │   │   └── AccessDenied.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
├── Dockerfile
├── docker-compose.yml
├── .gitignore
├── .env.example
└── README.md
```

---

## 7. Environment Variables

Create a `.env` file or export the following variables:

```bash
# Gemini AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# HR Registration Protection Code (Server-side secret)
HR_REGISTRATION_CODE=your_hr_registration_code_here

# JWT Secret Key (HMAC SHA-256)
JWT_SECRET=your_jwt_secret_here

# Database Configuration
DATABASE_URL=jdbc:sqlite:./feedback_agent.db

# Server Port
SERVER_PORT=8080
```

---

## 8. Local Setup & Execution

### Prerequisites
- Java 21 LTS installed (`java -version`)
- Apache Maven 3.9+ (`mvn -v`)
- Node.js 18+ and npm (`node -v`)

### Step 1: Start the Backend (Spring Boot)
```bash
cd backend
mvn clean spring-boot:run
```
Backend will start on: `http://localhost:8080`
Health check: `http://localhost:8080/api/health`

### Step 2: Start the Frontend (React + Vite)
In a separate terminal window:
```bash
cd frontend
npm install
npm run dev
```
Frontend will be accessible on: `http://localhost:5173`

---

## 9. Testing & Build Verification

### Backend Tests
Execute the comprehensive test suite covering Authentication, Authorization, JWT validity, Feedback submission, Anonymity privacy, Gemini AI heuristics, and RAG policy retrieval:
```bash
cd backend
mvn clean test
```

### Backend Packaging
Package the production Spring Boot JAR:
```bash
cd backend
mvn clean package
```

### Frontend Build
Compile the React production bundle:
```bash
cd frontend
npm run build
```

---

## 10. Docker Deployment

Build and run the full stack container:
```bash
docker compose up --build
```
The multi-stage `Dockerfile` compiles the Java 21 application in a Maven alpine image and executes in a lightweight Eclipse Temurin 21 JRE container.
