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

    // Fallback to mock data
    const mockStats = {
      activeFlights: 42,
      crewOnDuty: 156,
      activeAlerts: 3,
      scheduledFlights: 87
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

