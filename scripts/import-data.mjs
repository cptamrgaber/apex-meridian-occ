#!/usr/bin/env node

/**
 * EgyptAir Data Import Script
 * Imports all operational data into the rostering system database
 * 
 * Usage: node scripts/import-data.mjs
 */

import { sql } from '@vercel/postgres';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

function log(message) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

function logSuccess(message) {
  console.log(`✅ ${message}`);
}

function logError(message, error) {
  console.error(`❌ ${message}`);
  if (error) console.error(error);
}

function loadJSON(filename) {
  const filepath = path.join(__dirname, '..', 'src', 'data', filename);
  log(`Loading ${filename}...`);
  const data = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
  logSuccess(`Loaded ${filename}: ${Array.isArray(data) ? data.length : 'N/A'} records`);
  return data;
}

// =====================================================
// IMPORT FUNCTIONS
// =====================================================

async function importAircraft() {
  log('Importing aircraft...');
  const aircraft = loadJSON('egyptair_aircraft.json');
  
  let imported = 0;
  for (const ac of aircraft) {
    try {
      await sql`
        INSERT INTO aircraft (
          registration, aircraft_type, manufacturer, variant, msn,
          status, delivery_date, home_base, current_location,
          seating_capacity, cargo_capacity_kg, range_km,
          cruise_speed_kmh, service_ceiling_m, mtow_kg, fuel_capacity_liters
        ) VALUES (
          ${ac.registration},
          ${ac.type || ac.aircraft_type},
          ${ac.manufacturer},
          ${ac.variant || ''},
          ${ac.msn || ac.serial_number || ''},
          ${ac.status || 'active'},
          ${ac.delivery_date || ac.deliveryDate || null},
          ${ac.home_base || ac.homeBase || 'CAI'},
          ${ac.current_location || ac.currentLocation || 'CAI'},
          ${ac.seating_capacity || ac.seatingCapacity || null},
          ${ac.cargo_capacity_kg || null},
          ${ac.range_km || ac.range || null},
          ${ac.cruise_speed_kmh || ac.cruiseSpeed || null},
          ${ac.service_ceiling_m || null},
          ${ac.mtow_kg || null},
          ${ac.fuel_capacity_liters || ac.fuelCapacity || null}
        )
        ON CONFLICT (registration) DO UPDATE SET
          aircraft_type = EXCLUDED.aircraft_type,
          status = EXCLUDED.status
      `;
      imported++;
    } catch (error) {
      logError(`Failed to import aircraft ${ac.registration}`, error);
    }
  }
  
  logSuccess(`Imported ${imported}/${aircraft.length} aircraft`);
  return imported;
}

async function importAirports() {
  log('Importing airports...');
  const airports = loadJSON('egyptair_airports_complete.json');
  
  let imported = 0;
  for (const ap of airports) {
    try {
      await sql`
        INSERT INTO airports (
          iata_code, icao_code, airport_name, city, country,
          region, classification
        ) VALUES (
          ${ap.iata_code || ap.iata},
          ${ap.icao_code || ap.icao},
          ${ap.airport_name || ap.name},
          ${ap.city},
          ${ap.country},
          ${ap.region || ''},
          ${ap.classification || 'International'}
        )
        ON CONFLICT (iata_code) DO UPDATE SET
          airport_name = EXCLUDED.airport_name,
          classification = EXCLUDED.classification
      `;
      imported++;
    } catch (error) {
      logError(`Failed to import airport ${ap.iata_code}`, error);
    }
  }
  
  logSuccess(`Imported ${imported}/${airports.length} airports`);
  return imported;
}

async function importFlights() {
  log('Importing flights...');
  const flights = loadJSON('egyptair_flights_verified.json');
  
  let imported = 0;
  for (const flight of flights) {
    try {
      await sql`
        INSERT INTO flights (
          flight_number, callsign, aircraft_type,
          origin_iata, destination_iata,
          departure_time, arrival_time, flight_duration_minutes,
          distance_km, status
        ) VALUES (
          ${flight.flight_number || flight.flightNumber},
          ${flight.callsign || flight.flight_number},
          ${flight.aircraft_type || flight.aircraftType},
          ${flight.origin || flight.origin_iata},
          ${flight.destination || flight.destination_iata},
          ${flight.departure_time || flight.departureTime || '00:00'},
          ${flight.arrival_time || flight.arrivalTime || '00:00'},
          ${flight.duration || flight.flight_duration_minutes || 0},
          ${flight.distance || flight.distance_km || 0},
          ${flight.status || 'scheduled'}
        )
      `;
      imported++;
    } catch (error) {
      logError(`Failed to import flight ${flight.flight_number}`, error);
    }
  }
  
  logSuccess(`Imported ${imported}/${flights.length} flights`);
  return imported;
}

async function importCaptains() {
  log('Importing captains...');
  const captains = loadJSON('egyptair_captains_full.json');
  
  let imported = 0;
  for (const captain of captains) {
    try {
      // Insert crew profile
      const result = await sql`
        INSERT INTO crew_profiles (
          crew_code, arabic_name, english_name, passport_name,
          date_of_birth, nationality, base_airport, rank,
          seniority_number, hire_date, total_flight_hours,
          phone, email, status
        ) VALUES (
          ${captain.id || captain.code || `CREW${imported + 1}`},
          ${captain.arabic_name || captain.arabicName || ''},
          ${captain.english_name || captain.englishName || captain.name || 'Unknown'},
          ${captain.passport_name || captain.passportName || ''},
          ${captain.date_of_birth || captain.dateOfBirth || captain.birth_date || '1980-01-01'},
          ${captain.nationality || 'Egyptian'},
          ${captain.base || captain.base_airport || 'CAI'},
          ${captain.rank || captain.role || 'Captain'},
          ${captain.seniority || captain.seniority_number || null},
          ${captain.hire_date || captain.hireDate || captain.joining_date || '2010-01-01'},
          ${captain.total_hours || captain.totalFlightHours || 0},
          ${captain.phone || ''},
          ${captain.email || ''},
          ${captain.status || 'active'}
        )
        RETURNING id
      `;
      
      const crewId = result.rows[0].id;
      
      // Add qualification for aircraft type
      const aircraftType = captain.aircraft_type || captain.aircraftType || 'A320neo';
      await sql`
        INSERT INTO crew_qualifications (
          crew_id, aircraft_type, qualification_type,
          qualified_since, hours_on_type, status
        ) VALUES (
          ${crewId},
          ${aircraftType},
          'PIC',
          ${captain.hire_date || '2010-01-01'},
          ${captain.hours_on_type || captain.total_hours || 1000},
          'current'
        )
        ON CONFLICT (crew_id, aircraft_type, qualification_type) DO NOTHING
      `;
      
      // Add license
      await sql`
        INSERT INTO crew_licenses (
          crew_id, license_type, license_number,
          issuing_authority, issue_date, expiry_date, status
        ) VALUES (
          ${crewId},
          'ATPL',
          ${captain.license || captain.license_number || `LIC${crewId}`},
          'ECAA',
          ${captain.license_issue_date || '2010-01-01'},
          ${captain.license_expiry || captain.license_expiry_date || '2030-12-31'},
          'valid'
        )
      `;
      
      // Add medical certificate
      await sql`
        INSERT INTO crew_medical_records (
          crew_id, medical_class, certificate_number,
          issue_date, expiry_date, status
        ) VALUES (
          ${crewId},
          'Class 1',
          ${`MED${crewId}`},
          ${captain.medical_issue_date || '2024-01-01'},
          ${captain.medical_expiry || captain.medical_expiry_date || '2025-12-31'},
          'valid'
        )
      `;
      
      imported++;
    } catch (error) {
      logError(`Failed to import captain ${captain.english_name || captain.id}`, error);
    }
  }
  
  logSuccess(`Imported ${imported}/${captains.length} captains with qualifications, licenses, and medical records`);
  return imported;
}

// =====================================================
// MAIN IMPORT PROCESS
// =====================================================

async function main() {
  log('========================================');
  log('EgyptAir Data Import Started');
  log('========================================');
  
  const startTime = Date.now();
  const stats = {
    aircraft: 0,
    airports: 0,
    flights: 0,
    captains: 0
  };
  
  try {
    // Import in order (respecting foreign key dependencies)
    stats.aircraft = await importAircraft();
    stats.airports = await importAirports();
    stats.flights = await importFlights();
    stats.captains = await importCaptains();
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    
    log('========================================');
    log('Import Summary:');
    log(`  Aircraft: ${stats.aircraft}`);
    log(`  Airports: ${stats.airports}`);
    log(`  Flights: ${stats.flights}`);
    log(`  Captains: ${stats.captains} (with qualifications, licenses, medical)`);
    log(`  Duration: ${duration}s`);
    log('========================================');
    logSuccess('Data import completed successfully!');
    
  } catch (error) {
    logError('Import failed', error);
    process.exit(1);
  }
}

// Run the import
main().catch(error => {
  logError('Fatal error', error);
  process.exit(1);
});

