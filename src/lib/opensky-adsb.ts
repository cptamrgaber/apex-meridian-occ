/**
 * OpenSky Network ADS-B Integration
 * Real-time flight tracking using OpenSky Network's free ADS-B API
 * Documentation: https://openskynetwork.github.io/opensky-api/rest.html
 */

export interface OpenSkyStateVector {
  icao24: string;           // Unique ICAO 24-bit address
  callsign: string | null;  // Flight callsign (e.g., "MSR777")
  origin_country: string;   // Country name
  time_position: number | null;  // Last position update timestamp
  last_contact: number;     // Last contact timestamp
  longitude: number | null; // WGS-84 longitude
  latitude: number | null;  // WGS-84 latitude
  baro_altitude: number | null;  // Barometric altitude in meters
  on_ground: boolean;       // Is aircraft on ground
  velocity: number | null;  // Velocity over ground in m/s
  true_track: number | null;  // True track in degrees (north=0°)
  vertical_rate: number | null;  // Vertical rate in m/s
  sensors: number[] | null;
  geo_altitude: number | null;  // Geometric altitude in meters
  squawk: string | null;    // Transponder code
  spi: boolean;             // Special position identification
  position_source: number;  // Position source (0=ADS-B, 1=ASTERIX, 2=MLAT)
}

export interface OpenSkyResponse {
  time: number;  // Unix timestamp
  states: Array<[
    string,        // 0: icao24
    string | null, // 1: callsign
    string,        // 2: origin_country
    number | null, // 3: time_position
    number,        // 4: last_contact
    number | null, // 5: longitude
    number | null, // 6: latitude
    number | null, // 7: baro_altitude
    boolean,       // 8: on_ground
    number | null, // 9: velocity
    number | null, // 10: true_track
    number | null, // 11: vertical_rate
    number[] | null, // 12: sensors
    number | null, // 13: geo_altitude
    string | null, // 14: squawk
    boolean,       // 15: spi
    number         // 16: position_source
  ]> | null;
}

export interface FlightPosition {
  flightNumber: string;
  callsign: string;
  icao24: string;
  latitude: number;
  longitude: number;
  altitude: number;  // in feet
  speed: number;     // in knots
  heading: number;   // in degrees
  verticalRate: number;  // in feet/min
  onGround: boolean;
  lastUpdate: Date;
  origin: string;
  destination: string;
  aircraft: string;
}

const OPENSKY_API_BASE = 'https://opensky-network.org/api';

// OpenSky credentials from environment variables
const OPENSKY_USERNAME = process.env.OPENSKY_USERNAME;
const OPENSKY_PASSWORD = process.env.OPENSKY_PASSWORD;

/**
 * Get all state vectors from OpenSky Network
 */
export async function getAllStates(options?: {
  time?: number;
  icao24?: string[];
  bbox?: { lamin: number; lomin: number; lamax: number; lomax: number };
}): Promise<OpenSkyResponse> {
  const params = new URLSearchParams();
  
  if (options?.time) {
    params.append('time', options.time.toString());
  }
  
  if (options?.icao24) {
    options.icao24.forEach(icao => params.append('icao24', icao));
  }
  
  if (options?.bbox) {
    params.append('lamin', options.bbox.lamin.toString());
    params.append('lomin', options.bbox.lomin.toString());
    params.append('lamax', options.bbox.lamax.toString());
    params.append('lomax', options.bbox.lomax.toString());
  }
  
  const url = `${OPENSKY_API_BASE}/states/all${params.toString() ? '?' + params.toString() : ''}`;
  
  // Add authentication headers if credentials are available
  const headers: HeadersInit = {};
  if (OPENSKY_USERNAME && OPENSKY_PASSWORD) {
    const auth = Buffer.from(`${OPENSKY_USERNAME}:${OPENSKY_PASSWORD}`).toString('base64');
    headers['Authorization'] = `Basic ${auth}`;
  }
  
  const response = await fetch(url, { headers });
  
  if (!response.ok) {
    throw new Error(`OpenSky API error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Convert OpenSky state vector array to structured object
 */
function parseStateVector(state: OpenSkyResponse['states'][number]): OpenSkyStateVector {
  return {
    icao24: state[0],
    callsign: state[1]?.trim() || null,
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
  };
}

/**
 * Get EgyptAir flights from OpenSky Network
 * Filters for callsigns starting with "MSR" (EgyptAir ICAO code)
 */
export async function getEgyptAirFlights(): Promise<FlightPosition[]> {
  try {
    const response = await getAllStates();
    
    if (!response.states) {
      return [];
    }
    
    const egyptairFlights: FlightPosition[] = [];
    
    for (const stateArray of response.states) {
      const state = parseStateVector(stateArray);
      
      // Filter for EgyptAir flights (callsign starts with "MSR" or "MS")
      if (!state.callsign) continue;
      
      const callsign = state.callsign.trim().toUpperCase();
      if (!callsign.startsWith('MSR') && !callsign.startsWith('MS')) continue;
      
      // Skip if no position data
      if (state.latitude === null || state.longitude === null) continue;
      
      // Convert units
      const altitudeFeet = state.baro_altitude !== null ? state.baro_altitude * 3.28084 : 0;
      const speedKnots = state.velocity !== null ? state.velocity * 1.94384 : 0;
      const verticalRateFpm = state.vertical_rate !== null ? state.vertical_rate * 196.85 : 0;
      
      egyptairFlights.push({
        flightNumber: callsign.replace('MSR', 'MS'),
        callsign: callsign,
        icao24: state.icao24,
        latitude: state.latitude,
        longitude: state.longitude,
        altitude: Math.round(altitudeFeet),
        speed: Math.round(speedKnots),
        heading: state.true_track || 0,
        verticalRate: Math.round(verticalRateFpm),
        onGround: state.on_ground,
        lastUpdate: new Date(state.last_contact * 1000),
        origin: 'Unknown',  // Will be enriched from database
        destination: 'Unknown',  // Will be enriched from database
        aircraft: 'Unknown',  // Will be enriched from database
      });
    }
    
    return egyptairFlights;
  } catch (error) {
    console.error('Error fetching EgyptAir flights from OpenSky:', error);
    return [];
  }
}

/**
 * Get flights within a bounding box (e.g., around Egypt)
 */
export async function getFlightsInRegion(bbox: {
  lamin: number;
  lomin: number;
  lamax: number;
  lomax: number;
}): Promise<OpenSkyStateVector[]> {
  try {
    const response = await getAllStates({ bbox });
    
    if (!response.states) {
      return [];
    }
    
    return response.states.map(parseStateVector);
  } catch (error) {
    console.error('Error fetching flights in region from OpenSky:', error);
    return [];
  }
}

/**
 * Enrich OpenSky flight data with database information
 */
export async function enrichFlightData(
  openskyFlight: FlightPosition,
  databaseFlights: any[]
): Promise<FlightPosition> {
  // Try to match with database flight
  const dbFlight = databaseFlights.find(f => 
    f.flight_number === openskyFlight.flightNumber ||
    f.callsign === openskyFlight.callsign
  );
  
  if (dbFlight) {
    return {
      ...openskyFlight,
      origin: dbFlight.origin || openskyFlight.origin,
      destination: dbFlight.destination || openskyFlight.destination,
      aircraft: dbFlight.aircraft_type || openskyFlight.aircraft,
    };
  }
  
  return openskyFlight;
}

/**
 * Example: Get flights around Egypt (Cairo region)
 */
export async function getFlightsAroundEgypt(): Promise<OpenSkyStateVector[]> {
  return getFlightsInRegion({
    lamin: 22.0,  // Southern Egypt
    lomin: 25.0,  // Western Egypt
    lamax: 32.0,  // Northern Egypt (Mediterranean)
    lomax: 37.0,  // Eastern Egypt (Red Sea)
  });
}

