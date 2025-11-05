# Apex Meridian® OCC - Administrator Guide

**Published by:** Apex-Meridian LLC  
**Document Version:** 1.0  
**Last Updated:** November 5, 2025  
**Editor:** Apex-Meridian LLC

---

## Administrator Overview

This guide covers administrative functions, system management, and override capabilities for the Apex Meridian® Operations Control Center.

## Admin Responsibilities

Administrators have full system access including:
- User management and access control
- Compliance override authority
- System configuration
- Audit log review
- Report generation
- Emergency procedures

---

## User Management

### Creating Users

1. Navigate to Settings → Users
2. Click "Add New User"
3. Enter user details:
   - Username
   - Email
   - Full name
   - Role (Dispatcher, Crew Manager, Maintenance, Admin, Viewer)
4. Set initial password
5. Click "Create User"

### User Roles and Permissions

| Role | Dashboard | Schedule | Crew | Fleet | Analytics | OM-A | Compliance | Settings |
|------|-----------|----------|------|-------|-----------|------|------------|----------|
| Viewer | View | View | View | View | View | View | View | - |
| Dispatcher | Full | Full | View | View | View | Full | View | - |
| Crew Manager | View | Full | Full | View | View | Full | View | - |
| Maintenance | View | View | View | Full | View | Full | View | - |
| Admin | Full | Full | Full | Full | Full | Full | Full | Full |

### Managing User Access

**Activating/Deactivating Users:**
1. Go to Settings → Users
2. Find user in list
3. Toggle "Active" switch
4. Confirm action

**Resetting Passwords:**
1. Select user
2. Click "Reset Password"
3. Choose method:
   - Send reset email
   - Generate temporary password
4. User must change password on next login

---

## Compliance Override System

### Override Authority

Admins can override compliance violations for exceptional circumstances while maintaining full audit trails.

### When to Use Overrides

**Acceptable Reasons:**
- Operational necessity (e.g., crew shortage, aircraft AOG)
- Emergency situations (medical, security, weather)
- Regulatory exemption granted
- Training exercises
- System error (false positive)

**Unacceptable Reasons:**
- Convenience
- Cost savings
- Schedule pressure
- Lack of planning

### Override Procedure

1. Navigate to Compliance Monitor
2. Locate violation requiring override
3. Click "Override" button
4. Complete override form:
   - **Reason Category:** Select from dropdown
   - **Justification:** Detailed explanation (minimum 50 characters)
   - **Duration:** How long override is valid
   - **Approver:** Senior management approval (if required)
5. Review OM-A section reference
6. Click "Confirm Override"

### Override Audit Trail

Every override is logged with:
- Admin username
- Date and time
- Violation details
- Reason and justification
- Duration
- Approval chain
- Resolution status

**Viewing Override History:**
1. Go to Compliance → Override History
2. Filter by date, admin, or violation type
3. Export audit report (PDF/Excel)

### Override Review Process

**Daily:**
- Review all active overrides
- Verify justifications remain valid
- Extend or revoke as needed

**Weekly:**
- Generate override summary report
- Present to management
- Identify patterns requiring policy changes

**Monthly:**
- Comprehensive override audit
- Compliance trend analysis
- Training needs assessment

---

## System Configuration

### General Settings

**System Branding:**
- System Name: "Apex Meridian® Operations Control Center"
- Powered by: Apex-Meridian LLC
- Logo: Upload custom logo (recommended 200x50px PNG)
- Favicon: Upload favicon (32x32px ICO)

**Contact Information:**
- Support Email
- Emergency Contact
- Technical Support Phone

### Operations Configuration

**Duty Time Limits:**
- Single Flight Duty Period (FDP): 13 hours
- Extended FDP (with augmented crew): 16 hours
- Maximum Daily Duty: 14 hours
- Maximum Weekly Duty: 60 hours
- Maximum Monthly Duty: 190 hours

**Rest Period Requirements:**
- Minimum Rest Between Duties: 12 hours
- Minimum Weekly Rest: 36 consecutive hours
- Minimum Monthly Rest: 4 days off

**Alert Thresholds:**
- Duty time warning: 80% of limit
- Duty time critical: 90% of limit
- Maintenance due: 7 days
- Maintenance overdue: Immediate alert

### Integration Settings

**OpenSky Network:**
- Username: Configure for enhanced flight tracking
- Password: Encrypted storage
- Update Interval: 15 seconds (default)
- Rate Limit: 4000 requests/day

**Gemini API:**
- API Key: Required for OM-A Assistant
- Model: gemini-2.5-flash
- Temperature: 0.3 (factual responses)
- Max Tokens: 2048

**Weather API:**
- Provider: Aviation Weather Center
- Update Interval: 30 minutes
- Cache Duration: 15 minutes

---

## Security Management

### Password Policy

**Requirements:**
- Minimum length: 12 characters
- Must include: uppercase, lowercase, number, special character
- Cannot reuse last 5 passwords
- Expires every 90 days
- Account locks after 5 failed attempts

**Configuring Policy:**
1. Settings → Security → Password Policy
2. Adjust requirements as needed
3. Set expiration period
4. Configure lockout threshold
5. Save changes

### Two-Factor Authentication

**Enabling 2FA:**
1. Settings → Security → Two-Factor Authentication
2. Toggle "Require 2FA for all users"
3. Choose method:
   - Authenticator app (recommended)
   - SMS (less secure)
   - Email (least secure)
4. Grace period: 7 days for users to set up

**Emergency 2FA Bypass:**
Admins can generate one-time bypass codes for users who lose 2FA device.

### Session Management

**Session Settings:**
- Timeout: 30 minutes of inactivity (configurable)
- Maximum concurrent sessions: 1 per user
- Remember me: Optional (30 days)

**Force Logout:**
Admins can force logout of any user:
1. Settings → Users → Active Sessions
2. Select user
3. Click "Force Logout"

### Audit Logging

**Logged Events:**
- User login/logout
- Failed login attempts
- Compliance overrides
- System configuration changes
- Data exports
- Critical operations

**Viewing Audit Logs:**
1. Settings → Security → Audit Logs
2. Filter by user, event type, date range
3. Export for compliance reporting

---

## Data Management

### Database Backup

**Automated Backups:**
- Frequency: Daily at 02:00 UTC
- Retention: 30 days
- Location: Encrypted cloud storage
- Verification: Automatic integrity check

**Manual Backup:**
1. Settings → Data Management → Backup
2. Click "Create Backup Now"
3. Wait for completion
4. Download backup file (encrypted)

### Data Export

**Bulk Export:**
1. Settings → Data Management → Export
2. Select data types:
   - Flight schedules
   - Crew records
   - Aircraft data
   - Compliance logs
3. Choose format (CSV, Excel, JSON)
4. Click "Export"
5. Download file

**Scheduled Exports:**
Configure automatic exports:
1. Settings → Data Management → Scheduled Exports
2. Create new schedule
3. Set frequency (daily, weekly, monthly)
4. Select data types
5. Choose delivery method (email, SFTP, cloud storage)

### Data Retention

**Retention Policies:**
- Flight data: 7 years (regulatory requirement)
- Crew records: Permanent (while employed) + 5 years after departure
- Compliance logs: 10 years
- Audit logs: 3 years
- Analytics data: 5 years

**Configuring Retention:**
1. Settings → Data Management → Retention
2. Adjust retention periods (must meet regulatory minimums)
3. Configure automatic archival
4. Set deletion schedules

---

## System Monitoring

### Performance Monitoring

**Key Metrics:**
- Server CPU usage
- Memory utilization
- Database query performance
- API response times
- Active user count
- Real-time data update latency

**Viewing Metrics:**
1. Settings → System → Performance
2. View real-time dashboard
3. Set alert thresholds
4. Export performance reports

### Error Monitoring

**Error Dashboard:**
1. Settings → System → Errors
2. View recent errors
3. Filter by severity (Critical, High, Medium, Low)
4. View stack traces
5. Mark as resolved

**Error Notifications:**
- Critical errors: Immediate email/SMS
- High errors: Email within 15 minutes
- Medium/Low errors: Daily digest

### Health Checks

**Automated Health Checks:**
- Database connectivity: Every 60 seconds
- API endpoints: Every 5 minutes
- External integrations: Every 10 minutes
- Certificate expiry: Daily

**Manual Health Check:**
1. Settings → System → Health
2. Click "Run Health Check"
3. Review results
4. Address any issues

---

## Report Generation

### Standard Reports

**Daily Operations Report:**
- Total flights
- On-time performance
- Delays and reasons
- Crew utilization
- Aircraft utilization
- Compliance summary

**Weekly Management Report:**
- Operations summary
- Performance trends
- Compliance status
- Maintenance overview
- Crew availability
- Key metrics

**Monthly Compliance Audit:**
- Detailed compliance analysis
- Violation breakdown
- Override summary
- Trend analysis
- Recommendations

### Custom Reports

**Creating Custom Reports:**
1. Settings → Reports → Custom Reports
2. Click "Create New Report"
3. Select data sources
4. Choose metrics and dimensions
5. Configure filters
6. Set visualization type
7. Save report template

**Scheduling Reports:**
1. Open report template
2. Click "Schedule"
3. Set frequency and time
4. Choose recipients
5. Select delivery format
6. Save schedule

---

## Emergency Procedures

### System Outage

**Immediate Actions:**
1. Check system status page
2. Verify network connectivity
3. Review error logs
4. Contact technical support (Apex-Meridian LLC)
5. Activate backup procedures

**Backup Procedures:**
- Use offline flight schedule printouts
- Manual crew tracking
- Phone/radio communication
- Paper-based compliance tracking

### Data Recovery

**Recovery Procedure:**
1. Identify data loss extent
2. Locate most recent backup
3. Verify backup integrity
4. Restore from backup
5. Validate restored data
6. Resume operations

**Recovery Time Objectives (RTO):**
- Critical systems: 1 hour
- Core operations: 4 hours
- Full system: 24 hours

### Security Incident

**Incident Response:**
1. Isolate affected systems
2. Preserve evidence
3. Notify security team
4. Change all passwords
5. Review audit logs
6. Document incident
7. Implement corrective measures

---

## Best Practices

### Daily Admin Tasks

**Morning:**
- Review overnight operations
- Check system health
- Review compliance status
- Address critical alerts

**During Day:**
- Monitor active operations
- Respond to user issues
- Review override requests
- Track system performance

**End of Day:**
- Generate daily reports
- Review audit logs
- Plan for next day
- Backup verification

### Weekly Admin Tasks

- User access review
- Compliance trend analysis
- Performance optimization
- Security patch review
- Training needs assessment

### Monthly Admin Tasks

- Comprehensive system audit
- User permission review
- Data retention cleanup
- Backup testing
- Disaster recovery drill
- Management reporting

---

## Support and Escalation

### Support Tiers

**Tier 1 - User Support:**
- Password resets
- Basic troubleshooting
- User training
- Report generation

**Tier 2 - Technical Support:**
- System configuration
- Integration issues
- Performance problems
- Data recovery

**Tier 3 - Engineering Support:**
- Critical system failures
- Security incidents
- Custom development
- Architecture changes

### Contact Information

**Apex-Meridian LLC Support:**
- Email: support@apex-meridian.com
- Phone: +1-XXX-XXX-XXXX
- Emergency: +1-XXX-XXX-XXXX (24/7)
- Portal: https://support.apex-meridian.com

**Escalation Path:**
1. User → Admin
2. Admin → Technical Support
3. Technical Support → Engineering
4. Engineering → Management

---

## Appendix

### Admin Checklist

**New Admin Onboarding:**
- [ ] Complete admin training
- [ ] Review all documentation
- [ ] Set up 2FA
- [ ] Configure alerts
- [ ] Test override procedure
- [ ] Practice emergency procedures
- [ ] Review compliance requirements
- [ ] Understand escalation paths

**Monthly Admin Review:**
- [ ] User access audit
- [ ] Override review
- [ ] Compliance trends
- [ ] System performance
- [ ] Security incidents
- [ ] Backup verification
- [ ] Training completion
- [ ] Documentation updates

---

**Published by:** Apex-Meridian LLC  
**Document Version:** 1.0  
**Last Updated:** November 5, 2025  
**Editor:** Apex-Meridian LLC  
**Copyright:** © 2025 Apex-Meridian LLC. All rights reserved.

