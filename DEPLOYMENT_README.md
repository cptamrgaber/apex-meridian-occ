# Apex Meridian® Operations Control Center - Deployment Guide

## 📦 Package Contents

This deployment package contains a complete, production-ready EgyptAir Operations Control Center with:

- ✅ **541 Real EgyptAir Captains** with full details (English/Arabic names, qualifications, licenses)
- ✅ **72 Daily Flight Schedules** across 48 routes covering 6 regions
- ✅ **67 Real Aircraft** verified from FlightRadar24 with complete fleet data
- ✅ **Real-time ADS-B Flight Tracking** via OpenSky Network
- ✅ **10 Fully Functional Pages** (Dashboard, Crew, Fleet, Schedule, Routes, Weather, Analytics, etc.)
- ✅ **Professional Dark Aviation Theme** optimized for 24/7 operations
- ✅ **Authentication System** with demo credentials

---

## 🚀 Quick Start (3 Options)

### Option 1: Docker Deployment (Recommended)

**Prerequisites:**
- Docker installed ([Get Docker](https://docs.docker.com/get-docker/))
- Docker Compose installed (included with Docker Desktop)

**Steps:**
```bash
# 1. Extract the ZIP file
unzip apex-meridian-occ-deployment.zip
cd apex-meridian-occ

# 2. Build and run with Docker Compose
docker-compose up -d

# 3. Access the application
# Open browser: http://localhost:3000
# Login: demo_admin / password123
```

**Docker Commands:**
```bash
# View logs
docker-compose logs -f

# Stop the application
docker-compose down

# Rebuild after changes
docker-compose up -d --build
```

---

### Option 2: Local Development (npm)

**Prerequisites:**
- Node.js 20+ installed ([Get Node.js](https://nodejs.org/))
- npm (comes with Node.js)

**Steps:**
```bash
# 1. Extract the ZIP file
unzip apex-meridian-occ-deployment.zip
cd apex-meridian-occ

# 2. Install dependencies
npm install

# 3. Run development server
npm run dev

# 4. Access the application
# Open browser: http://localhost:3000
# Login: demo_admin / password123
```

---

### Option 3: Production Build (npm)

**For production deployment on a server:**

```bash
# 1. Install dependencies
npm install

# 2. Build the application
npm run build

# 3. Start production server
npm start

# Application runs on http://localhost:3000
```

---

## 🔐 Default Credentials

**Demo Admin Account:**
- Username: `demo_admin`
- Password: `password123`

**Demo Dispatcher Account:**
- Username: `demo_dispatcher`
- Password: `password123`

---

## 📊 Features & Pages

### 1. **Operations Dashboard**
- Real-time flight tracking with ADS-B data
- Live statistics (active flights, crew on duty, alerts)
- Flight positions updated every 15 seconds
- OpenSky Network integration

### 2. **Crew Management (541 Captains)**
- Complete EgyptAir captain database
- Search and filter by name, code, or aircraft type
- Aircraft qualifications breakdown:
  - B737-800: 210 captains
  - A330-300: 75 captains
  - B787-9: 56 captains
  - B777-300ER: 52 captains
  - A220-300: 70 captains
  - Others: 78 captains
- English and Arabic names properly displayed
- License numbers and seniority data

### 3. **Fleet Management (67 Aircraft)**
- Complete EgyptAir fleet verified from FlightRadar24
- Aircraft types: B737-800, A330-300, B787-9, B777-300ER, A220-300, A320-family
- Registration numbers (SU-GFJ, SU-GFK, etc.)
- Maintenance status and flight hours
- Aircraft age and cycles

### 4. **Flight Schedule (72 Flights)**
- Daily operations across 48 routes
- **Domestic Egypt:** CAI↔LXR, CAI↔SSH, CAI↔HRG, CAI↔ASW
- **Middle East:** CAI↔DXB, CAI↔KWI, CAI↔RUH, CAI↔JED, CAI↔DOH, CAI↔AMM
- **Europe:** CAI↔LHR, CAI↔CDG, CAI↔FRA, CAI↔FCO, CAI↔MAD, CAI↔ATH
- **Africa:** CAI↔JNB, CAI↔NBO, CAI↔ADD
- **Americas:** CAI↔JFK, CAI↔IAD
- **Asia:** CAI↔PEK, CAI↔BKK
- Departure/arrival times, gates, terminals, aircraft assignments

### 5. **Routes Visualization**
- Interactive route map
- 48 routes across 6 regions
- Distance and duration data

### 6. **Weather (METAR/TAF)**
- Real-time aviation weather for EgyptAir airports
- METAR and TAF data
- Weather alerts and warnings

### 7. **Notifications System**
- Real-time operational notifications
- Priority levels (High, Medium, Low)
- Filtering and search

### 8. **Analytics Dashboard**
- Operations metrics and KPIs
- Fleet utilization statistics
- Crew duty time tracking

### 9. **Roster Management**
- Crew scheduling and duty assignments
- Roster generation and optimization
- Compliance tracking

### 10. **Settings**
- User preferences
- System configuration
- Account management

---

## 🛠️ Technical Stack

**Frontend:**
- React 19 with Next.js 15
- TypeScript for type safety
- Tailwind CSS 4 for styling
- Lucide React for icons

**Backend:**
- Next.js API Routes
- JWT authentication
- JSON data storage (easily upgradeable to database)

**Real-time Data:**
- OpenSky Network ADS-B tracking
- 15-second auto-refresh
- Live flight positions, altitudes, speeds

**Deployment:**
- Docker & Docker Compose support
- Vercel-compatible
- Standalone Node.js server

---

## 📁 Project Structure

```
apex-meridian-occ/
├── src/
│   ├── app/                    # Next.js pages and API routes
│   │   ├── dashboard/          # Main operations dashboard
│   │   ├── crew/               # Crew management (541 captains)
│   │   ├── fleet/              # Fleet management (67 aircraft)
│   │   ├── schedule/           # Flight schedules (72 flights)
│   │   ├── roster/             # Crew roster management
│   │   ├── notifications/      # Notifications system
│   │   ├── weather/            # Aviation weather (METAR/TAF)
│   │   ├── routes/             # Route visualization
│   │   ├── analytics/          # Analytics dashboard
│   │   ├── settings/           # Settings page
│   │   └── api/                # Backend API endpoints
│   ├── components/             # Reusable React components
│   ├── data/                   # Real data files
│   │   ├── egyptair_captains_full.json  # 541 captains
│   │   ├── flight_schedule.json         # 72 flights
│   │   ├── egyptair_fleet.json          # 67 aircraft
│   │   └── ...
│   └── lib/                    # Utility functions
├── public/                     # Static assets
├── Dockerfile                  # Docker configuration
├── docker-compose.yml          # Docker Compose setup
├── package.json                # Dependencies
└── DEPLOYMENT_README.md        # This file
```

---

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file for custom configuration:

```env
# Application
NEXT_PUBLIC_APP_NAME=Apex Meridian OCC
NEXT_PUBLIC_APP_VERSION=1.0.0

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# OpenSky Network (optional - uses free tier by default)
# OPENSKY_USERNAME=your_username
# OPENSKY_PASSWORD=your_password
```

### Port Configuration

To change the default port (3000):

**Docker:**
Edit `docker-compose.yml`:
```yaml
ports:
  - "8080:3000"  # Change 8080 to your desired port
```

**npm:**
```bash
PORT=8080 npm run dev
```

---

## 🐛 Troubleshooting

### Docker Issues

**Problem:** Container fails to start
```bash
# Check logs
docker-compose logs

# Rebuild from scratch
docker-compose down
docker-compose up -d --build
```

**Problem:** Port 3000 already in use
```bash
# Change port in docker-compose.yml or stop conflicting service
lsof -i :3000  # Find process using port 3000
```

### npm Issues

**Problem:** Dependencies fail to install
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

**Problem:** Build fails
```bash
# Check Node.js version (requires 20+)
node --version

# Update Node.js if needed
```

---

## 📈 Upgrading to Database

The current version uses JSON files for data storage. To upgrade to a database:

1. **Choose a database:** PostgreSQL (recommended), MySQL, or MongoDB
2. **Update API routes** in `src/app/api/` to use database queries
3. **Run migrations** to import JSON data to database
4. **Update Docker Compose** to include database service

Example PostgreSQL setup in `docker-compose.yml`:
```yaml
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: apex_meridian_occ
      POSTGRES_USER: occ_user
      POSTGRES_PASSWORD: secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

---

## 🌐 Deployment to Cloud

### Vercel (Easiest)

1. Push code to GitHub
2. Import project in Vercel dashboard
3. Deploy automatically

### AWS/Azure/GCP

Use the Docker image:
```bash
# Build image
docker build -t apex-meridian-occ .

# Tag and push to registry
docker tag apex-meridian-occ your-registry/apex-meridian-occ
docker push your-registry/apex-meridian-occ
```

---

## 📞 Support & Documentation

**Included Data:**
- 541 real EgyptAir captains with qualifications
- 67 verified aircraft from FlightRadar24
- 72 daily flights across 48 routes
- 30 airports in route network

**Real-time Features:**
- ADS-B flight tracking via OpenSky Network
- 15-second auto-refresh
- Live flight positions, altitudes, speeds, headings

**Authentication:**
- JWT-based authentication
- Role-based access control (Admin, Dispatcher, Crew)
- Secure password hashing

---

## 📝 License

This is a demonstration project for EgyptAir Operations Control Center.

---

## 🎯 Next Steps

After deployment:

1. **Test all features** - Navigate through all 10 pages
2. **Verify real-time tracking** - Check dashboard for live flights
3. **Review crew database** - Browse 541 captains with filters
4. **Check flight schedules** - View 72 daily flights
5. **Customize branding** - Update logos and colors as needed
6. **Add users** - Create additional accounts for your team
7. **Upgrade to database** - For production use with large data

---

**🎉 Congratulations! Your Apex Meridian OCC is ready for operations!**

For questions or issues, refer to the troubleshooting section above.

