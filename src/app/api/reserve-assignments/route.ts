import { NextResponse } from 'next/server';
import { getReserveAssignments, createReserveAssignment } from '@/lib/requests';

export async function GET() {
  try {
    const data = await getReserveAssignments();
    return NextResponse.json({ data });
  } catch (error) {
    console.error(error);
    return new Response('Error fetching reserve assignments', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { crewId, startTime, endTime, flightId } = body;
    const result = await createReserveAssignment(
      crewId,
      startTime,
      endTime,
      flightId ?? null,
    );
    return NextResponse.json({ data: result });
  } catch (error) {
    console.error(error);
    return new Response('Error creating reserve assignment', { status: 500 });
  }
}
