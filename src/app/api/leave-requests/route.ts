import { NextResponse } from 'next/server';
import { getLeaveRequests, createLeaveRequest } from '@/lib/requests';

export async function GET() {
  try {
    const data = await getLeaveRequests();
    return NextResponse.json({ data });
  } catch (error) {
    console.error(error);
    return new Response('Error fetching leave requests', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { crewId, startDate, endDate, type, notes } = body;
    const result = await createLeaveRequest(crewId, startDate, endDate, type, notes);
    return NextResponse.json({ data: result });
  } catch (error) {
    console.error(error);
    return new Response('Error creating leave request', { status: 500 });
  }
}
