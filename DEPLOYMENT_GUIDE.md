# Income Tracker - Deployment Guide

Complete guide to deploying your Income Tracker application to production.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Option 1: Docker + Cloud Platform](#option-1-docker--cloud-platform-recommended)
3. [Option 2: Free Tier Deployment](#option-2-free-tier-deployment)
4. [Option 3: VPS/Self-Hosted](#option-3-vpsself-hosted)
5. [Production Checklist](#production-checklist)

---

## Prerequisites

### What You'll Need

- Domain name (optional but recommended)
- Cloud account or VPS
- Git repository (GitHub, GitLab, etc.)
- Environment variables configured

---

## Option 1: Docker + Cloud Platform (RECOMMENDED)

### Best For: Production-grade, scalable, professional deployment

#### Step 1: Create Docker Files

**Backend Dockerfile**

```dockerfile
# backend/Dockerfile
FROM python:3.12-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app
COPY app/ app/
COPY .env .env

# Expose port
EXPOSE 8000

# Run
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Frontend Dockerfile**

```dockerfile
# frontend/Dockerfile
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Serve with nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Frontend Nginx Config**

```nginx
# frontend/nginx.conf
server {
    listen 80;
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
}
```

**Docker Compose** (for local testing)

```yaml
# docker-compose.yml
version: "3.8"

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql://${DB_USER}:${DB_PASSWORD}@postgres:5432/${DB_NAME}
      SECRET_KEY: ${SECRET_KEY}
    depends_on:
      - postgres
    volumes:
      - ./backend:/app

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

#### Step 2: Deploy to Cloud Platforms

**Option A: Render.com (FREE with limitations)**

1. Create account at [render.com](https://render.com)
2. Create PostgreSQL database
3. Deploy Backend:
   - New → Web Service
   - Connect GitHub repo
   - Runtime: Python 3.12
   - Build: `pip install -r requirements.txt`
   - Start: `uvicorn app.main:app`
   - Port: 8000
   - Add environment variables

4. Deploy Frontend:
   - New → Static Site
   - Connect GitHub repo
   - Build: `npm install && npm run build`
   - Publish: `dist`

**Option B: Railway.app (FREE tier available)**

1. Create account at [railway.app](https://railway.app)
2. Deploy using `railway.json`:

```json
{
  "build": {
    "builder": "dockerfile"
  },
  "deploy": {
    "numReplicas": 1,
    "startCommand": "uvicorn app.main:app --host 0.0.0.0 --port $PORT"
  }
}
```

3. Add PostgreSQL plugin
4. Set environment variables

**Option C: PythonAnywhere (Backend only)**

1. Create account at [pythonanywhere.com](https://www.pythonanywhere.com)
2. Upload code via Git
3. Configure WSGI
4. Add PostgreSQL database

---

## Option 2: Free Tier Deployment

### Recommended Stack:

- **Backend**: Railway/Render (free)
- **Database**: Railway PostgreSQL (free)
- **Frontend**: Netlify/Vercel (free)
- **Domain**: Freenom or ngrok tunnel

### Step-by-Step:

#### Backend (Railway.app - Recommended)

1. Push code to GitHub
2. Connect GitHub to Railway
3. Add PostgreSQL service
4. Set environment:

```env
DATABASE_URL=postgresql://user:pass@host/db
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

5. Deploy automatically

#### Frontend (Netlify)

1. Push frontend code to GitHub
2. Connect Netlify to GitHub repo
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Add environment variable:

```env
VITE_API_URL=https://your-backend.railway.app
```

5. Deploy automatically

#### Domain Setup:

- Use free subdomain provided by platform, OR
- Buy cheap domain (~$3/year) and point DNS

---

## Option 3: VPS/Self-Hosted

### Best For: Full control, lower cost long-term

#### Recommended: DigitalOcean Droplet ($6-12/month)

1. Create Droplet with Ubuntu 22.04 LTS

2. Initial Setup:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install dependencies
sudo apt install -y curl git wget
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install -y docker-compose-plugin

# Create app directory
mkdir /home/ubuntu/income-tracker
cd /home/ubuntu/income-tracker
git clone <your-repo> .
```

3. Configure environment:

```bash
cp .env.example .env
# Edit with production values:
# - DATABASE_URL
# - SECRET_KEY
# - CORS_ORIGINS
```

4. Deploy with Docker Compose:

```bash
docker-compose up -d
```

5. Setup SSL/HTTPS (free with Let's Encrypt):

```bash
sudo apt install -y certbot python3-certbot-nginx

# Create reverse proxy
sudo nano /etc/nginx/sites-available/income-tracker

# Add:
server {
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
    }

    location /api {
        proxy_pass http://localhost:8000;
    }
}

# Enable and certify
sudo ln -s /etc/nginx/sites-available/income-tracker /etc/nginx/sites-enabled/
sudo certbot --nginx -d yourdomain.com
```

---

## Production Checklist

### Backend (.env)

- [ ] `DATABASE_URL` set to production database
- [ ] `SECRET_KEY` changed to strong random value
- [ ] `ALGORITHM=HS256` set
- [ ] `ACCESS_TOKEN_EXPIRE_MINUTES=30` configured
- [ ] `CORS_ORIGINS` set to frontend domain only
- [ ] Debug mode: OFF
- [ ] Database backups configured

### Frontend

- [ ] API URL points to production backend
- [ ] `.env` variables set correctly
- [ ] Build tested: `npm run build`
- [ ] Service Worker enabled for PWA
- [ ] Manifest.json configured

### Database

- [ ] PostgreSQL 12+ or higher
- [ ] Daily backups enabled
- [ ] User permissions limited
- [ ] SSL connections enabled if possible

### Deployment

- [ ] HTTPS/SSL enabled
- [ ] API rate limiting configured
- [ ] CORS properly configured
- [ ] Logging enabled
- [ ] Error monitoring (Sentry, etc.)
- [ ] Domain configured
- [ ] Auto-scaling/monitoring setup

---

## Environment Variables Reference

### Backend

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/income_tracker

# Security
SECRET_KEY=your-very-secret-key-here-change-this
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
CORS_ORIGINS=https://yourdomain.com

# Debug (set to False in production)
DEBUG=False
```

### Frontend (`.env` or build variable)

```env
VITE_API_URL=https://api.yourdomain.com
VITE_APP_NAME=Income Tracker
```

---

## Monitoring & Maintenance

### Daily Checks

```bash
# Check logs
docker-compose logs -f backend

# Check health
curl https://api.yourdomain.com/health

# Database size
SELECT pg_size_pretty(pg_database_size('income_tracker'));
```

### Weekly Backups

```bash
# Backup database
pg_dump income_tracker > backup_$(date +%Y%m%d).sql

# Upload to cloud storage
aws s3 cp backup_*.sql s3://your-backup-bucket/
```

### Monthly Tasks

- [ ] Review application logs
- [ ] Check for security updates
- [ ] Review user feedback
- [ ] Optimize database indexes
- [ ] Test disaster recovery

---

## Quick Deployment Command Reference

### Test Locally

```bash
# Backend
cd backend
python -m uvicorn app.main:app --reload

# Frontend (new terminal)
cd frontend
npm run dev
```

### Build for Production

```bash
# Frontend
cd frontend
npm run build
# Output: dist/ folder

# Backend is ready as-is
```

### Deploy with Docker

```bash
# Build images
docker-compose build

# Deploy
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

---

## Troubleshooting

### Database Connection Error

```
Solution: Check DATABASE_URL format and network access
```

### CORS Error

```
Check backend CORS_ORIGINS setting matches frontend domain
```

### Frontend Can't Reach API

```
Check VITE_API_URL matches backend domain
```

### Port Already in Use

```bash
# Kill process on port
lsof -ti:8000 | xargs kill -9
```

---

## Support & Resources

- **FastAPI Docs**: https://fastapi.tiangolo.com
- **React Docs**: https://react.dev
- **Railway Docs**: https://docs.railway.app
- **Render Docs**: https://render.com/docs
- **Docker Docs**: https://docs.docker.com
