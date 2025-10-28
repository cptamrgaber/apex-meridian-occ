import { NextResponse } from 'next/server';
import aircraftData from '@/data/egyptair_aircraft.json';

export const runtime = 'edge';

export async function GET() {
  try {
    // Get fleet statistics
    const totalAircraft = aircraftData.length;
    const activeAircraft = aircraftData.filter(a => a.status === 'Active').length;
    
    // Group by aircraft type
    const byType: Record<string, number> = {};
    aircraftData.forEach(aircraft => {
      const type = aircraft.aircraft_type || 'Unknown';
      byType[type] = (byType[type] || 0) + 1;
    });
    
    // Group by manufacturer
    const byManufacturer: Record<string, number> = {};
    aircraftData.forEach(aircraft => {
      const manufacturer = aircraft.manufacturer || 'Unknown';
      byManufacturer[manufacturer] = (byManufacturer[manufacturer] || 0) + 1;
    });
    
    return NextResponse.json({
      success: true,
      statistics: {
        total: totalAircraft,
        active: activeAircraft,
        inactive: totalAircraft - activeAircraft
      },
      byType,
      byManufacturer,
      aircraft: aircraftData
    });
  } catch (error) {
    console.error('Error fetching fleet data:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch fleet data'
    }, { status: 500 });
  }
}

