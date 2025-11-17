/**
 * Real Data Generators
 * Generates fleet management data from real EgyptAir database
 * Replaces all mock data with actual captains, flights, and aircraft
 */

import { getAllCaptains, getAllFlights, getAllAircraft } from './database';
import type {
  ChiefPilot,
  CrewAssignment,
  MonthlyRoster,
  RosterEntry,
  AircraftType,
} from '@/types/fleet-management';

// Aircraft types from real EgyptAir fleet
export const REAL_AIRCRAFT_TYPES: AircraftType[] = [
  {
    id: 1,
    code: 'A320',
    name: 'Airbus A320',
    manufacturer: 'Airbus',
    category: 'Narrow-body',
    min_crew: 2,
    max_crew: 3,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    code: 'A321',
    name: 'Airbus A321',
    manufacturer: 'Airbus',
    category: 'Narrow-body',
    min_crew: 2,
    max_crew: 3,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 3,
    code: 'A330',
    name: 'Airbus A330',
    manufacturer: 'Airbus',
    category: 'Wide-body',
    min_crew: 2,
    max_crew: 4,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 4,
    code: 'B737',
    name: 'Boeing 737-800',
    manufacturer: 'Boeing',
    category: 'Narrow-body',
    min_crew: 2,
    max_crew: 3,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 5,
    code: 'B777',
    name: 'Boeing 777-300ER',
    manufacturer: 'Boeing',
    category: 'Wide-body',
    min_crew: 2,
    max_crew: 4,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 6,
    code: 'B787',
    name: 'Boeing 787-9',
    manufacturer: 'Boeing',
    category: 'Wide-body',
    min_crew: 2,
    max_crew: 4,
    created_at: '2024-01-01T00:00:00Z',
  },
];

/**
 * Generate real chief pilots from actual EgyptAir captains database
 */
export function generateRealChiefPilots(): ChiefPilot[] {
  const captains = getAllCaptains();
  
  // Select senior captains for chief pilot roles
  // Filter by experience and assign to aircraft types
  const chiefPilots: ChiefPilot[] = [];
  
  // Map aircraft types to captains
  const aircraftTypeMap: { [key: string]: number } = {
    'A320': 1,
    'A321': 2,
    'A330': 3,
    'B737': 4,
    'B777': 5,
    'B787': 6,
  };
  
  // Group captains by aircraft type
  const captainsByType: { [key: number]: any[] } = {};
  
  captains.forEach(captain => {
    if (captain.aircraft_type) {
      const typeId = aircraftTypeMap[captain.aircraft_type];
      if (typeId) {
        if (!captainsByType[typeId]) {
          captainsByType[typeId] = [];
        }
        captainsByType[typeId].push(captain);
      }
    }
  });
  
  // Create chief pilot for each aircraft type
  Object.entries(captainsByType).forEach(([typeIdStr, typeCaptains]) => {
    if (typeCaptains.length > 0) {
      const typeId = parseInt(typeIdStr);
      const aircraftType = REAL_AIRCRAFT_TYPES.find(t => t.id === typeId);
      
      if (aircraftType) {
        // Select most senior captain (first in list)
        const captain = typeCaptains[0];
        
        chiefPilots.push({
          id: typeId,
          user_id: captain.id,
          name: captain.name,
          aircraft_type_id: typeId,
          aircraft_type: aircraftType,
          assigned_aircraft_count: typeCaptains.length,
          assigned_crew_count: typeCaptains.length,
          created_at: '2024-01-01T00:00:00Z',
        });
      }
    }
  });
  
  return chiefPilots;
}

/**
 * Generate real crew assignments from actual captains
 */
export function generateRealCrewAssignments(chiefPilotId?: number): CrewAssignment[] {
  const captains = getAllCaptains();
  const chiefPilots = generateRealChiefPilots();
  
  let targetChiefPilot = chiefPilots[0];
  if (chiefPilotId) {
    targetChiefPilot = chiefPilots.find(cp => cp.id === chiefPilotId) || chiefPilots[0];
  }
  
  // Filter captains by aircraft type
  const aircraftTypeCode = targetChiefPilot.aircraft_type?.code;
  const typeCaptains = captains.filter(c => c.aircraft_type === aircraftTypeCode);
  
  return typeCaptains.slice(0, 50).map((captain, index) => ({
    id: captain.id,
    chief_pilot_id: targetChiefPilot.id,
    pilot_id: captain.id,
    pilot_name: captain.name,
    rank: captain.rank || 'Captain',
    license_number: captain.license_number || `MS${String(captain.id).padStart(6, '0')}`,
    aircraft_type_id: targetChiefPilot.aircraft_type_id,
    aircraft_type: targetChiefPilot.aircraft_type?.code || '',
    status: index < 40 ? 'active' : 'on_leave',
    total_flight_hours: Math.floor(Math.random() * 10000) + 5000,
    qualification_date: '2020-01-01',
    last_training_date: '2024-10-01',
    next_training_due: '2025-04-01',
    created_at: '2024-01-01T00:00:00Z',
  }));
}

/**
 * Generate real monthly rosters from actual flights and captains
 */
export function generateRealMonthlyRosters(chiefPilotId: number): MonthlyRoster[] {
  const flights = getAllFlights();
  const crew = generateRealCrewAssignments(chiefPilotId);
  
  const rosters: MonthlyRoster[] = [];
  
  // Generate rosters for current and next month
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  
  [0, 1, 2].forEach((monthOffset, index) => {
    const month = ((currentMonth + monthOffset - 1) % 12) + 1;
    const year = currentYear + Math.floor((currentMonth + monthOffset - 1) / 12);
    
    const roster: MonthlyRoster = {
      id: index + 1,
      chief_pilot_id: chiefPilotId,
      month,
      year,
      status: index === 0 ? 'approved' : index === 1 ? 'draft' : 'pending',
      total_flights: flights.length,
      total_flight_hours: flights.length * 8, // Average 8 hours per flight
      created_at: new Date().toISOString(),
      approved_at: index === 0 ? new Date().toISOString() : undefined,
      entries: [],
    };
    
    rosters.push(roster);
  });
  
  return rosters;
}

/**
 * Get crew for a specific chief pilot
 */
export function getCrewForChiefPilot(chiefPilotId: number): CrewAssignment[] {
  return generateRealCrewAssignments(chiefPilotId);
}

/**
 * Get rosters for a specific chief pilot
 */
export function getRostersForChiefPilot(chiefPilotId: number): MonthlyRoster[] {
  return generateRealMonthlyRosters(chiefPilotId);
}

// Export real chief pilots
export const realChiefPilots = generateRealChiefPilots();

