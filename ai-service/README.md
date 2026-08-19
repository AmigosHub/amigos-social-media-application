# Amigos AI Microservice (`ai-service`) - Part 2 Complete Implementation

Production-Ready Python FastAPI Generative AI Microservice for the **Amigos Social Media Platform**.

> **Architecture Rule**: This is a supporting backend microservice. It is consumed strictly by:
> - **Spring Boot User Backend** (Caption Generator & Comment Moderation)
> - **ASP.NET Core Admin Backend** (AI Analytics & Flagged Comments)
> 
> Direct access from React frontend clients is strictly prohibited by architecture design.

---

## 🚀 Features Implemented

1. **AI Caption Generator** (`POST /api/v1/caption`): Generates exactly 3 post captions based on topic, tone, and language.
2. **AI Comment Moderation** (`POST /api/v1/moderate`): Evaluates user comments for toxicity, harassment, spam, hate speech, and violent content. Recommends `BLOCK`, `REVIEW`, or `ALLOW` actions based on confidence thresholds (>90 -> BLOCK, 70-90 -> REVIEW, <70 -> ALLOW).
3. **Admin AI Analytics** (`GET /api/v1/analytics` & `GET /api/v1/flagged-comments`): Metrics tracking requests processed and log of flagged non-compliant comments.

---

## 📂 Project Structure

```
ai-service/
├── app/
│   ├── api/
│   │   ├── analytics/       # GET /analytics & GET /flagged-comments
│   │   ├── caption/         # POST /caption
│   │   ├── health/          # GET /health
│   │   ├── moderation/      # POST /moderate
│   │   └── router.py        # Central Router (/api/v1/...)
│   ├── config/              # Environment Settings (pydantic-settings)
│   ├── core/                # Logger, Exceptions, Handlers, Middlewares
│   ├── infrastructure/
│   │   ├── llm/             # LLM Abstraction, Groq AI & Gemini Clients (Fallback & Retry aware)
│   │   ├── parsers/         # LLM Response Parser
│   │   └── prompts/         # Prompt Template Manager
│   ├── models/              # Internal Models
│   ├── prompts/             # Prompt Text Files (caption.txt, moderation.txt)
│   ├── schemas/             # Pydantic Request/Response Envelopes
│   ├── services/            # CaptionService, ModerationService, AnalyticsService
│   └── main.py              # FastAPI Application Entrypoint
├── tests/                   # Pytest Suite (Health, Caption, Moderation, Analytics, Groq, Gemini)
├── Dockerfile               # Production Docker Container
├── docker-compose.yml       # Docker Compose Setup
├── postman_collection.json  # Importable Postman API Collection
├── requirements.txt         # Dependencies
└── README.md
```

---

## 🧪 Postman & Manual Testing Guide

### 1. Start Service
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Health API (`GET /health`)
```http
GET http://localhost:8000/health
```
**Response:**
```json
{
  "success": true,
  "message": "AI Microservice status retrieved successfully",
  "requestId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "processingTime": "2.15ms",
  "data": {
    "status": "HEALTHY",
    "environment": "development",
    "components": {
      "application": {
        "status": "UP",
        "details": {
          "name": "Amigos AI Microservice",
          "environment": "development",
          "debugMode": false
        }
      },
      "groq_api": {
        "status": "UP",
        "details": {
          "status": "UP",
          "provider": "Groq AI",
          "message": "GroqClient operating in smart fallback mode (no live API key provided).",
          "model": "llama-3.3-70b-versatile"
        }
      }
    }
  }
}
```

### 3. Caption API (`POST /api/v1/caption`)
```http
POST http://localhost:8000/api/v1/caption
Content-Type: application/json

{
  "topic": "Beach Vacation",
  "tone": "Professional",
  "language": "English"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Captions Generated",
  "requestId": "c1a2b3c4-d5e6-7f8a-9b0c-1d2e3f4a5b6c",
  "processingTime": "45.10ms",
  "data": {
    "captions": [
      "✨ Exploring new horizons! Every moment spent here brings endless memories. 🌊 #VacationVibes #TravelGoals",
      "Living for days like these! Sunny skies, good times, and unforgettable experiences. ☀️ #GoodTimes #Adventure",
      "Unplugged and rejuvenated. Taking in the beauty of life one sunset at a time. 🌴 #Wanderlust #Relaxation"
    ]
  }
}
```

### 4. Moderation API (`POST /api/v1/moderate`)
```http
POST http://localhost:8000/api/v1/moderate
Content-Type: application/json

{
  "comment": "You are stupid."
}
```
**Response:**
```json
{
  "success": true,
  "message": "Moderation Completed",
  "requestId": "98765432-10ab-cdef-fe09-876543210abc",
  "processingTime": "32.40ms",
  "data": {
    "safe": false,
    "confidence": 94,
    "category": "Harassment",
    "reason": "Detected insulting language.",
    "action": "BLOCK"
  }
}
```

### 5. Analytics API (`GET /api/v1/analytics`)
```http
GET http://localhost:8000/api/v1/analytics
```
**Response:**
```json
{
  "success": true,
  "message": "Analytics metrics retrieved successfully",
  "requestId": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
  "processingTime": "1.10ms",
  "data": {
    "captionRequests": 120,
    "moderationRequests": 540,
    "flaggedComments": 28
  }
}
```

### 6. Flagged Comments API (`GET /api/v1/flagged-comments`)
```http
GET http://localhost:8000/api/v1/flagged-comments
```
**Response:**
```json
{
  "success": true,
  "message": "Flagged comments retrieved successfully",
  "requestId": "b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e",
  "processingTime": "1.80ms",
  "data": [
    {
      "id": "e932b132-7212-4c28-98e3-05ef89c12345",
      "comment": "You are stupid.",
      "confidence": 94,
      "category": "Harassment",
      "reason": "Detected insulting language.",
      "action": "BLOCK",
      "timestamp": "2026-08-02T23:54:03Z"
    }
  ]
}
```

---

## ☕ Spring Boot Integration Guide

Spring Boot User Backend should consume the AI Microservice using `RestTemplate` or `WebClient`.

### Spring Boot DTOs

```java
// CaptionRequest.java
public record CaptionRequest(String topic, String tone, String language) {}

// ApiResponse.java
public record ApiResponse<T>(
    boolean success,
    String message,
    String requestId,
    String processingTime,
    T data
) {}

// CaptionData.java
public record CaptionData(List<String> captions) {}
```

### RestTemplate Client Example

```java
@Service
public class AiServiceClient {

    private final RestTemplate restTemplate;
    private final String aiServiceUrl = "http://localhost:8000/api/v1";

    public AiServiceClient(RestTemplateBuilder builder) {
        this.restTemplate = builder.build();
    }

    public List<String> generateCaptions(String topic, String tone, String language) {
        var request = new CaptionRequest(topic, tone, language);
        var responseType = new ParameterizedTypeReference<ApiResponse<CaptionData>>() {};

        ResponseEntity<ApiResponse<CaptionData>> response = restTemplate.exchange(
            aiServiceUrl + "/caption",
            HttpMethod.POST,
            new HttpEntity<>(request),
            responseType
        );

        if (response.getBody() != null && response.getBody().success()) {
            return response.getBody().data().captions();
        }
        throw new RuntimeException("AI Microservice failed to generate captions");
    }
}
```

---

## 🐳 Docker Commands

```bash
# Build and run containers
docker-compose up --build -d

# Verify container status
docker ps

# Check logs
docker logs -f amigos-ai-service

# Stop container
docker-compose down
```
