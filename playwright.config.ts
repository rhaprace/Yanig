import { defineConfig } from '@playwright/test';

// Let context.route() see requests the service worker makes, so the offline test can really cut the network.
process.env.PW_EXPERIMENTAL_SERVICE_WORKER_NETWORK_EVENTS = '1';

// Browser tests run against a production build with installed Chrome. Earthquake and news APIs are
// answered with fixed data in the tests, so results do not depend on today's earthquakes.
export default defineConfig({
  testDir: 'e2e',
  timeout: 30_000,
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:4174',
    channel: process.env.CI ? undefined : 'chrome',
    serviceWorkers: 'block',
  },
  webServer: {
    command: 'npm run build && npx vite preview --port 4174 --strictPort',
    url: 'http://localhost:4174',
    reuseExistingServer: false,
    timeout: 180_000,
  },
});
