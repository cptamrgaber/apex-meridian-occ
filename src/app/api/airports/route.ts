import { NextResponse } from 'next/server';
import { 
  getAllAirports, 
  getAirportByIATA,
  getAirportsByRegion,
  getAirportsByType
} from '@/lib/database';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const iata = searchParams.get('iata');
    const region = searchParams.get('region');
    const type = searchParams.get('type');

    // Get specific airport by IATA code
    if (iata) {
      const airport = getAirportByIATA(iata);
      if (!airport) {
        return NextResponse.json({ error: 'Airport not found' }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        airport
      });
    }

    // Get airports by region
    if (region) {
      const airports = getAirportsByRegion(region);
      return NextResponse.json({
        success: true,
        airports,
        total: airports.length
      });
    }

    // Get airports by type
    if (type) {
      const airports = getAirportsByType(type);
      return NextResponse.json({
        success: true,
        airports,
        total: airports.length
      });
    }

    // Get all airports from real database
    const airports = getAllAirports();
    
    // Calculate statistics
    const totalAirports = airports.length;
    const hubs = airports.filter(a => a.type === 'Hub').length;
    const focusCities = airports.filter(a => a.type === 'Focus City').length;
    
    // Group by region
    const byRegion: Record<string, number> = {};
    airports.forEach(airport => {
      const region = airport.region || 'Unknown';
      byRegion[region] = (byRegion[region] || 0) + 1;
    });
    
    // Group by country
    const byCountry: Record<string, number> = {};
    airports.forEach(airport => {
      const country = airport.country || 'Unknown';
      byCountry[country] = (byCountry[country] || 0) + 1;
    });
    
    return NextResponse.json({
      success: true,
      statistics: {
        total: totalAirports,
        hubs,
        focusCities,
        domestic: airports.filter(a => a.type === 'Domestic').length,
        international: airports.filter(a => a.type !== 'Domestic').length
      },
      byRegion,
      byCountry,
      airports
    });
  } catch (error) {
    console.error('Error fetching airports data:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch airports data'
    }, { status: 500 });
  }
}

