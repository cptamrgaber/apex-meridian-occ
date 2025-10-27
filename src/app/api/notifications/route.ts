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

    try {
      const { db } = await import('@/lib/db');
      const notifications = await db.getNotifications(decoded.userId);
      return NextResponse.json({ success: true, notifications });
    } catch (dbError) {
      console.log('Database not configured, using mock data');
    }

    // Mock data fallback
    const mockNotifications = [
      {
        id: 1,
        title: 'Flight Update',
        message: 'AM101 departure gate changed to A15',
        read: false,
        created_at: new Date()
      }
    ];

    return NextResponse.json({ success: true, notifications: mockNotifications });
  } catch (error) {
    console.error('Notifications error:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
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
    const { notificationId } = await request.json();

    try {
      const { db } = await import('@/lib/db');
      await db.markNotificationRead(notificationId, decoded.userId);
      return NextResponse.json({ success: true });
    } catch (dbError) {
      console.log('Database not configured');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Mark notification read error:', error);
    return NextResponse.json({ error: 'Failed to mark notification as read' }, { status: 500 });
  }
}

