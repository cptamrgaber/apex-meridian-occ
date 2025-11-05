# Apex Meridian® OCC - API Documentation

**Published by:** Apex-Meridian LLC  
**Document Version:** 1.0  
**Last Updated:** November 5, 2025  
**Editor:** Apex-Meridian LLC

---

## API Overview

The Apex Meridian® OCC provides RESTful API endpoints for flight operations, crew management, OM-A queries, and compliance validation.

**Base URL:** `https://apex-meridian-occ.vercel.app/api`  
**Authentication:** Bearer token (future implementation)  
**Content-Type:** `application/json`

---

## Flight Operations

### Get Live Flights

Retrieve real-time flight data from OpenSky Network.

**Endpoint:** `GET /api/flights/live`

**Response:**
```json
{
  "flights": [
    {
      "callsign": "MSR777",
      "latitude": 30.12,
      "longitude": 31.41,
      "altitude": 35000,
      "speed": 450,
      "heading": 90,
      "status": "In Flight"
    }
  ],
  "timestamp": "2025-11-05T12:00:00Z",
  "count": 3
}
```

**Status Codes:**
- `200 OK` - Success
- `500 Internal Server Error` - API failure

---

### Get Dashboard Statistics

Retrieve operational statistics for the dashboard.

**Endpoint:** `GET /api/dashboard/stats`

**Response:**
```json
{
  "activeFlights": 3,
  "crewOnDuty": 45,
  "activeAlerts": 2,
  "scheduledFlights": 72,
  "onTimePerformance": 94.5,
  "averageDelay": 12.3
}
```

**Status Codes:**
- `200 OK` - Success
- `500 Internal Server Error` - Calculation error

---

## OM-A AI System

### Query Operations Manual

Ask questions about EgyptAir Operations Manual regulations.

**Endpoint:** `POST /api/om-a/query`

**Request Body:**
```json
{
  "query": "What are the maximum flight duty period limits?",
  "context": "crew_scheduling"
}
```

**Response:**
```json
{
  "answer": "According to OM-A Section 7.2.1, the maximum Flight Duty Period (FDP) is 13 hours for a single pilot operation...",
  "sources": [
    {
      "section": "7.2.1",
      "title": "Flight Duty Period Limitations",
      "content": "The maximum FDP shall not exceed 13 hours..."
    }
  ],
  "confidence": 0.95
}
```

**Parameters:**
- `query` (required): Question about regulations
- `context` (optional): Context for better results (crew_scheduling, maintenance, safety, operations)

**Status Codes:**
- `200 OK` - Success
- `400 Bad Request` - Missing query
- `500 Internal Server Error` - AI processing error

---

### Validate Compliance

Check if an operation complies with OM-A regulations.

**Endpoint:** `POST /api/om-a/validate`

**Request Body:**
```json
{
  "operation_type": "crew_duty",
  "data": {
    "captain_code": "15100",
    "duty_start": "2025-11-05T06:00:00Z",
    "duty_end": "2025-11-05T20:00:00Z",
    "flight_hours": 8.5,
    "rest_period": 11.5
  }
}
```

**Response:**
```json
{
  "compliant": false,
  "violations": [
    {
      "rule": "Minimum Rest Period",
      "section": "7.3.2",
      "required": "12 hours",
      "actual": "11.5 hours",
      "severity": "high"
    }
  ],
  "recommendations": [
    "Extend rest period by 30 minutes to meet minimum requirement"
  ]
}
```

**Operation Types:**
- `crew_duty` - Crew duty time validation
- `maintenance` - Maintenance compliance
- `flight_planning` - Flight plan validation
- `safety` - Safety procedure compliance

**Status Codes:**
- `200 OK` - Validation complete
- `400 Bad Request` - Invalid operation type or data
- `500 Internal Server Error` - Validation error

---

## Schedule Generation

### Generate Crew Schedule

Generate optimized crew schedules based on flights and availability.

**Endpoint:** `POST /api/schedule/generate`

**Request Body:**
```json
{
  "mode": "aircraft_type",
  "aircraft_type": "B738",
  "start_date": "2025-11-01",
  "end_date": "2025-11-30",
  "days": 30
}
```

**Parameters:**
- `mode` (required): Generation mode
  - `individual` - Single captain
  - `aircraft_type` - All captains for specific aircraft
  - `all` - Entire captain database
- `captain_code` (required if mode=individual): Captain employee code
- `aircraft_type` (required if mode=aircraft_type): Aircraft type code
- `start_date` (required): Schedule start date (YYYY-MM-DD)
- `end_date` (required): Schedule end date (YYYY-MM-DD)
- `days` (required): Number of days (7-90)

**Response:**
```json
{
  "schedule": [
    {
      "date": "2025-11-01",
      "captain_code": "15100",
      "captain_name": "Shhyr Magdy Yacoub",
      "flight_number": "MS145",
      "aircraft_type": "B738",
      "route": "CAI-DXB",
      "duty_start": "06:00",
      "duty_end": "14:30",
      "duty_hours": 8.5,
      "flight_hours": 4.2,
      "status": "scheduled"
    }
  ],
  "statistics": {
    "total_assignments": 210,
    "captains_used": 30,
    "average_utilization": 75.5,
    "compliance_rate": 100
  }
}
```

**Status Codes:**
- `200 OK` - Schedule generated
- `400 Bad Request` - Invalid parameters
- `404 Not Found` - Captain not found
- `500 Internal Server Error` - Generation error

---

## Error Responses

All API endpoints return consistent error responses:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Missing required parameter: query",
    "details": {
      "field": "query",
      "reason": "required"
    }
  }
}
```

**Error Codes:**
- `VALIDATION_ERROR` - Invalid request parameters
- `NOT_FOUND` - Resource not found
- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Insufficient permissions
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `INTERNAL_ERROR` - Server error
- `EXTERNAL_API_ERROR` - External service failure

---

## Rate Limiting

**Current Limits:**
- 100 requests per minute per IP
- 1000 requests per hour per IP

**Rate Limit Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1699200000
```

**429 Too Many Requests Response:**
```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Please try again in 60 seconds.",
    "retry_after": 60
  }
}
```

---

## Authentication (Future)

**Bearer Token Authentication:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Token Endpoint:** `POST /api/auth/token`

**Request:**
```json
{
  "username": "demo_admin",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

---

## Webhooks (Future)

Subscribe to real-time events:

**Events:**
- `flight.departed` - Flight has departed
- `flight.arrived` - Flight has arrived
- `flight.delayed` - Flight is delayed
- `compliance.violation` - Compliance violation detected
- `maintenance.due` - Maintenance due soon

**Webhook Payload:**
```json
{
  "event": "flight.departed",
  "timestamp": "2025-11-05T12:00:00Z",
  "data": {
    "flight_number": "MS145",
    "origin": "CAI",
    "destination": "DXB",
    "departure_time": "2025-11-05T12:00:00Z"
  }
}
```

---

## SDK Examples

### JavaScript/TypeScript

```typescript
import axios from 'axios';

const API_BASE = 'https://apex-meridian-occ.vercel.app/api';

// Get live flights
async function getLiveFlights() {
  const response = await axios.get(`${API_BASE}/flights/live`);
  return response.data.flights;
}

// Query OM-A
async function queryOMA(question: string) {
  const response = await axios.post(`${API_BASE}/om-a/query`, {
    query: question
  });
  return response.data.answer;
}

// Validate compliance
async function validateDuty(dutyData: any) {
  const response = await axios.post(`${API_BASE}/om-a/validate`, {
    operation_type: 'crew_duty',
    data: dutyData
  });
  return response.data;
}
```

### Python

```python
import requests

API_BASE = 'https://apex-meridian-occ.vercel.app/api'

# Get live flights
def get_live_flights():
    response = requests.get(f'{API_BASE}/flights/live')
    return response.json()['flights']

# Query OM-A
def query_oma(question):
    response = requests.post(f'{API_BASE}/om-a/query', json={
        'query': question
    })
    return response.json()['answer']

# Validate compliance
def validate_duty(duty_data):
    response = requests.post(f'{API_BASE}/om-a/validate', json={
        'operation_type': 'crew_duty',
        'data': duty_data
    })
    return response.json()
```

### cURL

```bash
# Get live flights
curl https://apex-meridian-occ.vercel.app/api/flights/live

# Query OM-A
curl -X POST https://apex-meridian-occ.vercel.app/api/om-a/query \
  -H "Content-Type: application/json" \
  -d '{"query": "What are the duty time limits?"}'

# Validate compliance
curl -X POST https://apex-meridian-occ.vercel.app/api/om-a/validate \
  -H "Content-Type: application/json" \
  -d '{
    "operation_type": "crew_duty",
    "data": {
      "captain_code": "15100",
      "duty_hours": 14.5
    }
  }'
```

---

## Changelog

### Version 1.0 (2025-11-05)
- Initial API release
- Flight operations endpoints
- OM-A AI system endpoints
- Schedule generation endpoint

---

**Powered by:** Apex-Meridian LLC  
**Document Version:** 1.0  
**Last Updated:** November 5, 2025  
**Editor:** Apex-Meridian LLC  
**Copyright:** © 2025 Apex-Meridian LLC. All rights reserved.

