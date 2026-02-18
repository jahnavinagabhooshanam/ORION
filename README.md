# ORION – Organizational Risk Intelligence Platform

## Overview
ORION is an AI-powered executive risk monitoring system designed for scaling SMEs. It features a modern React dashboard and a Flask-based risk simulation engine.

## Prerequisites
- **Python 3.8+**
- **Node.js 16+**

## 🚀 Setup & Run Instructions

### 1. Start the Backend
```bash
cd backend
pip install -r requirements.txt
python app.py
```
*Port: 5000*

### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
*Port: 5173 (default)*

## Key Features
- **Executive Dashboard**: Real-time view of organizational risk.
- **Risk Engine**: Weighted risk calculation across Finance, HR, CRM, Vendor, and Support.
- **Simulation Mode**: "Simulate Risk Event" button to demonstrate AI-driven risk updates.
- **Alert System**: Automatic alert generation based on severity thresholds.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Recharts, Framer Motion
- **Backend**: Python, Flask, SQLAlchemy
- **Database**: SQLite3
