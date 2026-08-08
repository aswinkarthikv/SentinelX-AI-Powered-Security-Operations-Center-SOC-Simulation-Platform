# SentinelX Deployment & Installation Guide

## Docker Compose Production Deployment (Recommended)

To deploy SentinelX in a containerized production environment with Nginx, Gunicorn, Flask, PostgreSQL, and Redis:

```bash
# 1. Clone Repository
git clone https://github.com/aswinkarthikv/AI-Powered-Security-Operations-Center-SOC-Platform.git
cd AI-Powered-Security-Operations-Center-SOC-Platform

# 2. Build and Start All Containers
docker-compose up -d --build

# 3. Access Platform
# Frontend: http://localhost
# Backend API: http://localhost:5000
# OpenAPI Docs: http://localhost:5000/api/docs
```

## Local Development Execution

### Backend Setup (Python Flask)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python run.py
# Backend starts on http://localhost:5000
```

### Frontend Setup (React 19 + Vite)
```bash
cd frontend
npm install
npm run dev
# Frontend starts on http://localhost:3000
```
