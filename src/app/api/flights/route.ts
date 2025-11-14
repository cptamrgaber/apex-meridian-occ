import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getAllFlights, getFlightByNumber, getFlightsByRoute, getFlightStats } from '@/lib/database';

const JWT_SECRET = process.env.JWT_SECRET || 'apex-meridian-super-secret-key';

export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const flightNumber = searchParams.get('flight_number');
    const origin = searchParams.get('origin');
    const destination = searchParams.get('destination');
    const stats = searchParams.get('stats');

    // Get statistics
    if (stats === 'true') {
      const statistics = getFlightStats();
      return NextResponse.json({
        success: true,
        stats: statistics
      });
    }

    // Get specific flight by number
    if (flightNumber) {
      const flight = getFlightByNumber(flightNumber);
      if (!flight) {
        return NextResponse.json({ error: 'Flight not found' }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        flight
      });
    }

    // Get flights by route
    if (origin && destination) {
      const flights = getFlightsByRoute(origin, destination);
      return NextResponse.json({
        success: true,
        flights
      });
    }

    // Get all flights from real database
    const flights = getAllFlights();
    
    return NextResponse.json({
      success: true,
      flights,
      total: flights.length
    });
  } catch (error) {
    console.error('Flights error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch flights' },
      { status: 500 }
    );
  }
}

