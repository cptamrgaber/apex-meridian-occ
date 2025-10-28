import { NextResponse } from 'next/server';
import airportsData from '@/data/egyptair_airports.json';

export const runtime = 'edge';

export async function GET() {
  try {
    // Get airport statistics
    const totalAirports = airportsData.length;
    const hubs = airportsData.filter(a => a.classification === 'Hub').length;
    const focusCities = airportsData.filter(a => a.classification === 'Focus City').length;
    
    // Group by region
    const byRegion: Record<string, number> = {};
    airportsData.forEach(airport => {
      const region = airport.region || 'Unknown';
      byRegion[region] = (byRegion[region] || 0) + 1;
    });
    
    // Group by country
    const byCountry: Record<string, number> = {};
    airportsData.forEach(airport => {
      const country = airport.country || 'Unknown';
      byCountry[country] = (byCountry[country] || 0) + 1;
    });
    
    return NextResponse.json({
      success: true,
      statistics: {
        total: totalAirports,
        hubs,
        focusCities,
        domestic: airportsData.filter(a => a.classification === 'Domestic').length,
        international: airportsData.filter(a => a.classification === 'International').length
      },
      byRegion,
      byCountry,
      airports: airportsData
    });
  } catch (error) {
    console.error('Error fetching airports data:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch airports data'
    }, { status: 500 });
  }
}

