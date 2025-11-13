/**
 * Preferential Bidding System (PBS) - Bid Processing Engine
 * Awards pairings to crew based on seniority and preferences
 */

import { Pairing } from './pairing-generator';
import { checkDutyCompliance, CrewDutyHistory, DutyPeriod } from './regulations';

export interface CrewBid {
  id: number;
  bid_period_id: number;
  crew_id: number;
  pairing_id: number;
  bid_priority: number; // 1 = highest priority
  bid_type: 'preference' | 'avoid';
  status: 'pending' | 'awarded' | 'denied';
}

export interface BidPeriod {
  id: number;
  period_code: string;
  month: number;
  year: number;
  aircraft_type: string;
  bidding_opens_at: Date;
  bidding_closes_at: Date;
  processing_status: 'pending' | 'processing' | 'completed';
}

export interface CrewWithBids {
  id: number;
  crew_code: string;
  english_name: string;
  seniority_number: number;
  bids: CrewBid[];
}

export interface BidAward {
  crew_id: number;
  pairing_id: number;
  bid_id: number;
  awarded_at: Date;
}

export interface BidProcessingResult {
  total_bids: number;
  awarded_bids: number;
  denied_bids: number;
  awards: BidAward[];
  unassigned_pairings: number[];
  processing_time_ms: number;
  errors: string[];
}

/**
 * Process all bids for a bid period
 */
export async function processBids(
  bidPeriod: BidPeriod,
  crewWithBids: CrewWithBids[],
  availablePairings: Pairing[]
): Promise<BidProcessingResult> {
  
  const startTime = Date.now();
  const awards: BidAward[] = [];
  const errors: string[] = [];
  
  // Create a map of available pairings
  const pairingMap = new Map<number, Pairing>();
  availablePairings.forEach(p => {
    if ((p as any).id) {
      pairingMap.set((p as any).id, p);
    }
  });
  
  // Sort crew by seniority (lowest number = highest seniority)
  const sortedCrew = [...crewWithBids].sort((a, b) => 
    (a.seniority_number || 9999) - (b.seniority_number || 9999)
  );
  
  // Track awarded pairings per crew
  const crewAwards = new Map<number, Set<number>>();
  
  // Process each crew member in seniority order
  for (const crew of sortedCrew) {
    // Initialize crew awards tracking
    if (!crewAwards.has(crew.id)) {
      crewAwards.set(crew.id, new Set());
    }
    
    const crewPairings = crewAwards.get(crew.id)!;
    
    // Sort crew's bids by priority
    const sortedBids = [...crew.bids]
      .filter(b => b.bid_type === 'preference') // Only process preference bids
      .sort((a, b) => a.bid_priority - b.bid_priority);
    
    // Initialize crew duty history
    const crewHistory: CrewDutyHistory = {
      daily_flight_hours: 0,
      weekly_flight_hours: 0,
      monthly_flight_hours: 0,
      yearly_flight_hours: 0,
      consecutive_duty_days: 0,
      days_off_this_week: 0,
      days_off_this_month: 0,
      last_rest_period_hours: 12
    };
    
    // Process each bid
    for (const bid of sortedBids) {
      // Check if pairing is still available
      if (!pairingMap.has(bid.pairing_id)) {
        bid.status = 'denied';
        continue;
      }
      
      const pairing = pairingMap.get(bid.pairing_id)!;
      
      // Check if pairing conflicts with already awarded pairings
      if (hasConflict(pairing, Array.from(crewPairings).map(id => pairingMap.get(id)!))) {
        bid.status = 'denied';
        continue;
      }
      
      // Check duty compliance
      const dutyPeriod: DutyPeriod = {
        start_time: pairing.start_date,
        end_time: pairing.end_date,
        flight_time_hours: pairing.total_flight_hours,
        duty_time_hours: pairing.total_duty_hours,
        is_night_duty: isNightDuty(pairing.start_date)
      };
      
      const compliance = checkDutyCompliance(dutyPeriod, crewHistory);
      
      if (!compliance.compliant) {
        bid.status = 'denied';
        errors.push(`Crew ${crew.crew_code} bid ${bid.id} denied: ${compliance.violations.join(', ')}`);
        continue;
      }
      
      // Award the pairing
      bid.status = 'awarded';
      crewPairings.add(bid.pairing_id);
      pairingMap.delete(bid.pairing_id); // Remove from available
      
      awards.push({
        crew_id: crew.id,
        pairing_id: bid.pairing_id,
        bid_id: bid.id,
        awarded_at: new Date()
      });
      
      // Update crew history
      crewHistory.monthly_flight_hours += pairing.total_flight_hours;
      crewHistory.yearly_flight_hours += pairing.total_flight_hours;
    }
    
    // Mark remaining bids as denied
    crew.bids.forEach(bid => {
      if (bid.status === 'pending') {
        bid.status = 'denied';
      }
    });
  }
  
  // Count results
  const allBids = crewWithBids.flatMap(c => c.bids);
  const awardedCount = allBids.filter(b => b.status === 'awarded').length;
  const deniedCount = allBids.filter(b => b.status === 'denied').length;
  const unassignedPairings = Array.from(pairingMap.keys());
  
  const processingTime = Date.now() - startTime;
  
  return {
    total_bids: allBids.length,
    awarded_bids: awardedCount,
    denied_bids: deniedCount,
    awards,
    unassigned_pairings,
    processing_time_ms: processingTime,
    errors
  };
}

/**
 * Check if a pairing conflicts with already awarded pairings
 */
function hasConflict(newPairing: Pairing, awardedPairings: Pairing[]): boolean {
  for (const awarded of awardedPairings) {
    // Check for date overlap
    if (
      (newPairing.start_date >= awarded.start_date && newPairing.start_date <= awarded.end_date) ||
      (newPairing.end_date >= awarded.start_date && newPairing.end_date <= awarded.end_date) ||
      (newPairing.start_date <= awarded.start_date && newPairing.end_date >= awarded.end_date)
    ) {
      return true; // Conflict found
    }
  }
  
  return false; // No conflict
}

/**
 * Check if time is during night hours
 */
function isNightDuty(time: Date): boolean {
  const hour = time.getHours();
  return hour >= 22 || hour < 6;
}

/**
 * Validate bid before submission
 */
export function validateBid(
  bid: Partial<CrewBid>,
  existingBids: CrewBid[],
  maxBids: number = 50
): { valid: boolean; errors: string[] } {
  
  const errors: string[] = [];
  
  // Check required fields
  if (!bid.crew_id) errors.push('Crew ID is required');
  if (!bid.pairing_id) errors.push('Pairing ID is required');
  if (!bid.bid_priority || bid.bid_priority < 1) errors.push('Valid bid priority is required');
  
  // Check max bids limit
  if (existingBids.length >= maxBids) {
    errors.push(`Maximum ${maxBids} bids allowed per crew`);
  }
  
  // Check for duplicate pairing
  const duplicate = existingBids.find(b => b.pairing_id === bid.pairing_id);
  if (duplicate) {
    errors.push('Pairing already bid');
  }
  
  // Check for duplicate priority
  const duplicatePriority = existingBids.find(b => b.bid_priority === bid.bid_priority);
  if (duplicatePriority) {
    errors.push(`Priority ${bid.bid_priority} already used`);
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Calculate bid statistics
 */
export function calculateBidStats(bids: CrewBid[]) {
  const total = bids.length;
  const awarded = bids.filter(b => b.status === 'awarded').length;
  const denied = bids.filter(b => b.status === 'denied').length;
  const pending = bids.filter(b => b.status === 'pending').length;
  
  const awardRate = total > 0 ? (awarded / total) * 100 : 0;
  
  return {
    total_bids: total,
    awarded_bids: awarded,
    denied_bids: denied,
    pending_bids: pending,
    award_rate_percentage: awardRate.toFixed(1)
  };
}

/**
 * Generate bid period code
 */
export function generateBidPeriodCode(
  aircraftType: string,
  month: number,
  year: number
): string {
  const monthStr = String(month).padStart(2, '0');
  return `BID-${aircraftType}-${year}${monthStr}`;
}

/**
 * Check if bidding is open
 */
export function isBiddingOpen(bidPeriod: BidPeriod): boolean {
  const now = new Date();
  return now >= bidPeriod.bidding_opens_at && now <= bidPeriod.bidding_closes_at;
}

/**
 * Check if bidding has closed
 */
export function isBiddingClosed(bidPeriod: BidPeriod): boolean {
  const now = new Date();
  return now > bidPeriod.bidding_closes_at;
}

