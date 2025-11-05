# Apex Meridian® OCC - Deployment Guide

**Document Version:** 1.0  
**Last Updated:** November 5, 2025  
**Author:** Manus AI

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Deployment Methods](#deployment-methods)
4. [Method 1: Docker Deployment](#method-1-docker-deployment)
5. [Method 2: Local Development](#method-2-local-development)
6. [Method 3: Production Build](#method-3-production-build)
7. [Method 4: Vercel Deployment](#method-4-vercel-deployment)
8. [Environment Configuration](#environment-configuration)
9. [Post-Deployment Verification](#post-deployment-verification)
10. [Troubleshooting](#troubleshooting)

---

## Overview

The Apex Meridian® Operations Control Center can be deployed in multiple ways depending on your requirements. This guide covers four deployment methods, from local development to production cloud deployment.

**Deployment Options:**

| Method | Use Case | Complexity | Time to Deploy |
|--------|----------|------------|----------------|
| Docker | Quick local deployment, testing | Low | 5 minutes |
| Local Dev | Development, debugging | Low | 3 minutes |
| Production Build | Self-hosted production | Medium | 10 minutes |
| Vercel | Cloud production deployment | Low | 5 minutes |

---

## Prerequisites

### System Requirements

**Minimum Hardware:**
- CPU: 2 cores
- RAM: 4 GB
- Storage: 10 GB free space
- Network: Broadband internet connection

**Recommended Hardware:**
- CPU: 4+ cores
- RAM: 8+ GB
- Storage: 20+ GB SSD
- Network: High-speed internet (for real-time tracking)

### Software Requirements

**Required:**
- Node.js 18.x or higher
- npm 9.x or pnpm 8.x
- Git 2.x

**Optional (for Docker):**
- Docker 24.x or higher
- Docker Compose 2.x

**Optional (for development):**
- VS Code or preferred IDE
- Chrome/Firefox for testing

### API Keys and Credentials

**Required:**
- **GEMINI_API_KEY** - For OM-A AI assistant (provided in environment)

**Optional:**
- OpenSky Network account (for enhanced flight tracking)
- Custom domain SSL certificates (for production)

---

## Deployment Methods

### Quick Start Decision Tree

```
Do you need production deployment?
├─ Yes → Use Vercel (Method 4)
└─ No → Do you have Docker installed?
    ├─ Yes → Use Docker (Method 1)
    └─ No → Do you need hot reload?
        ├─ Yes → Use Local Dev (Method 2)
        └─ No → Use Production Build (Method 3)
```

---

## Method 1: Docker Deployment

Docker provides the easiest deployment method with all dependencies pre-configured.

### Step 1: Extract Project Files

```bash
# Extract the deployment package
unzip apex-meridian-occ-deployment-v2.zip
cd apex-meridian-occ-vercel
```

### Step 2: Review Docker Configuration

The project includes two Docker configuration files:

**Dockerfile:**
```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable pnpm && pnpm i --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN corepack enable pnpm && pnpm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  occ:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    restart: unless-stopped
```

### Step 3: Build and Run

```bash
# Build the Docker image
docker-compose build

# Start the container
docker-compose up -d

# View logs
docker-compose logs -f
```

### Step 4: Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

**Default Credentials:**
- Username: `demo_admin`
- Password: `password123`

### Docker Management Commands

```bash
# Stop the container
docker-compose down

# Restart the container
docker-compose restart

# View running containers
docker ps

# Access container shell
docker exec -it apex-meridian-occ-vercel-occ-1 sh

# Remove all containers and images
docker-compose down --rmi all
```

---

## Method 2: Local Development

Local development mode provides hot reload for rapid development and debugging.

### Step 1: Install Dependencies

```bash
# Navigate to project directory
cd apex-meridian-occ-vercel

# Install dependencies (using pnpm)
pnpm install

# Or using npm
npm install
```

### Step 2: Configure Environment

Create a `.env.local` file:

```bash
# Copy environment template
cp .env.example .env.local

# Edit with your API keys
nano .env.local
```

Add the following:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

### Step 3: Start Development Server

```bash
# Using pnpm
pnpm dev

# Or using npm
npm run dev
```

The development server will start on `http://localhost:3000` with hot reload enabled.

### Development Features

**Hot Reload:**
- Automatic page refresh on file changes
- Fast refresh for React components
- CSS hot reload

**Development Tools:**
- React DevTools integration
- Console error reporting
- Source maps for debugging

**Performance:**
- Unoptimized builds (faster compilation)
- Detailed error messages
- Debug logging enabled

---

## Method 3: Production Build

Production build creates optimized static files for self-hosted deployment.

### Step 1: Install Dependencies

```bash
cd apex-meridian-occ-vercel
pnpm install
```

### Step 2: Build for Production

```bash
# Create production build
pnpm build

# This generates:
# - .next/standalone (Node.js server)
# - .next/static (static assets)
# - public (public files)
```

### Step 3: Start Production Server

```bash
# Start the production server
pnpm start

# Or use Node.js directly
node .next/standalone/server.js
```

### Step 4: Configure Reverse Proxy (Optional)

For production deployment, use Nginx or Apache as a reverse proxy.

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name occ.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Step 5: Setup as System Service (Linux)

Create a systemd service file:

```bash
sudo nano /etc/systemd/system/apex-occ.service
```

Add the following:
```ini
[Unit]
Description=Apex Meridian OCC
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/apex-meridian-occ-vercel
ExecStart=/usr/bin/node .next/standalone/server.js
Restart=on-failure
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
```

Enable and start the service:
```bash
sudo systemctl enable apex-occ
sudo systemctl start apex-occ
sudo systemctl status apex-occ
```

---

## Method 4: Vercel Deployment

Vercel provides the simplest cloud deployment with automatic CI/CD.

### Step 1: Prepare Repository

```bash
# Initialize Git repository (if not already done)
git init
git add .
git commit -m "Initial commit"

# Create GitHub repository and push
git remote add origin https://github.com/yourusername/apex-occ.git
git branch -M main
git push -u origin main
```

### Step 2: Connect to Vercel

1. Visit [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Configure project settings:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./`
   - **Build Command:** `pnpm build`
   - **Output Directory:** `.next`

### Step 3: Configure Environment Variables

In Vercel dashboard, add environment variables:

| Key | Value | Environment |
|-----|-------|-------------|
| `GEMINI_API_KEY` | Your Gemini API key | Production, Preview |
| `NODE_ENV` | `production` | Production |

### Step 4: Deploy

Click "Deploy" and wait for the build to complete (typically 1-2 minutes).

### Step 5: Configure Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records:
   - **Type:** A
   - **Name:** @
   - **Value:** 76.76.21.21
   
   Or use CNAME:
   - **Type:** CNAME
   - **Name:** www
   - **Value:** cname.vercel-dns.com

### Automatic Deployments

Vercel automatically deploys on every push to the main branch:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push

# Vercel automatically builds and deploys
```

### Vercel CLI Deployment

Install Vercel CLI for command-line deployment:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

---

## Environment Configuration

### Environment Variables

The application requires the following environment variables:

**Required:**
```bash
# Gemini API for OM-A AI assistant
GEMINI_API_KEY=your_gemini_api_key_here
```

**Optional:**
```bash
# Node environment
NODE_ENV=production

# Server port
PORT=3000

# OpenSky Network credentials (for enhanced tracking)
OPENSKY_USERNAME=your_username
OPENSKY_PASSWORD=your_password

# Custom branding
VITE_APP_TITLE="Apex Meridian® OCC"
VITE_APP_LOGO="/logo.png"
```

### Configuration Files

**next.config.ts:**
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', // For Docker deployment
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;
```

**tailwind.config.ts:**
```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Custom theme configuration
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

---

## Post-Deployment Verification

### Verification Checklist

After deployment, verify the following:

**1. Application Access:**
- [ ] Homepage loads at `http://localhost:3000` or your domain
- [ ] Login page accessible at `/login`
- [ ] Can log in with demo credentials

**2. Core Features:**
- [ ] Dashboard displays flight data
- [ ] Schedule page shows 326 flights
- [ ] Crew page displays 541 captains
- [ ] Fleet page shows 67 aircraft
- [ ] Fleet Map renders with aircraft markers

**3. AI Features:**
- [ ] OM-A Assistant responds to queries
- [ ] Compliance dashboard displays metrics
- [ ] Chat interface functional

**4. Analytics:**
- [ ] Charts render correctly
- [ ] Period selector works (hourly, weekly, etc.)
- [ ] Data export downloads CSV

**5. Performance:**
- [ ] Page load time < 3 seconds
- [ ] No console errors
- [ ] Real-time updates working (15-second interval)

### Health Check Endpoints

Test the following endpoints:

```bash
# Homepage
curl http://localhost:3000

# API health check
curl http://localhost:3000/api/health

# Flight data
curl http://localhost:3000/api/flights/live
```

### Performance Testing

```bash
# Install Apache Bench
sudo apt-get install apache2-utils

# Test homepage performance
ab -n 100 -c 10 http://localhost:3000/

# Expected results:
# - Requests per second: > 50
# - Time per request: < 200ms
# - Failed requests: 0
```

---

## Troubleshooting

### Common Issues and Solutions

#### Issue 1: Port Already in Use

**Symptoms:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use a different port
PORT=3001 pnpm dev
```

#### Issue 2: Module Not Found

**Symptoms:**
```
Error: Cannot find module 'next'
```

**Solution:**
```bash
# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
pnpm install

# Or clear pnpm cache
pnpm store prune
pnpm install
```

#### Issue 3: Build Failures

**Symptoms:**
```
Error: Build failed with exit code 1
```

**Solution:**
```bash
# Check Node.js version
node --version  # Should be 18.x or higher

# Clear Next.js cache
rm -rf .next

# Rebuild
pnpm build
```

#### Issue 4: Gemini API Errors

**Symptoms:**
```
Error: API key not valid
```

**Solution:**
```bash
# Verify API key is set
echo $GEMINI_API_KEY

# Check .env.local file
cat .env.local

# Restart server after updating
pnpm dev
```

#### Issue 5: Docker Build Fails

**Symptoms:**
```
Error: failed to solve: process "/bin/sh -c pnpm build" did not complete successfully
```

**Solution:**
```bash
# Increase Docker memory limit
# Docker Desktop → Settings → Resources → Memory → 4GB+

# Clear Docker cache
docker system prune -a

# Rebuild
docker-compose build --no-cache
```

#### Issue 6: Map Not Loading

**Symptoms:**
- Fleet map shows blank screen
- Console error: "Leaflet is not defined"

**Solution:**
```bash
# Ensure Leaflet CSS is loaded
# Check client/index.html includes:
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />

# Or install locally
pnpm add leaflet react-leaflet
```

#### Issue 7: Charts Not Rendering

**Symptoms:**
- Analytics page shows empty charts
- Console error: "Recharts is not defined"

**Solution:**
```bash
# Install Recharts
pnpm add recharts

# Restart development server
pnpm dev
```

### Debug Mode

Enable debug logging:

```bash
# Set debug environment variable
DEBUG=* pnpm dev

# Or for specific modules
DEBUG=next:* pnpm dev
```

### Log Files

Check application logs:

```bash
# Docker logs
docker-compose logs -f

# Systemd logs
sudo journalctl -u apex-occ -f

# Vercel logs
vercel logs
```

---

## Maintenance and Updates

### Regular Maintenance

**Weekly:**
- Check application logs for errors
- Verify real-time data updates
- Monitor API usage (Gemini)

**Monthly:**
- Update dependencies: `pnpm update`
- Review security advisories
- Backup configuration files

**Quarterly:**
- Update Node.js version
- Review and optimize database
- Performance audit

### Updating the Application

```bash
# Pull latest changes
git pull origin main

# Install new dependencies
pnpm install

# Rebuild
pnpm build

# Restart
pnpm start

# Or with Docker
docker-compose down
docker-compose build
docker-compose up -d
```

### Backup and Restore

**Backup:**
```bash
# Backup configuration
tar -czf occ-backup-$(date +%Y%m%d).tar.gz \
  .env.local \
  src/data/ \
  public/

# Backup Docker volumes
docker run --rm -v apex-occ-data:/data \
  -v $(pwd):/backup alpine \
  tar czf /backup/occ-data-backup.tar.gz /data
```

**Restore:**
```bash
# Restore configuration
tar -xzf occ-backup-20251105.tar.gz

# Restore Docker volumes
docker run --rm -v apex-occ-data:/data \
  -v $(pwd):/backup alpine \
  sh -c "cd /data && tar xzf /backup/occ-data-backup.tar.gz --strip 1"
```

---

## Security Considerations

### Production Security Checklist

- [ ] Change default admin credentials
- [ ] Enable HTTPS with SSL certificate
- [ ] Configure firewall rules
- [ ] Set up rate limiting
- [ ] Enable CORS restrictions
- [ ] Implement authentication (OAuth2)
- [ ] Regular security updates
- [ ] Monitor access logs
- [ ] Backup encryption
- [ ] API key rotation

### SSL/TLS Configuration

**Let's Encrypt (Free SSL):**
```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d occ.yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

### Firewall Configuration

```bash
# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow SSH (if needed)
sudo ufw allow 22/tcp

# Enable firewall
sudo ufw enable
```

---

## Support and Resources

### Documentation

- **Development Log:** `docs/DEVELOPMENT_LOG.md`
- **User Guide:** `docs/USER_GUIDE.md`
- **Admin Guide:** `docs/ADMIN_GUIDE.md`
- **API Documentation:** `docs/API_DOCUMENTATION.md`
- **System Architecture:** `docs/SYSTEM_ARCHITECTURE.md`

### External Resources

- **Next.js Documentation:** https://nextjs.org/docs
- **Vercel Documentation:** https://vercel.com/docs
- **Docker Documentation:** https://docs.docker.com
- **Gemini API:** https://ai.google.dev/gemini-api/docs

### Getting Help

For issues or questions:
1. Check this deployment guide
2. Review troubleshooting section
3. Check application logs
4. Consult development log
5. Submit feedback at https://help.manus.im

---

## Conclusion

The Apex Meridian® Operations Control Center can be deployed in multiple ways to suit your needs. Whether you choose Docker for quick deployment, local development for debugging, production build for self-hosting, or Vercel for cloud deployment, this guide provides all the necessary steps.

**Recommended Deployment Path:**
1. **Development:** Use Method 2 (Local Development)
2. **Testing:** Use Method 1 (Docker)
3. **Production:** Use Method 4 (Vercel) or Method 3 (Self-hosted)

For production deployments, always follow security best practices and maintain regular backups.

---

**Document Version:** 1.0  
**Last Updated:** November 5, 2025  
**Author:** Manus AI  
**Project:** Apex Meridian® Operations Control Center

