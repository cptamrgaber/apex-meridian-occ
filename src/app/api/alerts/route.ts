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
      const alerts = await db.getAlerts(tenant, false);
      return NextResponse.json({ success: true, alerts });
    } catch (dbError) {
      console.log('Database not configured, using mock data');
    }

    // Mock data fallback
    const mockAlerts = [
      {
        id: 1,
        type: 'weather',
        severity: 'warning',
        title: 'Weather Advisory',
        message: 'Thunderstorms expected at JFK',
        created_at: new Date()
      },
      {
        id: 2,
        type: 'delay',
        severity: 'info',
        title: 'Flight Delay',
        message: 'AM202 delayed by 15 minutes',
        created_at: new Date()
      }
    ];

    return NextResponse.json({ success: true, alerts: mockAlerts });
  } catch (error) {
    console.error('Alerts error:', error);
    return NextResponse.json({ error: 'Failed to fetch alerts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const { alertId } = await request.json();

    try {
      const { db } = await import('@/lib/db');
      await db.acknowledgeAlert(alertId, decoded.userId, decoded.tenant);
      return NextResponse.json({ success: true });
    } catch (dbError) {
      console.log('Database not configured');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Acknowledge alert error:', error);
    return NextResponse.json({ error: 'Failed to acknowledge alert' }, { status: 500 });
  }
}

