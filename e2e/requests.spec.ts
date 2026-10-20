import { expect, test, type Page } from '@playwright/test';
import { advance, mockApis, ROUND, type Counts } from './fixtures';

/**
 * Request budget: Yanig must not spam the earthquake sources or the news server.
 * One round = USGS 1, GeoNet 1, BMKG 2. The page clock is controlled, so "10 minutes" passes in the test.
 */

const quakeCounts = (c: Counts) => ({ usgs: c.usgs, geonet: c.geonet, bmkg: c.bmkg });
const rounds = (n: number) => ({ usgs: ROUND.usgs * n, geonet: ROUND.geonet * n, bmkg: ROUND.bmkg * n });

const openTracker = async (page: Page) => {
  await page.goto('/tracker');
  await expect(page.locator('main ol').first().getByRole('button', { name: /Sablayan/ })).toBeVisible();
};

test('one round of requests on first load, and none when moving between pages or languages', async ({ page }) => {
  const counts = await mockApis(page);
  await page.goto('/');
  await expect(page.getByText('12 km SW of Sablayan, Philippines')).toBeVisible();
  expect(quakeCounts(counts)).toEqual(rounds(1));

  // Home and the tracker share the same data.
  await page.locator('header').getByRole('link', { name: 'Tracker' }).first().click();
  await expect(page.locator('main ol').first().getByRole('button', { name: /Sablayan/ })).toBeVisible();
  await page.locator('header').getByRole('link', { name: 'Guides' }).first().click();
  await page.locator('header').getByRole('link', { name: 'Home' }).first().click();
  await expect(page.getByText('12 km SW of Sablayan, Philippines')).toBeVisible();

  // Changing the language or the filters does not ask again.
  await page.locator('header').getByRole('button', { name: 'tl', exact: true }).click();
  await page.locator('header').getByRole('button', { name: 'en', exact: true }).click();
  expect(quakeCounts(counts)).toEqual(rounds(1));
});

test('the news server gets one request, also when the language changes', async ({ page }) => {
  const counts = await mockApis(page);
  await page.goto('/news');
  await expect(page.getByRole('heading', { name: 'Magnitude 5 earthquake felt in Mindanao' })).toBeVisible();
  await page.locator('header').getByRole('button', { name: 'tl', exact: true }).click();
  await page.locator('header').getByRole('button', { name: 'en', exact: true }).click();
  await page.locator('header').getByRole('link', { name: 'Home' }).first().click();
  await page.locator('header').getByRole('link', { name: /News|Balita/ }).first().click();
  await expect(page.getByRole('heading', { name: 'Magnitude 5 earthquake felt in Mindanao' })).toBeVisible();
  expect(counts.news).toBe(1);
});

test('the refresh button waits a minute after new data, and many taps send one round', async ({ page }) => {
  await page.clock.install();
  const counts = await mockApis(page);
  await openTracker(page);
  const refresh = page.getByRole('button', { name: /refresh|up to date/i });
  await expect(refresh).toBeDisabled();
  await expect(refresh).toHaveText(/up to date/i);

  await advance(page, 61_000);
  await expect(refresh).toBeEnabled();
  for (let i = 0; i < 5; i++) await refresh.click({ force: true });
  await expect(refresh).toHaveText(/up to date/i);
  expect(quakeCounts(counts)).toEqual(rounds(2));
});

test('the page checks again every 10 minutes, not sooner', async ({ page }) => {
  await page.clock.install();
  const counts = await mockApis(page);
  await openTracker(page);
  await advance(page, 9 * 60_000, 10_000);
  expect(quakeCounts(counts)).toEqual(rounds(1));
  await advance(page, 61_000);
  await expect.poll(() => quakeCounts(counts)).toEqual(rounds(2));
  await advance(page, 9 * 60_000, 10_000);
  expect(quakeCounts(counts)).toEqual(rounds(2));
});

test('when every source is down, the retries stop, and the error shows', async ({ page }) => {
  await page.clock.install();
  const counts = await mockApis(page, 'down');
  await page.goto('/tracker');
  // Three attempts at most (the first and two retries), each with one quick second try for USGS.
  await advance(page, 60_000);
  await expect(page.getByText('Yanig could not load earthquake data')).toBeVisible();
  const afterRetries = quakeCounts(counts);
  expect(afterRetries.usgs).toBeLessThanOrEqual(6);
  expect(afterRetries.geonet).toBeLessThanOrEqual(3);
  expect(afterRetries.bmkg).toBeLessThanOrEqual(6);
  // Nothing more until the next 10-minute check.
  await advance(page, 5 * 60_000, 10_000);
  expect(quakeCounts(counts)).toEqual(afterRetries);
});
