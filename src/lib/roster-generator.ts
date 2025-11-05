// Intelligent Roster Generation Algorithm
// Fair distribution of flights ensuring equal hours, layovers, night flights, and domestic/international flights

import type { RosterEntry, CrewAssignment } from '@/types/fleet-management';

// Flight data structure
export interface Flight {
  id: string;
  flight_number: string;
  aircraft_registration: string;
  departure_airport: string;
  arrival_airport: string;
  scheduled_departure: string; // HH:MM format
  scheduled_arrival: string;
  date: string; // YYYY-MM-DD
  flight_hours: number;
  duty_hours: number;
  is_night_flight: boolean; // Departure or arrival between 22:00-06:00
  is_international: boolean; // Not domestic (CAI-based)
  requires_layover: boolean; // Overnight stay required
  aircraft_type: string; // A320, A330, etc.
}

// Pilot statistics for fair distribution
export interface PilotStats {
  pilot_id: number;
  pilot_name: string;
  total_flight_hours: number;
  total_duty_hours: number;
  total_flights: number;
  night_flights: number;
  international_flights: number;
  domestic_flights: number;
  layovers: number;
  days_worked: number;
  last_flight_date?: string;
  last_duty_end?: string;
}

// Roster generation options
export interface RosterGenerationOptions {
  month: number; // 1-12
  year: number;
  aircraft_type: string;
  min_flight_hours: number; // Default: 60
  min_duty_hours: number; // Default: 120
  max_duty_hours_per_day: number; // Default: 13 (OM-A limit)
  max_flight_hours_per_month: number; // Default: 100
  min_rest_hours: number; // Default: 12 (OM-A requirement)
  max_consecutive_duty_days: number; // Default: 6
}

// Default options
export const DEFAULT_ROSTER_OPTIONS: RosterGenerationOptions = {
  month: new Date().getMonth() + 1,
  year: new Date().getFullYear(),
  aircraft_type: 'A320',
  min_flight_hours: 60,
  min_duty_hours: 120,
  max_duty_hours_per_day: 13,
  max_flight_hours_per_month: 100,
  min_rest_hours: 12,
  max_consecutive_duty_days: 6,
};

/**
 * Initialize pilot statistics
 */
export function initializePilotStats(crew: CrewAssignment[]): Map<number, PilotStats> {
  const stats = new Map<number, PilotStats>();
  
  crew.forEach(member => {
    stats.set(member.pilot_id, {
      pilot_id: member.pilot_id,
      pilot_name: member.pilot_name || `Pilot ${member.pilot_id}`,
      total_flight_hours: 0,
      total_duty_hours: 0,
      total_flights: 0,
      night_flights: 0,
      international_flights: 0,
      domestic_flights: 0,
      layovers: 0,
      days_worked: 0,
    });
  });
  
  return stats;
}

/**
 * Calculate fairness score for assigning a flight to a pilot
 * Lower score = more fair (pilot needs this type of flight more)
 */
export function calculateFairnessScore(
  pilot: PilotStats,
  flight: Flight,
  allPilots: PilotStats[],
  options: RosterGenerationOptions
): number {
  let score = 0;
  
  // Calculate average stats across all pilots
  const avgFlightHours = allPilots.reduce((sum, p) => sum + p.total_flight_hours, 0) / allPilots.length;
  const avgDutyHours = allPilots.reduce((sum, p) => sum + p.total_duty_hours, 0) / allPilots.length;
  const avgNightFlights = allPilots.reduce((sum, p) => sum + p.night_flights, 0) / allPilots.length;
  const avgLayovers = allPilots.reduce((sum, p) => sum + p.layovers, 0) / allPilots.length;
  const avgInternational = allPilots.reduce((sum, p) => sum + p.international_flights, 0) / allPilots.length;
  
  // 1. Flight hours deviation (weight: 40%)
  const flightHoursDiff = pilot.total_flight_hours - avgFlightHours;
  score += flightHoursDiff * 0.4;
  
  // 2. Duty hours deviation (weight: 30%)
  const dutyHoursDiff = pilot.total_duty_hours - avgDutyHours;
  score += dutyHoursDiff * 0.3;
  
  // 3. Night flights deviation (weight: 10%)
  if (flight.is_night_flight) {
    const nightFlightsDiff = pilot.night_flights - avgNightFlights;
    score += nightFlightsDiff * 0.1;
  }
  
  // 4. Layovers deviation (weight: 10%)
  if (flight.requires_layover) {
    const layoversDiff = pilot.layovers - avgLayovers;
    score += layoversDiff * 0.1;
  }
  
  // 5. International/domestic balance (weight: 10%)
  if (flight.is_international) {
    const internationalDiff = pilot.international_flights - avgInternational;
    score += internationalDiff * 0.1;
  }
  
  // 6. Penalty for pilots below minimum requirements
  if (pilot.total_flight_hours < options.min_flight_hours) {
    score -= 50; // Strong preference to assign to pilots below minimum
  }
  if (pilot.total_duty_hours < options.min_duty_hours) {
    score -= 30;
  }
  
  // 7. Penalty for pilots approaching maximum limits
  if (pilot.total_flight_hours > options.max_flight_hours_per_month - 10) {
    score += 100; // Avoid assigning to pilots near maximum
  }
  
  return score;
}

/**
 * Check if pilot can be assigned to flight (compliance checks)
 */
export function canAssignPilot(
  pilot: PilotStats,
  flight: Flight,
  options: RosterGenerationOptions
): { canAssign: boolean; reason?: string } {
  // 1. Check maximum flight hours
  if (pilot.total_flight_hours + flight.flight_hours > options.max_flight_hours_per_month) {
    return {
      canAssign: false,
      reason: `Would exceed maximum flight hours (${options.max_flight_hours_per_month}h)`,
    };
  }
  
  // 2. Check maximum duty hours per day (simplified - would need daily tracking)
  if (flight.duty_hours > options.max_duty_hours_per_day) {
    return {
      canAssign: false,
      reason: `Flight duty hours exceed daily limit (${options.max_duty_hours_per_day}h)`,
    };
  }
  
  // 3. Check rest period (if pilot has last flight)
  if (pilot.last_flight_date && pilot.last_duty_end) {
    const lastDutyEnd = new Date(`${pilot.last_flight_date}T${pilot.last_duty_end}`);
    const nextDutyStart = new Date(`${flight.date}T${flight.scheduled_departure}`);
    const restHours = (nextDutyStart.getTime() - lastDutyEnd.getTime()) / (1000 * 60 * 60);
    
    if (restHours < options.min_rest_hours) {
      return {
        canAssign: false,
        reason: `Insufficient rest period (${restHours.toFixed(1)}h < ${options.min_rest_hours}h)`,
      };
    }
  }
  
  return { canAssign: true };
}

/**
 * Assign flight to best available pilot using fairness algorithm
 */
export function assignFlightToPilot(
  flight: Flight,
  availablePilots: PilotStats[],
  pilotStats: Map<number, PilotStats>,
  options: RosterGenerationOptions
): { pilot: PilotStats | null; reason?: string } {
  // Filter pilots who can be assigned
  const eligiblePilots = availablePilots.filter(pilot => {
    const check = canAssignPilot(pilot, flight, options);
    return check.canAssign;
  });
  
  if (eligiblePilots.length === 0) {
    return {
      pilot: null,
      reason: 'No eligible pilots available (all violate compliance rules)',
    };
  }
  
  // Calculate fairness scores for all eligible pilots
  const allPilots = Array.from(pilotStats.values());
  const scores = eligiblePilots.map(pilot => ({
    pilot,
    score: calculateFairnessScore(pilot, flight, allPilots, options),
  }));
  
  // Sort by score (lowest = most fair)
  scores.sort((a, b) => a.score - b.score);
  
  // Select pilot with lowest score
  const selectedPilot = scores[0].pilot;
  
  // Update pilot statistics
  selectedPilot.total_flight_hours += flight.flight_hours;
  selectedPilot.total_duty_hours += flight.duty_hours;
  selectedPilot.total_flights += 1;
  
  if (flight.is_night_flight) {
    selectedPilot.night_flights += 1;
  }
  
  if (flight.is_international) {
    selectedPilot.international_flights += 1;
  } else {
    selectedPilot.domestic_flights += 1;
  }
  
  if (flight.requires_layover) {
    selectedPilot.layovers += 1;
  }
  
  selectedPilot.last_flight_date = flight.date;
  selectedPilot.last_duty_end = flight.scheduled_arrival;
  
  return { pilot: selectedPilot };
}

/**
 * Generate roster entries for a month
 */
export function generateRoster(
  flights: Flight[],
  crew: CrewAssignment[],
  options: RosterGenerationOptions
): {
  entries: RosterEntry[];
  stats: Map<number, PilotStats>;
  unassignedFlights: Flight[];
  warnings: string[];
} {
  const pilotStats = initializePilotStats(crew);
  const entries: RosterEntry[] = [];
  const unassignedFlights: Flight[] = [];
  const warnings: string[] = [];
  
  // Sort flights by date and departure time
  const sortedFlights = [...flights].sort((a, b) => {
    const dateCompare = a.date.localeCompare(b.date);
    if (dateCompare !== 0) return dateCompare;
    return a.scheduled_departure.localeCompare(b.scheduled_departure);
  });
  
  // Assign each flight to a pilot
  for (const flight of sortedFlights) {
    const availablePilots = Array.from(pilotStats.values());
    const assignment = assignFlightToPilot(flight, availablePilots, pilotStats, options);
    
    if (assignment.pilot) {
      // Create roster entry
      const entry: RosterEntry = {
        id: Math.floor(Math.random() * 1000000), // Generate temp ID
        roster_id: 0, // Will be set when saving
        pilot_id: assignment.pilot.pilot_id,
        pilot_name: assignment.pilot.pilot_name,
        date: flight.date,
        flight_number: flight.flight_number,
        aircraft_registration: flight.aircraft_registration,
        departure_airport: flight.departure_airport,
        arrival_airport: flight.arrival_airport,
        scheduled_departure: flight.scheduled_departure,
        scheduled_arrival: flight.scheduled_arrival,
        duty_start: flight.scheduled_departure, // Simplified
        duty_end: flight.scheduled_arrival,
        duty_hours: flight.duty_hours,
        flight_hours: flight.flight_hours,
        position: 'captain', // Would need to determine based on qualifications
        status: 'scheduled',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      entries.push(entry);
    } else {
      unassignedFlights.push(flight);
      warnings.push(`Flight ${flight.flight_number} on ${flight.date} could not be assigned: ${assignment.reason}`);
    }
  }
  
  // Check if all pilots meet minimum requirements
  pilotStats.forEach((stats, pilotId) => {
    if (stats.total_flight_hours < options.min_flight_hours) {
      warnings.push(
        `${stats.pilot_name} has only ${stats.total_flight_hours.toFixed(1)}h flight time (minimum: ${options.min_flight_hours}h)`
      );
    }
    if (stats.total_duty_hours < options.min_duty_hours) {
      warnings.push(
        `${stats.pilot_name} has only ${stats.total_duty_hours.toFixed(1)}h duty time (minimum: ${options.min_duty_hours}h)`
      );
    }
  });
  
  return {
    entries,
    stats: pilotStats,
    unassignedFlights,
    warnings,
  };
}

/**
 * Calculate roster statistics
 */
export function calculateRosterStatistics(stats: Map<number, PilotStats>): {
  totalPilots: number;
  avgFlightHours: number;
  avgDutyHours: number;
  avgNightFlights: number;
  avgLayovers: number;
  avgInternationalFlights: number;
  stdDevFlightHours: number;
  fairnessScore: number;
} {
  const pilots = Array.from(stats.values());
  const n = pilots.length;
  
  if (n === 0) {
    return {
      totalPilots: 0,
      avgFlightHours: 0,
      avgDutyHours: 0,
      avgNightFlights: 0,
      avgLayovers: 0,
      avgInternationalFlights: 0,
      stdDevFlightHours: 0,
      fairnessScore: 0,
    };
  }
  
  // Calculate averages
  const avgFlightHours = pilots.reduce((sum, p) => sum + p.total_flight_hours, 0) / n;
  const avgDutyHours = pilots.reduce((sum, p) => sum + p.total_duty_hours, 0) / n;
  const avgNightFlights = pilots.reduce((sum, p) => sum + p.night_flights, 0) / n;
  const avgLayovers = pilots.reduce((sum, p) => sum + p.layovers, 0) / n;
  const avgInternationalFlights = pilots.reduce((sum, p) => sum + p.international_flights, 0) / n;
  
  // Calculate standard deviation of flight hours (measure of fairness)
  const variance = pilots.reduce((sum, p) => {
    const diff = p.total_flight_hours - avgFlightHours;
    return sum + diff * diff;
  }, 0) / n;
  const stdDevFlightHours = Math.sqrt(variance);
  
  // Fairness score: lower is better (0 = perfectly fair)
  // Combines standard deviations of all metrics
  const fairnessScore = stdDevFlightHours / avgFlightHours * 100; // Coefficient of variation
  
  return {
    totalPilots: n,
    avgFlightHours,
    avgDutyHours,
    avgNightFlights,
    avgLayovers,
    avgInternationalFlights,
    stdDevFlightHours,
    fairnessScore,
  };
}

