# Multi-stage Docker build for Employee Feedback Analyzer
# Stage 1: Build Java 21 Spring Boot Backend
FROM maven:3.9.9-eclipse-temurin-21-alpine AS builder
WORKDIR /app

# Copy pom.xml and download dependencies
COPY backend/pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build production jar
COPY backend/src ./src
RUN mvn clean package -DskipTests

# Stage 2: Minimal Java 21 Runtime Image
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Set non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Create directory for SQLite database
RUN mkdir -p /app/data && chown -R appuser:appgroup /app/data

# Copy jar from builder stage
COPY --from=builder --chown=appuser:appgroup /app/target/employee-feedback-analyzer-*.jar app.jar

USER appuser

# Environment defaults
ENV SERVER_PORT=8080
ENV DATABASE_URL=jdbc:sqlite:/app/data/feedback_agent.db
ENV GEMINI_API_KEY=""
ENV HR_REGISTRATION_CODE="HR_SECRET_ACCESS_2025"
ENV JWT_SECRET="404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970"

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
