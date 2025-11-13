import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    const { rows } = await sql`
      SELECT * FROM trade_requests 
      ORDER BY created_at DESC
    `;
    return NextResponse.json({ data: rows });
  } catch (error) {
    console.error('Error fetching trade requests:', error);
    return NextResponse.json({ error: 'Failed to fetch trade requests' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { crewId, offeredFlightId, requestedFlightId } = body;

    const { rows } = await sql`
      INSERT INTO trade_requests (crew_id, offered_flight_id, requested_flight_id, status)
      VALUES (${crewId}, ${offeredFlightId}, ${requestedFlightId}, 'pending')
      RETURNING *
    `;

    return NextResponse.json({ data: rows[0] });
  } catch (error) {
    console.error('Error creating trade request:', error);
    return NextResponse.json({ error: 'Failed to create trade request' }, { status: 500 });
  }
}

