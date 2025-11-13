import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { processBids } from '@/lib/roster/bid-processor';

/**
 * POST /api/bidding/process
 * Process all bids for a bid period and award pairings
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bid_period_id } = body;
    
    if (!bid_period_id) {
      return NextResponse.json({
        error: 'bid_period_id is required'
      }, { status: 400 });
    }
    
    const startTime = Date.now();
    
    // Get bid period
    const bidPeriodResult = await sql`
      SELECT * FROM bid_periods WHERE id = ${bid_period_id}
    `;
    
    if (bidPeriodResult.rows.length === 0) {
      return NextResponse.json({
        error: 'Bid period not found'
      }, { status: 404 });
    }
    
    const bidPeriod = bidPeriodResult.rows[0];
    
    // Check if bidding has closed
    if (new Date() <= new Date(bidPeriod.bidding_closes_at)) {
      return NextResponse.json({
        error: 'Cannot process bids before bidding closes'
      }, { status: 400 });
    }
    
    // Update status to processing
    await sql`
      UPDATE bid_periods
      SET processing_status = 'processing'
      WHERE id = ${bid_period_id}
    `;
    
    // Load all bids for this period with crew info
    const bidsResult = await sql`
      SELECT 
        cb.*,
        cp.crew_code,
        cp.english_name,
        cp.seniority_number
      FROM crew_bids cb
      JOIN crew_profiles cp ON cb.crew_id = cp.id
      WHERE cb.bid_period_id = ${bid_period_id}
      ORDER BY cp.seniority_number ASC, cb.bid_priority ASC
    `;
    
    // Group bids by crew
    const crewMap = new Map();
    for (const bid of bidsResult.rows) {
      if (!crewMap.has(bid.crew_id)) {
        crewMap.set(bid.crew_id, {
          id: bid.crew_id,
          crew_code: bid.crew_code,
          english_name: bid.english_name,
          seniority_number: bid.seniority_number,
          bids: []
        });
      }
      crewMap.get(bid.crew_id).bids.push(bid);
    }
    
    const crewWithBids = Array.from(crewMap.values());
    
    // Load available pairings
    const pairingsResult = await sql`
      SELECT * FROM pairings
      WHERE aircraft_type = ${bidPeriod.aircraft_type}
        AND status = 'available'
        AND EXTRACT(MONTH FROM start_date) = ${bidPeriod.month}
        AND EXTRACT(YEAR FROM start_date) = ${bidPeriod.year}
    `;
    
    if (pairingsResult.rows.length === 0) {
      return NextResponse.json({
        error: 'No available pairings found for this period'
      }, { status: 404 });
    }
    
    // Process bids
    const result = await processBids(
      bidPeriod as any,
      crewWithBids,
      pairingsResult.rows as any[]
    );
    
    // Update bid statuses in database
    for (const crew of crewWithBids) {
      for (const bid of crew.bids) {
        await sql`
          UPDATE crew_bids
          SET status = ${bid.status}
          WHERE id = ${bid.id}
        `;
      }
    }
    
    // Create roster assignments from awards
    for (const award of result.awards) {
      // Get or create roster for this crew
      const rosterResult = await sql`
        INSERT INTO rosters (
          roster_code,
          crew_id,
          aircraft_type,
          month,
          year,
          total_flights,
          total_duty_hours,
          total_flight_hours,
          total_credit_hours,
          days_off,
          status
        ) VALUES (
          ${`${crewMap.get(award.crew_id).crew_code}-${bidPeriod.year}${String(bidPeriod.month).padStart(2, '0')}`},
          ${award.crew_id},
          ${bidPeriod.aircraft_type},
          ${bidPeriod.month},
          ${bidPeriod.year},
          0, 0, 0, 0, 0,
          'draft'
        )
        ON CONFLICT (crew_id, month, year) DO UPDATE SET
          updated_at = CURRENT_TIMESTAMP
        RETURNING id
      `;
      
      const rosterId = rosterResult.rows[0].id;
      
      // Add roster assignment
      await sql`
        INSERT INTO roster_assignments (
          roster_id,
          pairing_id,
          assignment_date,
          position,
          status
        ) VALUES (
          ${rosterId},
          ${award.pairing_id},
          ${award.awarded_at.toISOString()},
          'Captain',
          'assigned'
        )
        ON CONFLICT DO NOTHING
      `;
    }
    
    // Update bid period status
    await sql`
      UPDATE bid_periods
      SET processing_status = 'completed'
      WHERE id = ${bid_period_id}
    `;
    
    const processingTime = ((Date.now() - startTime) / 1000).toFixed(2);
    
    return NextResponse.json({
      success: true,
      message: 'Bids processed successfully',
      result: {
        ...result,
        total_processing_time_seconds: parseFloat(processingTime)
      }
    });
    
  } catch (error: any) {
    console.error('Bid processing error:', error);
    
    // Reset processing status on error
    if (request.body) {
      const body = await request.json();
      if (body.bid_period_id) {
        await sql`
          UPDATE bid_periods
          SET processing_status = 'pending'
          WHERE id = ${body.bid_period_id}
        `;
      }
    }
    
    return NextResponse.json({
      error: 'Failed to process bids',
      details: error.message
    }, { status: 500 });
  }
}

