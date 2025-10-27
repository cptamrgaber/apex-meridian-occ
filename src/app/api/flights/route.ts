import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

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
    const tenant = decoded.tenant || 'DEMO';

    // Try to get flights from database
    try {
      const { db } = await import('@/lib/db');
      const flights = await db.getActiveFlights(tenant);
      
      return NextResponse.json({
        success: true,
        flights
      });
    } catch (dbError) {
      console.log('Database not configured, using mock data');
    }

    // Fallback to mock data
    const mockFlights = [
      {
        id: 1,
        flight_number: 'AM101',
        origin: 'JFK',
        destination: 'LAX',
        status: 'On Time',
        departure: '14:30',
        arrival: '18:45',
        aircraft: 'B737-800',
        gate: 'A12'
      },
      {
        id: 2,
        flight_number: 'AM202',
        origin: 'LAX',
        destination: 'SFO',
        status: 'Delayed',
        departure: '09:15',
        arrival: '10:45',
        aircraft: 'A320',
        gate: 'B7'
      },
      {
        id: 3,
        flight_number: 'AM303',
        origin: 'ORD',
        destination: 'MIA',
        status: 'On Time',
        departure: '16:00',
        arrival: '20:30',
        aircraft: 'B787-9',
        gate: 'C3'
      }
    ];

    return NextResponse.json({
      success: true,
      flights: mockFlights
    });
  } catch (error) {
    console.error('Flights error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch flights' },
      { status: 500 }
    );
  }
}

