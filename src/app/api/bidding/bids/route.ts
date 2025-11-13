import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { validateBid } from '@/lib/roster/bid-processor';

/**
 * POST /api/bidding/bids
 * Submit a new crew bid
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { crew_id, bid_period_id, pairing_id, bid_priority, bid_type = 'preference' } = body;
    
    // Validate required fields
    if (!crew_id || !bid_period_id || !pairing_id || !bid_priority) {
      return NextResponse.json({
        error: 'Missing required fields: crew_id, bid_period_id, pairing_id, bid_priority'
      }, { status: 400 });
    }
    
    // Check if bid period is open
    const bidPeriodResult = await sql`
      SELECT * FROM bid_periods WHERE id = ${bid_period_id}
    `;
    
    if (bidPeriodResult.rows.length === 0) {
      return NextResponse.json({
        error: 'Bid period not found'
      }, { status: 404 });
    }
    
    const bidPeriod = bidPeriodResult.rows[0];
    const now = new Date();
    
    if (now < new Date(bidPeriod.bidding_opens_at) || now > new Date(bidPeriod.bidding_closes_at)) {
      return NextResponse.json({
        error: 'Bidding is not currently open for this period'
      }, { status: 400 });
    }
    
    // Get existing bids for this crew and period
    const existingBidsResult = await sql`
      SELECT * FROM crew_bids
      WHERE crew_id = ${crew_id} AND bid_period_id = ${bid_period_id}
    `;
    
    // Validate bid
    const validation = validateBid(
      { crew_id, pairing_id, bid_priority },
      existingBidsResult.rows as any[]
    );
    
    if (!validation.valid) {
      return NextResponse.json({
        error: 'Bid validation failed',
        details: validation.errors
      }, { status: 400 });
    }
    
    // Insert bid
    const result = await sql`
      INSERT INTO crew_bids (
        bid_period_id, crew_id, pairing_id, bid_priority, bid_type, status
      ) VALUES (
        ${bid_period_id},
        ${crew_id},
        ${pairing_id},
        ${bid_priority},
        ${bid_type},
        'pending'
      )
      RETURNING *
    `;
    
    return NextResponse.json({
      success: true,
      bid: result.rows[0]
    });
    
  } catch (error: any) {
    console.error('Bid submission error:', error);
    return NextResponse.json({
      error: 'Failed to submit bid',
      details: error.message
    }, { status: 500 });
  }
}

/**
 * GET /api/bidding/bids?crew_id=X&bid_period_id=Y
 * Get bids for a crew member in a specific bid period
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const crewId = searchParams.get('crew_id');
    const bidPeriodId = searchParams.get('bid_period_id');
    
    if (!crewId) {
      return NextResponse.json({
        error: 'crew_id parameter is required'
      }, { status: 400 });
    }
    
    let query;
    if (bidPeriodId) {
      query = sql`
        SELECT 
          cb.*,
          p.pairing_code,
          p.start_date,
          p.end_date,
          p.total_duty_hours,
          p.total_flight_hours,
          p.layover_count
        FROM crew_bids cb
        JOIN pairings p ON cb.pairing_id = p.id
        WHERE cb.crew_id = ${crewId}
          AND cb.bid_period_id = ${bidPeriodId}
        ORDER BY cb.bid_priority ASC
      `;
    } else {
      query = sql`
        SELECT 
          cb.*,
          p.pairing_code,
          p.start_date,
          p.end_date,
          bp.month,
          bp.year
        FROM crew_bids cb
        JOIN pairings p ON cb.pairing_id = p.id
        JOIN bid_periods bp ON cb.bid_period_id = bp.id
        WHERE cb.crew_id = ${crewId}
        ORDER BY bp.year DESC, bp.month DESC, cb.bid_priority ASC
      `;
    }
    
    const result = await query;
    
    return NextResponse.json({
      bids: result.rows
    });
    
  } catch (error: any) {
    console.error('Get bids error:', error);
    return NextResponse.json({
      error: 'Failed to get bids',
      details: error.message
    }, { status: 500 });
  }
}

/**
 * DELETE /api/bidding/bids?bid_id=X
 * Delete a bid (only if bidding is still open)
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bidId = searchParams.get('bid_id');
    
    if (!bidId) {
      return NextResponse.json({
        error: 'bid_id parameter is required'
      }, { status: 400 });
    }
    
    // Get bid details
    const bidResult = await sql`
      SELECT cb.*, bp.bidding_closes_at
      FROM crew_bids cb
      JOIN bid_periods bp ON cb.bid_period_id = bp.id
      WHERE cb.id = ${bidId}
    `;
    
    if (bidResult.rows.length === 0) {
      return NextResponse.json({
        error: 'Bid not found'
      }, { status: 404 });
    }
    
    const bid = bidResult.rows[0];
    
    // Check if bidding is still open
    if (new Date() > new Date(bid.bidding_closes_at)) {
      return NextResponse.json({
        error: 'Cannot delete bid after bidding has closed'
      }, { status: 400 });
    }
    
    // Delete bid
    await sql`
      DELETE FROM crew_bids WHERE id = ${bidId}
    `;
    
    return NextResponse.json({
      success: true,
      message: 'Bid deleted successfully'
    });
    
  } catch (error: any) {
    console.error('Delete bid error:', error);
    return NextResponse.json({
      error: 'Failed to delete bid',
      details: error.message
    }, { status: 500 });
  }
}

