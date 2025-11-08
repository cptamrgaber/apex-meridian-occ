import { NextResponse } from 'next/server';
import { getTradeRequests, createTradeRequest } from '@/lib/requests';

export async function GET() {
  try {
    const data = await getTradeRequests();
    return NextResponse.json({ data });
  } catch (error) {
    console.error(error);
    return new Response('Error fetching trade requests', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { crewId, offeredFlightId, requestedFlightId } = body;
    const result = await createTradeRequest(crewId, offeredFlightId, requestedFlightId);
    return NextResponse.json({ data: result });
  } catch (error) {
    console.error(error);
    return new Response('Error creating trade request', { status: 500 });
  }
}
