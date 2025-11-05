// Fleet Management System Types

export type UserRole = 'admin' | 'chief_pilot' | 'pilot' | 'dispatcher' | 'crew';

export type AircraftCategory = 'Narrow-body' | 'Wide-body';

export type QualificationType = 'captain' | 'first_officer' | 'relief_pilot';

export type RosterStatus = 'draft' | 'submitted' | 'approved' | 'published';

export type AssignmentStatus = 'active' | 'inactive' | 'transferred';

export type AvailabilityType = 'available' | 'vacation' | 'sick_leave' | 'training' | 'off_duty';

export type FlightPosition = 'captain' | 'first_officer' | 'relief';

export type FlightStatus = 'scheduled' | 'completed' | 'cancelled' | 'delayed';

export interface AircraftType {
  id: number;
  code: string; // A320, A321, A330, B737, B777, B787
  name: string;
  manufacturer: string;
  category: AircraftCategory;
  min_crew: number;
  max_crew: number;
  created_at: string;
}

export interface ChiefPilot {
  id: number;
  user_id: number;
  aircraft_type_id: number;
  aircraft_type?: AircraftType;
  name: string;
  license_number: string;
  total_flight_hours: number;
  phone?: string;
  email?: string;
  assigned_date: string;
  status: 'active' | 'inactive' | 'on_leave';
  created_at: string;
  updated_at: string;
}

export interface FleetAssignment {
  id: number;
  aircraft_id: number;
  chief_pilot_id: number;
  chief_pilot?: ChiefPilot;
  assigned_date: string;
  status: 'assigned' | 'unassigned' | 'maintenance';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CrewQualification {
  id: number;
  pilot_id: number;
  aircraft_type_id: number;
  aircraft_type?: AircraftType;
  qualification_type: QualificationType;
  qualification_date: string;
  expiry_date?: string;
  total_hours_on_type: number;
  status: 'active' | 'expired' | 'suspended';
  created_at: string;
  updated_at: string;
}

export interface CrewAssignment {
  id: number;
  pilot_id: number;
  pilot_name?: string;
  chief_pilot_id: number;
  aircraft_type_id: number;
  aircraft_type?: AircraftType;
  assignment_date: string;
  status: AssignmentStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface MonthlyRoster {
  id: number;
  chief_pilot_id: number;
  chief_pilot?: ChiefPilot;
  aircraft_type_id: number;
  aircraft_type?: AircraftType;
  month: number; // 1-12
  year: number;
  status: RosterStatus;
  total_flights: number;
  total_duty_hours: number;
  created_by: number;
  approved_by?: number;
  approved_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface RosterEntry {
  id: number;
  roster_id: number;
  pilot_id: number;
  pilot_name?: string;
  date: string;
  flight_number?: string;
  aircraft_registration?: string;
  departure_airport?: string;
  arrival_airport?: string;
  scheduled_departure?: string;
  scheduled_arrival?: string;
  duty_start?: string;
  duty_end?: string;
  duty_hours?: number;
  flight_hours?: number;
  position: FlightPosition;
  status: FlightStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CrewAvailability {
  id: number;
  pilot_id: number;
  date: string;
  availability_type: AvailabilityType;
  start_time?: string;
  end_time?: string;
  reason?: string;
  approved_by?: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface DutyTimeRecord {
  id: number;
  pilot_id: number;
  date: string;
  duty_start: string;
  duty_end?: string;
  total_duty_hours?: number;
  total_flight_hours?: number;
  rest_period_hours?: number;
  compliant: boolean;
  violation_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface RosterApproval {
  id: number;
  roster_id: number;
  approver_id: number;
  approver_name?: string;
  approval_level: number; // 1: chief_pilot, 2: operations_manager, 3: director
  status: 'pending' | 'approved' | 'rejected';
  comments?: string;
  approved_at?: string;
  created_at: string;
}

// API Request/Response Types

export interface CreateChiefPilotRequest {
  user_id: number;
  aircraft_type_id: number;
  name: string;
  license_number: string;
  total_flight_hours?: number;
  phone?: string;
  email?: string;
}

export interface CreateRosterRequest {
  chief_pilot_id: number;
  aircraft_type_id: number;
  month: number;
  year: number;
  notes?: string;
}

export interface AddRosterEntryRequest {
  roster_id: number;
  pilot_id: number;
  date: string;
  flight_number?: string;
  aircraft_registration?: string;
  departure_airport?: string;
  arrival_airport?: string;
  scheduled_departure?: string;
  scheduled_arrival?: string;
  duty_start?: string;
  duty_end?: string;
  position: FlightPosition;
}

export interface AssignCrewRequest {
  pilot_id: number;
  chief_pilot_id: number;
  aircraft_type_id: number;
  notes?: string;
}

export interface RosterGenerationOptions {
  roster_id: number;
  start_date: string;
  end_date: string;
  optimize_duty_time: boolean;
  respect_preferences: boolean;
  min_rest_hours: number;
  max_duty_hours_per_day: number;
  max_flight_hours_per_month: number;
}

export interface RosterStatistics {
  total_pilots: number;
  total_flights: number;
  total_duty_hours: number;
  average_duty_hours_per_pilot: number;
  compliance_rate: number;
  pilots_over_limit: number;
  flights_without_crew: number;
}

export interface PilotDutySummary {
  pilot_id: number;
  pilot_name: string;
  total_flights: number;
  total_duty_hours: number;
  total_flight_hours: number;
  days_worked: number;
  days_off: number;
  compliance_status: 'compliant' | 'warning' | 'violation';
  violations: string[];
}

