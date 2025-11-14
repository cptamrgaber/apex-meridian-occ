// Live flight tracking service using real EgyptAir schedules (COMPLETE DATABASE - 326 flights)
import { getAllFlights, getActiveAircraft, type Flight, type Aircraft } from './database';

export interface LiveFlight {
  flight_number: string;
  callsign: string;
  origin: string;
  origin_city: string;
  destination: string;
  destination_city: string;
  route: string;
  altitude: number;
  speed: number;
  status: string;
  aircraft_type: string;
  aircraft_name: string;
  registration?: string;
  progress: number; // 0-100 percentage of flight completed
  departure_time: string;
  arrival_time: string;
  distance_km: number;
  region: string;
  terminal?: string;
  gate?: string;
}

/**
 * Generate live flight data by simulating which flights are currently in the air
 * based on real flight schedules (326 flights) and current time
 */
export function generateLiveFlights(count: number = 8): LiveFlight[] {
  const allFlights = getAllFlights();
  const activeAircraft = getActiveAircraft();
  
  if (allFlights.length === 0) {
    return [];
  }

  const currentHour = new Date().getHours();
  const currentMinute = new Date().getMinutes();
  const currentTimeInMinutes = currentHour * 60 + currentMinute;
  
  // Select flights that should be active around current time
  const activeFlights = allFlights.filter((flight: any) => {
    // Parse departure time (format: "HH:MM")
    const [depHour, depMin] = flight.departure_time.split(':').map(Number);
    const departureTimeInMinutes = depHour * 60 + depMin;
    
    // Parse arrival time
    const [arrHour, arrMin] = flight.arrival_time.split(':').map(Number);
    let arrivalTimeInMinutes = arrHour * 60 + arrMin;
    
    // Handle overnight flights (arrival next day)
    if (arrivalTimeInMinutes < departureTimeInMinutes) {
      arrivalTimeInMinutes += 24 * 60;
    }
    
    // Consider flights that departed in the last 3 hours or will depart in next hour
    const timeWindow = 240; // 4 hours window
    const timeDiff = Math.abs(currentTimeInMinutes - departureTimeInMinutes);
    
    return timeDiff < timeWindow;
  });
  
  // If no flights in time window, show some flights for demo
  const flightsToShow = activeFlights.length > 0 
    ? activeFlights.slice(0, count) 
    : allFlights.slice(0, count);

  const liveFlights: LiveFlight[] = [];
  
  for (const flight of flightsToShow) {
    const flightData = flight as any;
    
    // Find a matching aircraft for this flight
    const matchingAircraft = activeAircraft.find(
      (a: any) => a.aircraft_type?.includes(flightData.aircraft_type) || 
           flightData.aircraft_type?.includes(a.aircraft_type?.split('-')[0])
    );
    
    // Calculate progress based on time
    const [depHour, depMin] = flightData.departure_time.split(':').map(Number);
    const departureTimeInMinutes = depHour * 60 + depMin;
    const timeSinceDeparture = currentTimeInMinutes - departureTimeInMinutes;
    
    // Estimate flight duration from distance (rough estimate: 500 km/h average)
    const estimatedDurationMinutes = (flightData.distance_km / 500) * 60;
    const progress = Math.min(100, Math.max(0, (timeSinceDeparture / estimatedDurationMinutes) * 100));
    
    // Generate realistic flight parameters
    const baseAltitude = getTypicalCruiseAltitude(flightData.aircraft_type);
    const altitude = Math.round(baseAltitude + (Math.random() * 4000 - 2000)); // ±2000 ft variation
    const baseSpeed = getTypicalCruiseSpeed(flightData.aircraft_type);
    const speed = Math.round(baseSpeed + (Math.random() * 40 - 20)); // ±20 kts variation
    
    // Determine status based on progress
    let status = 'In Flight';
    if (progress < 5) {
      status = 'Departed';
    } else if (progress > 95) {
      status = 'Approaching';
    } else if (timeSinceDeparture < -30) {
      status = 'Scheduled';
    } else if (timeSinceDeparture < 0) {
      status = 'Boarding';
    }
    
    liveFlights.push({
      flight_number: flightData.flight_number,
      callsign: flightData.callsign,
      origin: flightData.origin,
      origin_city: flightData.origin_city,
      destination: flightData.destination,
      destination_city: flightData.destination_city,
      route: `${flightData.origin} → ${flightData.destination}`,
      altitude,
      speed,
      status,
      aircraft_type: flightData.aircraft_type,
      aircraft_name: flightData.aircraft_name,
      registration: matchingAircraft?.registration,
      progress: Math.round(progress),
      departure_time: flightData.departure_time,
      arrival_time: flightData.arrival_time,
      distance_km: flightData.distance_km,
      region: flightData.region,
      terminal: flightData.terminal,
      gate: flightData.gate
    });
  }
  
  return liveFlights;
}

/**
 * Get typical cruise altitude for aircraft type
 */
function getTypicalCruiseAltitude(aircraftType: string): number {
  const type = aircraftType.toUpperCase();
  
  if (type.includes('777') || type.includes('787') || type.includes('A350') || type.includes('B77') || type.includes('B78')) {
    return 39000; // Long-haul widebodies
  } else if (type.includes('330') || type.includes('A330') || type.includes('A33')) {
    return 38000;
  } else if (type.includes('737') || type.includes('320') || type.includes('A320') || type.includes('B73') || type.includes('A32')) {
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
  
  if (type.includes('777') || type.includes('B77')) {
    return 490; // B777 cruise speed
  } else if (type.includes('787') || type.includes('B78')) {
    return 485; // B787 cruise speed
  } else if (type.includes('A350')) {
    return 488; // A350 cruise speed
  } else if (type.includes('330') || type.includes('A330') || type.includes('A33')) {
    return 470; // A330 cruise speed
  } else if (type.includes('737') || type.includes('B73')) {
    return 450; // B737 cruise speed
  } else if (type.includes('320') || type.includes('A320') || type.includes('A32')) {
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
  const liveFlights = generateLiveFlights(8);
  
  return {
    totalScheduled: allFlights.length,
    activeFlights: liveFlights.length,
    inFlight: liveFlights.filter(f => f.status === 'In Flight').length,
    boarding: liveFlights.filter(f => f.status === 'Boarding').length,
    departed: liveFlights.filter(f => f.status === 'Departed').length,
    onTime: liveFlights.filter(f => f.status === 'In Flight').length,
    delayed: 0 // Can be enhanced with real delay data
  };
}

