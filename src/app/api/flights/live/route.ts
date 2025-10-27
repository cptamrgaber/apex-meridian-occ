import { NextRequest, NextResponse } from 'next/server';
import { getAllStates, filterEgyptAirFlights, msToKnots, metersToFeet } from '@/lib/opensky';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

/**
 * GET /api/flights/live
 * Get real-time EgyptAir flights from OpenSky Network
 */
export async function GET(request: NextRequest) {
  try {
    // Get all current state vectors
    const states = await getAllStates();
    
    // Filter for EgyptAir flights
    const egyptairFlights = filterEgyptAirFlights(states);
    
    // Transform to our flight format
    const flights = egyptairFlights.map(state => ({
      id: state.icao24,
      icao24: state.icao24,
      callsign: state.callsign?.trim() || 'Unknown',
      origin_country: state.origin_country,
      longitude: state.longitude,
      latitude: state.latitude,
      altitude: metersToFeet(state.baro_altitude || state.geo_altitude),
      velocity: msToKnots(state.velocity),
      heading: state.true_track,
      vertical_rate: state.vertical_rate,
      on_ground: state.on_ground,
      last_contact: state.last_contact,
      time_position: state.time_position,
      squawk: state.squawk,
      category: state.category,
      // Additional computed fields
      status: state.on_ground ? 'On Ground' : 'In Flight',
      speed_knots: msToKnots(state.velocity),
      altitude_feet: metersToFeet(state.baro_altitude || state.geo_altitude)
    }));

    return NextResponse.json({
      success: true,
      count: flights.length,
      timestamp: Math.floor(Date.now() / 1000),
      flights
    });
  } catch (error) {
    console.error('Error fetching live flights:', error);
    
    // Return demo fallback data on error
    const demoFlights = [
      {
        id: 'demo1',
        icao24: '010203',
        callsign: 'MSR777',
        origin_country: 'Egypt',
        longitude: 31.4056,
        latitude: 30.1219,
        altitude: 35000,
        velocity: 450,
        heading: 90,
        vertical_rate: 0,
        on_ground: false,
        last_contact: Math.floor(Date.now() / 1000),
        time_position: Math.floor(Date.now() / 1000),
        squawk: '1200',
        category: 4,
        status: 'In Flight',
        speed_knots: 450,
        altitude_feet: 35000
      },
      {
        id: 'demo2',
        icao24: '020304',
        callsign: 'MSR985',
        origin_country: 'Egypt',
        longitude: 29.9792,
        latitude: 31.2001,
        altitude: 0,
        velocity: 0,
        heading: 0,
        vertical_rate: 0,
        on_ground: true,
        last_contact: Math.floor(Date.now() / 1000),
        time_position: Math.floor(Date.now() / 1000),
        squawk: null,
        category: 4,
        status: 'On Ground',
        speed_knots: 0,
        altitude_feet: 0
      },
      {
        id: 'demo3',
        icao24: '030405',
        callsign: 'MSR123',
        origin_country: 'Egypt',
        longitude: 33.8141,
        latitude: 27.1783,
        altitude: 28000,
        velocity: 420,
        heading: 180,
        vertical_rate: -500,
        on_ground: false,
        last_contact: Math.floor(Date.now() / 1000),
        time_position: Math.floor(Date.now() / 1000),
        squawk: '1200',
        category: 4,
        status: 'In Flight',
        speed_knots: 420,
        altitude_feet: 28000
      }
    ];
    
    return NextResponse.json({
      success: true,
      demo: true,
      message: 'Using demo data - OpenSky Network temporarily unavailable',
      count: demoFlights.length,
      timestamp: Math.floor(Date.now() / 1000),
      flights: demoFlights
    });
  }
}

