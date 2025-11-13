-- ============================================
-- EGYPTAIR CREW ROSTERING & SCHEDULING SYSTEM
-- Complete Database Schema
-- Based on AIMS and Jeppesen industry standards
-- ============================================

-- ============================================
-- 1. CREW PROFILES (Extended from captains data)
-- ============================================

CREATE TABLE IF NOT EXISTS crew_profiles (
  id SERIAL PRIMARY KEY,
  employee_id VARCHAR(50) UNIQUE NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  
  -- Personal Information
  arabic_name VARCHAR(255),
  english_name VARCHAR(255) NOT NULL,
  passport_name VARCHAR(255),
  date_of_birth DATE,
  nationality VARCHAR(100),
  base_airport VARCHAR(10), -- IATA code
  
  -- Contact Information
  phone VARCHAR(20),
  email VARCHAR(255),
  emergency_contact_name VARCHAR(255),
  emergency_contact_phone VARCHAR(20),
  
  -- Employment Information
  hire_date DATE,
  seniority_number INTEGER UNIQUE,
  seniority_date DATE,
  rank VARCHAR(50), -- captain, first_officer, relief_pilot
  status VARCHAR(20) DEFAULT 'active', -- active, inactive, on_leave, retired
  
  -- Preferences
  preferred_destinations TEXT[], -- Array of airport codes
  preferred_layover_length VARCHAR(20), -- short, medium, long
  day_night_preference VARCHAR(20), -- day, night, no_preference
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 2. CREW QUALIFICATIONS & RATINGS
-- ============================================

CREATE TABLE IF NOT EXISTS crew_ratings (
  id SERIAL PRIMARY KEY,
  crew_id INTEGER REFERENCES crew_profiles(id) ON DELETE CASCADE,
  aircraft_type VARCHAR(50) NOT NULL, -- A320, A321, A330, B737, B777, B787
  rating_type VARCHAR(50) NOT NULL, -- type_rating, instructor, examiner
  qualification_date DATE NOT NULL,
  expiry_date DATE,
  total_hours_on_type INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active', -- active, expired, suspended
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(crew_id, aircraft_type, rating_type)
);

-- ============================================
-- 3. LICENSES & CERTIFICATIONS
-- ============================================

CREATE TABLE IF NOT EXISTS crew_licenses (
  id SERIAL PRIMARY KEY,
  crew_id INTEGER REFERENCES crew_profiles(id) ON DELETE CASCADE,
  license_type VARCHAR(100) NOT NULL, -- ATPL, CPL, medical, passport
  license_number VARCHAR(100) NOT NULL,
  issue_date DATE,
  expiry_date DATE NOT NULL,
  issuing_authority VARCHAR(255),
  status VARCHAR(20) DEFAULT 'valid', -- valid, expired, suspended, renewed
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 4. MEDICAL RECORDS
-- ============================================

CREATE TABLE IF NOT EXISTS medical_records (
  id SERIAL PRIMARY KEY,
  crew_id INTEGER REFERENCES crew_profiles(id) ON DELETE CASCADE,
  medical_class VARCHAR(20) NOT NULL, -- class_1, class_2
  certificate_number VARCHAR(100),
  issue_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  examining_physician VARCHAR(255),
  restrictions TEXT,
  status VARCHAR(20) DEFAULT 'valid', -- valid, expired, restricted
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 5. TRAINING RECORDS
-- ============================================

CREATE TABLE IF NOT EXISTS training_records (
  id SERIAL PRIMARY KEY,
  crew_id INTEGER REFERENCES crew_profiles(id) ON DELETE CASCADE,
  training_type VARCHAR(100) NOT NULL, -- recurrent, type_rating, upgrade, safety
  aircraft_type VARCHAR(50),
  training_date DATE NOT NULL,
  completion_date DATE,
  next_due_date DATE,
  status VARCHAR(20) DEFAULT 'completed', -- scheduled, in_progress, completed, failed
  instructor_name VARCHAR(255),
  score DECIMAL(5,2),
  notes TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 6. DUTY REGULATIONS & LIMITS
-- ============================================

CREATE TABLE IF NOT EXISTS duty_regulations (
  id SERIAL PRIMARY KEY,
  regulation_name VARCHAR(255) NOT NULL,
  regulation_authority VARCHAR(100), -- ECAA, EASA, ICAO
  
  -- Flight Time Limitations
  max_flight_hours_daily DECIMAL(5,2),
  max_flight_hours_weekly DECIMAL(5,2),
  max_flight_hours_monthly DECIMAL(5,2),
  max_flight_hours_yearly DECIMAL(5,2),
  
  -- Duty Period Limits
  max_duty_hours_daily DECIMAL(5,2),
  max_duty_hours_weekly DECIMAL(5,2),
  max_duty_hours_monthly DECIMAL(5,2),
  
  -- Rest Requirements
  min_rest_hours_daily DECIMAL(5,2),
  min_rest_hours_weekly DECIMAL(5,2),
  min_rest_between_duties DECIMAL(5,2),
  
  -- Overtime Caps
  max_overtime_hours_monthly DECIMAL(5,2),
  
  effective_date DATE NOT NULL,
  expiry_date DATE,
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 7. PAIRINGS (Flight Sequences)
-- ============================================

CREATE TABLE IF NOT EXISTS pairings (
  id SERIAL PRIMARY KEY,
  pairing_code VARCHAR(50) UNIQUE NOT NULL,
  aircraft_type VARCHAR(50) NOT NULL,
  base_airport VARCHAR(10) NOT NULL,
  
  -- Pairing Details
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_duty_hours DECIMAL(6,2),
  total_flight_hours DECIMAL(6,2),
  total_block_hours DECIMAL(6,2),
  
  -- Cost Information
  hotel_cost DECIMAL(10,2),
  per_diem_cost DECIMAL(10,2),
  deadhead_cost DECIMAL(10,2),
  total_cost DECIMAL(10,2),
  
  -- Status
  status VARCHAR(20) DEFAULT 'active', -- active, cancelled, completed
  is_reserve BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 8. PAIRING LEGS (Individual Flights in Pairing)
-- ============================================

CREATE TABLE IF NOT EXISTS pairing_legs (
  id SERIAL PRIMARY KEY,
  pairing_id INTEGER REFERENCES pairings(id) ON DELETE CASCADE,
  sequence_number INTEGER NOT NULL,
  
  -- Flight Information
  flight_number VARCHAR(20) NOT NULL,
  aircraft_registration VARCHAR(20),
  departure_airport VARCHAR(10) NOT NULL,
  arrival_airport VARCHAR(10) NOT NULL,
  scheduled_departure TIMESTAMP NOT NULL,
  scheduled_arrival TIMESTAMP NOT NULL,
  
  -- Time Information
  block_time DECIMAL(5,2), -- Actual flight time
  duty_time DECIMAL(5,2),
  ground_time DECIMAL(5,2), -- Time between flights
  
  -- Leg Type
  leg_type VARCHAR(20) DEFAULT 'flight', -- flight, deadhead, positioning
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(pairing_id, sequence_number)
);

-- ============================================
-- 9. ROSTERS (Monthly Schedules)
-- ============================================

CREATE TABLE IF NOT EXISTS rosters (
  id SERIAL PRIMARY KEY,
  crew_id INTEGER REFERENCES crew_profiles(id) ON DELETE CASCADE,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  year INTEGER NOT NULL CHECK (year >= 2020),
  
  -- Roster Statistics
  total_pairings INTEGER DEFAULT 0,
  total_duty_hours DECIMAL(6,2) DEFAULT 0,
  total_flight_hours DECIMAL(6,2) DEFAULT 0,
  total_days_off INTEGER DEFAULT 0,
  total_reserve_days INTEGER DEFAULT 0,
  
  -- Status
  status VARCHAR(20) DEFAULT 'draft', -- draft, bidding, awarded, published, completed
  awarded_date TIMESTAMP,
  published_date TIMESTAMP,
  
  -- Compliance
  is_compliant BOOLEAN DEFAULT true,
  compliance_notes TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(crew_id, month, year)
);

-- ============================================
-- 10. ROSTER ASSIGNMENTS (Pairing Assignments)
-- ============================================

CREATE TABLE IF NOT EXISTS roster_assignments (
  id SERIAL PRIMARY KEY,
  roster_id INTEGER REFERENCES rosters(id) ON DELETE CASCADE,
  pairing_id INTEGER REFERENCES pairings(id) ON DELETE CASCADE,
  crew_id INTEGER REFERENCES crew_profiles(id) ON DELETE CASCADE,
  
  -- Assignment Details
  position VARCHAR(50) NOT NULL, -- captain, first_officer, relief_pilot
  assignment_date DATE NOT NULL,
  assignment_type VARCHAR(20) DEFAULT 'regular', -- regular, reserve, standby, training
  
  -- Status
  status VARCHAR(20) DEFAULT 'assigned', -- assigned, completed, swapped, cancelled
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 11. BIDS (Preferential Bidding System)
-- ============================================

CREATE TABLE IF NOT EXISTS bids (
  id SERIAL PRIMARY KEY,
  crew_id INTEGER REFERENCES crew_profiles(id) ON DELETE CASCADE,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  year INTEGER NOT NULL CHECK (year >= 2020),
  
  -- Bid Window
  bid_open_date TIMESTAMP NOT NULL,
  bid_close_date TIMESTAMP NOT NULL,
  submitted_at TIMESTAMP,
  
  -- Bid Status
  status VARCHAR(20) DEFAULT 'draft', -- draft, submitted, processing, awarded, rejected
  
  -- Award Information
  awarded_roster_id INTEGER REFERENCES rosters(id),
  award_score DECIMAL(10,2), -- How well preferences were met
  award_feedback TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(crew_id, month, year)
);

-- ============================================
-- 12. BID PREFERENCES
-- ============================================

CREATE TABLE IF NOT EXISTS bid_preferences (
  id SERIAL PRIMARY KEY,
  bid_id INTEGER REFERENCES bids(id) ON DELETE CASCADE,
  preference_type VARCHAR(50) NOT NULL, -- pairing, destination, days_off, reserve_period, trip_length
  preference_value TEXT NOT NULL, -- JSON or text value
  weight INTEGER DEFAULT 1, -- Priority weight (1-10)
  sequence_number INTEGER, -- Order of preference
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 13. TRADES (Flight/Trip Swaps)
-- ============================================

CREATE TABLE IF NOT EXISTS trades (
  id SERIAL PRIMARY KEY,
  trade_type VARCHAR(20) NOT NULL, -- leg, trip, day, block
  
  -- Requesting Crew
  requesting_crew_id INTEGER REFERENCES crew_profiles(id) ON DELETE CASCADE,
  requesting_pairing_id INTEGER REFERENCES pairings(id),
  requesting_date DATE,
  
  -- Target Crew (if specific)
  target_crew_id INTEGER REFERENCES crew_profiles(id),
  target_pairing_id INTEGER REFERENCES pairings(id),
  target_date DATE,
  
  -- Trade Details
  reason TEXT,
  notes TEXT,
  
  -- Status
  status VARCHAR(20) DEFAULT 'pending', -- pending, matched, approved, rejected, completed, cancelled
  matched_at TIMESTAMP,
  approved_by INTEGER REFERENCES users(id),
  approved_at TIMESTAMP,
  completed_at TIMESTAMP,
  
  -- Legality Check
  is_legal BOOLEAN DEFAULT true,
  legality_notes TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 14. LEAVE REQUESTS
-- ============================================

CREATE TABLE IF NOT EXISTS leave_requests (
  id SERIAL PRIMARY KEY,
  crew_id INTEGER REFERENCES crew_profiles(id) ON DELETE CASCADE,
  leave_type VARCHAR(50) NOT NULL, -- annual, sick, training, unpaid, emergency
  
  -- Leave Period
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_days INTEGER NOT NULL,
  
  -- Request Details
  reason TEXT,
  supporting_documents TEXT[], -- File paths/URLs
  
  -- Approval Workflow
  status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected, cancelled
  requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_by INTEGER REFERENCES users(id),
  reviewed_at TIMESTAMP,
  review_notes TEXT,
  
  -- Leave Balance Impact
  balance_before DECIMAL(5,2),
  balance_after DECIMAL(5,2),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 15. LEAVE BALANCES
-- ============================================

CREATE TABLE IF NOT EXISTS leave_balances (
  id SERIAL PRIMARY KEY,
  crew_id INTEGER REFERENCES crew_profiles(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  leave_type VARCHAR(50) NOT NULL,
  
  -- Balance Information
  annual_entitlement DECIMAL(5,2) NOT NULL,
  used_days DECIMAL(5,2) DEFAULT 0,
  remaining_days DECIMAL(5,2) NOT NULL,
  carried_forward DECIMAL(5,2) DEFAULT 0,
  
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(crew_id, year, leave_type)
);

-- ============================================
-- 16. RESERVE POOL
-- ============================================

CREATE TABLE IF NOT EXISTS reserve_pool (
  id SERIAL PRIMARY KEY,
  crew_id INTEGER REFERENCES crew_profiles(id) ON DELETE CASCADE,
  aircraft_type VARCHAR(50) NOT NULL,
  
  -- Reserve Period
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reserve_type VARCHAR(20) NOT NULL, -- airport_standby, home_standby, short_call, long_call
  
  -- Availability
  start_time TIME,
  end_time TIME,
  location VARCHAR(100), -- Airport, home, hotel
  
  -- Status
  status VARCHAR(20) DEFAULT 'available', -- available, assigned, used, released
  assigned_pairing_id INTEGER REFERENCES pairings(id),
  assigned_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 17. DUTY TIME TRACKING
-- ============================================

CREATE TABLE IF NOT EXISTS duty_time_tracking (
  id SERIAL PRIMARY KEY,
  crew_id INTEGER REFERENCES crew_profiles(id) ON DELETE CASCADE,
  pairing_leg_id INTEGER REFERENCES pairing_legs(id),
  
  -- Actual Times
  actual_duty_start TIMESTAMP,
  actual_duty_end TIMESTAMP,
  actual_flight_start TIMESTAMP,
  actual_flight_end TIMESTAMP,
  
  -- Calculated Times
  actual_duty_hours DECIMAL(5,2),
  actual_flight_hours DECIMAL(5,2),
  actual_rest_hours DECIMAL(5,2),
  
  -- Compliance
  is_compliant BOOLEAN DEFAULT true,
  violation_type VARCHAR(100),
  violation_notes TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 18. CHECK-IN/CHECK-OUT LOGS
-- ============================================

CREATE TABLE IF NOT EXISTS checkin_logs (
  id SERIAL PRIMARY KEY,
  crew_id INTEGER REFERENCES crew_profiles(id) ON DELETE CASCADE,
  pairing_leg_id INTEGER REFERENCES pairing_legs(id),
  
  -- Check-in Information
  checkin_time TIMESTAMP,
  checkin_location VARCHAR(100),
  checkin_method VARCHAR(20), -- web, mobile, kiosk
  
  -- Check-out Information
  checkout_time TIMESTAMP,
  checkout_location VARCHAR(100),
  
  -- Journey Log
  journey_log_printed BOOLEAN DEFAULT false,
  briefing_received BOOLEAN DEFAULT false,
  messages_viewed BOOLEAN DEFAULT false,
  
  -- Status
  status VARCHAR(20) DEFAULT 'checked_in', -- checked_in, checked_out, no_show
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 19. FATIGUE SCORES (Boeing Alertness Model)
-- ============================================

CREATE TABLE IF NOT EXISTS fatigue_scores (
  id SERIAL PRIMARY KEY,
  crew_id INTEGER REFERENCES crew_profiles(id) ON DELETE CASCADE,
  pairing_id INTEGER REFERENCES pairings(id),
  calculation_date TIMESTAMP NOT NULL,
  
  -- Fatigue Metrics
  fatigue_score DECIMAL(5,2) NOT NULL, -- 0-100 scale
  risk_level VARCHAR(20) NOT NULL, -- low, medium, high, critical
  
  -- Contributing Factors
  time_of_day_factor DECIMAL(5,2),
  sleep_debt_factor DECIMAL(5,2),
  cumulative_duty_factor DECIMAL(5,2),
  circadian_disruption_factor DECIMAL(5,2),
  
  -- Recommendations
  recommended_action TEXT,
  alert_sent BOOLEAN DEFAULT false,
  alert_sent_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 20. NOTIFICATIONS
-- ============================================

CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  recipient_crew_id INTEGER REFERENCES crew_profiles(id) ON DELETE CASCADE,
  notification_type VARCHAR(50) NOT NULL, -- roster_change, bid_award, trade_approval, training_reminder, irregular_ops
  
  -- Notification Content
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  priority VARCHAR(20) DEFAULT 'normal', -- low, normal, high, urgent
  
  -- Delivery Channels
  send_email BOOLEAN DEFAULT true,
  send_sms BOOLEAN DEFAULT false,
  send_push BOOLEAN DEFAULT true,
  
  -- Status
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP,
  sent_at TIMESTAMP,
  
  -- Related Records
  related_roster_id INTEGER REFERENCES rosters(id),
  related_bid_id INTEGER REFERENCES bids(id),
  related_trade_id INTEGER REFERENCES trades(id),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 21. MESSAGES (Two-way Communication)
-- ============================================

CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  sender_id INTEGER REFERENCES crew_profiles(id),
  recipient_id INTEGER REFERENCES crew_profiles(id),
  
  -- Message Content
  subject VARCHAR(255),
  body TEXT NOT NULL,
  message_type VARCHAR(50) DEFAULT 'general', -- general, urgent, roster_query, trade_discussion
  
  -- Thread Management
  parent_message_id INTEGER REFERENCES messages(id),
  thread_id INTEGER,
  
  -- Status
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP,
  is_archived BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 22. AUDIT LOGS
-- ============================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  crew_id INTEGER REFERENCES crew_profiles(id),
  
  -- Action Details
  action_type VARCHAR(100) NOT NULL, -- create, update, delete, approve, reject
  entity_type VARCHAR(100) NOT NULL, -- roster, bid, trade, leave_request
  entity_id INTEGER NOT NULL,
  
  -- Change Details
  old_values JSONB,
  new_values JSONB,
  
  -- Context
  ip_address VARCHAR(50),
  user_agent TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 23. SYSTEM CONFIGURATION
-- ============================================

CREATE TABLE IF NOT EXISTS system_config (
  id SERIAL PRIMARY KEY,
  config_key VARCHAR(100) UNIQUE NOT NULL,
  config_value TEXT NOT NULL,
  config_type VARCHAR(50) NOT NULL, -- string, number, boolean, json
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  
  updated_by INTEGER REFERENCES users(id),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 24. BIDDING RULES CONFIGURATION
-- ============================================

CREATE TABLE IF NOT EXISTS bidding_rules (
  id SERIAL PRIMARY KEY,
  rule_name VARCHAR(255) NOT NULL,
  rule_type VARCHAR(50) NOT NULL, -- seniority, fair_share, weighted, bidline
  
  -- Rule Parameters
  parameters JSONB NOT NULL,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  effective_date DATE NOT NULL,
  expiry_date DATE,
  
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 25. TRADE POLICIES
-- ============================================

CREATE TABLE IF NOT EXISTS trade_policies (
  id SERIAL PRIMARY KEY,
  policy_name VARCHAR(255) NOT NULL,
  
  -- Policy Rules
  allow_early_late_trades BOOLEAN DEFAULT true,
  allow_block_trades BOOLEAN DEFAULT true,
  allow_specific_crew_trades BOOLEAN DEFAULT true,
  require_approval BOOLEAN DEFAULT true,
  advance_notice_hours INTEGER DEFAULT 24,
  
  -- Restrictions
  max_trades_per_month INTEGER,
  blackout_periods JSONB, -- Array of date ranges
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  effective_date DATE NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 26. REPORTS CACHE
-- ============================================

CREATE TABLE IF NOT EXISTS reports_cache (
  id SERIAL PRIMARY KEY,
  report_type VARCHAR(100) NOT NULL,
  report_parameters JSONB,
  
  -- Report Data
  report_data JSONB NOT NULL,
  generated_at TIMESTAMP NOT NULL,
  expires_at TIMESTAMP,
  
  -- Metadata
  generated_by INTEGER REFERENCES users(id),
  file_path TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Crew Profiles
CREATE INDEX IF NOT EXISTS idx_crew_profiles_employee_id ON crew_profiles(employee_id);
CREATE INDEX IF NOT EXISTS idx_crew_profiles_base_airport ON crew_profiles(base_airport);
CREATE INDEX IF NOT EXISTS idx_crew_profiles_seniority ON crew_profiles(seniority_number);
CREATE INDEX IF NOT EXISTS idx_crew_profiles_status ON crew_profiles(status);

-- Crew Ratings
CREATE INDEX IF NOT EXISTS idx_crew_ratings_crew_id ON crew_ratings(crew_id);
CREATE INDEX IF NOT EXISTS idx_crew_ratings_aircraft_type ON crew_ratings(aircraft_type);
CREATE INDEX IF NOT EXISTS idx_crew_ratings_expiry ON crew_ratings(expiry_date);

-- Licenses
CREATE INDEX IF NOT EXISTS idx_crew_licenses_crew_id ON crew_licenses(crew_id);
CREATE INDEX IF NOT EXISTS idx_crew_licenses_expiry ON crew_licenses(expiry_date);

-- Medical Records
CREATE INDEX IF NOT EXISTS idx_medical_records_crew_id ON medical_records(crew_id);
CREATE INDEX IF NOT EXISTS idx_medical_records_expiry ON medical_records(expiry_date);

-- Training Records
CREATE INDEX IF NOT EXISTS idx_training_records_crew_id ON training_records(crew_id);
CREATE INDEX IF NOT EXISTS idx_training_records_next_due ON training_records(next_due_date);

-- Pairings
CREATE INDEX IF NOT EXISTS idx_pairings_code ON pairings(pairing_code);
CREATE INDEX IF NOT EXISTS idx_pairings_aircraft_type ON pairings(aircraft_type);
CREATE INDEX IF NOT EXISTS idx_pairings_dates ON pairings(start_date, end_date);

-- Pairing Legs
CREATE INDEX IF NOT EXISTS idx_pairing_legs_pairing_id ON pairing_legs(pairing_id);
CREATE INDEX IF NOT EXISTS idx_pairing_legs_flight_number ON pairing_legs(flight_number);
CREATE INDEX IF NOT EXISTS idx_pairing_legs_departure ON pairing_legs(scheduled_departure);

-- Rosters
CREATE INDEX IF NOT EXISTS idx_rosters_crew_id ON rosters(crew_id);
CREATE INDEX IF NOT EXISTS idx_rosters_month_year ON rosters(month, year);
CREATE INDEX IF NOT EXISTS idx_rosters_status ON rosters(status);

-- Roster Assignments
CREATE INDEX IF NOT EXISTS idx_roster_assignments_roster_id ON roster_assignments(roster_id);
CREATE INDEX IF NOT EXISTS idx_roster_assignments_crew_id ON roster_assignments(crew_id);
CREATE INDEX IF NOT EXISTS idx_roster_assignments_pairing_id ON roster_assignments(pairing_id);

-- Bids
CREATE INDEX IF NOT EXISTS idx_bids_crew_id ON bids(crew_id);
CREATE INDEX IF NOT EXISTS idx_bids_month_year ON bids(month, year);
CREATE INDEX IF NOT EXISTS idx_bids_status ON bids(status);

-- Trades
CREATE INDEX IF NOT EXISTS idx_trades_requesting_crew ON trades(requesting_crew_id);
CREATE INDEX IF NOT EXISTS idx_trades_target_crew ON trades(target_crew_id);
CREATE INDEX IF NOT EXISTS idx_trades_status ON trades(status);

-- Leave Requests
CREATE INDEX IF NOT EXISTS idx_leave_requests_crew_id ON leave_requests(crew_id);
CREATE INDEX IF NOT EXISTS idx_leave_requests_dates ON leave_requests(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_leave_requests_status ON leave_requests(status);

-- Leave Balances
CREATE INDEX IF NOT EXISTS idx_leave_balances_crew_year ON leave_balances(crew_id, year);

-- Reserve Pool
CREATE INDEX IF NOT EXISTS idx_reserve_pool_crew_id ON reserve_pool(crew_id);
CREATE INDEX IF NOT EXISTS idx_reserve_pool_dates ON reserve_pool(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_reserve_pool_status ON reserve_pool(status);

-- Duty Time Tracking
CREATE INDEX IF NOT EXISTS idx_duty_time_tracking_crew_id ON duty_time_tracking(crew_id);
CREATE INDEX IF NOT EXISTS idx_duty_time_tracking_duty_start ON duty_time_tracking(actual_duty_start);

-- Check-in Logs
CREATE INDEX IF NOT EXISTS idx_checkin_logs_crew_id ON checkin_logs(crew_id);
CREATE INDEX IF NOT EXISTS idx_checkin_logs_checkin_time ON checkin_logs(checkin_time);

-- Fatigue Scores
CREATE INDEX IF NOT EXISTS idx_fatigue_scores_crew_id ON fatigue_scores(crew_id);
CREATE INDEX IF NOT EXISTS idx_fatigue_scores_risk_level ON fatigue_scores(risk_level);
CREATE INDEX IF NOT EXISTS idx_fatigue_scores_date ON fatigue_scores(calculation_date);

-- Notifications
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_crew_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at);

-- Messages
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_thread ON messages(thread_id);

-- Audit Logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);

-- ============================================
-- SEED DATA - DUTY REGULATIONS
-- ============================================

INSERT INTO duty_regulations (
  regulation_name,
  regulation_authority,
  max_flight_hours_daily,
  max_flight_hours_weekly,
  max_flight_hours_monthly,
  max_flight_hours_yearly,
  max_duty_hours_daily,
  max_duty_hours_weekly,
  max_duty_hours_monthly,
  min_rest_hours_daily,
  min_rest_hours_weekly,
  min_rest_between_duties,
  max_overtime_hours_monthly,
  effective_date,
  is_active
) VALUES (
  'ECAA Standard Regulations',
  'ECAA',
  9.0,
  60.0,
  100.0,
  1000.0,
  14.0,
  60.0,
  190.0,
  12.0,
  36.0,
  12.0,
  20.0,
  '2024-01-01',
  true
) ON CONFLICT DO NOTHING;

-- ============================================
-- SEED DATA - SYSTEM CONFIGURATION
-- ============================================

INSERT INTO system_config (config_key, config_value, config_type, description, is_public) VALUES
('bid_window_days', '14', 'number', 'Number of days before month start to open bidding', false),
('trade_advance_notice_hours', '24', 'number', 'Minimum hours notice required for trades', false),
('max_trades_per_month', '4', 'number', 'Maximum number of trades allowed per crew per month', false),
('fatigue_alert_threshold', '70', 'number', 'Fatigue score threshold for alerts (0-100)', false),
('enable_automatic_reserve_assignment', 'true', 'boolean', 'Automatically assign reserve crew when needed', false),
('enable_sms_notifications', 'true', 'boolean', 'Enable SMS notifications', false),
('enable_email_notifications', 'true', 'boolean', 'Enable email notifications', false),
('enable_push_notifications', 'true', 'boolean', 'Enable push notifications', false)
ON CONFLICT (config_key) DO NOTHING;

-- ============================================
-- END OF SCHEMA
-- ============================================

