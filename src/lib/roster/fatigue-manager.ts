/**
 * Fatigue Risk Management System (FRMS)
 * Based on Boeing Alertness Model (BAM) and ICAO standards
 */

export interface DutyPeriodForFatigue {
  start_time: Date;
  end_time: Date;
  flight_hours: number;
  duty_hours: number;
  time_zone_crossings: number;
  is_night_duty: boolean;
}

export interface SleepOpportunity {
  start_time: Date;
  end_time: Date;
  duration_hours: number;
  quality_factor: number; // 0-1, based on time of day
}

export interface FatigueScore {
  score: number; // 0-100, higher = more fatigued
  alertness_level: 'high' | 'moderate' | 'low' | 'critical';
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  recommendations: string[];
  calculated_at: Date;
}

export interface CrewFatigueHistory {
  crew_id: number;
  last_7_days_flight_hours: number;
  last_7_days_duty_hours: number;
  last_sleep_period: SleepOpportunity | null;
  consecutive_duty_days: number;
  time_since_last_rest_hours: number;
}

/**
 * Calculate fatigue score using Boeing Alertness Model principles
 */
export function calculateFatigueScore(
  dutyPeriod: DutyPeriodForFatigue,
  history: CrewFatigueHistory
): FatigueScore {
  
  let fatigueScore = 0;
  const recommendations: string[] = [];
  
  // Factor 1: Time of day (circadian rhythm)
  const circadianFactor = calculateCircadianFactor(dutyPeriod.start_time);
  fatigueScore += circadianFactor * 20; // Max 20 points
  
  // Factor 2: Time awake (sleep deprivation)
  const timeAwakeFactor = history.time_since_last_rest_hours / 24;
  fatigueScore += Math.min(timeAwakeFactor * 30, 30); // Max 30 points
  
  // Factor 3: Workload (duty hours)
  const workloadFactor = dutyPeriod.duty_hours / 16; // Normalize to 16-hour max
  fatigueScore += Math.min(workloadFactor * 20, 20); // Max 20 points
  
  // Factor 4: Cumulative fatigue (recent duty)
  const cumulativeFactor = history.last_7_days_duty_hours / 60; // Normalize to 60 hours/week
  fatigueScore += Math.min(cumulativeFactor * 15, 15); // Max 15 points
  
  // Factor 5: Sleep quality
  const sleepQualityFactor = calculateSleepQualityFactor(history.last_sleep_period);
  fatigueScore += (1 - sleepQualityFactor) * 15; // Max 15 points (inverse)
  
  // Determine alertness level
  let alertnessLevel: 'high' | 'moderate' | 'low' | 'critical';
  let riskLevel: 'low' | 'medium' | 'high' | 'critical';
  
  if (fatigueScore < 30) {
    alertnessLevel = 'high';
    riskLevel = 'low';
  } else if (fatigueScore < 50) {
    alertnessLevel = 'moderate';
    riskLevel = 'medium';
    recommendations.push('Monitor crew alertness during flight');
  } else if (fatigueScore < 70) {
    alertnessLevel = 'low';
    riskLevel = 'high';
    recommendations.push('Consider additional rest before duty');
    recommendations.push('Implement fatigue mitigation strategies');
  } else {
    alertnessLevel = 'critical';
    riskLevel = 'critical';
    recommendations.push('CRITICAL: Crew may be unfit for duty');
    recommendations.push('Mandatory rest period required');
    recommendations.push('Consider crew replacement');
  }
  
  // Additional recommendations
  if (dutyPeriod.is_night_duty) {
    recommendations.push('Night duty: Ensure adequate pre-duty rest');
  }
  
  if (dutyPeriod.time_zone_crossings > 3) {
    recommendations.push(`${dutyPeriod.time_zone_crossings} time zones: High jet lag risk`);
  }
  
  if (history.consecutive_duty_days > 5) {
    recommendations.push(`${history.consecutive_duty_days} consecutive days: Schedule rest days`);
  }
  
  return {
    score: Math.round(fatigueScore),
    alertness_level: alertnessLevel,
    risk_level: riskLevel,
    recommendations,
    calculated_at: new Date()
  };
}

/**
 * Calculate circadian rhythm factor (0-1, higher = more fatigue)
 * Based on time of day - humans are naturally less alert 2-6 AM
 */
function calculateCircadianFactor(time: Date): number {
  const hour = time.getHours();
  
  // Window of Circadian Low (WOCL): 2 AM - 6 AM
  if (hour >= 2 && hour < 6) {
    return 1.0; // Highest fatigue
  }
  
  // Early morning: 6 AM - 9 AM
  if (hour >= 6 && hour < 9) {
    return 0.5;
  }
  
  // Daytime: 9 AM - 2 PM
  if (hour >= 9 && hour < 14) {
    return 0.2; // Lowest fatigue
  }
  
  // Afternoon dip: 2 PM - 4 PM
  if (hour >= 14 && hour < 16) {
    return 0.4;
  }
  
  // Evening: 4 PM - 10 PM
  if (hour >= 16 && hour < 22) {
    return 0.3;
  }
  
  // Late night: 10 PM - 2 AM
  return 0.7;
}

/**
 * Calculate sleep quality factor (0-1, higher = better sleep)
 */
function calculateSleepQualityFactor(sleepPeriod: SleepOpportunity | null): number {
  if (!sleepPeriod) {
    return 0; // No sleep = worst quality
  }
  
  // Duration factor
  const durationFactor = Math.min(sleepPeriod.duration_hours / 8, 1); // 8 hours = optimal
  
  // Time of day factor (sleep during night is better quality)
  const timeFactor = sleepPeriod.quality_factor;
  
  // Combined quality
  return (durationFactor * 0.7) + (timeFactor * 0.3);
}

/**
 * Calculate sleep opportunity quality based on time of day
 */
export function calculateSleepQuality(startTime: Date, endTime: Date): number {
  const startHour = startTime.getHours();
  const endHour = endTime.getHours();
  
  // Best sleep: 10 PM - 6 AM
  if (startHour >= 22 || startHour < 6) {
    return 1.0;
  }
  
  // Good sleep: 8 PM - 10 PM or 6 AM - 8 AM
  if ((startHour >= 20 && startHour < 22) || (startHour >= 6 && startHour < 8)) {
    return 0.8;
  }
  
  // Poor sleep: daytime
  return 0.5;
}

/**
 * Predict fatigue for upcoming duty period
 */
export function predictFatigue(
  plannedDuty: DutyPeriodForFatigue,
  currentHistory: CrewFatigueHistory
): FatigueScore {
  
  // Project history forward
  const projectedHistory: CrewFatigueHistory = {
    ...currentHistory,
    time_since_last_rest_hours: currentHistory.time_since_last_rest_hours + 
      ((plannedDuty.start_time.getTime() - new Date().getTime()) / (1000 * 60 * 60))
  };
  
  return calculateFatigueScore(plannedDuty, projectedHistory);
}

/**
 * Check if crew is fit for duty based on fatigue
 */
export function isFitForDuty(fatigueScore: FatigueScore): boolean {
  return fatigueScore.risk_level !== 'critical' && fatigueScore.score < 70;
}

/**
 * Calculate required rest period based on duty
 */
export function calculateRequiredRest(dutyHours: number, isNightDuty: boolean): number {
  // Minimum rest = duty period length (minimum 12 hours)
  let requiredRest = Math.max(dutyHours, 12);
  
  // Night duty requires additional rest
  if (isNightDuty) {
    requiredRest += 2;
  }
  
  // Extended duty requires proportionally more rest
  if (dutyHours > 12) {
    requiredRest += (dutyHours - 12) * 0.5;
  }
  
  return Math.ceil(requiredRest);
}

/**
 * Generate fatigue report for crew
 */
export function generateFatigueReport(
  crewId: number,
  dutyPeriods: DutyPeriodForFatigue[],
  history: CrewFatigueHistory
): {
  crew_id: number;
  total_duty_hours: number;
  average_fatigue_score: number;
  high_risk_periods: number;
  recommendations: string[];
} {
  
  const fatigueScores = dutyPeriods.map(duty => 
    calculateFatigueScore(duty, history)
  );
  
  const totalDutyHours = dutyPeriods.reduce((sum, d) => sum + d.duty_hours, 0);
  const avgFatigueScore = fatigueScores.reduce((sum, s) => sum + s.score, 0) / fatigueScores.length;
  const highRiskPeriods = fatigueScores.filter(s => s.risk_level === 'high' || s.risk_level === 'critical').length;
  
  const allRecommendations = new Set<string>();
  fatigueScores.forEach(s => s.recommendations.forEach(r => allRecommendations.add(r)));
  
  return {
    crew_id: crewId,
    total_duty_hours: totalDutyHours,
    average_fatigue_score: Math.round(avgFatigueScore),
    high_risk_periods: highRiskPeriods,
    recommendations: Array.from(allRecommendations)
  };
}

/**
 * Fatigue monitoring thresholds
 */
export const FATIGUE_THRESHOLDS = {
  LOW_RISK: 30,
  MEDIUM_RISK: 50,
  HIGH_RISK: 70,
  CRITICAL_RISK: 85,
  
  MAX_CONSECUTIVE_DUTY_DAYS: 6,
  MIN_REST_HOURS: 12,
  OPTIMAL_SLEEP_HOURS: 8,
  
  ALERT_SCORE: 60, // Send alert if fatigue score exceeds this
  BLOCK_ASSIGNMENT_SCORE: 75 // Block roster assignment if score exceeds this
};

