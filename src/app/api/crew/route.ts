import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'apex-meridian-super-secret-key';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const tenant = decoded.tenant || 'DEMO';

    try {
      const { db } = await import('@/lib/db');
      const crew = await db.getCrewOnDuty(tenant);
      return NextResponse.json({ success: true, crew });
    } catch (dbError) {
      console.log('Database not configured, using mock data');
    }

    // Mock data fallback
    const mockCrew = [
      { id: 1, name: 'John Smith', position: 'Captain', status: 'On Duty', base: 'JFK' },
      { id: 2, name: 'Sarah Johnson', position: 'First Officer', status: 'On Duty', base: 'LAX' },
      { id: 3, name: 'Michael Williams', position: 'Flight Attendant', status: 'On Duty', base: 'ORD' }
    ];

    return NextResponse.json({ success: true, crew: mockCrew });
  } catch (error) {
    console.error('Crew error:', error);
    return NextResponse.json({ error: 'Failed to fetch crew' }, { status: 500 });
  }
}

