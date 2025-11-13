import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { generateBidPeriodCode } from '@/lib/roster/bid-processor';

/**
 * POST /api/bidding/periods
 * Create a new bid period
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { month, year, aircraft_type, bidding_opens_at, bidding_closes_at } = body;
    
    // Validate required fields
    if (!month || !year || !aircraft_type || !bidding_opens_at || !bidding_closes_at) {
      return NextResponse.json({
        error: 'Missing required fields'
      }, { status: 400 });
    }
    
    // Generate period code
    const periodCode = generateBidPeriodCode(aircraft_type, month, year);
    
    // Create bid period
    const result = await sql`
      INSERT INTO bid_periods (
        period_code, month, year, aircraft_type,
        bidding_opens_at, bidding_closes_at, processing_status
      ) VALUES (
        ${periodCode},
        ${month},
        ${year},
        ${aircraft_type},
        ${bidding_opens_at},
        ${bidding_closes_at},
        'pending'
      )
      ON CONFLICT (month, year, aircraft_type) DO UPDATE SET
        bidding_opens_at = EXCLUDED.bidding_opens_at,
        bidding_closes_at = EXCLUDED.bidding_closes_at,
        processing_status = 'pending'
      RETURNING *
    `;
    
    return NextResponse.json({
      success: true,
      bid_period: result.rows[0]
    });
    
  } catch (error: any) {
    console.error('Create bid period error:', error);
    return NextResponse.json({
      error: 'Failed to create bid period',
      details: error.message
    }, { status: 500 });
  }
}

/**
 * GET /api/bidding/periods
 * List all bid periods
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const aircraftType = searchParams.get('aircraft_type');
    
    let query = `
      SELECT 
        bp.*,
        COUNT(DISTINCT cb.crew_id) as total_bidders,
        COUNT(cb.id) as total_bids
      FROM bid_periods bp
      LEFT JOIN crew_bids cb ON bp.id = cb.bid_period_id
    `;
    
    const conditions: string[] = [];
    const params: any[] = [];
    
    if (status) {
      conditions.push(`bp.processing_status = $${params.length + 1}`);
      params.push(status);
    }
    
    if (aircraftType) {
      conditions.push(`bp.aircraft_type = $${params.length + 1}`);
      params.push(aircraftType);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += `
      GROUP BY bp.id
      ORDER BY bp.year DESC, bp.month DESC
    `;
    
    const result = await sql.query(query, params);
    
    return NextResponse.json({
      bid_periods: result.rows
    });
    
  } catch (error: any) {
    console.error('Get bid periods error:', error);
    return NextResponse.json({
      error: 'Failed to get bid periods',
      details: error.message
    }, { status: 500 });
  }
}

