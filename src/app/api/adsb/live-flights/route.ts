import { NextResponse } from 'next/server';
import { getEgyptAirFlights, enrichFlightData } from '@/lib/opensky-adsb';
import { getAllFlights } from '@/lib/database';

/**
 * GET /api/adsb/live-flights
 * 
 * Get real-time EgyptAir flights from OpenSky Network ADS-B data
 * Enriched with database information (routes, aircraft types)
 */
export async function GET() {
  try {
    // Get real-time flights from OpenSky Network
    const liveFlights = await getEgyptAirFlights();
    
    // Get database flights for enrichment
    const dbFlights = getAllFlights();
    
    // Enrich OpenSky data with database information
    const enrichedFlights = await Promise.all(
      liveFlights.map(flight => enrichFlightData(flight, dbFlights))
    );
    
    return NextResponse.json({
      success: true,
      count: enrichedFlights.length,
      timestamp: new Date().toISOString(),
      source: 'OpenSky Network ADS-B',
      flights: enrichedFlights,
    });
  } catch (error) {
    console.error('Error fetching ADS-B live flights:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch live flights from OpenSky Network',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

