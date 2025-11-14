import { getAllFlights, getActiveAircraft, type Flight, type Aircraft } from './database';

export interface LiveFlight {
  callsign: string;
  origin: string;
  destination: string;
  altitude: number;
  speed: number;
  status: string;
  aircraft_type: string;
  registration?: string;
  progress: number; // 0-100 percentage of flight completed
}

/**
 * Generate live flight data by simulating which flights are currently in the air
 * based on real flight schedules and current time
 */
export function generateLiveFlights(count: number = 5): LiveFlight[] {
  const allFlights = getAllFlights();
  const activeAircraft = getActiveAircraft();
  
  if (allFlights.length === 0) {
    return [];
  }

  const liveFlights: LiveFlight[] = [];
  const currentHour = new Date().getHours();
  
  // Select flights that would be flying at this time
  // We'll simulate by picking flights based on time of day
  const selectedFlights = allFlights
    .filter(f => f.frequency === 'Daily') // Only daily flights for now
    .slice(0, Math.min(count * 2, allFlights.length)); // Get more than needed to randomize
  
  // Shuffle and take the required count
  const shuffled = selectedFlights.sort(() => Math.random() - 0.5);
  
  for (let i = 0; i < Math.min(count, shuffled.length); i++) {
    const flight = shuffled[i];
    
    // Find a matching aircraft for this flight
    const matchingAircraft = activeAircraft.find(
      a => a.aircraft_type.includes(flight.aircraft_type.split(' ')[0]) || 
           flight.aircraft_type.includes(a.aircraft_type.split('-')[0])
    );
    
    // Generate realistic flight parameters
    const progress = 30 + Math.random() * 50; // 30-80% through flight
    const baseAltitude = getTypicalCruiseAltitude(flight.aircraft_type);
    const altitude = baseAltitude + (Math.random() * 4000 - 2000); // ±2000 ft variation
    const baseSpeed = getTypicalCruiseSpeed(flight.aircraft_type);
    const speed = Math.round(baseSpeed + (Math.random() * 40 - 20)); // ±20 kts variation
    
    liveFlights.push({
      callsign: flight.flight_number,
      origin: flight.origin,
      destination: flight.destination,
      altitude: Math.round(altitude),
      speed,
      status: 'In Flight',
      aircraft_type: flight.aircraft_type,
      registration: matchingAircraft?.registration,
      progress: Math.round(progress)
    });
  }
  
  return liveFlights;
}

/**
 * Get typical cruise altitude for aircraft type
 */
function getTypicalCruiseAltitude(aircraftType: string): number {
  const type = aircraftType.toUpperCase();
  
  if (type.includes('777') || type.includes('787') || type.includes('A350')) {
    return 39000; // Long-haul widebodies
  } else if (type.includes('330') || type.includes('A330')) {
    return 38000;
  } else if (type.includes('737') || type.includes('320') || type.includes('A320')) {
    return 36000; // Narrowbodies
  } else {
    return 37000; // Default
  }
}

/**
 * Get typical cruise speed for aircraft type
 */
function getTypicalCruiseSpeed(aircraftType: string): number {
  const type = aircraftType.toUpperCase();
  
  if (type.includes('777')) {
    return 490; // B777 cruise speed
  } else if (type.includes('787')) {
    return 485; // B787 cruise speed
  } else if (type.includes('A350')) {
    return 488; // A350 cruise speed
  } else if (type.includes('330') || type.includes('A330')) {
    return 470; // A330 cruise speed
  } else if (type.includes('737')) {
    return 450; // B737 cruise speed
  } else if (type.includes('320') || type.includes('A320')) {
    return 447; // A320 cruise speed
  } else {
    return 460; // Default
  }
}

/**
 * Get flight statistics for dashboard
 */
export function getFlightStatistics() {
  const allFlights = getAllFlights();
  const liveFlights = generateLiveFlights(5);
  
  return {
    totalScheduled: allFlights.length,
    activeFlights: liveFlights.length,
    onTime: liveFlights.filter(f => f.status === 'In Flight').length,
    delayed: 0 // Can be enhanced with real delay data
  };
}

