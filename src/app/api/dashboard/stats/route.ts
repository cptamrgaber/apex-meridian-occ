import { NextResponse } from 'next/server';

export async function GET() {
  // Mock data - in production, this would query Vercel Postgres
  const stats = {
    activeFlights: 42,
    crewOnDuty: 156,
    alerts: 3,
    scheduledFlights: 87,
    flightStatus: {
      onTime: 35,
      delayed: 5,
      cancelled: 2
    },
    crewUtilization: 78.5,
    lastUpdated: new Date().toISOString()
  };

  return NextResponse.json(stats);
}

