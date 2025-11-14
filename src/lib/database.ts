// Real EgyptAir data from JSON files (exported from SQLite databases)
import flightsData from '@/data/flights.json';
import aircraftData from '@/data/aircraft.json';
import airportsData from '@/data/airports.json';

// Types
export interface Flight {
  flight_number: string;
  origin: string;
  destination: string;
  aircraft_type: string;
  frequency: string;
}

export interface Aircraft {
  registration: string;
  aircraft_type: string;
  msn: string;
  manufacturer: string;
  status: string;
  delivery_date: string;
}

export interface Airport {
  iata: string;
  icao: string;
  name: string;
  city: string;
  country: string;
  region: string;
  type: string;
}

// Flight queries
export function getAllFlights(): Flight[] {
  return flightsData as Flight[];
}

export function getFlightByNumber(flightNumber: string): Flight | undefined {
  return flightsData.find(f => f.flight_number === flightNumber) as Flight | undefined;
}

export function getFlightsByRoute(origin: string, destination: string): Flight[] {
  return flightsData.filter(f => f.origin === origin && f.destination === destination) as Flight[];
}

export function getFlightsByOrigin(origin: string): Flight[] {
  return flightsData.filter(f => f.origin === origin) as Flight[];
}

export function getFlightsByDestination(destination: string): Flight[] {
  return flightsData.filter(f => f.destination === destination) as Flight[];
}

export function getFlightsByAircraftType(aircraftType: string): Flight[] {
  return flightsData.filter(f => f.aircraft_type === aircraftType) as Flight[];
}

// Aircraft queries
export function getAllAircraft(): Aircraft[] {
  return aircraftData as Aircraft[];
}

export function getAircraftByRegistration(registration: string): Aircraft | undefined {
  return aircraftData.find(a => a.registration === registration) as Aircraft | undefined;
}

export function getAircraftByType(aircraftType: string): Aircraft[] {
  return aircraftData.filter(a => a.aircraft_type === aircraftType) as Aircraft[];
}

export function getActiveAircraft(): Aircraft[] {
  return aircraftData.filter(a => a.status === 'Active') as Aircraft[];
}

export function getFleetSummary() {
  const aircraft = aircraftData as Aircraft[];
  const summary: Record<string, { count: number; active: number; manufacturer: string }> = {};
  
  aircraft.forEach(a => {
    if (!summary[a.aircraft_type]) {
      summary[a.aircraft_type] = {
        count: 0,
        active: 0,
        manufacturer: a.manufacturer
      };
    }
    summary[a.aircraft_type].count++;
    if (a.status === 'Active') {
      summary[a.aircraft_type].active++;
    }
  });
  
  return Object.entries(summary).map(([type, data]) => ({
    aircraft_type: type,
    manufacturer: data.manufacturer,
    total: data.count,
    active: data.active
  }));
}

// Airport queries
export function getAllAirports(): Airport[] {
  return airportsData as Airport[];
}

export function getAirportByIATA(iata: string): Airport | undefined {
  return airportsData.find(a => a.iata === iata) as Airport | undefined;
}

export function getAirportsByRegion(region: string): Airport[] {
  return airportsData.filter(a => a.region === region) as Airport[];
}

export function getAirportsByType(type: string): Airport[] {
  return airportsData.filter(a => a.type === type) as Airport[];
}

// Statistics
export function getFlightStats() {
  const flights = flightsData as Flight[];
  
  // Group by route
  const routeSummary: Record<string, number> = {};
  flights.forEach(f => {
    const route = `${f.origin}-${f.destination}`;
    routeSummary[route] = (routeSummary[route] || 0) + 1;
  });
  
  return {
    totalFlights: flights.length,
    routeSummary: Object.entries(routeSummary).map(([route, count]) => ({
      route,
      count
    }))
  };
}

export function getAircraftStats() {
  const aircraft = aircraftData as Aircraft[];
  const activeAircraft = aircraft.filter(a => a.status === 'Active');
  
  return {
    totalAircraft: aircraft.length,
    activeAircraft: activeAircraft.length,
    fleetSummary: getFleetSummary()
  };
}

