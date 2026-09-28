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
- **Language**: Java 21 LTS
- **Framework**: Spring Boot 3.3.4
- **Security**: Spring Security 6 with BCrypt password hashing & JJWT 0.12 (Stateless JWT authentication)
- **Persistence**: Spring Data JPA & Hibernate 6 with `hibernate-community-dialects`
- **Database**: SQLite 3 via `org.xerial:sqlite-jdbc`
- **AI Integration**: Google Gemini API (`gemini-2.5-flash` / `gemini-1.5-flash`) via structured JSON prompt engineering + resilient offline heuristic fallback engine
- **RAG Engine**: Pure Java TF-IDF Vectorizer with Cosine Similarity index over organizational policy corpus
- **Build Tool**: Apache Maven 3.9+

### Frontend
- **Framework**: React 18+ (Vite)
- **Styling**: Vanilla CSS enterprise design system with responsive layouts, modern card elevation, accessible typography, and status badges
- **Icons**: Lucide React
- **API Client**: Native Fetch API client with Bearer token interceptor and global error propagation

---

## 4. Key Features

### Employee Portal
- **Public Employee Registration & Login**: Validated registration with backend role enforcement (`role = EMPLOYEE`).
- **Secure Feedback Submission**: Select department, draft feedback (minimum 10 characters), and toggle end-to-end anonymity.
- **Strict Data Isolation**: Employees can only view their own feedback history. Other employees' feedback and HR metrics are blocked at the database and API level.
- **Inspection**: View submission status, sentiment classification, urgency level, and summary.

### HR Portal
- **Protected HR Registration**: Requires a secret server-side `HR_REGISTRATION_CODE`. Arbitrary role escalation is prevented.
- **Executive Dashboard**: Real-time KPI cards (Total Submissions, Positive %, Negative %, Urgent/Critical issues, Sentiment distribution).
- **AI Organizational Health Insight**: Dynamically generated high-level summary of company morale and primary recurring themes.
- **Feedback Management & Search**: Filter by department, sentiment, urgency, topic, or free-text query. Full inspection drawer displays original text, AI summary, AI recommendation, emotion, intent, and anonymity status.
- **Organizational Analytics**: Comprehensive distribution charts for departments, sentiment ratios, urgency levels, and recurring concerns. Displays a clean empty state if no data exists.
- **HR Knowledge Assistant (RAG)**: Ask natural language questions against internal HR policies (Leave, Attendance, Remote Work/WFH, Grievance Redressal, Code of Conduct) with direct source citations.

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
HR_REGISTRATION_CODE=HR_SECRET_ACCESS_2025

# JWT Secret Key (HMAC SHA-256)
JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970

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
