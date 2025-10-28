# Apex Meridian OCC - Enhancement TODO

## Phase 1: Database Integration
- [x] Set up Vercel Postgres database schema
- [x] Create database schema (users, flights, crew, alerts, notifications)
- [x] Write migration scripts (schema.sql)
- [x] Add database connection utilities
- [x] Update API routes to use database with fallback to mock data

## Phase 2: User Management
- [x] Create users table with roles (admin, dispatcher, crew)
- [x] Implement proper JWT authentication
- [ ] Add user registration endpoint
- [ ] Add user management UI (admin only)
- [x] Implement role-based access control (RBAC)
- [x] Add password hashing with bcrypt

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




## Bugs to Fix
- [x] Fix 401 error on dashboard page load - send auth token with API requests
- [x] Add fallback data when API calls fail




## New Feature: ADS-B Real-Time Flight Tracking for EgyptAir
- [x] Research and select ADS-B data provider (OpenSky Network selected - FREE)
- [x] Create OpenSky API client library
- [x] Create ADS-B data ingestion service
- [x] Filter flights by EgyptAir fleet (callsign prefix: MSR/MSE)
- [x] Implement real-time flight position tracking API
- [x] Add flight history API (past flights from airports)
- [ ] Add future scheduled flights (requires additional API)
- [ ] Create flight map visualization component
- [x] Update dashboard to show live flight data
- [ ] Add flight details modal/panel
- [x] Implement auto-refresh for live updates (15 seconds)
- [ ] Store flight data in database for historical tracking




## Bugs to Fix
- [x] Fix OpenSky API call failing in production - Added demo fallback data
- [x] Add better error handling and fallback data for live flights



- [x] Fix 404 error - was authentication issue, dashboard works after login




## New Feature: Integrate Real EgyptAir Database
- [x] Examine uploaded Excel database files (aircraft, airports, flights)
- [x] Extract data from Excel files to JSON
- [x] Import aircraft data (67 aircraft - fleet information)
- [x] Import airports data (30 airports - route network)
- [x] Import flights data (34 routes - schedules and operations)
- [x] Update API endpoints to use real data (fleet, routes, airports, stats)
- [ ] Update dashboard to display actual EgyptAir information
- [ ] Add fleet management page
- [ ] Add routes/network visualization
- [ ] Add data refresh/sync mechanism

