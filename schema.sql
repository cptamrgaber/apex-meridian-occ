-- Apex Meridian OCC Database Schema

-- Users table with role-based access control
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'dispatcher', 'crew', 'viewer')),
    tenant VARCHAR(50) NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Flights table for real-time flight tracking
CREATE TABLE IF NOT EXISTS flights (
    id SERIAL PRIMARY KEY,
    flight_number VARCHAR(10) NOT NULL,
    aircraft_registration VARCHAR(10),
    aircraft_type VARCHAR(20),
    origin VARCHAR(4) NOT NULL,
    destination VARCHAR(4) NOT NULL,
    scheduled_departure TIMESTAMP NOT NULL,
    actual_departure TIMESTAMP,
    scheduled_arrival TIMESTAMP NOT NULL,
    actual_arrival TIMESTAMP,
    status VARCHAR(20) NOT NULL CHECK (status IN ('scheduled', 'boarding', 'departed', 'in_flight', 'landed', 'cancelled', 'delayed')),
    delay_minutes INTEGER DEFAULT 0,
    gate VARCHAR(10),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    altitude INTEGER,
    speed INTEGER,
    heading INTEGER,
    tenant VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crew members table
CREATE TABLE IF NOT EXISTS crew (
    id SERIAL PRIMARY KEY,
    employee_id VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    position VARCHAR(30) NOT NULL CHECK (position IN ('captain', 'first_officer', 'flight_attendant', 'purser')),
    license_number VARCHAR(50),
    license_expiry DATE,
    base_airport VARCHAR(4),
    status VARCHAR(20) NOT NULL CHECK (status IN ('available', 'on_duty', 'off_duty', 'sick', 'vacation')),
    phone VARCHAR(20),
    email VARCHAR(100),
    tenant VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Flight assignments (crew to flights)
CREATE TABLE IF NOT EXISTS flight_assignments (
    id SERIAL PRIMARY KEY,
    flight_id INTEGER REFERENCES flights(id) ON DELETE CASCADE,
    crew_id INTEGER REFERENCES crew(id) ON DELETE CASCADE,
    position VARCHAR(30) NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(flight_id, crew_id, position)
);

-- Alerts and notifications
CREATE TABLE IF NOT EXISTS alerts (
    id SERIAL PRIMARY KEY,
    type VARCHAR(30) NOT NULL CHECK (type IN ('delay', 'cancellation', 'weather', 'maintenance', 'crew', 'regulatory', 'system')),
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('info', 'warning', 'critical')),
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    flight_id INTEGER REFERENCES flights(id) ON DELETE SET NULL,
    acknowledged BOOLEAN DEFAULT false,
    acknowledged_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    acknowledged_at TIMESTAMP,
    tenant VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

-- Notifications for users
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    alert_id INTEGER REFERENCES alerts(id) ON DELETE CASCADE,
    read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Roster schedules
CREATE TABLE IF NOT EXISTS rosters (
    id SERIAL PRIMARY KEY,
    crew_id INTEGER REFERENCES crew(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    duty_type VARCHAR(30) NOT NULL CHECK (duty_type IN ('flight', 'standby', 'training', 'rest', 'vacation', 'sick')),
    notes TEXT,
    tenant VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Weather data
CREATE TABLE IF NOT EXISTS weather (
    id SERIAL PRIMARY KEY,
    airport_code VARCHAR(4) NOT NULL,
    metar TEXT,
    taf TEXT,
    temperature DECIMAL(5, 2),
    wind_speed INTEGER,
    wind_direction INTEGER,
    visibility INTEGER,
    conditions VARCHAR(50),
    fetched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tenant VARCHAR(50) NOT NULL
);

-- Audit log
CREATE TABLE IF NOT EXISTS audit_log (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50),
    entity_id INTEGER,
    details JSONB,
    ip_address VARCHAR(45),
    tenant VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_flights_tenant ON flights(tenant);
CREATE INDEX IF NOT EXISTS idx_flights_status ON flights(status);
CREATE INDEX IF NOT EXISTS idx_flights_departure ON flights(scheduled_departure);
CREATE INDEX IF NOT EXISTS idx_crew_tenant ON crew(tenant);
CREATE INDEX IF NOT EXISTS idx_crew_status ON crew(status);
CREATE INDEX IF NOT EXISTS idx_alerts_tenant ON alerts(tenant);
CREATE INDEX IF NOT EXISTS idx_alerts_acknowledged ON alerts(acknowledged);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);

-- Insert demo admin user (password: password123)
INSERT INTO users (username, email, password_hash, full_name, role, tenant) 
VALUES (
    'demo_admin',
    'admin@apexmeridian.com',
    '$2a$10$rOzJqKCjGKqKqKqKqKqKqOqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKq',
    'Demo Administrator',
    'admin',
    'DEMO'
) ON CONFLICT (username) DO NOTHING;

-- Insert demo flights
INSERT INTO flights (flight_number, aircraft_registration, aircraft_type, origin, destination, scheduled_departure, scheduled_arrival, status, tenant) 
VALUES 
    ('AM101', 'N12345', 'B737-800', 'JFK', 'LAX', NOW() + INTERVAL '2 hours', NOW() + INTERVAL '7 hours', 'scheduled', 'DEMO'),
    ('AM202', 'N67890', 'A320', 'LAX', 'SFO', NOW() + INTERVAL '1 hour', NOW() + INTERVAL '2 hours', 'boarding', 'DEMO'),
    ('AM303', 'N24680', 'B787-9', 'ORD', 'MIA', NOW() + INTERVAL '3 hours', NOW() + INTERVAL '6 hours', 'scheduled', 'DEMO')
ON CONFLICT DO NOTHING;

-- Insert demo crew
INSERT INTO crew (employee_id, first_name, last_name, position, base_airport, status, tenant)
VALUES
    ('EMP001', 'John', 'Smith', 'captain', 'JFK', 'on_duty', 'DEMO'),
    ('EMP002', 'Sarah', 'Johnson', 'first_officer', 'JFK', 'on_duty', 'DEMO'),
    ('EMP003', 'Michael', 'Williams', 'flight_attendant', 'LAX', 'available', 'DEMO'),
    ('EMP004', 'Emily', 'Brown', 'purser', 'LAX', 'on_duty', 'DEMO')
ON CONFLICT (employee_id) DO NOTHING;

-- Insert demo alert
INSERT INTO alerts (type, severity, title, message, tenant)
VALUES
    ('weather', 'warning', 'Weather Advisory', 'Thunderstorms expected at JFK between 14:00-18:00 UTC', 'DEMO'),
    ('delay', 'info', 'Flight Delay', 'AM202 delayed by 15 minutes due to ground traffic', 'DEMO')
ON CONFLICT DO NOTHING;

