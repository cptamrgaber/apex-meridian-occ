# Apex Meridian OCC - Enhancement TODO

## Phase 1: Database Integration
- [x] Set up Vercel Postgres database schema
- [x] Create database schema (users, flights, crew, alerts, notifications)
- [x] Write migration scripts (schema.sql)
- [x] Add database connection utilities
- [x] Update API routes to use database with fallback to mock data

## Phase 2: User Management
- [ ] Create users table with roles (admin, dispatcher, crew) - DONE in schema
- [ ] Implement proper JWT authentication - DONE
- [ ] Add user registration endpoint
- [ ] Add user management UI (admin only)
- [ ] Implement role-based access control (RBAC)
- [ ] Add password hashing with bcrypt - DONE

## Phase 3: Real Flight Data Integration
- [ ] Research and select flight tracking API (AviationStack/FlightAware)
- [ ] Set up API credentials
- [ ] Create flight data ingestion service
- [ ] Implement real-time flight status updates
- [ ] Add ADS-B data integration
- [ ] Create flight position tracking
- [ ] Add weather data integration (TAF/METAR)

## Phase 4: Real-Time Notifications
- [x] Create notifications table in database
- [ ] Implement WebSocket/Server-Sent Events for real-time updates
- [x] Add notification API endpoints
- [ ] Create notification UI component
- [ ] Add notification preferences
- [ ] Implement alert triggers (delays, cancellations, weather)

## Phase 5: Backend Services
- [ ] Deploy optimizer service to Render/Railway
- [ ] Deploy rules engine service
- [ ] Set up service-to-service communication
- [ ] Add API gateway for backend services
- [ ] Implement crew pairing optimization
- [ ] Add regulatory compliance checks

## Phase 6: AI Chatbot
- [ ] Integrate AI chatbot for OM-A queries
- [ ] Add weather information queries
- [ ] Add flight status queries
- [ ] Add flight position queries
- [ ] Implement chat history
- [ ] Add copy and PDF export features

## Phase 7: Testing & Documentation
- [ ] Test all database operations
- [ ] Test authentication and authorization
- [ ] Test real-time notifications
- [ ] Test flight data accuracy
- [ ] Update README with new features
- [ ] Create API documentation
- [ ] Write user guide

## Phase 8: Deployment
- [ ] Deploy enhanced version to Vercel
- [ ] Configure environment variables
- [ ] Set up monitoring and logging
- [ ] Create production checkpoint
- [ ] Verify all features working in production

