-- =====================================================
-- EgyptAir Crew Rostering System - Complete Database Schema
-- Version: 1.0
-- Date: November 9, 2025
-- Compliance: ECAA, EASA, ICAO regulations
-- =====================================================

-- Drop existing tables if they exist (in correct order due to foreign keys)
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS fatigue_assessments CASCADE;
DROP TABLE IF EXISTS journey_logs CASCADE;
DROP TABLE IF EXISTS check_in_out_logs CASCADE;
DROP TABLE IF EXISTS trade_requests CASCADE;
DROP TABLE IF EXISTS reserve_assignments CASCADE;
DROP TABLE IF EXISTS crew_bids CASCADE;
DROP TABLE IF EXISTS bid_periods CASCADE;
DROP TABLE IF EXISTS roster_assignments CASCADE;
DROP TABLE IF EXISTS rosters CASCADE;
DROP TABLE IF EXISTS pairing_legs CASCADE;
DROP TABLE IF EXISTS pairings CASCADE;
DROP TABLE IF EXISTS training_records CASCADE;
DROP TABLE IF EXISTS crew_medical_records CASCADE;
DROP TABLE IF EXISTS crew_licenses CASCADE;
DROP TABLE IF EXISTS crew_qualifications CASCADE;
DROP TABLE IF EXISTS leave_requests CASCADE;
DROP TABLE IF EXISTS crew_profiles CASCADE;
DROP TABLE IF EXISTS flights CASCADE;
DROP TABLE IF EXISTS airports CASCADE;
DROP TABLE IF EXISTS aircraft CASCADE;
DROP TABLE IF EXISTS duty_regulations CASCADE;
DROP TABLE IF EXISTS system_config CASCADE;

-- =====================================================
-- 1. SYSTEM CONFIGURATION
-- =====================================================

CREATE TABLE system_config (
  id SERIAL PRIMARY KEY,
  config_key VARCHAR(100) UNIQUE NOT NULL,
  config_value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_by VARCHAR(100)
);

-- =====================================================
-- 2. DUTY REGULATIONS
-- =====================================================

CREATE TABLE duty_regulations (
  id SERIAL PRIMARY KEY,
  regulation_code VARCHAR(50) UNIQUE NOT NULL,
  regulation_name VARCHAR(200) NOT NULL,
  authority VARCHAR(50) NOT NULL, -- ECAA, EASA, ICAO
  max_flight_duty_period_hours DECIMAL(4,2) NOT NULL,
  max_daily_flight_time_hours DECIMAL(4,2) NOT NULL,
  max_weekly_flight_time_hours DECIMAL(4,2) NOT NULL,
  max_monthly_flight_time_hours DECIMAL(4,2) NOT NULL,
  max_yearly_flight_time_hours DECIMAL(4,2) NOT NULL,
  min_rest_period_hours DECIMAL(4,2) NOT NULL,
  max_consecutive_duty_days INTEGER NOT NULL,
  min_days_off_per_week INTEGER NOT NULL,
  min_days_off_per_month INTEGER NOT NULL,
  night_duty_reduction_factor DECIMAL(3,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 3. AIRCRAFT
-- =====================================================

CREATE TABLE aircraft (
  id SERIAL PRIMARY KEY,
  registration VARCHAR(20) UNIQUE NOT NULL,
  aircraft_type VARCHAR(50) NOT NULL,
  manufacturer VARCHAR(50) NOT NULL,
  variant VARCHAR(50),
  msn VARCHAR(20), -- Manufacturer Serial Number
  status VARCHAR(20) DEFAULT 'active',
  delivery_date DATE,
  home_base VARCHAR(10),
  current_location VARCHAR(10),
  seating_capacity INTEGER,
  cargo_capacity_kg INTEGER,
  range_km INTEGER,
  cruise_speed_kmh INTEGER,
  service_ceiling_m INTEGER,
  mtow_kg INTEGER, -- Maximum Takeoff Weight
  fuel_capacity_liters INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 4. AIRPORTS
-- =====================================================

CREATE TABLE airports (
  id SERIAL PRIMARY KEY,
  iata_code VARCHAR(3) UNIQUE NOT NULL,
  icao_code VARCHAR(4) UNIQUE NOT NULL,
  airport_name VARCHAR(200) NOT NULL,
  city VARCHAR(100) NOT NULL,
  country VARCHAR(100) NOT NULL,
  region VARCHAR(50),
  classification VARCHAR(50), -- Hub, Focus City, Domestic, International
  latitude DECIMAL(10,7),
  longitude DECIMAL(10,7),
  altitude_m INTEGER,
  timezone VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 5. FLIGHTS
-- =====================================================

CREATE TABLE flights (
  id SERIAL PRIMARY KEY,
  flight_number VARCHAR(10) NOT NULL,
  callsign VARCHAR(10),
  aircraft_id INTEGER REFERENCES aircraft(id),
  aircraft_type VARCHAR(50) NOT NULL,
  origin_iata VARCHAR(3) NOT NULL,
  destination_iata VARCHAR(3) NOT NULL,
  departure_time TIME NOT NULL,
  arrival_time TIME NOT NULL,
  flight_duration_minutes INTEGER NOT NULL,
  distance_km INTEGER,
  days_of_week VARCHAR(20), -- e.g., "1,2,3,4,5" for Mon-Fri
  effective_from DATE,
  effective_until DATE,
  status VARCHAR(20) DEFAULT 'scheduled',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 6. CREW PROFILES
-- =====================================================

CREATE TABLE crew_profiles (
  id SERIAL PRIMARY KEY,
  crew_code VARCHAR(20) UNIQUE NOT NULL,
  arabic_name VARCHAR(200),
  english_name VARCHAR(200) NOT NULL,
  passport_name VARCHAR(200),
  date_of_birth DATE NOT NULL,
  nationality VARCHAR(50) NOT NULL,
  base_airport VARCHAR(10) NOT NULL,
  rank VARCHAR(50) NOT NULL, -- Captain, First Officer, etc.
  seniority_number INTEGER,
  hire_date DATE NOT NULL,
  total_flight_hours DECIMAL(10,2) DEFAULT 0,
  phone VARCHAR(20),
  email VARCHAR(100),
  emergency_contact_name VARCHAR(200),
  emergency_contact_phone VARCHAR(20),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 7. CREW QUALIFICATIONS
-- =====================================================

CREATE TABLE crew_qualifications (
  id SERIAL PRIMARY KEY,
  crew_id INTEGER NOT NULL REFERENCES crew_profiles(id) ON DELETE CASCADE,
  aircraft_type VARCHAR(50) NOT NULL,
  qualification_type VARCHAR(50) NOT NULL, -- PIC, SIC, Instructor, Examiner
  qualified_since DATE NOT NULL,
  hours_on_type DECIMAL(10,2) DEFAULT 0,
  last_proficiency_check DATE,
  next_proficiency_check DATE,
  status VARCHAR(20) DEFAULT 'current',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(crew_id, aircraft_type, qualification_type)
);

-- =====================================================
-- 8. CREW LICENSES
-- =====================================================

CREATE TABLE crew_licenses (
  id SERIAL PRIMARY KEY,
  crew_id INTEGER NOT NULL REFERENCES crew_profiles(id) ON DELETE CASCADE,
  license_type VARCHAR(50) NOT NULL, -- ATPL, CPL, etc.
  license_number VARCHAR(50) UNIQUE NOT NULL,
  issuing_authority VARCHAR(50) NOT NULL,
  issue_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'valid',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 9. CREW MEDICAL RECORDS
-- =====================================================

CREATE TABLE crew_medical_records (
  id SERIAL PRIMARY KEY,
  crew_id INTEGER NOT NULL REFERENCES crew_profiles(id) ON DELETE CASCADE,
  medical_class VARCHAR(20) NOT NULL, -- Class 1, Class 2
  certificate_number VARCHAR(50),
  issue_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  examining_physician VARCHAR(200),
  restrictions TEXT,
  status VARCHAR(20) DEFAULT 'valid',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 10. TRAINING RECORDS
-- =====================================================

CREATE TABLE training_records (
  id SERIAL PRIMARY KEY,
  crew_id INTEGER NOT NULL REFERENCES crew_profiles(id) ON DELETE CASCADE,
  training_type VARCHAR(100) NOT NULL, -- Initial, Recurrent, Upgrade, etc.
  aircraft_type VARCHAR(50),
  training_provider VARCHAR(200),
  start_date DATE NOT NULL,
  completion_date DATE,
  expiry_date DATE,
  result VARCHAR(20), -- Pass, Fail, In Progress
  instructor_name VARCHAR(200),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 11. PAIRINGS (Flight Sequences)
-- =====================================================

CREATE TABLE pairings (
  id SERIAL PRIMARY KEY,
  pairing_code VARCHAR(20) UNIQUE NOT NULL,
  aircraft_type VARCHAR(50) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  start_airport VARCHAR(10) NOT NULL,
  end_airport VARCHAR(10) NOT NULL,
  total_duty_hours DECIMAL(6,2) NOT NULL,
  total_flight_hours DECIMAL(6,2) NOT NULL,
  total_credit_hours DECIMAL(6,2), -- For pay calculation
  layover_count INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 12. PAIRING LEGS (Individual Flights in a Pairing)
-- =====================================================

CREATE TABLE pairing_legs (
  id SERIAL PRIMARY KEY,
  pairing_id INTEGER NOT NULL REFERENCES pairings(id) ON DELETE CASCADE,
  leg_sequence INTEGER NOT NULL,
  flight_id INTEGER REFERENCES flights(id),
  flight_number VARCHAR(10) NOT NULL,
  origin_iata VARCHAR(3) NOT NULL,
  destination_iata VARCHAR(3) NOT NULL,
  departure_datetime TIMESTAMP NOT NULL,
  arrival_datetime TIMESTAMP NOT NULL,
  flight_time_hours DECIMAL(5,2) NOT NULL,
  block_time_hours DECIMAL(5,2),
  ground_time_hours DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(pairing_id, leg_sequence)
);

-- =====================================================
-- 13. ROSTERS (Monthly Crew Schedules)
-- =====================================================

CREATE TABLE rosters (
  id SERIAL PRIMARY KEY,
  roster_code VARCHAR(20) UNIQUE NOT NULL,
  crew_id INTEGER NOT NULL REFERENCES crew_profiles(id) ON DELETE CASCADE,
  aircraft_type VARCHAR(50) NOT NULL,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  year INTEGER NOT NULL CHECK (year >= 2020),
  total_flights INTEGER DEFAULT 0,
  total_duty_hours DECIMAL(8,2) DEFAULT 0,
  total_flight_hours DECIMAL(8,2) DEFAULT 0,
  total_credit_hours DECIMAL(8,2) DEFAULT 0,
  days_off INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'draft', -- draft, submitted, approved, published
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(crew_id, month, year)
);

-- =====================================================
-- 14. ROSTER ASSIGNMENTS (Pairings Assigned to Crew)
-- =====================================================

CREATE TABLE roster_assignments (
  id SERIAL PRIMARY KEY,
  roster_id INTEGER NOT NULL REFERENCES rosters(id) ON DELETE CASCADE,
  pairing_id INTEGER NOT NULL REFERENCES pairings(id),
  assignment_date DATE NOT NULL,
  position VARCHAR(20) NOT NULL, -- Captain, First Officer
  status VARCHAR(20) DEFAULT 'assigned',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 15. BID PERIODS (Preferential Bidding System)
-- =====================================================

CREATE TABLE bid_periods (
  id SERIAL PRIMARY KEY,
  period_code VARCHAR(20) UNIQUE NOT NULL,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  year INTEGER NOT NULL CHECK (year >= 2020),
  aircraft_type VARCHAR(50) NOT NULL,
  bidding_opens_at TIMESTAMP NOT NULL,
  bidding_closes_at TIMESTAMP NOT NULL,
  processing_status VARCHAR(20) DEFAULT 'pending', -- pending, processing, completed
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(month, year, aircraft_type)
);

-- =====================================================
-- 16. CREW BIDS (Individual Crew Preferences)
-- =====================================================

CREATE TABLE crew_bids (
  id SERIAL PRIMARY KEY,
  bid_period_id INTEGER NOT NULL REFERENCES bid_periods(id) ON DELETE CASCADE,
  crew_id INTEGER NOT NULL REFERENCES crew_profiles(id) ON DELETE CASCADE,
  pairing_id INTEGER NOT NULL REFERENCES pairings(id),
  bid_priority INTEGER NOT NULL CHECK (bid_priority > 0),
  bid_type VARCHAR(20) DEFAULT 'preference', -- preference, avoid
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) DEFAULT 'pending', -- pending, awarded, denied
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(bid_period_id, crew_id, pairing_id)
);

-- =====================================================
-- 17. LEAVE REQUESTS
-- =====================================================

CREATE TABLE leave_requests (
  id SERIAL PRIMARY KEY,
  crew_id INTEGER NOT NULL REFERENCES crew_profiles(id) ON DELETE CASCADE,
  leave_type VARCHAR(50) NOT NULL, -- Annual, Sick, Personal, etc.
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_days INTEGER NOT NULL,
  reason TEXT,
  notes TEXT,
  status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected, cancelled
  requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMP,
  reviewed_by VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 18. RESERVE ASSIGNMENTS
-- =====================================================

CREATE TABLE reserve_assignments (
  id SERIAL PRIMARY KEY,
  crew_id INTEGER NOT NULL REFERENCES crew_profiles(id) ON DELETE CASCADE,
  reserve_type VARCHAR(20) NOT NULL, -- Airport Standby, Home Standby
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  airport VARCHAR(10),
  flight_id INTEGER REFERENCES flights(id),
  assigned_at TIMESTAMP,
  status VARCHAR(20) DEFAULT 'active', -- active, utilized, released, cancelled
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 19. TRADE REQUESTS
-- =====================================================

CREATE TABLE trade_requests (
  id SERIAL PRIMARY KEY,
  requesting_crew_id INTEGER NOT NULL REFERENCES crew_profiles(id) ON DELETE CASCADE,
  target_crew_id INTEGER REFERENCES crew_profiles(id),
  offered_pairing_id INTEGER NOT NULL REFERENCES pairings(id),
  requested_pairing_id INTEGER NOT NULL REFERENCES pairings(id),
  trade_reason TEXT,
  status VARCHAR(20) DEFAULT 'pending', -- pending, accepted, rejected, approved, completed
  requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  responded_at TIMESTAMP,
  approved_at TIMESTAMP,
  approved_by VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 20. CHECK-IN/OUT LOGS
-- =====================================================

CREATE TABLE check_in_out_logs (
  id SERIAL PRIMARY KEY,
  crew_id INTEGER NOT NULL REFERENCES crew_profiles(id) ON DELETE CASCADE,
  flight_id INTEGER REFERENCES flights(id),
  pairing_id INTEGER REFERENCES pairings(id),
  check_in_time TIMESTAMP,
  check_out_time TIMESTAMP,
  location VARCHAR(100),
  device_info TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 21. JOURNEY LOGS (Detailed Flight Records)
-- =====================================================

CREATE TABLE journey_logs (
  id SERIAL PRIMARY KEY,
  crew_id INTEGER NOT NULL REFERENCES crew_profiles(id) ON DELETE CASCADE,
  flight_id INTEGER REFERENCES flights(id),
  flight_number VARCHAR(10) NOT NULL,
  flight_date DATE NOT NULL,
  aircraft_registration VARCHAR(20),
  origin_iata VARCHAR(3) NOT NULL,
  destination_iata VARCHAR(3) NOT NULL,
  departure_time TIMESTAMP NOT NULL,
  arrival_time TIMESTAMP NOT NULL,
  block_time_hours DECIMAL(5,2),
  flight_time_hours DECIMAL(5,2),
  position VARCHAR(20) NOT NULL, -- Captain, First Officer
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 22. FATIGUE ASSESSMENTS (Boeing Alertness Model)
-- =====================================================

CREATE TABLE fatigue_assessments (
  id SERIAL PRIMARY KEY,
  crew_id INTEGER NOT NULL REFERENCES crew_profiles(id) ON DELETE CASCADE,
  assessment_date DATE NOT NULL,
  duty_start_time TIMESTAMP NOT NULL,
  duty_end_time TIMESTAMP NOT NULL,
  total_duty_hours DECIMAL(5,2) NOT NULL,
  time_awake_hours DECIMAL(5,2),
  sleep_hours_last_24h DECIMAL(4,2),
  sleep_hours_last_48h DECIMAL(4,2),
  fatigue_score DECIMAL(5,2), -- Boeing Alertness Model score
  risk_level VARCHAR(20), -- Low, Medium, High
  mitigation_actions TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 23. NOTIFICATIONS
-- =====================================================

CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  crew_id INTEGER REFERENCES crew_profiles(id) ON DELETE CASCADE,
  notification_type VARCHAR(50) NOT NULL, -- roster_published, bid_result, trade_request, etc.
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  priority VARCHAR(20) DEFAULT 'normal', -- low, normal, high, urgent
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 24. AUDIT LOGS
-- =====================================================

CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(100),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id INTEGER,
  old_values JSONB,
  new_values JSONB,
  ip_address VARCHAR(50),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Crew indexes
CREATE INDEX idx_crew_profiles_crew_code ON crew_profiles(crew_code);
CREATE INDEX idx_crew_profiles_status ON crew_profiles(status);
CREATE INDEX idx_crew_profiles_base_airport ON crew_profiles(base_airport);
CREATE INDEX idx_crew_qualifications_crew_id ON crew_qualifications(crew_id);
CREATE INDEX idx_crew_qualifications_aircraft_type ON crew_qualifications(aircraft_type);

-- Flight indexes
CREATE INDEX idx_flights_flight_number ON flights(flight_number);
CREATE INDEX idx_flights_origin_destination ON flights(origin_iata, destination_iata);
CREATE INDEX idx_flights_aircraft_type ON flights(aircraft_type);

-- Roster indexes
CREATE INDEX idx_rosters_crew_id ON rosters(crew_id);
CREATE INDEX idx_rosters_month_year ON rosters(month, year);
CREATE INDEX idx_rosters_status ON rosters(status);
CREATE INDEX idx_roster_assignments_roster_id ON roster_assignments(roster_id);
CREATE INDEX idx_roster_assignments_pairing_id ON roster_assignments(pairing_id);

-- Bidding indexes
CREATE INDEX idx_bid_periods_month_year ON bid_periods(month, year);
CREATE INDEX idx_crew_bids_bid_period_id ON crew_bids(bid_period_id);
CREATE INDEX idx_crew_bids_crew_id ON crew_bids(crew_id);

-- Leave and reserve indexes
CREATE INDEX idx_leave_requests_crew_id ON leave_requests(crew_id);
CREATE INDEX idx_leave_requests_status ON leave_requests(status);
CREATE INDEX idx_reserve_assignments_crew_id ON reserve_assignments(crew_id);
CREATE INDEX idx_reserve_assignments_status ON reserve_assignments(status);

-- Trade indexes
CREATE INDEX idx_trade_requests_requesting_crew_id ON trade_requests(requesting_crew_id);
CREATE INDEX idx_trade_requests_target_crew_id ON trade_requests(target_crew_id);
CREATE INDEX idx_trade_requests_status ON trade_requests(status);

-- Notification indexes
CREATE INDEX idx_notifications_crew_id ON notifications(crew_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- Audit log indexes
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity_type_id ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- =====================================================
-- SEED DATA - DUTY REGULATIONS
-- =====================================================

INSERT INTO duty_regulations (
  regulation_code, regulation_name, authority,
  max_flight_duty_period_hours, max_daily_flight_time_hours,
  max_weekly_flight_time_hours, max_monthly_flight_time_hours,
  max_yearly_flight_time_hours, min_rest_period_hours,
  max_consecutive_duty_days, min_days_off_per_week,
  min_days_off_per_month, night_duty_reduction_factor
) VALUES
('ECAA-2024', 'Egyptian Civil Aviation Authority Regulations 2024', 'ECAA', 
 13.00, 9.00, 60.00, 100.00, 900.00, 12.00, 6, 1, 8, 0.75),
('EASA-FTL', 'EASA Flight Time Limitations', 'EASA',
 13.00, 9.00, 60.00, 100.00, 900.00, 12.00, 6, 1, 8, 0.75),
('ICAO-ANNEX6', 'ICAO Annex 6 Standards', 'ICAO',
 14.00, 10.00, 60.00, 110.00, 1000.00, 12.00, 7, 1, 8, 0.80);

-- =====================================================
-- SEED DATA - SYSTEM CONFIGURATION
-- =====================================================

INSERT INTO system_config (config_key, config_value, description) VALUES
('roster_generation_algorithm', 'optimization', 'Algorithm used for roster generation'),
('bidding_system_enabled', 'true', 'Enable preferential bidding system'),
('fatigue_monitoring_enabled', 'true', 'Enable fatigue risk management'),
('trade_approval_required', 'true', 'Require management approval for trades'),
('max_bid_priority', '50', 'Maximum number of bids per crew per period'),
('roster_publish_days_advance', '30', 'Days in advance to publish rosters'),
('notification_retention_days', '90', 'Days to retain notifications'),
('audit_log_retention_days', '365', 'Days to retain audit logs');

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

-- Display success message
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Database schema created successfully!';
  RAISE NOTICE 'Total tables: 24';
  RAISE NOTICE 'Ready for data import.';
  RAISE NOTICE '========================================';
END $$;

