// Real EgyptAir data from JSON files - COMPLETE DATABASE
import flightsData from '@/data/egyptair_flights_verified.json'; // 326 flights with full details
import aircraftData from '@/data/egyptair_aircraft.json'; // Complete aircraft fleet
import airportsData from '@/data/egyptair_airports_complete.json'; // 95 airports

// Types for complete database
export interface Flight {
  id: number;
  flight_number: string;
  callsign: string;
  aircraft_type: string;
  aircraft_name: string;
  origin: string;
  origin_city: string;
  origin_country: string;
  destination: string;
  destination_city: string;
  destination_country: string;
  departure_time: string;
  arrival_time: string;
  distance_km: number;
  region: string;
  status: string;
  terminal?: string;
  gate?: string;
}

export interface Aircraft {
  registration: string;
  aircraft_type: string;
  msn?: string;
  manufacturer?: string;
  status?: string;
  delivery_date?: string;
  [key: string]: any; // Allow additional fields
}

export interface Airport {
  iata_code: string;
  icao_code: string;
  airport_name: string;
  city: string;
  country: string;
  region: string;
  classification: string;
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

export function getFlightsByRegion(region: string): Flight[] {
  return flightsData.filter(f => f.region === region) as Flight[];
}

export function getDomesticFlights(): Flight[] {
  return flightsData.filter(f => f.region === 'domestic') as Flight[];
}

export function getInternationalFlights(): Flight[] {
  return flightsData.filter(f => f.region === 'international') as Flight[];
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
        manufacturer: a.manufacturer || 'Unknown'
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
  return airportsData.find(a => a.iata_code === iata) as Airport | undefined;
}

export function getAirportsByRegion(region: string): Airport[] {
  return airportsData.filter(a => a.region === region) as Airport[];
}

export function getAirportsByClassification(classification: string): Airport[] {
  return airportsData.filter(a => a.classification === classification) as Airport[];
}

export function getHubAirports(): Airport[] {
  return airportsData.filter(a => a.classification === 'Hub') as Airport[];
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
  
  // Group by region
  const regionSummary: Record<string, number> = {};
  flights.forEach(f => {
    regionSummary[f.region] = (regionSummary[f.region] || 0) + 1;
  });
  
  return {
    totalFlights: flights.length,
    domesticFlights: flights.filter(f => f.region === 'domestic').length,
    internationalFlights: flights.filter(f => f.region === 'international').length,
    routeSummary: Object.entries(routeSummary).map(([route, count]) => ({
      route,
      count
    })),
    regionSummary: Object.entries(regionSummary).map(([region, count]) => ({
      region,
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

export function getAirportStats() {
  const airports = airportsData as Airport[];
  
  // Group by region
  const regionSummary: Record<string, number> = {};
  airports.forEach(a => {
    regionSummary[a.region] = (regionSummary[a.region] || 0) + 1;
  });
  
  // Group by classification
  const classificationSummary: Record<string, number> = {};
  airports.forEach(a => {
    classificationSummary[a.classification] = (classificationSummary[a.classification] || 0) + 1;
  });
  
  return {
    totalAirports: airports.length,
    hubs: airports.filter(a => a.classification === 'Hub').length,
    regionSummary: Object.entries(regionSummary).map(([region, count]) => ({
      region,
      count
    })),
    classificationSummary: Object.entries(classificationSummary).map(([classification, count]) => ({
      classification,
      count
    }))
  };
}

