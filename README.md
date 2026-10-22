# AirFare - Real-Time Flight & Multi-Platform OTA Intelligence

AirFare is a modern, full-stack flight intelligence platform and price aggregator. It tracks historical airfare trends, predicts optimal booking windows, and performs real-time multi-platform price comparisons across major Online Travel Agencies (OTAs) and direct airline websites.

---

## Key Features

- **Live Flight & OTA Aggregation**: Real-time pricing via Google Flights (SerpApi) and Amadeus API.
- **Multi-Platform Price Comparison**: Compares live fares across Airline Direct, MakeMyTrip, Cleartrip, Skyscanner, Ixigo, and Yatra.
- **30-Day Historical Trends**: Interactive price variation curves with custom glass tooltips and reference lines.
- **Independent Split-Column Scrolling**: Left flight list and right analytics dashboard scroll independently based on cursor placement.
- **Price Drop Email Alerts**: Real-time email notifications powered by Nodemailer.
- **15-Minute TTL Rate-Limit Shield**: Server-side in-memory cache to preserve third-party API quotas.
- **Simulation Sandbox Fallback**: Deterministic mock engine with genuine DGCA route networks and hubs.

---

## Tech Stack

- **Frontend**: React 19, Tailwind CSS v4, Lucide React, Recharts
- **Backend / Proxy**: Node.js HTTP server, Nodemailer
- **APIs**: SerpApi (Google Flights Engine), Amadeus Self-Service API
- **Deployment**: Render Web Service

---

## Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/Pawan12345kr/AirFare.git
cd AirFare
npm install
```

### 2. Configure Environment (.env.local)
Copy `.env.example` to `.env.local` and add your keys:
```env
SERPAPI_KEY=your_serpapi_key_here
AMADEUS_CLIENT_ID=your_amadeus_client_id
AMADEUS_CLIENT_SECRET=your_amadeus_client_secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password
```

### 3. Run Locally
```bash
# Development mode
npm run dev

# Production build and run
npm run build
npm start
```
