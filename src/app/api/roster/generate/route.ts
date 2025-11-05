import { NextRequest, NextResponse } from 'next/server';
import { generateRoster, calculateRosterStatistics, DEFAULT_ROSTER_OPTIONS } from '@/lib/roster-generator';
import type { RosterGenerationOptions } from '@/lib/roster-generator';
import { generateSampleFlights } from '@/data/sample-flights';
import { mockCrewAssignments } from '@/data/fleet-management-mock';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const options: RosterGenerationOptions = {
      ...DEFAULT_ROSTER_OPTIONS,
      ...body.options,
    };
    
    // Get crew for the specified aircraft type
    const crew = mockCrewAssignments.filter(
      c => c.aircraft_type?.code === options.aircraft_type && c.status === 'active'
    );
    
    if (crew.length === 0) {
      return NextResponse.json(
        { error: `No active crew found for aircraft type ${options.aircraft_type}` },
        { status: 400 }
      );
    }
    
    // Generate sample flights for the month
    const flights = generateSampleFlights(options.month, options.year, options.aircraft_type);
    
    // Generate roster
    const result = generateRoster(flights, crew, options);
    
    // Calculate statistics
    const statistics = calculateRosterStatistics(result.stats);
    
    // Convert pilot stats map to array for JSON response
    const pilotStats = Array.from(result.stats.values());
    
    return NextResponse.json({
      success: true,
      roster: {
        entries: result.entries,
        unassignedFlights: result.unassignedFlights,
        warnings: result.warnings,
      },
      statistics: {
        ...statistics,
        pilotStats,
      },
      options,
    });
  } catch (error) {
    console.error('Roster generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate roster', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

