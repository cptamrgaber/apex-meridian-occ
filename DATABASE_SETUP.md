# Apex Meridian OCC - Database Setup Guide

## Quick Setup (2 Minutes)

### Step 1: Create Neon Database in Vercel

1. Go to your project: https://vercel.com/apex-meridians-projects/apex-meridian-occ/stores
2. Click **"Create Database"** button
3. Select **"Neon"** (Serverless Postgres)
4. Choose region: **Washington, D.C., USA (East)** (recommended)
5. Keep **Auth** enabled
6. Select **Free** plan
7. Click **"Create"**

Vercel will automatically:
- Create the Neon database
- Add environment variables to your project:
  - `POSTGRES_URL`
  - `POSTGRES_PRISMA_URL`
  - `POSTGRES_URL_NO_SSL`
  - `POSTGRES_URL_NON_POOLING`
  - `POSTGRES_USER`
  - `POSTGRES_HOST`
  - `POSTGRES_PASSWORD`
  - `POSTGRES_DATABASE`

### Step 2: Run Database Migrations

After the database is created, you need to run the schema migration:

**Option A: Using Vercel SQL Tab (Easiest)**

1. In your Vercel project, go to **Storage** tab
2. Click on your newly created **Neon database**
3. Click on **"Query"** or **"SQL Editor"** tab
4. Copy the entire content from `schema.sql` file (in your project root)
5. Paste it into the SQL editor
6. Click **"Run"** or **"Execute"**

**Option B: Using Vercel CLI (For Developers)**

```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Login to Vercel
vercel login

# Link your project
cd apex-meridian-occ-vercel
vercel link

# Pull environment variables
vercel env pull .env.local

# Run the migration script
psql $POSTGRES_URL < schema.sql
```

**Option C: Using Neon Console Directly**

1. Go to https://console.neon.tech
2. Find your database (it will be named after your Vercel project)
3. Click **"SQL Editor"**
4. Paste the content from `schema.sql`
5. Click **"Run"**

### Step 3: Verify Database Setup

After running the migration, verify it worked:

1. Go back to Vercel Storage → Your Neon Database → Query tab
2. Run this query:
   ```sql
   SELECT * FROM users WHERE username = 'demo_admin';
   ```
3. You should see the demo admin user

### Step 4: Redeploy Your Application

The database environment variables are already injected into your Vercel deployment, but to ensure everything is connected:

1. Go to your Vercel project dashboard
2. Click **"Deployments"** tab
3. Click the **"..."** menu on the latest deployment
4. Click **"Redeploy"**

OR simply push a new commit to GitHub (Vercel will auto-deploy).

---

## What's Included in the Database

### Tables Created:
- **users** - User accounts with roles (admin, dispatcher, crew, viewer)
- **flights** - Flight information and real-time tracking
- **crew** - Crew members and their status
- **flight_assignments** - Crew assigned to flights
- **alerts** - System alerts and warnings
- **notifications** - User notifications
- **rosters** - Crew scheduling
- **weather** - Weather data (METAR/TAF)
- **audit_log** - Audit trail for compliance

### Demo Data Included:
- **Demo Admin User**
  - Username: `demo_admin`
  - Password: `password123`
  - Role: admin
  - Tenant: DEMO

- **3 Demo Flights**
  - AM101: JFK → LAX
  - AM202: LAX → SFO
  - AM303: ORD → MIA

- **4 Demo Crew Members**
  - Captain, First Officer, Flight Attendant, Purser

- **2 Demo Alerts**
  - Weather advisory
  - Flight delay notification

---

## Features Now Available

Once the database is set up, your OCC platform will have:

✅ **Persistent Data Storage** - All data saved in Postgres  
✅ **Multi-User Support** - Create and manage multiple users  
✅ **Role-Based Access** - Admin, Dispatcher, Crew, Viewer roles  
✅ **Real-Time Flight Tracking** - Store and query flight data  
✅ **Crew Management** - Track crew status and assignments  
✅ **Alert System** - Create and acknowledge alerts  
✅ **Notifications** - User-specific notifications  
✅ **Audit Logging** - Track all system actions  

---

## Troubleshooting

### Database Connection Error

If you see database connection errors:

1. Check that environment variables are set in Vercel:
   - Go to Settings → Environment Variables
   - Verify `POSTGRES_URL` and related vars exist

2. Redeploy the application after adding the database

3. Check Vercel deployment logs for specific errors

### Migration Failed

If the schema migration fails:

1. Make sure you copied the entire `schema.sql` file
2. Try running it in smaller chunks (one CREATE TABLE at a time)
3. Check for syntax errors in the SQL editor

### Can't Login After Database Setup

If login fails after setting up the database:

1. Verify the demo user was created:
   ```sql
   SELECT * FROM users;
   ```

2. The password hash in the schema might need updating. Run:
   ```sql
   UPDATE users 
   SET password_hash = '$2a$10$rOzJqKCjGKqKqKqKqKqKqOqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKq'
   WHERE username = 'demo_admin';
   ```

3. Or use the fallback authentication (works without database):
   - Username: `demo_admin`
   - Password: `password123`

---

## Next Steps

After database setup is complete:

1. ✅ Test login with demo credentials
2. ✅ Verify dashboard shows real data from database
3. ✅ Check that flights, crew, and alerts are displayed
4. 🚀 Ready to add more features (real flight APIs, notifications, etc.)

---

## Need Help?

If you encounter any issues:

1. Check Vercel deployment logs
2. Check Neon database logs in Neon console
3. Verify environment variables are set correctly
4. Try the fallback mock data mode (works without database)

The application is designed to work with or without the database - it will automatically fall back to mock data if the database is not configured.

