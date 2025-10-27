/**
 * OpenSky Network API Client
 * Provides real-time flight tracking using ADS-B data
 * Documentation: https://openskynetwork.github.io/opensky-api/rest.html
 */

const OPENSKY_API_BASE = 'https://opensky-network.org/api';

export interface StateVector {
  icao24: string;
  callsign: string | null;
  origin_country: string;
  time_position: number | null;
  last_contact: number;
  longitude: number | null;
  latitude: number | null;
  baro_altitude: number | null;
  on_ground: boolean;
  velocity: number | null;
  true_track: number | null;
  vertical_rate: number | null;
  sensors: number[] | null;
  geo_altitude: number | null;
  squawk: string | null;
  spi: boolean;
  position_source: number;
  category: number;
}

export interface Flight {
  icao24: string;
  firstSeen: number;
  estDepartureAirport: string | null;
  lastSeen: number;
  estArrivalAirport: string | null;
  callsign: string;
  estDepartureAirportHorizDistance: number | null;
  estDepartureAirportVertDistance: number | null;
  estArrivalAirportHorizDistance: number | null;
  estArrivalAirportVertDistance: number | null;
  departureAirportCandidatesCount: number;
  arrivalAirportCandidatesCount: number;
}

export interface OpenSkyStatesResponse {
  time: number;
  states: any[][] | null;
}

export interface OpenSkyFlightsResponse extends Array<Flight> {}

/**
 * Parse raw state vector array into structured object
 */
function parseStateVector(state: any[]): StateVector {
  return {
    icao24: state[0],
    callsign: state[1] ? state[1].trim() : null,
    origin_country: state[2],
    time_position: state[3],
    last_contact: state[4],
    longitude: state[5],
    latitude: state[6],
    baro_altitude: state[7],
    on_ground: state[8],
    velocity: state[9],
    true_track: state[10],
    vertical_rate: state[11],
    sensors: state[12],
    geo_altitude: state[13],
    squawk: state[14],
    spi: state[15],
    position_source: state[16],
    category: state[17] || 0
  };
}

/**
 * Get all current state vectors (all aircraft in the world)
 * Can be filtered by ICAO24, bounding box, or time
 */
export async function getAllStates(params?: {
  time?: number;
  icao24?: string | string[];
  bbox?: { lamin: number; lomin: number; lamax: number; lomax: number };
}): Promise<StateVector[]> {
  const url = new URL(`${OPENSKY_API_BASE}/states/all`);
  
  if (params?.time) {
    url.searchParams.append('time', params.time.toString());
  }
  
  if (params?.icao24) {
    const icao24List = Array.isArray(params.icao24) ? params.icao24 : [params.icao24];
    icao24List.forEach(icao => url.searchParams.append('icao24', icao));
  }
  
  if (params?.bbox) {
    url.searchParams.append('lamin', params.bbox.lamin.toString());
    url.searchParams.append('lomin', params.bbox.lomin.toString());
    url.searchParams.append('lamax', params.bbox.lamax.toString());
    url.searchParams.append('lomax', params.bbox.lomax.toString());
  }

  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error(`OpenSky API error: ${response.status} ${response.statusText}`);
  }

  const data: OpenSkyStatesResponse = await response.json();
  
  if (!data.states) {
    return [];
  }

  return data.states.map(parseStateVector);
}

/**
 * Get flights by aircraft ICAO24 in a time interval
 */
export async function getFlightsByAircraft(
  icao24: string,
  begin: number,
  end: number
): Promise<Flight[]> {
  const url = new URL(`${OPENSKY_API_BASE}/flights/aircraft`);
  url.searchParams.append('icao24', icao24);
  url.searchParams.append('begin', begin.toString());
  url.searchParams.append('end', end.toString());

  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error(`OpenSky API error: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Get arrivals at an airport in a time interval
 */
export async function getArrivalsByAirport(
  airport: string,
  begin: number,
  end: number
): Promise<Flight[]> {
  const url = new URL(`${OPENSKY_API_BASE}/flights/arrival`);
  url.searchParams.append('airport', airport);
  url.searchParams.append('begin', begin.toString());
  url.searchParams.append('end', end.toString());

  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error(`OpenSky API error: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Get departures from an airport in a time interval
 */
export async function getDeparturesByAirport(
  airport: string,
  begin: number,
  end: number
): Promise<Flight[]> {
  const url = new URL(`${OPENSKY_API_BASE}/flights/departure`);
  url.searchParams.append('airport', airport);
  url.searchParams.append('begin', begin.toString());
  url.searchParams.append('end', end.toString());

  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error(`OpenSky API error: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Filter state vectors for EgyptAir flights
 * EgyptAir callsigns start with "MSR" or "MSE"
 */
export function filterEgyptAirFlights(states: StateVector[]): StateVector[] {
  return states.filter(state => {
    if (!state.callsign) return false;
    const callsign = state.callsign.trim().toUpperCase();
    return callsign.startsWith('MSR') || callsign.startsWith('MSE');
  });
}

/**
 * Get EgyptAir flights from major Egyptian airports
 * HECA = Cairo International
 * HEGN = Hurghada
 * HESH = Sharm El Sheikh
 * HELX = Luxor
 * HESN = Aswan
 * HEBA = Alexandria Borg El Arab
 */
export const EGYPTAIR_AIRPORTS = {
  HECA: 'Cairo International',
  HEGN: 'Hurghada International',
  HESH: 'Sharm El Sheikh International',
  HELX: 'Luxor International',
  HESN: 'Aswan International',
  HEBA: 'Alexandria Borg El Arab'
};

/**
 * Get bounding box for Egypt to filter flights in Egyptian airspace
 */
export const EGYPT_BBOX = {
  lamin: 22.0,  // Southern border
  lomin: 25.0,  // Western border
  lamax: 31.7,  // Northern border (Mediterranean)
  lomax: 36.9   // Eastern border (Red Sea)
};

/**
 * Convert meters per second to knots
 */
export function msToKnots(ms: number | null): number | null {
  if (ms === null) return null;
  return Math.round(ms * 1.94384);
}

/**
 * Convert meters to feet
 */
export function metersToFeet(meters: number | null): number | null {
  if (meters === null) return null;
  return Math.round(meters * 3.28084);
}

/**
 * Get aircraft category name
 */
export function getAircraftCategoryName(category: number): string {
  const categories: { [key: number]: string } = {
    0: 'No information',
    1: 'No ADS-B Emitter Category',
    2: 'Light',
    3: 'Small',
    4: 'Large',
    5: 'High Vortex Large',
    6: 'Heavy',
    7: 'High Performance',
    8: 'Rotorcraft',
    9: 'Glider',
    10: 'Lighter-than-air',
    11: 'Parachutist',
    12: 'Ultralight',
    13: 'Reserved',
    14: 'UAV',
    15: 'Space Vehicle',
    16: 'Emergency Vehicle',
    17: 'Service Vehicle',
    18: 'Point Obstacle',
    19: 'Cluster Obstacle',
    20: 'Line Obstacle'
  };
  return categories[category] || 'Unknown';
}

/**
 * Format Unix timestamp to readable date/time
 */
export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleString();
}

