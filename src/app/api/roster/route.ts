import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

    // Demo roster data
    const roles = ['Captain', 'First Officer', 'Senior FA', 'Flight Attendant'];
    const flights = [
      { flight: 'MSR777', origin: 'CAI', destination: 'LHR', departure: '11:10', arrival: '14:09', aircraft: 'B77W' },
      { flight: 'MSR757', origin: 'CAI', destination: 'AMS', departure: '12:56', arrival: '16:36', aircraft: 'A21N' },
      { flight: 'MSR785', origin: 'CAI', destination: 'FRA', departure: '12:29', arrival: '16:01', aircraft: 'A21N' },
      { flight: 'MSR703', origin: 'CAI', destination: 'MXP', departure: '11:40', arrival: '15:00', aircraft: 'B738' },
      { flight: 'MSR725', origin: 'CAI', destination: 'BRU', departure: '11:18', arrival: '15:24', aircraft: 'B738' },
      { flight: 'MSR747', origin: 'CAI', destination: 'ATH', departure: '12:54', arrival: '15:17', aircraft: 'B738' },
      { flight: 'MSR773', origin: 'CAI', destination: 'ZRH', departure: '11:26', arrival: '14:49', aircraft: 'A20N' },
      { flight: 'MSR781', origin: 'CAI', destination: 'MAN', departure: '10:33', arrival: '14:19', aircraft: 'A321' },
    ];

    const roster: any[] = [];
    flights.forEach((flight, flightIdx) => {
      roles.forEach((role, roleIdx) => {
        roster.push({
          id: `${date}-${flightIdx}-${roleIdx}`,
          crew_id: `EGY${1000 + flightIdx * 4 + roleIdx}`,
          crew_name: `${role === 'Captain' ? 'Capt.' : role === 'First Officer' ? 'F/O' : ''} ${
            ['Ahmed Hassan', 'Mohamed Ali', 'Sarah Ibrahim', 'Fatima Khalil', 
             'Omar Mansour', 'Layla Farouk', 'Karim Nasser', 'Nour El-Din'][flightIdx * 4 + roleIdx % 8]
          }`,
          role,
          flight_number: flight.flight,
          origin: flight.origin,
          destination: flight.destination,
          departure_time: flight.departure,
          arrival_time: flight.arrival,
          aircraft_type: flight.aircraft,
          status: 'Confirmed',
          date
        });
      });
    });

    return NextResponse.json({
      success: true,
      date,
      roster,
      total: roster.length
    });
  } catch (error) {
    console.error('Roster API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch roster' },
      { status: 500 }
    );
  }
}

