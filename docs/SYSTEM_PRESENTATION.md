# Apex Meridian® OCC - Complete System Presentation

**Published by:** Apex-Meridian LLC  
**Document Version:** 1.0  
**Last Updated:** November 5, 2025  
**Editor:** Apex-Meridian LLC

---

## Executive Summary

The **Apex Meridian® Operations Control Center** is a comprehensive, AI-powered airline operations management system designed specifically for EgyptAir. This presentation provides a complete walkthrough of every page, feature, and button in the system.

**Key Highlights:**
- 13 functional pages
- AI-powered Operations Manual assistant
- Real-time flight tracking with live maps
- 541 real EgyptAir captains
- 326 verified flights across 75 destinations
- 67 aircraft fleet management
- Comprehensive analytics and compliance monitoring

---

## Page-by-Page Walkthrough

### 1. Login Page (`/login`)

**Purpose:** Secure authentication for system access

**Layout:**
- Left: EgyptAir branding and welcome message
- Right: Login form

**Elements:**
- **Username field** - Enter user credentials
- **Password field** - Secure password entry
- **"Remember me" checkbox** - Stay logged in (30 days)
- **"Sign In" button** - Submit credentials
- **"Forgot password?" link** - Password recovery (future)

**Demo Credentials:**
- Username: `demo_admin`
- Password: `password123`

**User Experience:**
1. Enter username and password
2. Click "Sign In"
3. System validates credentials
4. Redirects to Dashboard on success
5. Shows error message on failure

**Security Features:**
- Password masking
- Account lockout after 5 failed attempts
- Session timeout after 30 minutes of inactivity

---

### 2. Dashboard (`/dashboard`)

**Purpose:** Central hub for real-time operations monitoring

**Header Section:**
- **Title:** "Apex Meridian® Operations Control Center"
- **Subtitle:** "Real-time EgyptAir operations monitoring"
- **Background:** Professional OCC image
- **Live Indicator:** "Live ADS-B: 0s ago" (updates every 15 seconds)

**Statistics Cards (4 cards):**

1. **Active Flights**
   - Number: 0
   - Label: "Live Tracking"
   - Icon: Plane
   - Color: Blue gradient

2. **Crew On Duty**
   - Number: 0
   - Label: "Estimated"
   - Icon: Users
   - Color: Green gradient

3. **Active Alerts**
   - Number: 0
   - Label: "All Clear"
   - Icon: Alert Triangle
   - Color: Orange gradient

4. **Scheduled**
   - Number: 0
   - Label: "Today"
   - Icon: Calendar
   - Color: Purple gradient

**Charts Section:**

1. **Hourly Operations (Bar Chart)**
   - X-axis: Hours (00:00 - 23:00)
   - Y-axis: Number of flights
   - Shows flight distribution throughout the day
   - Hover: Exact flight count

2. **Weekly Operations (Line Chart)**
   - X-axis: Days (Mon - Sun)
   - Y-axis: Number of flights
   - Shows weekly flight pattern
   - Hover: Exact flight count

3. **Delay Reasons (Pie Chart)**
   - Segments: Weather, Technical, Crew, ATC, Other
   - Percentages shown
   - Hover: Exact count and percentage

4. **On-Time Performance (Line Chart)**
   - X-axis: Months (Jan - Dec)
   - Y-axis: Percentage (0-100%)
   - Target line at 90%
   - Hover: Exact percentage

**Live Flights Table:**
- **Columns:** Callsign, Position, Altitude, Speed, Heading, Status
- **Data:** Real-time from OpenSky Network
- **Updates:** Every 15 seconds
- **Status colors:**
  - Green: In Flight
  - Gray: On Ground

**Interactions:**
- Hover over cards: Subtle lift animation
- Hover over charts: Show detailed tooltips
- Auto-refresh: Live data updates every 15 seconds

---

### 3. Schedule (`/schedule`)

**Purpose:** View and manage daily flight schedules

**Header:**
- Title: "Flight Schedule"
- Search bar: Filter by flight number, route, or aircraft
- Filter buttons: All, Scheduled, Boarding, In Flight, Landed

**Statistics Cards:**
- Total Flights
- Scheduled
- Boarding
- In Flight
- Landed

**Flight Table:**
- **Columns:**
  - Flight Number (e.g., MS145)
  - Aircraft Type (e.g., B738)
  - Route (e.g., CAI → DXB with city names)
  - Departure Time
  - Arrival Time
  - Duration
  - Gate
  - Terminal
  - Status (badge with color)

**Status Colors:**
- Blue: Scheduled
- Yellow: Boarding
- Green: In Flight
- Gray: Landed

**Interactions:**
- **Search:** Type to filter flights in real-time
- **Filter buttons:** Click to show only specific status
- **Table rows:** Hover for highlight
- **Click row:** View detailed flight information (future)

**Data:**
- 326 flights across 75 destinations
- All 6 regions (Domestic, Middle East, Europe, Africa, Asia, Americas)
- Realistic departure/arrival times
- Verified aircraft types

---

### 4. Roster (`/roster`)

**Purpose:** Crew scheduling and roster management

**Header:**
- Title: "Crew Roster & Scheduling"
- **"Generate Schedule" button** - Opens schedule generation dialog

**Schedule Generation Dialog:**

**Step 1: Select Mode**
- **Individual Captain** - Generate for one captain
- **Aircraft Type** - Generate for all captains of specific aircraft
- **All Captains** - Generate for entire database

**Step 2: Configure Parameters**
- **Captain dropdown** (if Individual mode)
- **Aircraft Type dropdown** (if Aircraft Type mode)
- **Start Date** picker
- **End Date** picker
- **Days** slider (7-90 days)

**Step 3: Generate**
- Click "Generate Schedule"
- Shows loading spinner
- Displays generated schedule

**Generated Schedule Display:**
- **Statistics cards:**
  - Total Assignments
  - Captains Used
  - Average Utilization
  - Compliance Rate

- **Schedule table:**
  - Date
  - Captain Name
  - Flight Number
  - Route
  - Duty Hours
  - Status

- **Export button** - Download as CSV

**Features:**
- Aircraft type matching (only qualified captains)
- Duty time limits enforcement
- Rest period requirements
- Seniority-based assignment
- EASA/ICAO compliance

---

### 5. Crew (`/crew`)

**Purpose:** Manage captain database and qualifications

**Header:**
- Title: "Crew Management"
- Search bar: Search by name or code
- **Filter buttons:** All (541), B737-800 (210), A330-300 (75), B787-9 (56), etc.

**Statistics:**
- Total Captains: 541
- Aircraft type breakdown with counts

**Crew Table:**
- **Columns:**
  - Code (employee ID)
  - Name (English)
  - Name (Arabic) - Properly displayed!
  - Aircraft Type
  - License
  - Base (CAI)
  - Status (Active badge)
  - Seniority

**Interactions:**
- **Search:** Real-time filtering by name or code
- **Filter buttons:** Show only captains qualified for specific aircraft
- **Table sorting:** Click column headers to sort
- **Pagination:** 50 captains per page

**Data:**
- 541 real EgyptAir captains
- English and Arabic names
- Real employee codes
- Aircraft qualifications
- License numbers
- Seniority rankings

---

### 6. Fleet (`/fleet`)

**Purpose:** Aircraft fleet management and maintenance tracking

**Header:**
- Title: "Fleet Management"
- Search bar: Filter by registration or type

**Statistics Cards:**
- Total Aircraft: 67
- Active: 60
- In Maintenance: 7
- Average Age: 10 years

**Fleet Table:**
- **Columns:**
  - Registration (e.g., SU-GFJ)
  - Type (Airbus/Boeing)
  - Manufacturer
  - Age (years)
  - Status (Active/Maintenance badge)
  - Flight Hours
  - Cycles
  - Next Maintenance (days)

**Status Colors:**
- Green: Active
- Orange: Maintenance

**Interactions:**
- **Search:** Filter by registration or type
- **Click row:** View detailed aircraft information
- **Sort:** Click column headers

**Data:**
- 67 real EgyptAir aircraft
- Verified registrations from FlightRadar24
- Realistic flight hours and cycles
- Maintenance schedules

---

### 7. Fleet Map (`/fleet-map`)

**Purpose:** Real-time visual tracking of all aircraft on interactive map

**Header:**
- Title: "Live Fleet Tracking"
- Live indicator: Updates every 15 seconds

**Map Display:**
- **Base map:** OpenStreetMap
- **Aircraft markers:** Plane icons with flight numbers
- **Flight paths:** Lines showing routes
- **Colors:**
  - Blue: In Flight
  - Gray: On Ground

**Map Controls:**
- **Zoom in/out** buttons
- **Pan:** Click and drag
- **Reset view** button

**Aircraft Markers:**
- Click marker to show popup with:
  - Flight number
  - Aircraft type
  - Altitude
  - Speed
  - Heading
  - Status

**Features:**
- Real-time position updates (15 seconds)
- Smooth marker animations
- Automatic map centering
- Flight path visualization
- Integration with OpenSky Network

**Interactions:**
- **Click marker:** Show flight details popup
- **Zoom:** Mouse wheel or +/- buttons
- **Pan:** Click and drag map
- **Auto-update:** Markers move smoothly as positions update

---

### 8. Routes (`/routes`)

**Purpose:** Visualize and manage EgyptAir route network

**Header:**
- Title: "Route Network"
- Filter: By region (All, Domestic, Middle East, Europe, Africa, Asia, Americas)

**Route Map:**
- Interactive map showing all routes
- Lines connecting airports
- Color-coded by region

**Route List:**
- **Columns:**
  - Route (e.g., CAI → DXB)
  - Distance (km/nm)
  - Frequency (flights per week)
  - Aircraft Types
  - Duration

**Statistics:**
- Total Routes: 75
- Total Destinations: 75
- Average Distance
- Most Frequent Route

**Interactions:**
- **Filter by region:** Show only routes in selected region
- **Click route:** Highlight on map
- **Hover route:** Show details

---

### 9. Analytics (`/analytics`)

**Purpose:** Comprehensive operations analytics and performance metrics

**Header:**
- Title: "Operations Analytics"
- Date range picker
- **"Export Data" button** - Download CSV

**Time Period Tabs:**
- **Hourly** - 24-hour operations
- **Quarter-Daily** - 15-minute intervals
- **Weekly** - 7-day operations
- **Monthly** - 30-day operations
- **Annual** - 5-year trends

**Charts (varies by tab):**

**Hourly Tab:**
- Bar chart showing flights per hour (00:00-23:00)
- Peak hours highlighted
- Average line

**Quarter-Daily Tab:**
- Line chart showing flights per 15-minute interval
- 96 data points (24 hours × 4)
- Smooth curve

**Weekly Tab:**
- Bar chart showing flights per day (Mon-Sun)
- Weekend vs weekday comparison
- Trend line

**Monthly Tab:**
- Line chart showing daily flights over 30 days
- Moving average
- Trend analysis

**Annual Tab:**
- Line chart showing monthly flights over 5 years
- Year-over-year comparison
- Growth trend

**Performance Metrics:**
- **On-Time Performance:** 94.5% (target: 90%)
- **Average Delay:** 12.3 minutes
- **Cancellation Rate:** 0.5%
- **Load Factor:** 82.3%

**Delay Analysis:**
- Pie chart showing delay reasons:
  - Weather: 35%
  - Technical: 25%
  - Crew: 15%
  - ATC: 15%
  - Other: 10%

**Regulatory Compliance:**
- Compliance rate: 98.5%
- Violations: 12 (minor)
- Overrides: 3 (approved)

**Interactions:**
- **Switch tabs:** Click to change time period
- **Hover charts:** Show exact values
- **Date range:** Select custom period
- **Export:** Download all data as CSV

---

### 10. OM-A Assistant (`/om-a-assistant`)

**Purpose:** AI-powered chatbot for Operations Manual queries

**Header:**
- Title: "OM-A AI Assistant"
- Subtitle: "Ask questions about EgyptAir Operations Manual"
- Powered by: Gemini 2.5 Flash

**Chat Interface:**

**Left Panel: Suggested Questions**
- "What are the maximum flight duty period limits?"
- "What are the rest period requirements?"
- "What are the crew qualification requirements?"
- "What are the maintenance schedule requirements?"
- Click to auto-fill question

**Right Panel: Chat Area**
- **Message input:** Text area for questions
- **"Ask" button:** Submit question
- **"Clear" button:** Reset conversation

**Chat Messages:**

**User Message:**
- Blue background
- Right-aligned
- Question text

**AI Response:**
- White background
- Left-aligned
- Answer text
- **Sources section:**
  - OM-A section references
  - "View in OM-A" links
  - Confidence score

**Features:**
- RAG (Retrieval Augmented Generation)
- 3,030 searchable OM-A chunks
- Hybrid search (keyword + semantic)
- Citation of sources
- Confidence scoring

**Example Interaction:**
1. User: "What are the duty time limits?"
2. AI: "According to OM-A Section 7.2.1, the maximum Flight Duty Period (FDP) is 13 hours for a single pilot operation..."
3. Sources: Section 7.2.1, 7.2.2, 7.3.1
4. Confidence: 95%

---

### 11. Compliance (`/compliance`)

**Purpose:** Monitor regulatory compliance and manage overrides

**Header:**
- Title: "Compliance Monitor"
- Live indicator: Real-time monitoring

**Statistics Cards:**
- **Compliance Rate:** 98.5% (green if >95%)
- **Active Violations:** 12
- **Pending Overrides:** 3
- **Resolved Today:** 8

**Violations Table:**
- **Columns:**
  - Type (Duty Time, Rest Period, Maintenance, etc.)
  - Description
  - Severity (Critical/High/Medium/Low badge)
  - Affected (captain/aircraft)
  - Detected (timestamp)
  - Status (Active/Overridden/Resolved)
  - Actions

**Severity Colors:**
- Red: Critical
- Orange: High
- Yellow: Medium
- Blue: Low

**Actions:**
- **"Override" button** - Opens override dialog
- **"Resolve" button** - Mark as resolved
- **"Details" button** - View full violation details

**Override Dialog:**

**Step 1: Review Violation**
- Violation type
- OM-A section reference
- Current values vs required values
- Impact assessment

**Step 2: Justification**
- **Reason dropdown:**
  - Operational Necessity
  - Emergency Situation
  - Regulatory Exemption
  - Training Exercise
  - System Error
- **Justification text area:** Detailed explanation (min 50 chars)
- **Duration:** How long override is valid
- **Approver:** Senior management approval (if required)

**Step 3: Confirm**
- Review all details
- **"Confirm Override" button**
- Creates audit log entry

**Override History:**
- Table showing all past overrides
- Filters: Date range, admin, violation type
- **"Export Audit Report" button** - Download PDF/Excel

**Compliance Trends:**
- Line chart showing compliance rate over time
- Target line at 95%
- Violation count by type

---

### 12. Weather (`/weather`)

**Purpose:** Aviation weather information (METAR/TAF)

**Header:**
- Title: "Weather Information"
- Last updated timestamp

**Airport Selection:**
- Dropdown: Select airport (CAI, LXR, SSH, HRG, ASW, etc.)
- Auto-refresh every 30 minutes

**METAR Display:**
- Raw METAR text
- Decoded information:
  - Wind direction and speed
  - Visibility
  - Cloud coverage
  - Temperature/Dewpoint
  - Pressure
  - Remarks

**TAF Display:**
- Raw TAF text
- Forecast periods
- Expected conditions

**Weather Map:**
- Satellite imagery
- Radar overlays
- Airport markers

---

### 13. Notifications (`/notifications`)

**Purpose:** System notifications and alerts

**Header:**
- Title: "Notifications"
- **"Mark All Read" button**

**Notification List:**
- **Unread notifications** (bold, blue dot)
- **Read notifications** (gray)

**Notification Types:**
- **Flight alerts** (plane icon)
- **Crew alerts** (users icon)
- **Maintenance alerts** (wrench icon)
- **Compliance alerts** (shield icon)
- **System alerts** (bell icon)

**Notification Content:**
- Title
- Description
- Timestamp
- Actions (if applicable)

**Interactions:**
- Click notification to mark as read
- Click action button to navigate to relevant page
- Hover for highlight

---

### 14. Settings (`/settings`)

**Purpose:** System configuration and user preferences

**Tabs:**
- General
- User Profile
- Notifications
- Security
- Data Management
- System

**General Tab:**
- System name
- Logo upload
- Time zone
- Language
- Date format
- Number format

**User Profile Tab:**
- Full name
- Email
- Phone
- Role
- Avatar upload
- **"Change Password" button**

**Notifications Tab:**
- Email notifications toggle
- SMS notifications toggle
- Push notifications toggle
- Notification preferences by type

**Security Tab:**
- Two-factor authentication
- Session timeout
- Password policy
- Active sessions list
- **"Force Logout All" button**

**Data Management Tab:**
- **"Backup Now" button**
- **"Export Data" button**
- **"Import Data" button**
- Backup history
- Retention policies

**System Tab:**
- System version
- API status
- Database status
- Cache status
- **"Clear Cache" button**
- **"Run Health Check" button**

---

## Navigation

### Sidebar (Left)

**Logo Section:**
- Apex Meridian logo
- "Operations Control" title

**Navigation Links:**
- 🏠 Operations (Dashboard)
- 📅 Schedule
- 📋 Roster
- 👥 Crew
- ✈️ Fleet
- 🗺️ Fleet Map
- 🛣️ Routes
- 📊 Analytics
- 🤖 OM-A Assistant
- ✅ Compliance
- 🌤️ Weather
- 🔔 Notifications
- ⚙️ Settings

**Bottom Section:**
- 🚪 Logout button

**Interactions:**
- Click link to navigate
- Active page highlighted in blue
- Hover for subtle highlight

---

## Common UI Elements

### Buttons

**Primary Button:**
- Blue background
- White text
- Hover: Darker blue
- Active: Even darker
- Disabled: Gray

**Secondary Button:**
- White background
- Blue border
- Blue text
- Hover: Light blue background

**Danger Button:**
- Red background
- White text
- Hover: Darker red
- Used for destructive actions

**Icon Buttons:**
- Circular
- Icon only
- Hover: Background color
- Used for actions in tables

### Cards

**Stat Card:**
- White background
- Gradient border (top)
- Icon (left)
- Number (large, center)
- Label (small, bottom)
- Hover: Lift animation

**Content Card:**
- White background
- Shadow
- Padding
- Rounded corners

### Tables

**Standard Table:**
- Header row (gray background)
- Alternating row colors (white/light gray)
- Hover: Light blue background
- Borders: Subtle gray lines
- Pagination at bottom

### Forms

**Text Input:**
- White background
- Gray border
- Focus: Blue border
- Error: Red border with message
- Success: Green border

**Dropdown:**
- White background
- Gray border
- Arrow icon (right)
- Options list on click

**Date Picker:**
- Calendar popup
- Month/year navigation
- Date selection
- Range selection support

### Badges

**Status Badge:**
- Rounded pill shape
- Color-coded by status
- Small text
- Used in tables

**Count Badge:**
- Circular
- Red background
- White text
- Used for notification counts

### Modals/Dialogs

**Standard Modal:**
- Overlay (dark transparent)
- White card (center)
- Close button (top right)
- Title (top)
- Content (middle)
- Actions (bottom)

---

## Keyboard Shortcuts

- `Ctrl/Cmd + K` - Global search
- `Ctrl/Cmd + /` - Show shortcuts
- `Esc` - Close modal/dialog
- `Enter` - Submit form
- `Tab` - Navigate fields
- `Shift + Tab` - Navigate backwards

---

## Mobile Responsiveness

**Breakpoints:**
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

**Mobile Adaptations:**
- Sidebar collapses to hamburger menu
- Tables scroll horizontally
- Charts resize responsively
- Touch-friendly button sizes
- Simplified layouts

---

## Accessibility

**WCAG 2.1 AA Compliance:**
- Keyboard navigation
- Screen reader support
- Color contrast ratios
- Focus indicators
- Alt text for images
- ARIA labels

---

## Performance

**Optimization Techniques:**
- Code splitting
- Lazy loading
- Image optimization
- Caching
- Compression

**Load Times:**
- Initial load: < 3 seconds
- Page navigation: < 1 second
- API calls: < 500ms

---

## Browser Support

**Supported Browsers:**
- Chrome 120+ ✅
- Firefox 121+ ✅
- Safari 17+ ✅
- Edge 120+ ✅

**Not Supported:**
- Internet Explorer ❌

---

## Conclusion

The Apex Meridian® Operations Control Center is a comprehensive, modern, and user-friendly system designed to streamline airline operations management. Every page, feature, and button has been carefully designed for efficiency, clarity, and ease of use.

**Key Strengths:**
- Intuitive navigation
- Real-time data
- AI-powered assistance
- Comprehensive analytics
- Regulatory compliance
- Professional design

**Powered by:** Apex-Meridian LLC  
**Document Version:** 1.0  
**Last Updated:** November 5, 2025  
**Editor:** Apex-Meridian LLC  
**Copyright:** © 2025 Apex-Meridian LLC. All rights reserved.

