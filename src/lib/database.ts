import Database from 'better-sqlite3';
import path from 'path';

// Database paths
const DB_DIR = path.join(process.cwd(), 'data');
const FLIGHTS_DB = path.join(DB_DIR, 'egyptair_flights_accurate.db');
const AIRCRAFT_DB = path.join(DB_DIR, 'egyptair_aircraft_accurate.db');
const AIRPORTS_DB = path.join(DB_DIR, 'egyptair_airports_accurate.db');

// Database connections (singleton pattern)
let flightsDb: Database.Database | null = null;
let aircraftDb: Database.Database | null = null;
let airportsDb: Database.Database | null = null;

// Initialize database connections
function getFlightsDb() {
  if (!flightsDb) {
    flightsDb = new Database(FLIGHTS_DB, { readonly: true });
  }
  return flightsDb;
}

function getAircraftDb() {
  if (!aircraftDb) {
    aircraftDb = new Database(AIRCRAFT_DB, { readonly: true });
  }
  return aircraftDb;
}

function getAirportsDb() {
  if (!airportsDb) {
    airportsDb = new Database(AIRPORTS_DB, { readonly: true });
  }
  return airportsDb;
}

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
  const db = getFlightsDb();
  const stmt = db.prepare('SELECT * FROM flights');
  return stmt.all() as Flight[];
}

export function getFlightByNumber(flightNumber: string): Flight | undefined {
  const db = getFlightsDb();
  const stmt = db.prepare('SELECT * FROM flights WHERE flight_number = ?');
  return stmt.get(flightNumber) as Flight | undefined;
}

export function getFlightsByRoute(origin: string, destination: string): Flight[] {
  const db = getFlightsDb();
  const stmt = db.prepare('SELECT * FROM flights WHERE origin = ? AND destination = ?');
  return stmt.all(origin, destination) as Flight[];
}

export function getFlightsByOrigin(origin: string): Flight[] {
  const db = getFlightsDb();
  const stmt = db.prepare('SELECT * FROM flights WHERE origin = ?');
  return stmt.all(origin) as Flight[];
}

export function getFlightsByDestination(destination: string): Flight[] {
  const db = getFlightsDb();
  const stmt = db.prepare('SELECT * FROM flights WHERE destination = ?');
  return stmt.all(destination) as Flight[];
}

export function getFlightsByAircraftType(aircraftType: string): Flight[] {
  const db = getFlightsDb();
  const stmt = db.prepare('SELECT * FROM flights WHERE aircraft_type = ?');
  return stmt.all(aircraftType) as Flight[];
}

// Aircraft queries
export function getAllAircraft(): Aircraft[] {
  const db = getAircraftDb();
  const stmt = db.prepare('SELECT * FROM aircraft');
  return stmt.all() as Aircraft[];
}

export function getAircraftByRegistration(registration: string): Aircraft | undefined {
  const db = getAircraftDb();
  const stmt = db.prepare('SELECT * FROM aircraft WHERE registration = ?');
  return stmt.get(registration) as Aircraft | undefined;
}

export function getAircraftByType(aircraftType: string): Aircraft[] {
  const db = getAircraftDb();
  const stmt = db.prepare('SELECT * FROM aircraft WHERE aircraft_type = ?');
  return stmt.all(aircraftType) as Aircraft[];
}

export function getActiveAircraft(): Aircraft[] {
  const db = getAircraftDb();
  const stmt = db.prepare('SELECT * FROM aircraft WHERE status = ?');
  return stmt.all('Active') as Aircraft[];
}

export function getFleetSummary() {
  const db = getAircraftDb();
  const stmt = db.prepare('SELECT * FROM fleet_summary');
  return stmt.all();
}

// Airport queries
export function getAllAirports(): Airport[] {
  const db = getAirportsDb();
  const stmt = db.prepare('SELECT * FROM airports');
  return stmt.all() as Airport[];
}

export function getAirportByIATA(iata: string): Airport | undefined {
  const db = getAirportsDb();
  const stmt = db.prepare('SELECT * FROM airports WHERE iata = ?');
  return stmt.get(iata) as Airport | undefined;
}

export function getAirportsByRegion(region: string): Airport[] {
  const db = getAirportsDb();
  const stmt = db.prepare('SELECT * FROM airports WHERE region = ?');
  return stmt.all(region) as Airport[];
}

export function getAirportsByType(type: string): Airport[] {
  const db = getAirportsDb();
  const stmt = db.prepare('SELECT * FROM airports WHERE type = ?');
  return stmt.all(type) as Airport[];
}

// Statistics
export function getFlightStats() {
  const db = getFlightsDb();
  
  const totalFlights = db.prepare('SELECT COUNT(*) as count FROM flights').get() as { count: number };
  const routeSummary = db.prepare('SELECT * FROM route_summary').all();
  
  return {
    totalFlights: totalFlights.count,
    routeSummary
  };
}

export function getAircraftStats() {
  const db = getAircraftDb();
  
  const totalAircraft = db.prepare('SELECT COUNT(*) as count FROM aircraft').get() as { count: number };
  const activeAircraft = db.prepare('SELECT COUNT(*) as count FROM aircraft WHERE status = ?').get('Active') as { count: number };
  const fleetSummary = db.prepare('SELECT * FROM fleet_summary').all();
  
  return {
    totalAircraft: totalAircraft.count,
    activeAircraft: activeAircraft.count,
    fleetSummary
  };
}

// Close databases (for cleanup)
export function closeDatabases() {
  if (flightsDb) {
    flightsDb.close();
    flightsDb = null;
  }
  if (aircraftDb) {
    aircraftDb.close();
    aircraftDb = null;
  }
  if (airportsDb) {
    airportsDb.close();
    airportsDb = null;
  }
}

