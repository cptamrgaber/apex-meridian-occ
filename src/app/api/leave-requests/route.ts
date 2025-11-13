import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    const { rows } = await sql`
      SELECT * FROM leave_requests 
      ORDER BY created_at DESC
    `;
    return NextResponse.json({ data: rows });
  } catch (error) {
    console.error('Error fetching leave requests:', error);
    return NextResponse.json({ error: 'Failed to fetch leave requests' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { crewId, startDate, endDate, type, notes } = body;

    const { rows } = await sql`
      INSERT INTO leave_requests (crew_id, start_date, end_date, type, notes, status)
      VALUES (${crewId}, ${startDate}, ${endDate}, ${type}, ${notes || ''}, 'pending')
      RETURNING *
    `;

    return NextResponse.json({ data: rows[0] });
  } catch (error) {
    console.error('Error creating leave request:', error);
    return NextResponse.json({ error: 'Failed to create leave request' }, { status: 500 });
  }
}

