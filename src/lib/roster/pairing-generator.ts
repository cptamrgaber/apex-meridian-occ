/**
 * Pairing Generation Algorithm
 * Creates optimal flight sequences (pairings) from flight schedule
 */

export interface Flight {
  id: number;
  flight_number: string;
  departure_time: Date;
  arrival_time: Date;
  origin: string;
  destination: string;
  aircraft_type: string;
  flight_time: number; // minutes
}

export interface Pairing {
  id: number;
  pairing_code: string;
  flights: Flight[];
  start_time: Date;
  end_time: Date;
  total_flight_time: number; // minutes
  total_duty_time: number; // minutes
  layovers: Layover[];
  base: string;
  aircraft_type: string;
}

export interface Layover {
  location: string;
  start: Date;
  end: Date;
  duration: number; // minutes
}

export function generatePairings(flights: Flight[], baseAirport: string): Pairing[] {
  const pairings: Pairing[] = [];
  const usedFlights = new Set<number>();
  
  // Sort flights by departure time
  const sortedFlights = [...flights].sort((a, b) => 
    a.departure_time.getTime() - b.departure_time.getTime()
  );
  
  // Generate pairings starting from base
  for (const flight of sortedFlights) {
    if (usedFlights.has(flight.id)) continue;
    if (flight.origin !== baseAirport) continue;
    
    const pairing = buildPairing(flight, sortedFlights, usedFlights, baseAirport);
    if (pairing) {
      pairings.push(pairing);
    }
  }
  
  return pairings;
}

function buildPairing(
  startFlight: Flight,
  allFlights: Flight[],
  usedFlights: Set<number>,
  baseAirport: string
): Pairing | null {
  const pairingFlights: Flight[] = [startFlight];
  const layovers: Layover[] = [];
  usedFlights.add(startFlight.id);
  
  let currentLocation = startFlight.destination;
  let currentTime = startFlight.arrival_time;
  let totalFlightTime = startFlight.flight_time;
  
  // Try to build a round trip back to base
  while (currentLocation !== baseAirport && pairingFlights.length < 6) {
    const nextFlight = findNextFlight(currentLocation, currentTime, allFlights, usedFlights, startFlight.aircraft_type);
    
    if (!nextFlight) break;
    
    // Calculate layover
    const layoverDuration = (nextFlight.departure_time.getTime() - currentTime.getTime()) / 60000;
    if (layoverDuration > 0) {
      layovers.push({
        location: currentLocation,
        start: currentTime,
        end: nextFlight.departure_time,
        duration: layoverDuration,
      });
    }
    
    pairingFlights.push(nextFlight);
    usedFlights.add(nextFlight.id);
    currentLocation = nextFlight.destination;
    currentTime = nextFlight.arrival_time;
    totalFlightTime += nextFlight.flight_time;
  }
  
  // Only create pairing if it returns to base
  if (currentLocation !== baseAirport) {
    // Remove flights from used set
    pairingFlights.forEach(f => usedFlights.delete(f.id));
    return null;
  }
  
  const totalDutyTime = (currentTime.getTime() - startFlight.departure_time.getTime()) / 60000;
  
  return {
    id: Math.floor(Math.random() * 1000000),
    pairing_code: `${startFlight.flight_number}-${pairingFlights.length}`,
    flights: pairingFlights,
    start_time: startFlight.departure_time,
    end_time: currentTime,
    total_flight_time: totalFlightTime,
    total_duty_time: totalDutyTime,
    layovers,
    base: baseAirport,
    aircraft_type: startFlight.aircraft_type,
  };
}

function findNextFlight(
  from: string,
  after: Date,
  flights: Flight[],
  usedFlights: Set<number>,
  aircraftType: string
): Flight | null {
  for (const flight of flights) {
    if (usedFlights.has(flight.id)) continue;
    if (flight.origin !== from) continue;
    if (flight.aircraft_type !== aircraftType) continue;
    if (flight.departure_time <= after) continue;
    
    // Check minimum connection time (45 minutes)
    const connectionTime = (flight.departure_time.getTime() - after.getTime()) / 60000;
    if (connectionTime < 45) continue;
    
    return flight;
  }
  
  return null;
}
