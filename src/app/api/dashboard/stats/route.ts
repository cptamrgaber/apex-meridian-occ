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

    // Try to get stats from database
    try {
      const { db } = await import('@/lib/db');
      const stats = await db.getDashboardStats(tenant);
      
      return NextResponse.json({
        success: true,
        stats
      });
    } catch (dbError) {
      console.log('Database not configured, using mock data');
    }

    // Fallback to real EgyptAir data
    const aircraftData = await import('@/data/egyptair_aircraft.json');
    const flightsData = await import('@/data/egyptair_flights.json');
    const airportsData = await import('@/data/egyptair_airports.json');
    
    const mockStats = {
      activeFlights: 0, // Updated by live ADS-B
      crewOnDuty: aircraftData.default.filter((a: any) => a.status === 'Active').length * 4,
      activeAlerts: 0,
      scheduledFlights: flightsData.default.length,
      totalAircraft: aircraftData.default.length,
      activeAircraft: aircraftData.default.filter((a: any) => a.status === 'Active').length,
      totalRoutes: flightsData.default.length,
      totalAirports: airportsData.default.length
    };

    return NextResponse.json({
      success: true,
      stats: mockStats
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}

