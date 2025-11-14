import { NextResponse } from 'next/server';
import { generateLiveFlights, getFlightStatistics } from '@/lib/liveFlightService';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic'; // Always generate fresh data

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const count = parseInt(searchParams.get('count') || '5');
    const stats = searchParams.get('stats') === 'true';

    if (stats) {
      const statistics = getFlightStatistics();
      return NextResponse.json({
        success: true,
        statistics
      });
    }

    const liveFlights = generateLiveFlights(count);
    
    return NextResponse.json({
      success: true,
      flights: liveFlights,
      total: liveFlights.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating live flights:', error);
    return NextResponse.json(
      { error: 'Failed to generate live flights data' },
      { status: 500 }
    );
  }
}

