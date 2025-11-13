# Phase 1: Database Setup + Data Import

## Objective
Set up complete database infrastructure and import all EgyptAir operational data

## Timeline
2-3 hours

---

## Tasks

### 1. Database Schema Creation
- [ ] Create crew_profiles table (541 captains)
- [ ] Create crew_qualifications table
- [ ] Create crew_licenses table
- [ ] Create crew_medical_records table
- [ ] Create training_records table
- [ ] Create duty_regulations table
- [ ] Create pairings table
- [ ] Create pairing_legs table
- [ ] Create rosters table
- [ ] Create roster_assignments table
- [ ] Create bid_periods table
- [ ] Create crew_bids table
- [ ] Create leave_requests table (already exists)
- [ ] Create reserve_assignments table (already exists)
- [ ] Create trade_requests table (already exists)
- [ ] Create check_in_out_logs table
- [ ] Create journey_logs table
- [ ] Create fatigue_assessments table
- [ ] Create notifications table
- [ ] Create audit_logs table
- [ ] Create system_config table
- [ ] Create aircraft table (67 aircraft)
- [ ] Create airports table (95 airports)
- [ ] Create flights table (326 flights)

### 2. Data Import Scripts
- [ ] Create script to import captains from egyptair_captains_full.json
- [ ] Create script to import aircraft from egyptair_aircraft.json
- [ ] Create script to import airports from egyptair_airports_complete.json
- [ ] Create script to import flights from egyptair_flights_verified.json
- [ ] Generate sample qualifications for all captains
- [ ] Generate sample licenses for all captains
- [ ] Generate sample medical records for all captains
- [ ] Set up duty regulations (ECAA/EASA/ICAO)

### 3. Data Verification
- [ ] Verify all 541 captains imported correctly
- [ ] Verify all 67 aircraft imported correctly
- [ ] Verify all 95 airports imported correctly
- [ ] Verify all 326 flights imported correctly
- [ ] Check foreign key relationships
- [ ] Validate data integrity constraints

### 4. API Endpoints for Data Access
- [ ] GET /api/crew - List all crew
- [ ] GET /api/crew/[id] - Get crew details
- [ ] GET /api/aircraft - List all aircraft
- [ ] GET /api/airports - List all airports (already exists)
- [ ] GET /api/flights - List all flights (already exists)
- [ ] GET /api/qualifications - List qualifications
- [ ] GET /api/regulations - Get duty regulations

---

## Deliverables

1. ✅ Complete database schema deployed to Vercel Postgres
2. ✅ All EgyptAir data imported (541 crew, 67 aircraft, 95 airports, 326 flights)
3. ✅ Data verification report
4. ✅ Basic API endpoints for data access
5. ✅ Documentation of database structure

---

## Success Criteria

- All database tables created without errors
- All data imported successfully
- No foreign key violations
- API endpoints return correct data
- Ready for Phase 2 (Roster Generation)

---

## Notes

- Use Vercel Postgres for database
- Follow ECAA, EASA, and ICAO regulations
- Ensure data privacy and security
- Support both English and Arabic text (UTF-8)

