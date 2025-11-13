# EgyptAir Crew Rostering & Scheduling System
## System Overview Documentation

**Version:** 1.0  
**Date:** November 2025  
**Organization:** EgyptAir  
**System Name:** Apex Meridian Operations Control Center (OCC)

---

## Executive Summary

The EgyptAir Crew Rostering & Scheduling System is a comprehensive, world-class web-based platform designed to manage crew scheduling, bidding, training, and compliance for EgyptAir's flight operations. Built to match industry-leading systems like AIMS and Jeppesen, this system automates crew rostering while ensuring full compliance with ECAA, EASA, and ICAO regulations.

### Key Capabilities

The system manages **541 crew members**, **326 flights**, **67 aircraft**, and **95 airports** across EgyptAir's global network, providing automated roster generation, preferential bidding, fatigue risk management, and comprehensive crew tracking.

---

## System Architecture

### Technology Stack

**Frontend:**
- Next.js 14 (React 19)
- TypeScript
- Tailwind CSS 4
- Responsive design (mobile-first)

**Backend:**
- Next.js API Routes
- Node.js 22
- TypeScript

**Database:**
- PostgreSQL (Vercel Postgres)
- 24 tables with full relational integrity
- Automated migrations

**Deployment:**
- Vercel (Production)
- GitHub (Version Control)
- Continuous Deployment

**Security:**
- HTTPS encryption
- JWT authentication
- Role-based access control
- Audit logging

---

## Core Modules

### 1. Schedule & Pairing Generation

Automatically generates flight pairings from the flight schedule, optimizing for crew utilization, regulation compliance, and operational efficiency.

**Features:**
- Automated pairing creation from flight data
- Multi-day pairing sequences
- Layover optimization
- Duty time compliance (ECAA/EASA/ICAO)
- Rest period calculation
- Aircraft type matching

**Algorithms:**
- Greedy pairing generation
- Constraint satisfaction
- Regulation compliance checking
- Workload balancing

### 2. Preferential Bidding System (PBS)

Allows crew members to submit preferences for pairings, with awards based on seniority and availability.

**Features:**
- Bid period management
- Priority-based bidding
- Seniority-based awards
- Automatic bid processing
- Award/denial notifications
- Bid history tracking

**Award Logic:**
- Seniority ranking
- Qualification verification
- Availability checking
- Regulation compliance
- Fair distribution

### 3. Roster Management

Comprehensive roster generation and management with full compliance checking.

**Features:**
- Monthly roster generation
- Crew assignment optimization
- Qualification matching
- Workload balancing
- Days-off allocation
- Roster publishing
- Change management

**Compliance:**
- Maximum duty hours (100 hours/28 days)
- Minimum rest periods (12 hours)
- Flight time limitations (900 hours/year)
- Consecutive duty limits (6 days max)
- Time zone crossing limits

### 4. Leave & Vacation Management

Manages crew leave requests, vacation planning, and coverage.

**Features:**
- Leave request submission
- Approval workflow
- Annual leave tracking
- Sick leave management
- Coverage planning
- Leave balance tracking

### 5. Flight/Trip Trade Board

Enables crew to trade flights and pairings with approval workflow.

**Features:**
- Trade request creation
- Peer-to-peer trading
- Qualification verification
- Management approval
- Trade history
- Automated notifications

### 6. Reserve & Emergency Coverage

Manages reserve crew pool and emergency callouts.

**Features:**
- Reserve pool management
- Availability tracking
- Emergency callout system
- Coverage assignments
- Reserve duty tracking

### 7. Fatigue Risk Management System (FRMS)

Monitors crew fatigue using the Boeing Alertness Model and ICAO standards.

**Features:**
- Real-time fatigue calculation
- Circadian rhythm analysis
- Sleep opportunity tracking
- Alertness level monitoring
- Risk assessment
- Fit-for-duty determination
- Fatigue alerts

**Fatigue Factors:**
- Time of day (circadian rhythm)
- Time awake (sleep deprivation)
- Workload (duty hours)
- Cumulative fatigue (recent duty)
- Sleep quality

**Risk Levels:**
- Low (score < 30): High alertness
- Medium (30-50): Moderate alertness
- High (50-70): Low alertness, mitigation required
- Critical (70+): Unfit for duty

### 8. Training & Qualifications Management

Tracks crew qualifications, licenses, medical certificates, and training.

**Features:**
- Qualification tracking (type ratings, PIC, instructor)
- License management (ATPL, CPL, MPL)
- Medical certificate tracking
- Training records (initial, recurrent, upgrade)
- Expiry alerts (30/60/90 days)
- Training scheduling
- Qualification verification

**Alert Thresholds:**
- Qualifications: 90/60/30 days
- Licenses: 90/60/30 days
- Medical: 60/30/14 days
- Training: 90/60/30 days

### 9. Notifications & Messaging

Multi-channel notification system for crew communications.

**Notification Types:**
- Roster published/changed
- Bid period opened/closed
- Bid awarded/denied
- Trade requests
- Leave requests
- Training due
- License/medical expiring
- Fatigue alerts
- Emergency callouts

**Channels:**
- In-app notifications
- Email
- SMS (optional)
- Push notifications

**Priority Levels:**
- Low: In-app only
- Medium: In-app + email
- High: In-app + email + push
- Critical: All channels including SMS

### 10. Reporting & Analytics

Comprehensive reporting and analytics dashboard.

**Reports:**
- Crew utilization
- Flight hour summaries
- Duty time analysis
- Fatigue trends
- Training compliance
- Qualification status
- Roster efficiency
- Bid statistics

---

## Database Schema

### Core Tables (24 total)

**Crew Management:**
- crew_profiles
- crew_qualifications
- crew_licenses
- crew_medical_certificates
- crew_training_records

**Scheduling:**
- flights
- aircraft
- airports
- pairings
- rosters
- roster_assignments

**Bidding:**
- bid_periods
- crew_bids

**Operations:**
- leave_requests
- trade_requests
- reserve_assignments

**Compliance:**
- duty_regulations
- fatigue_records

**System:**
- notifications
- audit_logs
- system_config

---

## Regulatory Compliance

### ECAA (Egyptian Civil Aviation Authority)
- Flight time limitations
- Duty period restrictions
- Rest requirements
- Medical standards

### EASA (European Aviation Safety Agency)
- ORO.FTL regulations
- Fatigue risk management
- Crew qualification requirements

### ICAO (International Civil Aviation Organization)
- Annex 6 standards
- Fatigue management principles
- Safety management systems

---

## System Capacity

**Current Scale:**
- 541 crew members
- 326 daily flights
- 67 aircraft (9 types)
- 95 airports (56 countries)
- 4 continents

**Scalability:**
- Supports up to 2,000 crew
- Handles 1,000+ daily flights
- Multi-base operations
- International operations

---

## Security & Access Control

### User Roles

**Crew:**
- View own roster
- Submit bids
- Request leave/trades
- View notifications
- Update preferences

**Scheduler:**
- Generate rosters
- Process bids
- Approve leave/trades
- Manage pairings
- View all crew data

**Administrator:**
- Full system access
- User management
- System configuration
- Database management
- Audit log access

### Security Features
- HTTPS encryption (TLS 1.3)
- JWT token authentication
- Password hashing (bcrypt)
- Role-based access control (RBAC)
- Session management
- Audit logging
- Data encryption at rest

---

## Integration Points

### Data Sources
- Flight schedule system
- Aircraft maintenance system
- HR system (crew data)
- Training management system

### External Systems
- Email service (SMTP)
- SMS gateway (optional)
- Push notification service
- Calendar systems (iCal/Google)

---

## Performance Specifications

**Response Times:**
- Page load: < 2 seconds
- API calls: < 500ms
- Roster generation: < 30 seconds
- Bid processing: < 2 minutes

**Availability:**
- Target uptime: 99.9%
- Scheduled maintenance windows
- Automated backups (daily)
- Disaster recovery plan

---

## Support & Maintenance

**Monitoring:**
- System health checks
- Performance metrics
- Error tracking
- Usage analytics

**Backup:**
- Daily automated backups
- 30-day retention
- Point-in-time recovery
- Offsite storage

**Updates:**
- Regular security patches
- Feature enhancements
- Bug fixes
- Quarterly reviews

---

## Future Enhancements

**Planned Features:**
- Mobile app (iOS/Android)
- Offline capability
- Advanced analytics
- AI-powered optimization
- Crew preference learning
- Predictive fatigue modeling
- Integration with flight ops
- Real-time flight tracking

---

## Contact & Support

**Technical Support:**
- Email: support@egyptair-occ.com
- Phone: +20 2 XXXX XXXX
- Portal: https://apex-meridian-occ.vercel.app

**System Administrator:**
- Captain Amr Gaber
- Email: cptamrgaber@egyptair.com

---

## Document Control

**Version History:**
- v1.0 (November 2025): Initial release

**Review Schedule:**
- Quarterly reviews
- Annual updates
- As-needed revisions

**Approval:**
- Chief Pilot: _______________
- Operations Manager: _______________
- IT Director: _______________

---

*This document is confidential and proprietary to EgyptAir. Unauthorized distribution is prohibited.*

