# Roster Generation Algorithm Documentation

**Apex Meridian® Operations Control Center**  
**Version:** 1.0  
**Last Updated:** November 5, 2025

---

## Table of Contents

1. [Overview](#overview)
2. [Algorithm Objectives](#algorithm-objectives)
3. [Fairness Scoring System](#fairness-scoring-system)
4. [OM-A Compliance Constraints](#om-a-compliance-constraints)
5. [How the Algorithm Works](#how-the-algorithm-works)
6. [Configuration Options](#configuration-options)
7. [Usage Guide](#usage-guide)
8. [API Reference](#api-reference)
9. [Troubleshooting](#troubleshooting)

---

## Overview

The **Roster Generation Algorithm** is an intelligent crew scheduling optimization system designed to fairly distribute flights among pilots while ensuring compliance with EgyptAir Operations Manual Part A (OM-A) regulations. The algorithm uses a weighted fairness scoring system to balance workload, flight types, and duty hours across all pilots in a fleet.

### Key Features

- **Fair Distribution**: Ensures equal flight hours, duty hours, layovers, night flights, and domestic/international flights
- **OM-A Compliance**: Enforces duty time limits, rest period requirements, and flight time limitations
- **Minimum Requirements**: Guarantees each pilot meets minimum monthly flying requirements
- **Optimization**: Balances workload while respecting regulatory constraints
- **Transparency**: Provides detailed statistics and warnings for roster quality assessment

---

## Algorithm Objectives

The roster generation algorithm aims to achieve the following objectives, listed in order of priority:

### 1. **Regulatory Compliance** (Mandatory)
- All flight assignments must comply with OM-A regulations
- No violations of duty time limits, rest periods, or flight time restrictions
- Proper spacing between flights to ensure adequate rest

### 2. **Minimum Requirements** (Mandatory)
- Each pilot must achieve at least **60 flight hours** per month
- Each pilot must achieve at least **120 duty hours** per month
- These minimums ensure pilots maintain proficiency and meet company requirements

### 3. **Fair Distribution** (Optimization Goal)
- Equal distribution of total flight hours across all pilots
- Equal distribution of total duty hours across all pilots
- Balanced allocation of night flights (departures or arrivals between 22:00-06:00)
- Balanced allocation of layovers (overnight stays away from base)
- Balanced mix of international and domestic flights

### 4. **Workload Balance** (Optimization Goal)
- Avoid excessive consecutive duty days
- Distribute difficult assignments (night flights, long-haul) evenly
- Ensure variety in flight assignments for all pilots

---

## Fairness Scoring System

The algorithm uses a **weighted fairness scoring system** to determine the best pilot for each flight assignment. For each flight, the algorithm calculates a "fairness score" for every eligible pilot. **Lower scores indicate a more fair assignment** (the pilot needs this type of flight more).

### Scoring Formula

```
Fairness Score = 
  (0.40 × Flight Hours Deviation) +
  (0.30 × Duty Hours Deviation) +
  (0.10 × Night Flights Deviation) +
  (0.10 × Layovers Deviation) +
  (0.10 × International Flights Deviation) +
  Penalty/Bonus Adjustments
```

### Weight Breakdown

| Metric | Weight | Rationale |
|--------|--------|-----------|
| **Flight Hours Balance** | 40% | Primary measure of workload equality |
| **Duty Hours Balance** | 30% | Secondary measure considering total time on duty |
| **Night Flights Distribution** | 10% | Ensures fair share of difficult night shifts |
| **Layovers Distribution** | 10% | Balances overnight stays away from home |
| **International/Domestic Mix** | 10% | Provides variety and experience diversity |

### Deviation Calculation

For each metric, the algorithm calculates how far each pilot deviates from the average:

```
Deviation = Pilot's Current Value - Average Value Across All Pilots
```

- **Positive deviation**: Pilot has more than average (higher score = less likely to be assigned)
- **Negative deviation**: Pilot has less than average (lower score = more likely to be assigned)

### Penalty and Bonus Adjustments

**Strong Preference for Pilots Below Minimum (-50 points for flight hours, -30 for duty hours)**
- Pilots who haven't met the minimum 60 flight hours receive a -50 point bonus
- Pilots who haven't met the minimum 120 duty hours receive a -30 point bonus
- This ensures all pilots reach minimum requirements first

**Avoidance of Pilots Near Maximum (+100 points)**
- Pilots approaching the 100-hour monthly flight limit receive a +100 point penalty
- This prevents any pilot from exceeding regulatory maximums

---

## OM-A Compliance Constraints

The algorithm enforces the following **hard constraints** based on EgyptAir Operations Manual Part A (OM-A):

### 1. **Maximum Duty Hours Per Day**
- **Limit**: 13 hours
- **OM-A Reference**: §7.2.1
- **Enforcement**: No flight assignment can cause a pilot to exceed 13 hours of duty in a single day
- **Calculation**: Duty time = Flight time + Pre-flight (1 hour) + Post-flight (0.5 hours)

### 2. **Minimum Rest Period Between Flights**
- **Limit**: 12 hours
- **OM-A Reference**: §7.3.2
- **Enforcement**: At least 12 hours must elapse between the end of one duty period and the start of the next
- **Calculation**: Rest time = Next duty start time - Previous duty end time

### 3. **Maximum Flight Hours Per Month**
- **Limit**: 100 hours
- **OM-A Reference**: §7.1.3
- **Enforcement**: No pilot can be assigned flights that would cause them to exceed 100 flight hours in a calendar month
- **Buffer**: Algorithm starts avoiding assignments when pilot reaches 90 hours (10-hour buffer)

### 4. **Maximum Consecutive Duty Days**
- **Limit**: 6 days
- **OM-A Reference**: §7.4.1
- **Enforcement**: Pilots must have at least one day off after 6 consecutive duty days
- **Note**: Currently simplified in the algorithm; full implementation requires daily duty tracking

### 5. **Crew Qualifications**
- **Requirement**: Pilots must be qualified for the specific aircraft type
- **Enforcement**: Only pilots with valid type ratings for the aircraft are considered eligible
- **Verification**: Checked against crew_assignments table

---

## How the Algorithm Works

### Step-by-Step Process

#### **Phase 1: Initialization**

1. **Load crew data**: Retrieve all active pilots qualified for the aircraft type
2. **Initialize pilot statistics**: Create tracking structures for each pilot with zero values
3. **Load flight schedule**: Retrieve all flights for the target month
4. **Sort flights**: Order flights by date and departure time (chronological order)

#### **Phase 2: Flight Assignment Loop**

For each flight in chronological order:

1. **Filter eligible pilots**:
   - Check aircraft type qualification
   - Verify compliance with duty hour limits
   - Verify compliance with rest period requirements
   - Verify compliance with monthly flight hour limits

2. **Calculate fairness scores**:
   - For each eligible pilot, calculate fairness score using the weighted formula
   - Consider current pilot statistics vs. fleet averages
   - Apply penalty/bonus adjustments

3. **Select best pilot**:
   - Choose pilot with the **lowest fairness score**
   - This pilot needs this type of flight the most

4. **Assign flight**:
   - Create roster entry linking pilot to flight
   - Update pilot statistics (flight hours, duty hours, night flights, layovers, etc.)
   - Record last flight date and duty end time for rest period calculations

5. **Handle unassignable flights**:
   - If no eligible pilots exist (all violate constraints), mark flight as unassigned
   - Record reason for inability to assign
   - Add warning to roster generation report

#### **Phase 3: Validation and Reporting**

1. **Check minimum requirements**:
   - Verify each pilot has at least 60 flight hours
   - Verify each pilot has at least 120 duty hours
   - Generate warnings for pilots below minimums

2. **Calculate statistics**:
   - Average flight hours, duty hours, night flights, layovers
   - Standard deviation of flight hours (measure of fairness)
   - Fairness score (coefficient of variation)

3. **Generate report**:
   - List of all roster entries
   - Pilot statistics summary
   - Unassigned flights (if any)
   - Warnings and recommendations

---

## Configuration Options

The roster generation algorithm accepts the following configuration parameters:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `month` | number | Current month | Target month (1-12) |
| `year` | number | Current year | Target year |
| `aircraft_type` | string | 'A320' | Aircraft type code (A320, A330, B737, etc.) |
| `min_flight_hours` | number | 60 | Minimum flight hours per pilot per month |
| `min_duty_hours` | number | 120 | Minimum duty hours per pilot per month |
| `max_duty_hours_per_day` | number | 13 | Maximum duty hours in a single day (OM-A §7.2.1) |
| `max_flight_hours_per_month` | number | 100 | Maximum flight hours per pilot per month (OM-A §7.1.3) |
| `min_rest_hours` | number | 12 | Minimum rest hours between duty periods (OM-A §7.3.2) |
| `max_consecutive_duty_days` | number | 6 | Maximum consecutive duty days (OM-A §7.4.1) |

### Example Configuration

```typescript
const options: RosterGenerationOptions = {
  month: 12,
  year: 2025,
  aircraft_type: 'A320',
  min_flight_hours: 60,
  min_duty_hours: 120,
  max_duty_hours_per_day: 13,
  max_flight_hours_per_month: 100,
  min_rest_hours: 12,
  max_consecutive_duty_days: 6,
};
```

---

## Usage Guide

### For Chief Pilots

#### **Generating a New Roster**

1. Navigate to the **Chief Pilot Dashboard**
2. Click **"Create Roster"** button
3. Select the target month and year
4. Review configuration options (or use defaults)
5. Click **"Generate Roster"**
6. Wait for the algorithm to complete (typically 2-5 seconds)

#### **Reviewing Generated Roster**

The system will display:

- **Roster Entries**: All flight assignments with pilot names, dates, and times
- **Pilot Statistics**: Summary of each pilot's hours, flights, and distribution
- **Fairness Metrics**: Standard deviation and fairness score
- **Warnings**: Any issues or pilots below minimum requirements
- **Unassigned Flights**: Flights that couldn't be assigned due to constraints

#### **Editing the Roster**

If the generated roster needs adjustments:

1. Click on any roster entry to edit
2. Reassign flights manually if needed
3. System will warn if manual changes violate OM-A compliance
4. Save changes when satisfied

#### **Submitting for Approval**

1. Review the complete roster
2. Ensure all warnings are addressed
3. Click **"Submit for Approval"**
4. Roster status changes to "Submitted" and is locked for editing
5. Admin will review and approve

---

## API Reference

### **POST /api/roster/generate**

Generates a monthly roster using the fairness algorithm.

#### Request Body

```json
{
  "options": {
    "month": 12,
    "year": 2025,
    "aircraft_type": "A320",
    "min_flight_hours": 60,
    "min_duty_hours": 120
  }
}
```

#### Response

```json
{
  "success": true,
  "roster": {
    "entries": [...],
    "unassignedFlights": [...],
    "warnings": [...]
  },
  "statistics": {
    "totalPilots": 3,
    "avgFlightHours": 65.2,
    "avgDutyHours": 128.5,
    "avgNightFlights": 8,
    "avgLayovers": 4,
    "avgInternationalFlights": 12,
    "stdDevFlightHours": 2.1,
    "fairnessScore": 3.2,
    "pilotStats": [...]
  },
  "options": {...}
}
```

---

## Troubleshooting

### **Problem: Many unassigned flights**

**Possible Causes:**
- Not enough pilots for the number of flights
- Flights too close together (rest period violations)
- Too many flights concentrated on certain days

**Solutions:**
- Add more qualified pilots to the crew
- Adjust flight schedule to spread flights more evenly
- Review and adjust OM-A constraint parameters if appropriate

### **Problem: Pilots below minimum hours**

**Possible Causes:**
- Not enough flights in the month
- Too many pilots for available flights
- Algorithm prioritizing compliance over minimums

**Solutions:**
- Reduce crew size or add more flights
- Manually assign additional flights to pilots below minimums
- Review flight schedule for gaps

### **Problem: Unfair distribution (high standard deviation)**

**Possible Causes:**
- Uneven flight schedule (some days very busy, others quiet)
- Pilots with different availability constraints
- Manual overrides disrupting algorithm balance

**Solutions:**
- Let algorithm run without manual intervention first
- Review flight schedule for balance
- Ensure all pilots have similar availability

### **Problem: Compliance violations**

**Possible Causes:**
- Manual edits after generation
- Incorrect OM-A constraint parameters
- Data errors in flight times

**Solutions:**
- Use "Validate Roster" function to check compliance
- Revert manual changes and regenerate
- Verify flight schedule data accuracy

---

## Performance Metrics

### **Fairness Score Interpretation**

The fairness score is the **coefficient of variation** of flight hours distribution:

- **0-5%**: Excellent fairness (nearly perfect distribution)
- **5-10%**: Good fairness (acceptable variation)
- **10-15%**: Fair (some imbalance, review recommended)
- **15%+**: Poor fairness (significant imbalance, regenerate or manual adjustment needed)

### **Expected Results**

For a typical month with 300-400 flights and 3-5 pilots:

- **Fairness Score**: 3-7%
- **Standard Deviation**: 2-5 flight hours
- **Unassigned Flights**: 0-2%
- **Pilots Meeting Minimums**: 100%
- **OM-A Compliance**: 100%

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Nov 5, 2025 | Initial release with fairness algorithm and OM-A compliance |

---

## Support

For questions or issues with the roster generation algorithm, contact:

- **Technical Support**: [support@apex-meridian.com](mailto:support@apex-meridian.com)
- **OM-A Compliance Questions**: Flight Operations Department
- **System Administrator**: IT Department

---

**© 2025 Apex-Meridian LLC. All rights reserved.**

