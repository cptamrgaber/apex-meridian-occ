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
    
    // Return fallback data on error
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch live flight data',
      count: 0,
      flights: []
    }, { status: 500 });
  }
}

