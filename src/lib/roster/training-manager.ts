/**
 * Training & Qualifications Management System
 * Tracks crew qualifications, licenses, medical certificates, and training
 */

export interface CrewQualification {
  id: number;
  crew_id: number;
  aircraft_type: string;
  qualification_type: 'type_rating' | 'pic' | 'instructor' | 'examiner';
  issue_date: Date;
  expiry_date: Date;
  status: 'current' | 'expiring_soon' | 'expired';
}

export interface CrewLicense {
  id: number;
  crew_id: number;
  license_number: string;
  license_type: 'atpl' | 'cpl' | 'mpl';
  issuing_authority: string;
  issue_date: Date;
  expiry_date: Date;
  status: 'current' | 'expiring_soon' | 'expired';
}

export interface MedicalCertificate {
  id: number;
  crew_id: number;
  certificate_number: string;
  class: 'class_1' | 'class_2';
  issue_date: Date;
  expiry_date: Date;
  restrictions: string | null;
  status: 'current' | 'expiring_soon' | 'expired';
}

export interface TrainingRecord {
  id: number;
  crew_id: number;
  training_type: 'initial' | 'recurrent' | 'upgrade' | 'differences' | 'emergency';
  aircraft_type: string | null;
  training_date: Date;
  completion_date: Date | null;
  next_due_date: Date | null;
  status: 'scheduled' | 'in_progress' | 'completed' | 'overdue';
  instructor_id: number | null;
  score: number | null;
  notes: string | null;
}

export interface ExpiryAlert {
  item_type: 'qualification' | 'license' | 'medical' | 'training';
  item_id: number;
  crew_id: number;
  crew_name: string;
  description: string;
  expiry_date: Date;
  days_until_expiry: number;
  severity: 'info' | 'warning' | 'critical';
  action_required: string;
}

/**
 * Check qualification status based on expiry date
 */
export function checkQualificationStatus(expiryDate: Date): 'current' | 'expiring_soon' | 'expired' {
  const now = new Date();
  const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysUntilExpiry < 0) {
    return 'expired';
  } else if (daysUntilExpiry <= 60) {
    return 'expiring_soon';
  } else {
    return 'current';
  }
}

/**
 * Generate expiry alerts for crew
 */
export function generateExpiryAlerts(
  qualifications: CrewQualification[],
  licenses: CrewLicense[],
  medicals: MedicalCertificate[],
  trainings: TrainingRecord[]
): ExpiryAlert[] {
  
  const alerts: ExpiryAlert[] = [];
  const now = new Date();
  
  // Check qualifications
  for (const qual of qualifications) {
    const daysUntilExpiry = Math.ceil((qual.expiry_date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry <= 90 && daysUntilExpiry > 0) {
      alerts.push({
        item_type: 'qualification',
        item_id: qual.id,
        crew_id: qual.crew_id,
        crew_name: '', // To be filled by caller
        description: `${qual.aircraft_type} ${qual.qualification_type} qualification`,
        expiry_date: qual.expiry_date,
        days_until_expiry: daysUntilExpiry,
        severity: daysUntilExpiry <= 30 ? 'critical' : daysUntilExpiry <= 60 ? 'warning' : 'info',
        action_required: 'Schedule recurrent training'
      });
    } else if (daysUntilExpiry <= 0) {
      alerts.push({
        item_type: 'qualification',
        item_id: qual.id,
        crew_id: qual.crew_id,
        crew_name: '',
        description: `${qual.aircraft_type} ${qual.qualification_type} qualification`,
        expiry_date: qual.expiry_date,
        days_until_expiry: daysUntilExpiry,
        severity: 'critical',
        action_required: 'EXPIRED - Remove from roster immediately'
      });
    }
  }
  
  // Check licenses
  for (const license of licenses) {
    const daysUntilExpiry = Math.ceil((license.expiry_date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry <= 90 && daysUntilExpiry > 0) {
      alerts.push({
        item_type: 'license',
        item_id: license.id,
        crew_id: license.crew_id,
        crew_name: '',
        description: `${license.license_type.toUpperCase()} License ${license.license_number}`,
        expiry_date: license.expiry_date,
        days_until_expiry: daysUntilExpiry,
        severity: daysUntilExpiry <= 30 ? 'critical' : daysUntilExpiry <= 60 ? 'warning' : 'info',
        action_required: 'Renew license with authority'
      });
    } else if (daysUntilExpiry <= 0) {
      alerts.push({
        item_type: 'license',
        item_id: license.id,
        crew_id: license.crew_id,
        crew_name: '',
        description: `${license.license_type.toUpperCase()} License ${license.license_number}`,
        expiry_date: license.expiry_date,
        days_until_expiry: daysUntilExpiry,
        severity: 'critical',
        action_required: 'EXPIRED - Crew cannot operate'
      });
    }
  }
  
  // Check medical certificates
  for (const medical of medicals) {
    const daysUntilExpiry = Math.ceil((medical.expiry_date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry <= 60 && daysUntilExpiry > 0) {
      alerts.push({
        item_type: 'medical',
        item_id: medical.id,
        crew_id: medical.crew_id,
        crew_name: '',
        description: `${medical.class.replace('_', ' ').toUpperCase()} Medical Certificate`,
        expiry_date: medical.expiry_date,
        days_until_expiry: daysUntilExpiry,
        severity: daysUntilExpiry <= 14 ? 'critical' : daysUntilExpiry <= 30 ? 'warning' : 'info',
        action_required: 'Schedule medical examination'
      });
    } else if (daysUntilExpiry <= 0) {
      alerts.push({
        item_type: 'medical',
        item_id: medical.id,
        crew_id: medical.crew_id,
        crew_name: '',
        description: `${medical.class.replace('_', ' ').toUpperCase()} Medical Certificate`,
        expiry_date: medical.expiry_date,
        days_until_expiry: daysUntilExpiry,
        severity: 'critical',
        action_required: 'EXPIRED - Crew cannot operate'
      });
    }
  }
  
  // Check training due dates
  for (const training of trainings) {
    if (training.next_due_date) {
      const daysUntilDue = Math.ceil((training.next_due_date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntilDue <= 90 && daysUntilDue > 0) {
        alerts.push({
          item_type: 'training',
          item_id: training.id,
          crew_id: training.crew_id,
          crew_name: '',
          description: `${training.training_type} training${training.aircraft_type ? ` - ${training.aircraft_type}` : ''}`,
          expiry_date: training.next_due_date,
          days_until_expiry: daysUntilDue,
          severity: daysUntilDue <= 30 ? 'critical' : daysUntilDue <= 60 ? 'warning' : 'info',
          action_required: 'Schedule training session'
        });
      } else if (daysUntilDue <= 0) {
        alerts.push({
          item_type: 'training',
          item_id: training.id,
          crew_id: training.crew_id,
          crew_name: '',
          description: `${training.training_type} training${training.aircraft_type ? ` - ${training.aircraft_type}` : ''}`,
          expiry_date: training.next_due_date,
          days_until_expiry: daysUntilDue,
          severity: 'critical',
          action_required: 'OVERDUE - Schedule immediately'
        });
      }
    }
  }
  
  // Sort by severity and days until expiry
  alerts.sort((a, b) => {
    const severityOrder = { critical: 0, warning: 1, info: 2 };
    if (severityOrder[a.severity] !== severityOrder[b.severity]) {
      return severityOrder[a.severity] - severityOrder[b.severity];
    }
    return a.days_until_expiry - b.days_until_expiry;
  });
  
  return alerts;
}

/**
 * Check if crew is qualified for aircraft type
 */
export function isQualifiedForAircraft(
  crewQualifications: CrewQualification[],
  aircraftType: string
): boolean {
  
  const qualification = crewQualifications.find(q => 
    q.aircraft_type === aircraftType && 
    q.qualification_type === 'type_rating'
  );
  
  if (!qualification) {
    return false;
  }
  
  return checkQualificationStatus(qualification.expiry_date) === 'current';
}

/**
 * Check if crew has valid license and medical
 */
export function hasValidCredentials(
  license: CrewLicense | null,
  medical: MedicalCertificate | null
): boolean {
  
  if (!license || !medical) {
    return false;
  }
  
  const licenseStatus = checkQualificationStatus(license.expiry_date);
  const medicalStatus = checkQualificationStatus(medical.expiry_date);
  
  return licenseStatus === 'current' && medicalStatus === 'current';
}

/**
 * Calculate next training due date
 */
export function calculateNextTrainingDate(
  trainingType: string,
  completionDate: Date
): Date {
  
  const nextDate = new Date(completionDate);
  
  switch (trainingType) {
    case 'recurrent':
      // Recurrent training every 12 months
      nextDate.setMonth(nextDate.getMonth() + 12);
      break;
    case 'emergency':
      // Emergency procedures every 12 months
      nextDate.setMonth(nextDate.getMonth() + 12);
      break;
    case 'differences':
      // Differences training valid for 24 months
      nextDate.setMonth(nextDate.getMonth() + 24);
      break;
    default:
      // Default to 12 months
      nextDate.setMonth(nextDate.getMonth() + 12);
  }
  
  return nextDate;
}

/**
 * Generate training schedule for crew
 */
export function generateTrainingSchedule(
  crewId: number,
  qualifications: CrewQualification[],
  lastTrainingRecords: TrainingRecord[]
): {
  crew_id: number;
  upcoming_training: {
    training_type: string;
    aircraft_type: string | null;
    due_date: Date;
    priority: 'high' | 'medium' | 'low';
  }[];
} {
  
  const upcomingTraining: any[] = [];
  const now = new Date();
  
  // Check each qualification for training needs
  for (const qual of qualifications) {
    const lastTraining = lastTrainingRecords.find(t => 
      t.aircraft_type === qual.aircraft_type && 
      t.training_type === 'recurrent'
    );
    
    if (lastTraining && lastTraining.next_due_date) {
      const daysUntilDue = Math.ceil((lastTraining.next_due_date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntilDue <= 90) {
        upcomingTraining.push({
          training_type: 'recurrent',
          aircraft_type: qual.aircraft_type,
          due_date: lastTraining.next_due_date,
          priority: daysUntilDue <= 30 ? 'high' : daysUntilDue <= 60 ? 'medium' : 'low'
        });
      }
    }
  }
  
  return {
    crew_id: crewId,
    upcoming_training: upcomingTraining
  };
}

/**
 * Training type definitions
 */
export const TRAINING_TYPES = {
  INITIAL: 'initial',
  RECURRENT: 'recurrent',
  UPGRADE: 'upgrade',
  DIFFERENCES: 'differences',
  EMERGENCY: 'emergency',
  LINE_CHECK: 'line_check',
  SIMULATOR: 'simulator'
};

/**
 * Training validity periods (in months)
 */
export const TRAINING_VALIDITY = {
  RECURRENT: 12,
  EMERGENCY: 12,
  DIFFERENCES: 24,
  LINE_CHECK: 12,
  SIMULATOR: 6
};

/**
 * Alert thresholds (in days before expiry)
 */
export const ALERT_THRESHOLDS = {
  QUALIFICATION: {
    INFO: 90,
    WARNING: 60,
    CRITICAL: 30
  },
  LICENSE: {
    INFO: 90,
    WARNING: 60,
    CRITICAL: 30
  },
  MEDICAL: {
    INFO: 60,
    WARNING: 30,
    CRITICAL: 14
  },
  TRAINING: {
    INFO: 90,
    WARNING: 60,
    CRITICAL: 30
  }
};

