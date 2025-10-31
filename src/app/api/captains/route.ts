import { NextResponse } from 'next/server';
import captainsData from '@/data/egyptair_captains_full.json';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const aircraft_type = searchParams.get('aircraft_type');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let filteredCaptains = [...captainsData];

    // Filter by aircraft type
    if (aircraft_type && aircraft_type !== 'all') {
      filteredCaptains = filteredCaptains.filter(c => 
        c.aircraft_type === aircraft_type
      );
    }

    // Search by name or code
    if (search) {
      const searchLower = search.toLowerCase();
      filteredCaptains = filteredCaptains.filter(c =>
        c.english_name.toLowerCase().includes(searchLower) ||
        c.passport_name.toLowerCase().includes(searchLower) ||
        c.code.includes(search) ||
        c.arabic_name.includes(search)
      );
    }

    // Sort by seniority
    filteredCaptains.sort((a, b) => a.seniority - b.seniority);

    const total = filteredCaptains.length;
    const paginatedCaptains = filteredCaptains.slice(offset, offset + limit);

    // Calculate statistics
    const aircraftTypes = {} as Record<string, number>;
    captainsData.forEach(c => {
      if (c.aircraft_type) {
        aircraftTypes[c.aircraft_type] = (aircraftTypes[c.aircraft_type] || 0) + 1;
      }
    });

    return NextResponse.json({
      success: true,
      captains: paginatedCaptains,
      total,
      limit,
      offset,
      statistics: {
        total_captains: captainsData.length,
        aircraft_types: aircraftTypes,
      }
    });
  } catch (error) {
    console.error('Error fetching captains:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch captains data' },
      { status: 500 }
    );
  }
}

