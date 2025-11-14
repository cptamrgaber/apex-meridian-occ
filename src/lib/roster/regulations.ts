/**
 * Aviation Duty Time Regulations Compliance Checker
 * Implements ECAA, EASA ORO.FTL, and ICAO Annex 6 requirements
 */

export interface DutyPeriod {
  start: Date;
  end: Date;
  flight_time: number; // minutes
  duty_time: number; // minutes
  sectors: number;
  rest_before: number; // minutes
  rest_after: number; // minutes
}

export interface CrewDutyHistory {
  crew_id: number;
  last_28_days_flight_time: number; // minutes
  last_365_days_flight_time: number; // minutes
  consecutive_duty_days: number;
  last_duty_end: Date | null;
  recent_duties: DutyPeriod[];
}

export interface RegulationLimits {
  max_flight_time_28_days: number;
  max_flight_time_365_days: number;
  max_flight_time_per_duty: number;
  max_duty_time_single_sector: number;
  max_duty_time_multi_sector: number;
  min_rest_between_duties: number;
  min_rest_after_long_duty: number;
  max_consecutive_duty_days: number;
  min_days_off_per_week: number;
  min_days_off_per_month: number;
}

export const STANDARD_LIMITS: RegulationLimits = {
  max_flight_time_28_days: 6000,
  max_flight_time_365_days: 54000,
  max_flight_time_per_duty: 780,
  max_duty_time_single_sector: 780,
  max_duty_time_multi_sector: 840,
  min_rest_between_duties: 720,
  min_rest_after_long_duty: 840,
  max_consecutive_duty_days: 6,
  min_days_off_per_week: 1,
  min_days_off_per_month: 4,
};

export interface ComplianceResult {
  compliant: boolean;
  violations: string[];
  warnings: string[];
}

export function checkDutyCompliance(
  proposedDuty: DutyPeriod,
  crewHistory: CrewDutyHistory,
  limits: RegulationLimits = STANDARD_LIMITS
): ComplianceResult {
  const violations: string[] = [];
  const warnings: string[] = [];
  
  // Check flight time limits
  const new_28_day_total = crewHistory.last_28_days_flight_time + proposedDuty.flight_time;
  if (new_28_day_total > limits.max_flight_time_28_days) {
    violations.push(`Exceeds 28-day flight time limit`);
  }
  
  // Check duty time
  const max_duty = proposedDuty.sectors === 1 ? limits.max_duty_time_single_sector : limits.max_duty_time_multi_sector;
  if (proposedDuty.duty_time > max_duty) {
    violations.push(`Exceeds duty time limit`);
  }
  
  // Check rest
  if (proposedDuty.rest_before < limits.min_rest_between_duties) {
    violations.push(`Insufficient rest before duty`);
  }
  
  return {
    compliant: violations.length === 0,
    violations,
    warnings,
  };
}

export function calculateRequiredRest(duty: DutyPeriod, limits: RegulationLimits = STANDARD_LIMITS): number {
  let requiredRest = limits.min_rest_between_duties;
  if (duty.duty_time > 720) {
    requiredRest = Math.max(requiredRest, limits.min_rest_after_long_duty);
  }
  return requiredRest;
}

export function isQualifiedForAircraft(crewQualifications: string[], aircraftType: string): boolean {
  return crewQualifications.includes(aircraftType);
}
