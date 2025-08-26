# IPL T20 Dashboard

A modern, real-time dashboard for Indian Premier League (IPL) cricket matches,
built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Live Match Updates**: Real-time score updates and match statistics
- **Points Table**: Current team standings and rankings
- **Match Schedule**: Complete fixture list with dates and venues
- **Responsive Design**: Mobile responsive UI
- **Real-time Data**: Live data scraping from official IPL sources
- **Dark/Light Theme**: Toggle between themes for better user experience

## Demo

**Live Demo**:
[https://iplt20-dashboard.netlify.app/](https://iplt20-dashboard.netlify.app/)

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: Server-side API routes
- **Data Scraping**: Cheerio for HTML parsing, JSON feed integration
- **Deployment**: Netlify

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18.17 or higher)
- **npm** or **yarn** package manager

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/piyush805/iplt20-dashboard
cd iplt20-dashboard
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the
application.

## URL Routes

The dashboard provides the following main routes:

- **`/`** - Main dashboard with live match updates
- **`/points-table`** - Current points table and team standings
- **`/schedule`** - Complete match schedule and fixtures
- **`/test-scrapers`** - Testing page for scraper functionality

## 📦 Data Source

### ✅ Current Integration

- Fetching structured data directly from JSON feeds such as:  
  `https://ipl-stats-sports-mechanic.s3.ap-south-1.amazonaws.com/ipl/feeds/203-matchschedule.js`

- The feed returns data in the format:
  ```js
  MatchSchedule({...})
  ```

The scraper:

- Extracts the JSON object via regex
- Parses the `Matchsummary` array
- Maps it into existing data schemas
- Aggregates team points and standings

### ❌ Previous Approach (Deprecated)

- HTML scraping with Cheerio & query selectors
- This was brittle (broke whenever the site structure changed)

### 🔄 Why Changed Approach

The original HTML scraping approach failed due to:

- **Dynamic Content Loading**: The IPL website uses JavaScript to populate match
  data after initial page load
- **Unreliable Selectors**: CSS selectors would break whenever the website
  updated its HTML structure

### 🚀 Benefits of JSON Feed Integration

- **No dependency** on frontend HTML changes
- **Faster & more efficient** data processing
- **Guaranteed structured data** format
- **Reliable data extraction** with fallback mechanisms
- **Robust error handling** and retry logic
- **Data validation** using Zod schemas

### ⚠️ Current Risks & Limitations

While JSON feed integration is more reliable, it's not bulletproof:

- **API Authentication**: Could require auth tokens in the future
- **Endpoint Changes**: The feed URL might change or be deprecated
- **Data Structure Changes**: The `MatchSchedule` format could evolve
- **Rate Limiting**: Could face request restrictions
- **Service Availability**: Depends on the S3 endpoint staying operational
