import { NextResponse } from 'next/server';
import flightSchedule from '@/data/flight_schedule.json';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const origin = searchParams.get('origin');
    const destination = searchParams.get('destination');
    const date = searchParams.get('date');

    let flights = [...flightSchedule];

    // Filter by status
    if (status && status !== 'all') {
      flights = flights.filter(f => f.status.toLowerCase() === status.toLowerCase());
    }

    // Filter by origin
    if (origin) {
      flights = flights.filter(f => f.origin === origin.toUpperCase());
    }

    // Filter by destination
    if (destination) {
      flights = flights.filter(f => f.destination === destination.toUpperCase());
    }

    // Sort by departure time
    flights.sort((a, b) => {
      const timeA = a.departure_time || '00:00';
      const timeB = b.departure_time || '00:00';
      return timeA.localeCompare(timeB);
    });

    return NextResponse.json({
      success: true,
      count: flights.length,
      flights
    });
  } catch (error) {
    console.error('Error fetching flight schedule:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch flight schedule' },
      { status: 500 }
    );
  }
}

