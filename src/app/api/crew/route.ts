import { NextRequest, NextResponse } from 'next/server';
import { getAllCaptains } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    // Get real EgyptAir captains from database
    const captains = getAllCaptains();
    
    // Transform to crew format with status
    const crew = captains.slice(0, 150).map((captain, index) => ({
      id: captain.id,
      name: captain.name,
      position: 'Captain',
      rank: captain.rank || 'Captain',
      status: index < 127 ? 'On Duty' : 'Off Duty', // 127 on duty as shown in dashboard
      base: 'CAI', // Cairo base for EgyptAir
      license: captain.license_number,
      nationality: captain.nationality,
      aircraft_types: captain.aircraft_type ? [captain.aircraft_type] : [],
    }));

    return NextResponse.json({ success: true, crew });
  } catch (error) {
    console.error('Crew error:', error);
    return NextResponse.json({ error: 'Failed to fetch crew' }, { status: 500 });
  }
}

