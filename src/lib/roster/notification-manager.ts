/**
 * Notifications & Messaging System
 * Handles all crew notifications and alerts
 */

export interface Notification {
  id?: number;
  crew_id: number;
  notification_type: NotificationType;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'sent' | 'read' | 'failed';
  channels: NotificationChannel[];
  created_at: Date;
  sent_at?: Date;
  read_at?: Date;
  related_id?: number; // ID of related entity (roster, bid, etc.)
  related_type?: string; // Type of related entity
}

export type NotificationType =
  | 'roster_published'
  | 'roster_changed'
  | 'bid_period_opened'
  | 'bid_period_closing'
  | 'bid_awarded'
  | 'bid_denied'
  | 'trade_request_received'
  | 'trade_request_approved'
  | 'trade_request_denied'
  | 'leave_request_approved'
  | 'leave_request_denied'
  | 'training_due'
  | 'license_expiring'
  | 'medical_expiring'
  | 'qualification_expiring'
  | 'fatigue_alert'
  | 'emergency_callout'
  | 'schedule_change';

export type NotificationChannel = 'in_app' | 'email' | 'sms' | 'push';

export interface NotificationPreferences {
  crew_id: number;
  roster_published: NotificationChannel[];
  roster_changed: NotificationChannel[];
  bid_period_opened: NotificationChannel[];
  bid_awarded: NotificationChannel[];
  trade_requests: NotificationChannel[];
  leave_requests: NotificationChannel[];
  training_alerts: NotificationChannel[];
  expiry_alerts: NotificationChannel[];
  fatigue_alerts: NotificationChannel[];
  emergency_callouts: NotificationChannel[];
}

export interface EmailTemplate {
  template_type: NotificationType;
  subject: string;
  body_html: string;
  body_text: string;
}

/**
 * Create a notification
 */
export function createNotification(
  crewId: number,
  type: NotificationType,
  title: string,
  message: string,
  priority: 'low' | 'medium' | 'high' | 'critical' = 'medium',
  relatedId?: number,
  relatedType?: string
): Notification {
  
  // Determine default channels based on priority
  const channels: NotificationChannel[] = ['in_app'];
  
  if (priority === 'high' || priority === 'critical') {
    channels.push('email');
  }
  
  if (priority === 'critical') {
    channels.push('sms', 'push');
  }
  
  return {
    crew_id: crewId,
    notification_type: type,
    title,
    message,
    priority,
    status: 'pending',
    channels,
    created_at: new Date(),
    related_id: relatedId,
    related_type: relatedType
  };
}

/**
 * Send roster published notification
 */
export function notifyRosterPublished(
  crewId: number,
  rosterId: number,
  month: number,
  year: number
): Notification {
  
  const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' });
  
  return createNotification(
    crewId,
    'roster_published',
    'New Roster Published',
    `Your roster for ${monthName} ${year} has been published and is now available to view.`,
    'high',
    rosterId,
    'roster'
  );
}

/**
 * Send bid award notification
 */
export function notifyBidAwarded(
  crewId: number,
  bidId: number,
  pairingCode: string,
  awardedCount: number,
  totalBids: number
): Notification {
  
  return createNotification(
    crewId,
    'bid_awarded',
    'Bid Awarded',
    `Congratulations! Your bid for pairing ${pairingCode} has been awarded. You received ${awardedCount} out of ${totalBids} bids.`,
    'high',
    bidId,
    'bid'
  );
}

/**
 * Send bid denied notification
 */
export function notifyBidDenied(
  crewId: number,
  bidId: number,
  pairingCode: string,
  reason: string
): Notification {
  
  return createNotification(
    crewId,
    'bid_denied',
    'Bid Not Awarded',
    `Your bid for pairing ${pairingCode} was not awarded. Reason: ${reason}`,
    'medium',
    bidId,
    'bid'
  );
}

/**
 * Send license expiry alert
 */
export function notifyLicenseExpiring(
  crewId: number,
  licenseNumber: string,
  expiryDate: Date,
  daysUntilExpiry: number
): Notification {
  
  const priority = daysUntilExpiry <= 14 ? 'critical' : daysUntilExpiry <= 30 ? 'high' : 'medium';
  
  return createNotification(
    crewId,
    'license_expiring',
    'License Expiring Soon',
    `Your license ${licenseNumber} will expire in ${daysUntilExpiry} days on ${expiryDate.toLocaleDateString()}. Please renew immediately.`,
    priority
  );
}

/**
 * Send medical expiry alert
 */
export function notifyMedicalExpiring(
  crewId: number,
  certificateNumber: string,
  expiryDate: Date,
  daysUntilExpiry: number
): Notification {
  
  const priority = daysUntilExpiry <= 7 ? 'critical' : daysUntilExpiry <= 14 ? 'high' : 'medium';
  
  return createNotification(
    crewId,
    'medical_expiring',
    'Medical Certificate Expiring',
    `Your medical certificate ${certificateNumber} will expire in ${daysUntilExpiry} days on ${expiryDate.toLocaleDateString()}. Schedule your medical examination now.`,
    priority
  );
}

/**
 * Send training due notification
 */
export function notifyTrainingDue(
  crewId: number,
  trainingType: string,
  aircraftType: string | null,
  dueDate: Date,
  daysUntilDue: number
): Notification {
  
  const priority = daysUntilDue <= 14 ? 'critical' : daysUntilDue <= 30 ? 'high' : 'medium';
  const aircraftInfo = aircraftType ? ` for ${aircraftType}` : '';
  
  return createNotification(
    crewId,
    'training_due',
    'Training Due Soon',
    `Your ${trainingType} training${aircraftInfo} is due in ${daysUntilDue} days on ${dueDate.toLocaleDateString()}. Please schedule your training session.`,
    priority
  );
}

/**
 * Send fatigue alert
 */
export function notifyFatigueAlert(
  crewId: number,
  fatigueScore: number,
  riskLevel: string,
  recommendations: string[]
): Notification {
  
  return createNotification(
    crewId,
    'fatigue_alert',
    'Fatigue Risk Alert',
    `Your fatigue score is ${fatigueScore} (${riskLevel} risk). Recommendations: ${recommendations.join(', ')}`,
    'critical'
  );
}

/**
 * Send emergency callout notification
 */
export function notifyEmergencyCallout(
  crewId: number,
  flightNumber: string,
  departureTime: Date,
  reportingTime: Date
): Notification {
  
  return createNotification(
    crewId,
    'emergency_callout',
    'EMERGENCY CALLOUT',
    `You have been assigned to flight ${flightNumber} departing at ${departureTime.toLocaleString()}. Report by ${reportingTime.toLocaleString()}.`,
    'critical'
  );
}

/**
 * Send bid period opening notification
 */
export function notifyBidPeriodOpened(
  crewId: number,
  bidPeriodId: number,
  month: number,
  year: number,
  closingDate: Date
): Notification {
  
  const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' });
  
  return createNotification(
    crewId,
    'bid_period_opened',
    'Bidding Now Open',
    `Bidding is now open for ${monthName} ${year}. Submit your bids before ${closingDate.toLocaleDateString()}.`,
    'high',
    bidPeriodId,
    'bid_period'
  );
}

/**
 * Generate email HTML template
 */
export function generateEmailTemplate(
  notification: Notification,
  crewName: string
): EmailTemplate {
  
  const subject = notification.title;
  
  const bodyHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #1e40af; color: white; padding: 20px; text-align: center; }
    .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
    .priority-${notification.priority} { border-left: 4px solid ${getPriorityColor(notification.priority)}; padding-left: 15px; }
    .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
    .button { display: inline-block; padding: 12px 24px; background: #1e40af; color: white; text-decoration: none; border-radius: 4px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>EgyptAir Operations Control Center</h1>
    </div>
    <div class="content priority-${notification.priority}">
      <h2>${notification.title}</h2>
      <p>Dear ${crewName},</p>
      <p>${notification.message}</p>
      ${notification.priority === 'critical' ? '<p><strong>⚠️ IMMEDIATE ACTION REQUIRED</strong></p>' : ''}
      <a href="https://apex-meridian-occ.vercel.app" class="button">View in OCC Portal</a>
    </div>
    <div class="footer">
      <p>This is an automated notification from EgyptAir OCC System.</p>
      <p>Sent on ${notification.created_at.toLocaleString()}</p>
    </div>
  </div>
</body>
</html>
  `;
  
  const bodyText = `
EgyptAir Operations Control Center

${notification.title}

Dear ${crewName},

${notification.message}

${notification.priority === 'critical' ? '⚠️ IMMEDIATE ACTION REQUIRED' : ''}

View in OCC Portal: https://apex-meridian-occ.vercel.app

---
This is an automated notification from EgyptAir OCC System.
Sent on ${notification.created_at.toLocaleString()}
  `;
  
  return {
    template_type: notification.notification_type,
    subject,
    body_html: bodyHtml,
    body_text: bodyText
  };
}

/**
 * Get priority color for email template
 */
function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'critical': return '#dc2626';
    case 'high': return '#f59e0b';
    case 'medium': return '#3b82f6';
    case 'low': return '#10b981';
    default: return '#6b7280';
  }
}

/**
 * Batch send notifications to multiple crew
 */
export function batchNotify(
  crewIds: number[],
  type: NotificationType,
  title: string,
  message: string,
  priority: 'low' | 'medium' | 'high' | 'critical' = 'medium'
): Notification[] {
  
  return crewIds.map(crewId => 
    createNotification(crewId, type, title, message, priority)
  );
}

/**
 * Get default notification preferences
 */
export function getDefaultNotificationPreferences(crewId: number): NotificationPreferences {
  return {
    crew_id: crewId,
    roster_published: ['in_app', 'email'],
    roster_changed: ['in_app', 'email', 'push'],
    bid_period_opened: ['in_app', 'email'],
    bid_awarded: ['in_app', 'email'],
    trade_requests: ['in_app', 'email'],
    leave_requests: ['in_app', 'email'],
    training_alerts: ['in_app', 'email'],
    expiry_alerts: ['in_app', 'email', 'sms'],
    fatigue_alerts: ['in_app', 'email', 'sms'],
    emergency_callouts: ['in_app', 'email', 'sms', 'push']
  };
}

/**
 * Notification priority levels
 */
export const NOTIFICATION_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
} as const;

/**
 * Notification channels
 */
export const NOTIFICATION_CHANNELS = {
  IN_APP: 'in_app',
  EMAIL: 'email',
  SMS: 'sms',
  PUSH: 'push'
} as const;

