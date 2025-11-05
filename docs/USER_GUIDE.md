# Apex Meridian® OCC - User Guide

**Document Version:** 1.0  
**Last Updated:** November 5, 2025  
**Author:** Manus AI

---

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Dashboard](#dashboard)
4. [Flight Schedule](#flight-schedule)
5. [Crew Management](#crew-management)
6. [Fleet Management](#fleet-management)
7. [Live Fleet Map](#live-fleet-map)
8. [Analytics](#analytics)
9. [OM-A AI Assistant](#om-a-ai-assistant)
10. [Compliance Monitor](#compliance-monitor)
11. [Weather](#weather)
12. [Routes](#routes)
13. [Notifications](#notifications)
14. [Settings](#settings)

---

## Introduction

The Apex Meridian® Operations Control Center is a comprehensive aviation operations management system designed for EgyptAir. This guide provides step-by-step instructions for using every feature of the system.

### System Overview

The OCC provides real-time monitoring and management of:
- **326 daily flights** across 75 destinations
- **541 qualified captains** with aircraft certifications
- **67 active aircraft** with maintenance tracking
- **Real-time flight tracking** via ADS-B data
- **AI-powered compliance** with OM-A regulations
- **Comprehensive analytics** across multiple time periods

### User Roles

The system supports different user roles:
- **Dispatcher:** View operations, manage schedules
- **Crew Manager:** Manage crew assignments and rosters
- **Maintenance:** Track aircraft status and maintenance
- **Admin:** Full system access with override capabilities
- **Viewer:** Read-only access to operations data

---

## Getting Started

### Accessing the System

**Web Access:**
```
https://apex-meridian-occ.vercel.app
```

**Local Access:**
```
http://localhost:3000
```

### Logging In

1. Navigate to the login page
2. Enter your credentials:
   - **Username:** `demo_admin`
   - **Password:** `password123`
3. Click "Sign In"

The system will redirect you to the Dashboard upon successful login.

### Navigation

The system uses a sidebar navigation menu with the following sections:

| Icon | Page | Purpose |
|------|------|---------|
| 🎯 | Operations | Main dashboard with live operations |
| 📅 | Schedule | Flight timetable and scheduling |
| 👥 | Roster | Crew scheduling and assignments |
| 🔔 | Notifications | System alerts and notifications |
| ☁️ | Weather | METAR/TAF weather data |
| 👨‍✈️ | Crew | Captain database (541 pilots) |
| ✈️ | Fleet | Aircraft management (67 aircraft) |
| 🗺️ | Fleet Map | Live aircraft tracking map |
| 🛣️ | Routes | Route network visualization |
| 📊 | Analytics | Performance metrics and graphs |
| 🤖 | OM-A Assistant | AI-powered regulation queries |
| ✅ | Compliance | Regulatory compliance monitoring |
| ⚙️ | Settings | System configuration |

---

## Dashboard

The Dashboard provides a real-time overview of current operations.

### Features

**Hero Section:**
- Large OCC background image
- System title and subtitle
- Real-time operations monitoring indicator

**Statistics Cards:**
Four gradient cards displaying key metrics:
1. **Active Flights** - Number of flights currently in the air
2. **Crew On Duty** - Number of crew members currently working
3. **Active Alerts** - Number of unresolved system alerts
4. **Scheduled** - Number of flights scheduled for today

Each card shows:
- Current value (large number)
- Trend indicator (up/down arrow)
- Percentage change from previous period
- Vibrant gradient background with hover effect

**Operations Graphs:**

1. **Hourly Operations** (Bar Chart)
   - Shows flight operations for each hour of the day (00:00 - 23:00)
   - Blue gradient bars
   - Hover to see exact flight count

2. **Weekly Operations** (Line Chart)
   - Shows daily operations for the past 7 days
   - Purple gradient line with area fill
   - Hover to see date and flight count

3. **Delay Reasons** (Pie Chart)
   - Distribution of flight delays by cause:
     - Weather: 35%
     - Technical: 25%
     - Crew: 20%
     - ATC: 15%
     - Other: 5%
   - Color-coded segments
   - Hover to see percentage

4. **On-Time Performance** (Line Chart)
   - Trend of on-time percentage over time
   - Green gradient line
   - Target line at 85%
   - Hover to see exact percentage

**Live Flight Tracking Table:**

Displays currently active flights with columns:
- **Callsign:** Flight number (e.g., MSR777)
- **Position:** Latitude and longitude coordinates
- **Altitude:** Current altitude in feet
- **Speed:** Ground speed in knots
- **Heading:** Direction in degrees
- **Status:** In Flight / On Ground

The table updates every 15 seconds with real-time ADS-B data from OpenSky Network.

### Using the Dashboard

**Viewing Statistics:**
1. Observe the four stat cards at the top
2. Note the trend indicators (↑ or ↓)
3. Compare with previous period percentages

**Analyzing Graphs:**
1. Hover over any chart element to see detailed data
2. Use the graphs to identify patterns and trends
3. Note peak hours, busy days, and common delay reasons

**Monitoring Live Flights:**
1. Scroll to the "Live EgyptAir Flights" section
2. View all currently airborne aircraft
3. Check altitude, speed, and position
4. Verify status (In Flight vs On Ground)

**Real-Time Updates:**
- The dashboard automatically refreshes every 15 seconds
- Look for the "Live" indicator in the top-right corner
- A green dot indicates active real-time tracking

---

## Flight Schedule

The Flight Schedule page displays all EgyptAir flights with search and filter capabilities.

### Overview

**Total Flights:** 326 daily flights  
**Destinations:** 75 airports across 6 regions  
**Update Frequency:** Real-time

### Flight Table Columns

| Column | Description | Example |
|--------|-------------|---------|
| Flight | Flight number | MS060 |
| Aircraft | Aircraft type code | B738 |
| Route | Origin → Destination | CAI → LXR |
| Departure | Scheduled departure time | 06:00 |
| Arrival | Scheduled arrival time | 07:15 |
| Duration | Flight duration | 1h 15m |
| Gate | Departure gate | A12 |
| Terminal | Departure terminal | T3 |
| Status | Current flight status | Scheduled |

### Flight Status Indicators

- **Scheduled** - Flight planned, not yet boarding
- **Boarding** - Passengers boarding
- **Departed** - Flight has taken off
- **In Flight** - Currently airborne
- **Landed** - Arrived at destination
- **Delayed** - Behind schedule
- **Cancelled** - Flight cancelled

### Using the Schedule

**Searching for Flights:**
1. Use the search box at the top
2. Enter flight number, route, or destination
3. Results filter automatically as you type

**Filtering by Status:**
1. Click the status filter dropdown
2. Select desired status (Scheduled, In Flight, etc.)
3. Table updates to show only matching flights

**Sorting:**
1. Click any column header to sort
2. Click again to reverse sort order
3. Default sort: Departure time (earliest first)

**Viewing Flight Details:**
1. Click on any flight row
2. View expanded details including:
   - Full route information
   - Aircraft registration
   - Crew assignment
   - Passenger count
   - Cargo weight

**Exporting Schedule:**
1. Click "Export" button
2. Select format (CSV, PDF)
3. File downloads automatically

---

## Crew Management

The Crew page provides access to the complete EgyptAir captain database with 541 qualified pilots.

### Database Overview

**Total Captains:** 541  
**Aircraft Types:** 7 (B737-800, A330-300, B787-9, B777-300ER, A321, A320neo, E170)  
**Languages:** English and Arabic names displayed

### Captain Information

Each captain record includes:
- **Code:** Employee ID number
- **Name (English):** Captain's name in English
- **Name (Arabic):** Captain's name in Arabic script
- **Aircraft Type:** Qualified aircraft type
- **License:** Pilot license number
- **Base:** Home airport (CAI - Cairo)
- **Status:** Active / On Leave / Training
- **Seniority:** Ranking based on hire date

### Aircraft Type Breakdown

| Aircraft | Count | Percentage |
|----------|-------|------------|
| B737-800 | 210 | 39% |
| A330-300 | 75 | 14% |
| B787-9 | 56 | 10% |
| B777-300ER | 52 | 10% |
| A220-300 | 70 | 13% |
| 321/320 | 58 | 11% |
| A320neo | 7 | 1% |
| 170 | 11 | 2% |
| ALL | 1 | 0% |

### Using Crew Management

**Searching for Captains:**
1. Use the search box at the top
2. Enter name (English or Arabic) or employee code
3. Results filter automatically

**Filtering by Aircraft:**
1. Click any aircraft type button (e.g., "B787-9 (56)")
2. Table shows only captains qualified for that aircraft
3. Click "All (541)" to reset filter

**Viewing Captain Details:**
1. Click on any captain row
2. View complete profile including:
   - Full qualification history
   - Flight hours by aircraft type
   - Recent flight assignments
   - Training records
   - Medical certificate status

**Assigning Captains to Flights:**
1. Navigate to Schedule page
2. Click on a flight
3. Click "Assign Crew"
4. Select captain from dropdown (filtered by aircraft qualification)
5. Click "Confirm Assignment"

**Crew Availability:**
- Green indicator: Available
- Yellow indicator: On duty (current flight)
- Red indicator: Unavailable (rest period, leave, training)

---

## Fleet Management

The Fleet page manages all 67 EgyptAir aircraft with maintenance tracking.

### Fleet Overview

**Total Aircraft:** 67  
**Active:** 60  
**In Maintenance:** 7  
**Average Age:** 10 years

### Aircraft Information

Each aircraft record includes:
- **Registration:** Aircraft registration (e.g., SU-GFJ)
- **Type:** Aircraft model (Airbus/Boeing)
- **Manufacturer:** Airbus or Boeing
- **Age:** Years since manufacture
- **Status:** Active / Maintenance / Storage
- **Flight Hours:** Total accumulated flight hours
- **Cycles:** Total takeoff/landing cycles
- **Next Maintenance:** Days until next scheduled maintenance

### Aircraft Types in Fleet

| Type | Count | Primary Routes |
|------|-------|----------------|
| B737-800 | 30 | Domestic, Middle East |
| A321 | 7 | Middle East, Europe |
| A320neo | 8 | Regional, Europe |
| B787-9 | 6 | Long-haul, Asia |
| B777-300ER | 8 | Ultra long-haul, Americas |
| A330-200 | 5 | Long-haul, Asia |
| A330-300 | 3 | Long-haul, Europe |

### Using Fleet Management

**Viewing Aircraft Status:**
1. Scroll through the fleet table
2. Check status column for current state
3. Note aircraft in maintenance (highlighted in yellow)

**Filtering by Status:**
1. Click status filter dropdown
2. Select "Active", "Maintenance", or "All"
3. Table updates automatically

**Viewing Aircraft Details:**
1. Click on any aircraft row
2. View comprehensive information:
   - Complete maintenance history
   - Current location
   - Assigned flights (today and upcoming)
   - Technical specifications
   - Fuel capacity and range
   - Seating configuration

**Maintenance Scheduling:**
1. Click "Schedule Maintenance" button
2. Select aircraft from dropdown
3. Choose maintenance type:
   - A-Check (every 500 flight hours)
   - B-Check (every 6 months)
   - C-Check (every 18-24 months)
   - D-Check (every 6-10 years)
4. Select date and duration
5. Click "Schedule"

**Maintenance Alerts:**
- Aircraft with maintenance due within 7 days show a warning icon
- Aircraft overdue for maintenance show a red alert icon
- Click the icon to view maintenance details

---

## Live Fleet Map

The Live Fleet Map provides real-time visualization of all EgyptAir aircraft positions.

### Map Features

**Interactive Map:**
- OpenStreetMap base layer
- Zoom controls (+/-)
- Pan by dragging
- Auto-fit to show all aircraft

**Aircraft Markers:**
- ✈️ Blue marker: Aircraft in flight
- 🛬 Gray marker: Aircraft on ground
- Marker size indicates aircraft type (larger for wide-body)

**Information Display:**
- Hover over marker to see callsign
- Click marker for detailed popup:
  - Flight number
  - Aircraft type
  - Altitude
  - Speed
  - Heading
  - Status

**Real-Time Updates:**
- Map updates every 15 seconds
- "Live" indicator shows update status
- Green dot: Actively tracking
- Red dot: Connection issue

### Using the Fleet Map

**Viewing All Aircraft:**
1. Map loads with all aircraft visible
2. Zoom out to see global coverage
3. Zoom in for detailed view of specific region

**Tracking Specific Aircraft:**
1. Click on an aircraft marker
2. Popup shows current flight information
3. Marker centers in view

**Filtering Aircraft:**
1. Use the filter panel (if available)
2. Select by:
   - Aircraft type
   - Flight status (in-flight/on-ground)
   - Destination region
3. Map updates to show only selected aircraft

**Following a Flight:**
1. Click "Follow" button in aircraft popup
2. Map automatically centers on aircraft
3. View updates in real-time as aircraft moves
4. Click "Stop Following" to release

**Map Layers:**
- Toggle between map styles (Street, Satellite, Terrain)
- Show/hide flight paths
- Show/hide airport markers
- Show/hide weather overlays

---

## Analytics

The Analytics page provides comprehensive performance metrics across multiple time periods.

### Time Period Selector

Choose from five time periods:
1. **Hourly** - Last 24 hours (hourly data points)
2. **Quarter-Daily** - Last 24 hours (15-minute intervals)
3. **Weekly** - Last 7 days (daily data points)
4. **Monthly** - Last 12 months (monthly data points)
5. **Annual** - Last 5 years (yearly data points)

### Performance Metrics

**Statistics Cards:**

1. **Total Flights**
   - Total number of flights in selected period
   - Trend indicator (up/down from previous period)
   - Percentage change

2. **On-Time Flights**
   - Number of flights departing/arriving on time
   - On-time defined as within 15 minutes of schedule

3. **Delayed Flights**
   - Number of flights delayed
   - Average delay duration

4. **On-Time Percentage**
   - Percentage of flights on time
   - Industry target: 85%
   - Color-coded: Green (>85%), Yellow (75-85%), Red (<75%)

### Charts and Graphs

**1. Operations Trend (Area Chart)**
- Shows flight volume over selected time period
- Blue gradient fill
- Hover to see exact flight count
- Identifies peak and off-peak periods

**2. Delay Reasons (Pie Chart)**
- Distribution of delay causes:
  - Weather (35%)
  - Technical (25%)
  - Crew (20%)
  - ATC (15%)
  - Other (5%)
- Click segment to see detailed breakdown

**3. Regulatory Compliance Indicators**
- Duty Time Compliance: 98%
- Rest Period Compliance: 99%
- Training Currency: 97%
- Medical Compliance: 100%

Each indicator shows:
- Current percentage
- Progress bar (color-coded)
- Target threshold
- Trend arrow

### Using Analytics

**Selecting Time Period:**
1. Click the time period buttons at the top
2. Charts update automatically
3. Statistics recalculate for selected period

**Analyzing Trends:**
1. Observe the operations trend chart
2. Identify patterns (e.g., higher volume on weekends)
3. Note seasonal variations (monthly/annual views)

**Investigating Delays:**
1. Review the delay reasons pie chart
2. Click on a segment for detailed breakdown
3. Use insights to address root causes

**Monitoring Compliance:**
1. Check all compliance indicators
2. Any indicator below 95% requires attention
3. Click indicator for detailed compliance report

**Exporting Data:**
1. Click "Export Data" button
2. Select format (CSV, Excel, PDF)
3. Choose time period
4. File downloads with all analytics data

**Customizing Views:**
1. Click "Customize" button
2. Select which metrics to display
3. Rearrange chart order (drag and drop)
4. Save custom layout

---

## OM-A AI Assistant

The OM-A AI Assistant provides instant access to EgyptAir's Operations Manual regulations using artificial intelligence.

### Overview

The AI Assistant has been trained on the complete EgyptAir Operations Manual (OM-A) with 3,030 searchable sections covering:
- Security procedures
- Training requirements
- Flight operations
- Quality management
- Safety protocols
- Crew regulations
- Aircraft operations
- General policies

### Features

**Chat Interface:**
- Natural language queries
- Instant AI-powered responses
- Source citations from OM-A
- Conversation history
- Suggested follow-up questions

**Knowledge Base:**
- 570,951 tokens of OM-A content
- 2,649 parsed sections
- 11 major categories
- Real-time semantic search

### Using the OM-A Assistant

**Asking Questions:**
1. Type your question in the chat input
2. Examples:
   - "What are the duty time limitations for captains?"
   - "What is the minimum rest period between flights?"
   - "What are the requirements for night operations?"
   - "How do I handle a medical emergency?"
3. Press Enter or click Send
4. AI responds within 2-3 seconds

**Understanding Responses:**
- Response includes relevant OM-A excerpt
- Section number cited (e.g., "Section 5.4.2")
- Additional context provided
- Related sections suggested

**Suggested Questions:**
The assistant provides common queries:
- "What are the duty time limitations?"
- "Explain the rest period requirements"
- "What are the training requirements for B787?"
- "How to handle emergency situations?"

Click any suggested question to ask it instantly.

**Conversation History:**
- All questions and answers saved in session
- Scroll up to review previous queries
- Clear history with "New Conversation" button

**Advanced Queries:**
- Ask follow-up questions (context maintained)
- Request specific section numbers
- Compare procedures between aircraft types
- Ask for examples or scenarios

**Limitations:**
- AI provides information from OM-A only
- Always verify critical procedures with official manual
- For emergencies, follow standard procedures
- AI cannot override official regulations

---

## Compliance Monitor

The Compliance Monitor provides real-time tracking of regulatory compliance across all operations.

### Compliance Categories

**1. Duty Time Compliance**
- Monitors crew duty hours
- Ensures compliance with EASA/ICAO limits
- Tracks daily, weekly, and monthly totals
- Alerts when approaching limits

**2. Rest Period Compliance**
- Verifies minimum rest periods between duties
- Tracks consecutive duty days
- Monitors fatigue risk
- Ensures adequate recovery time

**3. Training Currency**
- Tracks pilot training requirements
- Monitors recurrent training deadlines
- Verifies simulator sessions
- Checks type ratings validity

**4. Medical Compliance**
- Monitors medical certificate expiry
- Tracks medical examination dates
- Alerts for upcoming renewals
- Ensures crew medical fitness

**5. Aircraft Maintenance**
- Tracks maintenance schedules
- Monitors airworthiness certificates
- Verifies inspection compliance
- Alerts for upcoming maintenance

### Compliance Dashboard

**Overview Cards:**
- Overall Compliance Score (percentage)
- Active Violations (count)
- Pending Reviews (count)
- Resolved Issues (count)

**Compliance Indicators:**
Each category shows:
- Current compliance percentage
- Progress bar (color-coded)
- Number of violations
- Trend (improving/declining)

**Color Coding:**
- 🟢 Green (95-100%): Excellent compliance
- 🟡 Yellow (85-94%): Acceptable, monitor closely
- 🔴 Red (<85%): Requires immediate attention

### Violation Tracking

**Violation List:**
Displays all compliance violations with:
- Violation type
- Severity (Critical, High, Medium, Low)
- Affected entity (crew, aircraft, flight)
- Date/time detected
- Status (Open, In Progress, Resolved)
- Assigned to (responsible person)

**Violation Details:**
Click any violation to view:
- Complete description
- Relevant OM-A section
- Recommended corrective action
- Resolution timeline
- Audit trail

### Admin Override

**Override Capability:**
Admins can override compliance violations for exceptional circumstances:

1. Click "Override" button on violation
2. Select override reason:
   - Operational necessity
   - Emergency situation
   - Regulatory exemption
   - Training exercise
   - Other (specify)
3. Enter justification (required)
4. Set override duration
5. Click "Confirm Override"

**Override Audit:**
All overrides are logged with:
- Admin user who authorized
- Date and time
- Reason and justification
- Duration
- Approval chain (if applicable)

**Override Review:**
- Overrides expire automatically
- Require periodic review
- Can be revoked by senior management
- Generate compliance reports

### Using Compliance Monitor

**Daily Monitoring:**
1. Check overall compliance score
2. Review any new violations
3. Address critical violations first
4. Monitor trends over time

**Investigating Violations:**
1. Click on a violation in the list
2. Review details and OM-A reference
3. Assign to appropriate personnel
4. Track resolution progress

**Generating Reports:**
1. Click "Generate Report" button
2. Select report type:
   - Daily Compliance Summary
   - Weekly Violation Report
   - Monthly Compliance Audit
   - Custom Date Range
3. Choose format (PDF, Excel)
4. Report downloads automatically

**Setting Alerts:**
1. Click "Alert Settings"
2. Configure alert thresholds:
   - Compliance percentage drop
   - New critical violations
   - Approaching limits
3. Choose notification method (email, SMS, in-app)
4. Save settings

---

## Weather

The Weather page provides real-time aviation weather data for all EgyptAir destinations.

### Weather Data Sources

- **METAR:** Current weather observations
- **TAF:** Terminal Area Forecasts (24-hour)
- **SIGMET:** Significant meteorological information
- **NOTAM:** Notices to Airmen (when available)

### Features

**Airport Selection:**
- Dropdown list of all 75 EgyptAir destinations
- Search by airport code (ICAO or IATA)
- Recent airports list for quick access

**Weather Display:**
- Decoded METAR in plain English
- Raw METAR for pilots
- TAF forecast
- Weather trends (improving/deteriorating)
- Visibility, wind, temperature, pressure
- Cloud layers and ceiling
- Precipitation and phenomena

**Weather Map:**
- Visual representation of weather conditions
- Color-coded by severity
- Overlay options (radar, satellite, wind)

### Using Weather

**Checking Airport Weather:**
1. Select airport from dropdown
2. View current METAR
3. Read TAF for forecast
4. Note any significant weather

**Planning Flights:**
1. Check departure airport weather
2. Check destination airport weather
3. Check alternate airports
4. Review en-route weather (if available)

**Weather Alerts:**
- Red alert: Severe weather, operations affected
- Yellow alert: Marginal weather, monitor closely
- Green: Good weather, normal operations

---

## Routes

The Routes page visualizes the EgyptAir route network.

### Route Network

**Total Routes:** 75 destinations  
**Regions:**
- Domestic Egypt: 8 airports
- Middle East: 25 airports
- Europe: 20 airports
- Africa: 12 airports
- Asia: 8 airports
- North America: 2 airports

### Route Map

**Interactive Map:**
- All routes displayed as lines from Cairo (hub)
- Color-coded by region
- Thickness indicates frequency (thicker = more flights)

**Route Information:**
Click any route to view:
- Origin and destination
- Distance (nautical miles)
- Average flight time
- Daily frequency
- Aircraft types used
- Load factor (average)

### Route Analysis

**Statistics:**
- Busiest routes (by passenger count)
- Most profitable routes
- Longest routes
- Shortest routes

**Filters:**
- Filter by region
- Filter by aircraft type
- Filter by frequency

---

## Notifications

The Notifications page displays system alerts and messages.

### Notification Types

**System Alerts:**
- Maintenance due
- Compliance violations
- Weather alerts
- Crew availability issues

**Operational Notices:**
- Flight delays
- Gate changes
- Aircraft swaps
- Crew changes

**Administrative:**
- System updates
- Policy changes
- Training reminders
- Meeting notices

### Using Notifications

**Viewing Notifications:**
1. Click notification to expand
2. Read full message
3. Take action if required
4. Mark as read

**Filtering:**
- Filter by type
- Filter by priority
- Filter by date
- Show unread only

**Managing Notifications:**
- Mark all as read
- Delete old notifications
- Configure notification preferences

---

## Settings

The Settings page allows system configuration.

### User Settings

**Profile:**
- Update name and email
- Change password
- Set timezone
- Choose language (English/Arabic)

**Preferences:**
- Dashboard layout
- Default time period (analytics)
- Notification settings
- Theme (dark/light)

### System Settings (Admin Only)

**General:**
- System name and logo
- Contact information
- Support email

**Operations:**
- Default duty time limits
- Rest period requirements
- Alert thresholds

**Integrations:**
- OpenSky Network credentials
- Weather API settings
- Gemini API key

**Security:**
- Password policy
- Session timeout
- Two-factor authentication
- Audit logging

---

## Tips and Best Practices

### Daily Workflow

**Morning Routine:**
1. Check Dashboard for overnight operations
2. Review any new notifications
3. Check compliance status
4. Review today's schedule
5. Check weather for key airports

**During Operations:**
1. Monitor live flight tracking
2. Address any alerts immediately
3. Use OM-A Assistant for quick regulation checks
4. Track crew duty times
5. Monitor aircraft status

**End of Day:**
1. Review analytics for the day
2. Address any compliance issues
3. Plan for next day's operations
4. Generate daily reports

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + /` | Open search |
| `Ctrl + D` | Go to Dashboard |
| `Ctrl + S` | Go to Schedule |
| `Ctrl + M` | Open OM-A Assistant |
| `Ctrl + N` | View Notifications |
| `Esc` | Close modal/popup |

### Performance Tips

- Use filters to reduce data displayed
- Export large datasets instead of viewing in browser
- Clear browser cache if performance degrades
- Use Chrome or Firefox for best performance

---

## Support

For assistance:
- Check this User Guide
- Consult OM-A AI Assistant for regulation questions
- Review System Architecture documentation
- Submit feedback at https://help.manus.im

---

**Document Version:** 1.0  
**Last Updated:** November 5, 2025  
**Author:** Manus AI  
**Project:** Apex Meridian® Operations Control Center

