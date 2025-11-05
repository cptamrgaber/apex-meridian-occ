# Apex Meridian® OCC - System Architecture

**Published by:** Apex-Meridian LLC  
**Document Version:** 1.0  
**Last Updated:** November 5, 2025  
**Editor:** Apex-Meridian LLC

---

## Architecture Overview

The Apex Meridian® Operations Control Center is built on a modern, scalable architecture using Next.js 14, React 19, and TypeScript.

### Technology Stack

**Frontend:**
- React 19 RC (UI framework)
- Next.js 14.2.3 (Full-stack framework)
- TypeScript 5.x (Type safety)
- Tailwind CSS 4.0 (Styling)
- shadcn/ui (Component library)
- Recharts (Data visualization)
- Leaflet (Mapping)
- Framer Motion (Animations)

**Backend:**
- Next.js API Routes (RESTful API)
- Google Gemini API (AI/ML)
- OpenSky Network API (Flight tracking)

**Data Storage:**
- JSON files (Static data)
- In-memory caching (OM-A chunks)
- Future: PostgreSQL/Neon (Production scale)

**Deployment:**
- Vercel (Cloud hosting)
- Docker (Containerization)
- GitHub (Version control)

---

## System Components

### 1. Frontend Application

**Pages:**
- Dashboard (`/dashboard`)
- Schedule (`/schedule`)
- Roster (`/roster`)
- Crew (`/crew`)
- Fleet (`/fleet`)
- Fleet Map (`/fleet-map`)
- Routes (`/routes`)
- Analytics (`/analytics`)
- OM-A Assistant (`/om-a-assistant`)
- Compliance (`/compliance`)
- Weather (`/weather`)
- Notifications (`/notifications`)
- Settings (`/settings`)

**Components:**
- Sidebar (Navigation)
- FleetMap (Real-time tracking)
- Charts (Analytics visualization)
- OM-A Chat (AI assistant interface)

### 2. API Endpoints

**Flight Operations:**
- `GET /api/flights/live` - Real-time flight data
- `GET /api/dashboard/stats` - Dashboard statistics

**OM-A System:**
- `POST /api/om-a/query` - AI-powered regulation queries
- `POST /api/om-a/validate` - Compliance validation

**Schedule Generation:**
- `POST /api/schedule/generate` - Generate crew schedules

### 3. Data Layer

**Static Data Files:**
- `src/data/egyptair_captains_full.json` (541 captains)
- `src/data/egyptair_flights_verified.json` (326 flights)
- `src/data/egyptair_fleet.json` (67 aircraft)
- `src/data/om-a/OM-A.md` (Operations Manual)
- `src/data/om-a/om-a-chunks.json` (3,030 chunks)

**Data Models:**
```typescript
interface Captain {
  code: string;
  english_name: string;
  arabic_name: string;
  aircraft_type: string;
  license: string;
  base: string;
  status: string;
  seniority: number;
}

interface Flight {
  flight_number: string;
  aircraft_type: string;
  origin: string;
  destination: string;
  departure_time: string;
  arrival_time: string;
  duration: string;
  gate: string;
  terminal: string;
  status: string;
}

interface Aircraft {
  registration: string;
  type: string;
  manufacturer: string;
  age: number;
  status: string;
  flight_hours: number;
  cycles: number;
  next_maintenance: number;
}
```

### 4. AI/ML Integration

**Gemini API Integration:**
- Model: `gemini-2.5-flash`
- Embedding Model: `embedding-004`
- Context Window: 2M tokens
- Temperature: 0.3 (factual responses)

**RAG System:**
```typescript
// Hybrid search: Keyword + Semantic
async function searchOMA(query: string) {
  // 1. Keyword search (fast)
  const keywordResults = chunks.filter(chunk => 
    chunk.content.toLowerCase().includes(query.toLowerCase())
  );
  
  // 2. Semantic search (accurate)
  const embedding = await generateEmbedding(query);
  const semanticResults = findSimilar(embedding, chunks);
  
  // 3. Combine and rank
  return rankResults(keywordResults, semanticResults);
}
```

### 5. External Integrations

**OpenSky Network:**
- Real-time ADS-B flight tracking
- Update interval: 15 seconds
- Rate limit: 4000 requests/day
- Coverage: Global

**Weather APIs:**
- Aviation Weather Center (METAR/TAF)
- Update interval: 30 minutes
- Cache duration: 15 minutes

---

## Data Flow

### Real-Time Flight Tracking

```
OpenSky API → API Route → Frontend → Map Display
     ↓
  15s interval
     ↓
  Update markers
```

### OM-A Query Processing

```
User Query → API Route → RAG Engine → Gemini API
                ↓            ↓
          Keyword Search  Semantic Search
                ↓            ↓
              Combine Results
                ↓
          Generate Response
                ↓
          Return with Citations
```

### Compliance Validation

```
Operation Data → Validation Engine → OM-A Rules
                        ↓
                  Check Limits
                        ↓
              Generate Violations
                        ↓
              Update Dashboard
```

---

## Security Architecture

### Authentication

**Current:** Simple username/password (demo)  
**Future:** OAuth2 with JWT tokens

### Authorization

Role-based access control (RBAC):
- Viewer: Read-only
- Dispatcher: Operations management
- Crew Manager: Crew scheduling
- Maintenance: Fleet management
- Admin: Full access

### Data Security

- HTTPS encryption in transit
- Environment variables for API keys
- No sensitive data in client-side code
- Audit logging for all critical operations

---

## Performance Optimization

### Frontend Optimization

**Code Splitting:**
- Dynamic imports for heavy components
- Lazy loading for non-critical pages
- Reduced initial bundle size

**Caching:**
- Browser caching for static assets
- API response caching (15-minute TTL)
- In-memory chunk caching

**Image Optimization:**
- Next.js Image component
- WebP format with fallbacks
- Responsive loading

### Backend Optimization

**API Performance:**
- Hybrid search (keyword + semantic)
- On-demand embedding generation
- Response compression

**Data Processing:**
- Efficient chunking strategy
- Minimal memory footprint
- Parallel processing where possible

---

## Scalability Considerations

### Current Limitations

- JSON file storage (not scalable beyond 1000s of records)
- In-memory caching (limited by server RAM)
- Single-server deployment

### Future Enhancements

**Database Migration:**
- PostgreSQL/Neon for relational data
- Redis for caching
- Vector database for embeddings (Pinecone, Weaviate)

**Horizontal Scaling:**
- Load balancer
- Multiple application servers
- Database replication

**Microservices:**
- Separate services for:
  - Flight tracking
  - OM-A AI
  - Compliance engine
  - Analytics processing

---

## Deployment Architecture

### Development

```
Local Machine
  ↓
pnpm dev
  ↓
http://localhost:3000
```

### Production (Vercel)

```
GitHub Repository
  ↓
Push to main
  ↓
Vercel Build
  ↓
Deploy to Edge Network
  ↓
https://apex-meridian-occ.vercel.app
```

### Docker Deployment

```
Dockerfile
  ↓
docker-compose build
  ↓
Container Runtime
  ↓
http://localhost:3000
```

---

## Monitoring and Observability

### Logging

**Application Logs:**
- Console logging (development)
- Structured logging (production)
- Log levels: DEBUG, INFO, WARN, ERROR

**Audit Logs:**
- User authentication
- Compliance overrides
- System configuration changes
- Data exports

### Metrics

**Key Performance Indicators:**
- Page load time
- API response time
- Error rate
- Active users
- Data update latency

### Error Tracking

**Error Monitoring:**
- Client-side errors (React Error Boundaries)
- Server-side errors (API error handlers)
- External API failures

---

## Disaster Recovery

### Backup Strategy

**Automated Backups:**
- Daily at 02:00 UTC
- 30-day retention
- Encrypted storage
- Automatic integrity verification

**Backup Scope:**
- Configuration files
- User data
- Compliance logs
- Audit trails

### Recovery Procedures

**Recovery Time Objectives (RTO):**
- Critical systems: 1 hour
- Core operations: 4 hours
- Full system: 24 hours

**Recovery Point Objectives (RPO):**
- Maximum data loss: 24 hours

---

## Future Architecture

### Planned Enhancements

**Phase 1: Database Migration**
- Migrate to PostgreSQL
- Implement Redis caching
- Add vector database for embeddings

**Phase 2: Microservices**
- Separate OM-A AI service
- Dedicated flight tracking service
- Independent analytics engine

**Phase 3: Advanced Features**
- WebSocket for real-time updates
- GraphQL API
- Mobile applications (iOS/Android)
- Offline support (PWA)

---

## Technical Specifications

### System Requirements

**Minimum:**
- CPU: 2 cores
- RAM: 4 GB
- Storage: 10 GB
- Network: Broadband

**Recommended:**
- CPU: 4+ cores
- RAM: 8+ GB
- Storage: 20+ GB SSD
- Network: High-speed

### Browser Support

- Chrome 120+
- Firefox 121+
- Safari 17+
- Edge 120+

### API Rate Limits

- OpenSky Network: 4000 requests/day
- Gemini API: Based on subscription tier
- Weather API: 1000 requests/day

---

## Development Guidelines

### Code Organization

```
src/
├── app/              # Next.js pages and API routes
│   ├── dashboard/
│   ├── schedule/
│   ├── api/
│   └── ...
├── components/       # React components
│   ├── Sidebar.tsx
│   ├── FleetMap.tsx
│   └── ...
├── lib/              # Utility functions
│   ├── gemini-rag.ts
│   ├── om-a-processor.ts
│   └── ...
├── data/             # Static data files
│   ├── egyptair_captains_full.json
│   ├── egyptair_flights_verified.json
│   └── om-a/
└── styles/           # Global styles
```

### Coding Standards

**TypeScript:**
- Strict mode enabled
- Explicit types for all functions
- No `any` types (use `unknown` if needed)

**React:**
- Functional components only
- Hooks for state management
- Props interface for all components

**Naming Conventions:**
- PascalCase for components
- camelCase for functions and variables
- UPPER_SNAKE_CASE for constants
- kebab-case for files

---

## Conclusion

The Apex Meridian® OCC is built on a modern, scalable architecture designed for reliability, performance, and future growth. The system leverages cutting-edge technologies while maintaining simplicity and maintainability.

**Powered by:** Apex-Meridian LLC  
**Document Version:** 1.0  
**Last Updated:** November 5, 2025  
**Editor:** Apex-Meridian LLC  
**Copyright:** © 2025 Apex-Meridian LLC. All rights reserved.

