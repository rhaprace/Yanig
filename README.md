# Yanig

Yanig ("tremor" in Tagalog) is a free earthquake safety website for the Philippines. It is in English, Tagalog, Spanish and Japanese, and you can install it like an app.

Live site: https://yanig.vercel.app

## What it does

- **Tracker**: recent earthquakes on a map and in a list, from USGS, GeoNet (New Zealand) and BMKG (Indonesia). Yanig checks for new data every 10 minutes. Filter by region (near the Philippines or all) and magnitude, and sort by time or strength.
- **Guides**: what to do before, during and after an earthquake, with a go-bag checklist that stays on your device.
- **Emergency numbers**: national hotlines for the selected country, and hotlines, hospitals and evacuation centres for 31 major Philippine cities (sample data).
- **News**: earthquake news through NewsAPI, with sample safety notes when the news service is not available.
- **Offline**: pages you opened before work without internet.

Yanig does not use PHIVOLCS data, does not send alerts, and cannot predict earthquakes. For official reports in the Philippines, go to https://www.phivolcs.dost.gov.ph.

## Development

```bash
npm install
npm run dev          # http://localhost:5173
npm run lint
npm test             # Vitest unit and component tests
npm run test:e2e     # Playwright browser tests (builds the app, uses installed Chrome locally)
npm run build
```

The news page needs `NEWS_API_KEY` on the server (Vercel). Without it, the page shows the sample notes.

## Stack

React 19, TypeScript, Vite, Tailwind CSS, TanStack Query, i18next, Leaflet with OpenStreetMap, and vite-plugin-pwa. Deployed on Vercel.

Made by Rafael Race. MIT License.
