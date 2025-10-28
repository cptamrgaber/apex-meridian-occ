import { NextResponse } from 'next/server';
import flightsData from '@/data/egyptair_flights.json';
import airportsData from '@/data/egyptair_airports.json';

export const runtime = 'edge';

export async function GET() {
  try {
    // Enrich flight data with airport information
    const enrichedFlights = flightsData.map(flight => {
      const originAirport = airportsData.find(a => a.iata_code === flight.origin);
      const destAirport = airportsData.find(a => a.iata_code === flight.destination);
      
      return {
        ...flight,
        origin_name: originAirport?.airport_name || flight.origin,
        origin_city: originAirport?.city || '',
        destination_name: destAirport?.airport_name || flight.destination,
        destination_city: destAirport?.city || ''
      };
    });
    
    // Get route statistics
    const totalRoutes = flightsData.length;
    const uniqueDestinations = new Set(flightsData.map(f => f.destination)).size;
    
    return NextResponse.json({
      success: true,
      statistics: {
        totalRoutes,
        uniqueDestinations
      },
      routes: enrichedFlights
    });
  } catch (error) {
    console.error('Error fetching routes data:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch routes data'
    }, { status: 500 });
  }
}

