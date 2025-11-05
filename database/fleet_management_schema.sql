-- Fleet Management System Database Schema
-- For Chief Pilot Role-Based Fleet and Crew Management

-- ============================================
-- 1. USERS & ROLES
-- ============================================

-- Add role column to existing users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'pilot';
-- Roles: 'admin', 'chief_pilot', 'pilot', 'dispatcher', 'crew'

-- ============================================
-- 2. AIRCRAFT TYPES & GROUPS
-- ============================================

CREATE TABLE IF NOT EXISTS aircraft_types (
  id SERIAL PRIMARY KEY,
  code VARCHAR(10) UNIQUE NOT NULL, -- A320, A321, A330, B737, B777, B787
  name VARCHAR(100) NOT NULL,
  manufacturer VARCHAR(50) NOT NULL, -- Airbus, Boeing
  category VARCHAR(50) NOT NULL, -- Narrow-body, Wide-body
  min_crew INTEGER NOT NULL DEFAULT 2,
  max_crew INTEGER NOT NULL DEFAULT 4,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 3. CHIEF PILOTS
-- ============================================

CREATE TABLE IF NOT EXISTS chief_pilots (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  aircraft_type_id INTEGER REFERENCES aircraft_types(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  license_number VARCHAR(50) UNIQUE NOT NULL,
  total_flight_hours INTEGER DEFAULT 0,
  phone VARCHAR(20),
  email VARCHAR(255),
  assigned_date DATE DEFAULT CURRENT_DATE,
  status VARCHAR(20) DEFAULT 'active', -- active, inactive, on_leave
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, aircraft_type_id)
);

-- ============================================
-- 4. FLEET ASSIGNMENTS
-- ============================================

CREATE TABLE IF NOT EXISTS fleet_assignments (
  id SERIAL PRIMARY KEY,
  aircraft_id INTEGER NOT NULL, -- Reference to aircraft
  chief_pilot_id INTEGER REFERENCES chief_pilots(id) ON DELETE CASCADE,
  assigned_date DATE DEFAULT CURRENT_DATE,
  status VARCHAR(20) DEFAULT 'assigned', -- assigned, unassigned, maintenance
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 5. CREW QUALIFICATIONS
-- ============================================

CREATE TABLE IF NOT EXISTS crew_qualifications (
  id SERIAL PRIMARY KEY,
  pilot_id INTEGER NOT NULL, -- Reference to crew/pilots
  aircraft_type_id INTEGER REFERENCES aircraft_types(id) ON DELETE CASCADE,
  qualification_type VARCHAR(50) NOT NULL, -- captain, first_officer, relief_pilot
  qualification_date DATE NOT NULL,
  expiry_date DATE,
  total_hours_on_type INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active', -- active, expired, suspended
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(pilot_id, aircraft_type_id, qualification_type)
);

-- ============================================
-- 6. CREW ASSIGNMENTS TO CHIEF PILOTS
-- ============================================

CREATE TABLE IF NOT EXISTS crew_assignments (
  id SERIAL PRIMARY KEY,
  pilot_id INTEGER NOT NULL,
  chief_pilot_id INTEGER REFERENCES chief_pilots(id) ON DELETE CASCADE,
  aircraft_type_id INTEGER REFERENCES aircraft_types(id) ON DELETE CASCADE,
  assignment_date DATE DEFAULT CURRENT_DATE,
  status VARCHAR(20) DEFAULT 'active', -- active, inactive, transferred
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 7. MONTHLY ROSTERS
-- ============================================

CREATE TABLE IF NOT EXISTS monthly_rosters (
  id SERIAL PRIMARY KEY,
  chief_pilot_id INTEGER REFERENCES chief_pilots(id) ON DELETE CASCADE,
  aircraft_type_id INTEGER REFERENCES aircraft_types(id) ON DELETE CASCADE,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  year INTEGER NOT NULL CHECK (year >= 2020),
  status VARCHAR(20) DEFAULT 'draft', -- draft, submitted, approved, published
  total_flights INTEGER DEFAULT 0,
  total_duty_hours DECIMAL(10,2) DEFAULT 0,
  created_by INTEGER REFERENCES users(id),
  approved_by INTEGER REFERENCES users(id),
  approved_at TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(chief_pilot_id, aircraft_type_id, month, year)
);

-- ============================================
-- 8. ROSTER ENTRIES (Daily Assignments)
-- ============================================

CREATE TABLE IF NOT EXISTS roster_entries (
  id SERIAL PRIMARY KEY,
  roster_id INTEGER REFERENCES monthly_rosters(id) ON DELETE CASCADE,
  pilot_id INTEGER NOT NULL,
  date DATE NOT NULL,
  flight_number VARCHAR(20),
  aircraft_registration VARCHAR(20),
  departure_airport VARCHAR(10),
  arrival_airport VARCHAR(10),
  scheduled_departure TIME,
  scheduled_arrival TIME,
  duty_start TIME,
  duty_end TIME,
  duty_hours DECIMAL(5,2),
  flight_hours DECIMAL(5,2),
  position VARCHAR(50), -- captain, first_officer, relief
  status VARCHAR(20) DEFAULT 'scheduled', -- scheduled, completed, cancelled, delayed
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 9. CREW AVAILABILITY & LEAVE
-- ============================================

CREATE TABLE IF NOT EXISTS crew_availability (
  id SERIAL PRIMARY KEY,
  pilot_id INTEGER NOT NULL,
  date DATE NOT NULL,
  availability_type VARCHAR(50) NOT NULL, -- available, vacation, sick_leave, training, off_duty
  start_time TIME,
  end_time TIME,
  reason TEXT,
  approved_by INTEGER REFERENCES users(id),
  status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(pilot_id, date, availability_type)
);

-- ============================================
-- 10. DUTY TIME TRACKING
-- ============================================

CREATE TABLE IF NOT EXISTS duty_time_records (
  id SERIAL PRIMARY KEY,
  pilot_id INTEGER NOT NULL,
  date DATE NOT NULL,
  duty_start TIMESTAMP NOT NULL,
  duty_end TIMESTAMP,
  total_duty_hours DECIMAL(5,2),
  total_flight_hours DECIMAL(5,2),
  rest_period_hours DECIMAL(5,2),
  compliant BOOLEAN DEFAULT true,
  violation_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 11. ROSTER APPROVAL WORKFLOW
-- ============================================

CREATE TABLE IF NOT EXISTS roster_approvals (
  id SERIAL PRIMARY KEY,
  roster_id INTEGER REFERENCES monthly_rosters(id) ON DELETE CASCADE,
  approver_id INTEGER REFERENCES users(id),
  approval_level INTEGER NOT NULL, -- 1: chief_pilot, 2: operations_manager, 3: director
  status VARCHAR(20) NOT NULL, -- pending, approved, rejected
  comments TEXT,
  approved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 12. INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_chief_pilots_user_id ON chief_pilots(user_id);
CREATE INDEX IF NOT EXISTS idx_chief_pilots_aircraft_type ON chief_pilots(aircraft_type_id);
CREATE INDEX IF NOT EXISTS idx_fleet_assignments_chief_pilot ON fleet_assignments(chief_pilot_id);
CREATE INDEX IF NOT EXISTS idx_crew_assignments_chief_pilot ON crew_assignments(chief_pilot_id);
CREATE INDEX IF NOT EXISTS idx_crew_assignments_pilot ON crew_assignments(pilot_id);
CREATE INDEX IF NOT EXISTS idx_monthly_rosters_chief_pilot ON monthly_rosters(chief_pilot_id);
CREATE INDEX IF NOT EXISTS idx_roster_entries_roster ON roster_entries(roster_id);
CREATE INDEX IF NOT EXISTS idx_roster_entries_pilot ON roster_entries(pilot_id);
CREATE INDEX IF NOT EXISTS idx_roster_entries_date ON roster_entries(date);
CREATE INDEX IF NOT EXISTS idx_crew_availability_pilot_date ON crew_availability(pilot_id, date);
CREATE INDEX IF NOT EXISTS idx_duty_time_records_pilot_date ON duty_time_records(pilot_id, date);

-- ============================================
-- 13. SEED DATA - AIRCRAFT TYPES
-- ============================================

INSERT INTO aircraft_types (code, name, manufacturer, category, min_crew, max_crew) VALUES
('A320', 'Airbus A320', 'Airbus', 'Narrow-body', 2, 3),
('A321', 'Airbus A321', 'Airbus', 'Narrow-body', 2, 3),
('A330', 'Airbus A330', 'Airbus', 'Wide-body', 2, 4),
('B737', 'Boeing 737', 'Boeing', 'Narrow-body', 2, 3),
('B777', 'Boeing 777', 'Boeing', 'Wide-body', 2, 4),
('B787', 'Boeing 787 Dreamliner', 'Boeing', 'Wide-body', 2, 4)
ON CONFLICT (code) DO NOTHING;

-- ============================================
-- 14. SAMPLE CHIEF PILOTS (For Testing)
-- ============================================

-- Note: These will be created through the application
-- Sample structure:
-- Chief Pilot for A320 family
-- Chief Pilot for A330 family
-- Chief Pilot for B737 family
-- Chief Pilot for B777/B787 family

