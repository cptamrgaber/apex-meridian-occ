import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'apex-meridian-super-secret-key';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Try database authentication first (if Vercel Postgres is configured)
    try {
      const { db } = await import('@/lib/db');
      const user = await db.verifyPassword(username, password);

      if (user) {
        const token = jwt.sign(
          {
            userId: user.id,
            username: user.username,
            role: user.role,
            tenant: user.tenant
          },
          JWT_SECRET,
          { expiresIn: '24h' }
        );

        return NextResponse.json({
          success: true,
          token,
          user: {
            id: user.id,
            username: user.username,
            name: user.full_name,
            role: user.role,
            tenant: user.tenant
          }
        });
      }
    } catch (dbError) {
      console.log('Database not configured, using fallback authentication');
    }

    // Fallback to demo authentication if database is not configured
    if (username === 'demo_admin' && password === 'password123') {
      const token = jwt.sign(
        {
          userId: '1',
          username: 'demo_admin',
          role: 'admin',
          tenant: 'DEMO'
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return NextResponse.json({
        success: true,
        token,
        user: {
          id: '1',
          username: 'demo_admin',
          name: 'Demo Administrator',
          role: 'admin',
          tenant: 'DEMO'
        }
      });
    }

    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

