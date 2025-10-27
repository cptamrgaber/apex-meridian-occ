import { NextRequest, NextResponse } from 'next/server';
import { getDeparturesByAirport, getArrivalsByAirport, EGYPTAIR_AIRPORTS } from '@/lib/opensky';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

/**
 * GET /api/flights/history
 * Get historical flights from EgyptAir airports
 * Query params:
 *   - airport: ICAO code (default: HECA - Cairo)
 *   - type: 'departure' | 'arrival' | 'both' (default: 'both')
 *   - hours: number of hours to look back (default: 24, max: 168)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const airport = searchParams.get('airport') || 'HECA';
    const type = searchParams.get('type') || 'both';
    const hours = Math.min(parseInt(searchParams.get('hours') || '24'), 168);

    const now = Math.floor(Date.now() / 1000);
    const begin = now - (hours * 3600);
    const end = now;

    let flights: any[] = [];

    if (type === 'departure' || type === 'both') {
      try {
        const departures = await getDeparturesByAirport(airport, begin, end);
        flights.push(...departures.map(f => ({
          ...f,
          type: 'departure',
          airport,
          timestamp: f.firstSeen
        })));
      } catch (error) {
        console.error('Error fetching departures:', error);
      }
    }

    if (type === 'arrival' || type === 'both') {
      try {
        const arrivals = await getArrivalsByAirport(airport, begin, end);
        flights.push(...arrivals.map(f => ({
          ...f,
          type: 'arrival',
          airport,
          timestamp: f.lastSeen
        })));
      } catch (error) {
        console.error('Error fetching arrivals:', error);
      }
    }

    // Filter for EgyptAir flights (callsign starts with MSR or MSE)
    const egyptairFlights = flights.filter(f => {
      const callsign = f.callsign?.trim().toUpperCase();
      return callsign && (callsign.startsWith('MSR') || callsign.startsWith('MSE'));
    });

    // Sort by timestamp (most recent first)
    egyptairFlights.sort((a, b) => b.timestamp - a.timestamp);

    return NextResponse.json({
      success: true,
      count: egyptairFlights.length,
      airport,
      airport_name: EGYPTAIR_AIRPORTS[airport as keyof typeof EGYPTAIR_AIRPORTS] || airport,
      period: {
        begin,
        end,
        hours
      },
      flights: egyptairFlights
    });
  } catch (error) {
    console.error('Error fetching flight history:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch flight history',
      count: 0,
      flights: []
    }, { status: 500 });
  }
}

