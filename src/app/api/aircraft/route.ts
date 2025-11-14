import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { 
  getAllAircraft, 
  getAircraftByRegistration, 
  getAircraftByType,
  getActiveAircraft,
  getFleetSummary,
  getAircraftStats
} from '@/lib/database';

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
    jwt.verify(token, JWT_SECRET);

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const registration = searchParams.get('registration');
    const aircraftType = searchParams.get('type');
    const activeOnly = searchParams.get('active');
    const summary = searchParams.get('summary');
    const stats = searchParams.get('stats');

    // Get statistics
    if (stats === 'true') {
      const statistics = getAircraftStats();
      return NextResponse.json({
        success: true,
        stats: statistics
      });
    }

    // Get fleet summary
    if (summary === 'true') {
      const fleetSummary = getFleetSummary();
      return NextResponse.json({
        success: true,
        summary: fleetSummary
      });
    }

    // Get specific aircraft by registration
    if (registration) {
      const aircraft = getAircraftByRegistration(registration);
      if (!aircraft) {
        return NextResponse.json({ error: 'Aircraft not found' }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        aircraft
      });
    }

    // Get aircraft by type
    if (aircraftType) {
      const aircraft = getAircraftByType(aircraftType);
      return NextResponse.json({
        success: true,
        aircraft,
        total: aircraft.length
      });
    }

    // Get active aircraft only
    if (activeOnly === 'true') {
      const aircraft = getActiveAircraft();
      return NextResponse.json({
        success: true,
        aircraft,
        total: aircraft.length
      });
    }

    // Get all aircraft
    const aircraft = getAllAircraft();
    
    return NextResponse.json({
      success: true,
      aircraft,
      total: aircraft.length
    });
  } catch (error) {
    console.error('Aircraft error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch aircraft data' },
      { status: 500 }
    );
  }
}

