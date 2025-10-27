import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'apex-meridian-super-secret-key';

// Mock user database (in production, this would be in Vercel Postgres)
const USERS = [
  {
    id: '1',
    username: 'demo_admin',
    password: '$2a$10$rBV2kHYgL7dF.QxKvF5fFOqN0xGx7QxQxGxQxGxQxGxQxGxQxGxQx', // password123
    name: 'Admin User',
    role: 'admin',
    tenant: 'DEMO'
  }
];

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

    // Find user
    const user = USERS.find(u => u.username === username);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // For demo, accept any password for demo_admin
    // In production, use: await bcrypt.compare(password, user.password)
    const isValidPassword = password === 'password123';

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token
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
        name: user.name,
        role: user.role,
        tenant: user.tenant
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

