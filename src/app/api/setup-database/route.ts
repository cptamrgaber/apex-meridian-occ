import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import fs from 'fs';
import path from 'path';

/**
 * Database Setup API
 * POST /api/setup-database
 * 
 * Initializes the complete rostering system database
 * WARNING: This will drop and recreate all tables!
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, confirmToken } = body;
    
    // Security: Require confirmation token
    if (confirmToken !== 'INITIALIZE_DATABASE_2025') {
      return NextResponse.json({
        error: 'Invalid confirmation token. This operation requires explicit confirmation.'
      }, { status: 403 });
    }
    
    const results: any = {
      timestamp: new Date().toISOString(),
      action,
      steps: []
    };
    
    // Step 1: Execute schema migration
    if (action === 'create_schema' || action === 'full_setup') {
      results.steps.push({ step: 'create_schema', status: 'starting' });
      
      try {
        // Read the SQL schema file
        const schemaPath = path.join(process.cwd(), 'database', '001_rostering_complete_schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
        
        // Execute the schema (Note: This is a simplified version)
        // In production, you'd want to split this into individual statements
        await sql.query(schemaSql);
        
        results.steps.push({ 
          step: 'create_schema', 
          status: 'completed',
          message: 'Database schema created successfully'
        });
      } catch (error: any) {
        results.steps.push({ 
          step: 'create_schema', 
          status: 'failed',
          error: error.message
        });
        throw error;
      }
    }
    
    // Step 2: Import data
    if (action === 'import_data' || action === 'full_setup') {
      results.steps.push({ step: 'import_data', status: 'starting' });
      
      try {
        // Import aircraft
        const aircraftData = JSON.parse(
          fs.readFileSync(path.join(process.cwd(), 'src', 'data', 'egyptair_aircraft.json'), 'utf-8')
        );
        
        let aircraftCount = 0;
        for (const ac of aircraftData) {
          await sql`
            INSERT INTO aircraft (
              registration, aircraft_type, manufacturer, variant, msn, status
            ) VALUES (
              ${ac.registration},
              ${ac.type || ac.aircraft_type},
              ${ac.manufacturer},
              ${ac.variant || ''},
              ${ac.msn || ac.serial_number || ''},
              ${ac.status || 'active'}
            )
            ON CONFLICT (registration) DO NOTHING
          `;
          aircraftCount++;
        }
        
        results.steps.push({
          step: 'import_aircraft',
          status: 'completed',
          count: aircraftCount
        });
        
        // Import airports
        const airportsData = JSON.parse(
          fs.readFileSync(path.join(process.cwd(), 'src', 'data', 'egyptair_airports_complete.json'), 'utf-8')
        );
        
        let airportsCount = 0;
        for (const ap of airportsData) {
          await sql`
            INSERT INTO airports (
              iata_code, icao_code, airport_name, city, country, region, classification
            ) VALUES (
              ${ap.iata_code || ap.iata},
              ${ap.icao_code || ap.icao},
              ${ap.airport_name || ap.name},
              ${ap.city},
              ${ap.country},
              ${ap.region || ''},
              ${ap.classification || 'International'}
            )
            ON CONFLICT (iata_code) DO NOTHING
          `;
          airportsCount++;
        }
        
        results.steps.push({
          step: 'import_airports',
          status: 'completed',
          count: airportsCount
        });
        
        // Import flights
        const flightsData = JSON.parse(
          fs.readFileSync(path.join(process.cwd(), 'src', 'data', 'egyptair_flights_verified.json'), 'utf-8')
        );
        
        let flightsCount = 0;
        for (const flight of flightsData.slice(0, 100)) { // Limit for performance
          try {
            await sql`
              INSERT INTO flights (
                flight_number, aircraft_type, origin_iata, destination_iata,
                departure_time, arrival_time, flight_duration_minutes, status
              ) VALUES (
                ${flight.flight_number || flight.flightNumber},
                ${flight.aircraft_type || flight.aircraftType},
                ${flight.origin || flight.origin_iata},
                ${flight.destination || flight.destination_iata},
                ${flight.departure_time || flight.departureTime || '00:00'},
                ${flight.arrival_time || flight.arrivalTime || '00:00'},
                ${flight.duration || flight.flight_duration_minutes || 0},
                ${flight.status || 'scheduled'}
              )
            `;
            flightsCount++;
          } catch (e) {
            // Skip duplicates
          }
        }
        
        results.steps.push({
          step: 'import_flights',
          status: 'completed',
          count: flightsCount
        });
        
        // Import captains (limited batch for performance)
        const captainsData = JSON.parse(
          fs.readFileSync(path.join(process.cwd(), 'src', 'data', 'egyptair_captains_full.json'), 'utf-8')
        );
        
        let captainsCount = 0;
        for (const captain of captainsData.slice(0, 50)) { // First 50 for initial setup
          try {
            const result = await sql`
              INSERT INTO crew_profiles (
                crew_code, english_name, arabic_name,
                date_of_birth, nationality, base_airport, rank,
                hire_date, total_flight_hours, status
              ) VALUES (
                ${captain.id || captain.code || `CREW${captainsCount + 1}`},
                ${captain.english_name || captain.englishName || captain.name || 'Unknown'},
                ${captain.arabic_name || captain.arabicName || ''},
                ${captain.date_of_birth || captain.dateOfBirth || captain.birth_date || '1980-01-01'},
                ${captain.nationality || 'Egyptian'},
                ${captain.base || captain.base_airport || 'CAI'},
                ${captain.rank || captain.role || 'Captain'},
                ${captain.hire_date || captain.hireDate || captain.joining_date || '2010-01-01'},
                ${captain.total_hours || captain.totalFlightHours || 0},
                ${captain.status || 'active'}
              )
              RETURNING id
            `;
            
            const crewId = result.rows[0].id;
            
            // Add qualification
            await sql`
              INSERT INTO crew_qualifications (
                crew_id, aircraft_type, qualification_type,
                qualified_since, hours_on_type, status
              ) VALUES (
                ${crewId},
                ${captain.aircraft_type || captain.aircraftType || 'A320neo'},
                'PIC',
                ${captain.hire_date || '2010-01-01'},
                ${captain.hours_on_type || captain.total_hours || 1000},
                'current'
              )
            `;
            
            captainsCount++;
          } catch (e) {
            // Skip duplicates or errors
          }
        }
        
        results.steps.push({
          step: 'import_captains',
          status: 'completed',
          count: captainsCount,
          note: 'Initial batch imported. Use full import script for all 541 captains.'
        });
        
        results.steps.push({ 
          step: 'import_data', 
          status: 'completed',
          summary: {
            aircraft: aircraftCount,
            airports: airportsCount,
            flights: flightsCount,
            captains: captainsCount
          }
        });
        
      } catch (error: any) {
        results.steps.push({ 
          step: 'import_data', 
          status: 'failed',
          error: error.message
        });
        throw error;
      }
    }
    
    // Step 3: Verify setup
    results.steps.push({ step: 'verify', status: 'starting' });
    
    try {
      const counts = await sql`
        SELECT 
          (SELECT COUNT(*) FROM aircraft) as aircraft,
          (SELECT COUNT(*) FROM airports) as airports,
          (SELECT COUNT(*) FROM flights) as flights,
          (SELECT COUNT(*) FROM crew_profiles) as crew,
          (SELECT COUNT(*) FROM crew_qualifications) as qualifications,
          (SELECT COUNT(*) FROM duty_regulations) as regulations
      `;
      
      results.steps.push({
        step: 'verify',
        status: 'completed',
        counts: counts.rows[0]
      });
      
      results.status = 'success';
      results.message = 'Database setup completed successfully!';
      
    } catch (error: any) {
      results.steps.push({
        step: 'verify',
        status: 'failed',
        error: error.message
      });
    }
    
    return NextResponse.json(results);
    
  } catch (error: any) {
    console.error('Database setup error:', error);
    return NextResponse.json({
      status: 'error',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}

// GET endpoint to check database status
export async function GET() {
  try {
    const counts = await sql`
      SELECT 
        (SELECT COUNT(*) FROM aircraft) as aircraft,
        (SELECT COUNT(*) FROM airports) as airports,
        (SELECT COUNT(*) FROM flights) as flights,
        (SELECT COUNT(*) FROM crew_profiles) as crew,
        (SELECT COUNT(*) FROM crew_qualifications) as qualifications,
        (SELECT COUNT(*) FROM rosters) as rosters,
        (SELECT COUNT(*) FROM pairings) as pairings
    `;
    
    return NextResponse.json({
      status: 'ok',
      database: 'connected',
      counts: counts.rows[0],
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      database: 'not_initialized',
      error: error.message
    }, { status: 500 });
  }
}

