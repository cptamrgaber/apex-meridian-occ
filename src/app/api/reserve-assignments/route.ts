import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    const { rows } = await sql`
      SELECT * FROM reserve_assignments 
      ORDER BY created_at DESC
    `;
    return NextResponse.json({ data: rows });
  } catch (error) {
    console.error('Error fetching reserve assignments:', error);
    return NextResponse.json({ error: 'Failed to fetch reserve assignments' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { crewId, startTime, endTime, flightId } = body;

    const { rows } = await sql`
      INSERT INTO reserve_assignments (crew_id, start_time, end_time, flight_id, status)
      VALUES (${crewId}, ${startTime}, ${endTime}, ${flightId}, 'active')
      RETURNING *
    `;

    return NextResponse.json({ data: rows[0] });
  } catch (error) {
    console.error('Error creating reserve assignment:', error);
    return NextResponse.json({ error: 'Failed to create reserve assignment' }, { status: 500 });
  }
}

