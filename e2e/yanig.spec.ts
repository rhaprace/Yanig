import { expect, test, type Page } from '@playwright/test';
import { mockApis } from './fixtures';

const ROUTES = ['/', '/tracker', '/guides', '/resources', '/emergency-finder', '/news', '/about', '/privacy', '/terms', '/offline'];

/** Console errors, without the service worker message that comes from blocking service workers in tests. */
const collectErrors = (page: Page) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error' && !/SW registration|Failed to load resource/.test(m.text())) errors.push(m.text());
  });
  return errors;
};

test.beforeEach(async ({ page }) => {
  await mockApis(page);
});

test('every page loads, uses the Yanig name, and makes no false claims', async ({ page }) => {
  const errors = collectErrors(page);
  for (const route of ROUTES) {
    await page.goto(route);
    await expect(page.locator('header').getByText('Yanig', { exact: true })).toBeVisible();
    await expect(page.locator('main h1').first()).toBeVisible();
    const text = await page.locator('body').innerText();
    expect(text, route).not.toMatch(/\bquake\s?safe\b/i);
    expect(text, route).not.toMatch(/real-?time|\blive (tracker|monitoring|data)\b|24\/7/i);
    expect(text, route).not.toMatch(/data (comes |provided )?(from|by)[^.]*PHIVOLCS/i);
    await expect(page).toHaveTitle(/Yanig/);
  }
  expect(errors).toEqual([]);
});

test('home shows quakes near the Philippines first, and the steps advance', async ({ page }) => {
  await page.goto('/');
  const quakes = page.locator('#home-quakes').locator('xpath=ancestor::section[1]');
  await expect(quakes.getByText('12 km SW of Sablayan, Philippines')).toBeVisible();
  await expect(quakes.getByText('Near the Philippines', { exact: false })).toBeVisible();
  await expect(quakes.getByText('Alaska')).toHaveCount(0);

  await expect(page.getByText('Drop to your hands and knees', { exact: false }).first()).toBeVisible();
  await page.getByRole('button', { name: /next/i }).first().click();
  await expect(page.getByText(/step 2 of 3/i)).toBeVisible();

  const call = page.locator('a[href^="tel:"]').filter({ hasText: '911' }).first();
  await expect(call).toHaveAttribute('href', 'tel:911');
});

test('tracker filters by region and magnitude, and selects a quake', async ({ page }) => {
  await page.goto('/tracker');
  await expect(page.getByText('Yanig checks for new data every 10 minutes.')).toBeVisible();
  const list = page.locator('main ol').first();
  await expect(list.getByRole('button', { name: /Sablayan/ })).toBeVisible();
  await expect(list.getByRole('button', { name: /Alaska/ })).toHaveCount(0);

  await page.getByRole('button', { name: 'All regions' }).click();
  await expect(list.getByRole('button', { name: /Alaska/ })).toBeVisible();
  await expect(list.getByRole('button', { name: /Taupo/ })).toBeVisible();
  await expect(list.getByRole('button', { name: /Lombok/ })).toBeVisible();

  await page.getByRole('button', { name: 'Near the Philippines' }).click();
  await page.getByRole('button', { name: /Magnitude 5 and above/ }).click();
  await expect(list.getByRole('button', { name: /Manay/ })).toBeVisible();
  await expect(list.getByRole('button', { name: /Sablayan/ })).toHaveCount(0);

  await page.getByRole('button', { name: /Magnitude 6 and above/ }).click();
  await expect(page.getByText('No earthquakes match.', { exact: false })).toBeVisible();

  await page.getByRole('button', { name: 'All', exact: true }).click();
  const sablayan = list.getByRole('button', { name: /Sablayan/ });
  await sablayan.click();
  await expect(sablayan).toHaveAttribute('aria-pressed', 'true');
});

test('tracker shows an error with a retry when every source fails', async ({ page }) => {
  await page.unrouteAll();
  await mockApis(page, 'down');
  await page.goto('/tracker');
  await expect(page.getByText('Yanig could not load earthquake data')).toBeVisible({ timeout: 20_000 });
  await expect(page.getByRole('button', { name: 'Try again' })).toBeVisible();
});

test('deep links open the right page', async ({ page }) => {
  const response = await page.goto('/guides#kit');
  expect(response?.status()).toBe(200);
  await expect(page.getByRole('tab', { name: /go bag/i })).toHaveAttribute('aria-selected', 'true');
});

test('the go bag checklist keeps ticks after a reload', async ({ page }) => {
  await page.goto('/guides#kit');
  // The checkbox is visually hidden; people tap its label.
  const first = page.getByRole('checkbox').first();
  await page.locator(`label[for="${await first.getAttribute('id')}"]`).click();
  await expect(first).toBeChecked();
  await expect(page.getByText(/1 of \d+ ready/i)).toBeVisible();
  await page.reload();
  await expect(page.getByRole('checkbox').first()).toBeChecked();
});

test('Tagalog stays on after a reload', async ({ page }) => {
  await page.goto('/');
  await page.locator('header').getByRole('button', { name: 'tl', exact: true }).click();
  await expect(page.locator('main h1').first()).toContainText(/lindol|yumanig|lupa/i);
  await page.reload();
  await expect(page.locator('main h1').first()).toContainText(/lindol|yumanig|lupa/i);
});

test('the emergency finder searches cities', async ({ page }) => {
  await page.goto('/emergency-finder');
  await page.getByRole('searchbox').or(page.getByPlaceholder(/cebu/i)).first().fill('cebu');
  await expect(page.getByText(/^1 city$|^\d+ cit/i).first()).toBeVisible();
  await expect(page.getByText('Cebu City').first()).toBeVisible();
  await expect(page.getByText('Quezon City')).toHaveCount(0);
});

test('pages fit a phone screen', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  for (const route of ROUTES) {
    await page.goto(route);
    await page.waitForLoadState('networkidle');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, route).toBeLessThanOrEqual(0);
  }
});
