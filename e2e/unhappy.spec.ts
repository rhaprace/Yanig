import { expect, test } from '@playwright/test';
import { advance, mockApis } from './fixtures';

const list = (page: import('@playwright/test').Page) => page.locator('main ol').first();

test.describe('a source fails, the others still show', () => {
  test('USGS never answers: GeoNet and BMKG show after the timeout', async ({ page }) => {
    await page.clock.install();
    await mockApis(page, { usgs: 'hang' });
    await page.goto('/tracker');
    await page.getByRole('button', { name: 'All regions' }).click();
    await advance(page, 30_000);
    await expect(list(page).getByRole('button', { name: /Taupo/ })).toBeVisible();
    await expect(list(page).getByRole('button', { name: /Lombok/ })).toBeVisible();
    await expect(list(page).getByRole('button', { name: /Sablayan/ })).toHaveCount(0);
  });

  test('USGS answers with an HTML page: the page does not crash', async ({ page }) => {
    await page.clock.install();
    await mockApis(page, { usgs: 'junk' });
    await page.goto('/tracker');
    await advance(page, 10_000);
    await page.getByRole('button', { name: 'All regions' }).click();
    await expect(list(page).getByRole('button', { name: /Taupo/ })).toBeVisible();
  });

  test('GeoNet gives a server error and BMKG is down: USGS still shows', async ({ page }) => {
    await mockApis(page, { geonet: 'http500', bmkg: 'down' });
    await page.goto('/tracker');
    await expect(list(page).getByRole('button', { name: /Sablayan/ })).toBeVisible();
  });

  test('no earthquake near the Philippines: home shows the newest from anywhere and says so', async ({ page }) => {
    await mockApis(page, { usgs: 'down' });
    await page.goto('/');
    await expect(page.getByText(/Taupo/)).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(/Worldwide/i).first()).toBeVisible();
  });
});

test('every source down: the tracker says so and the retry works when they come back', async ({ page }) => {
  await page.clock.install();
  await mockApis(page, 'down');
  await page.goto('/tracker');
  await advance(page, 60_000);
  await expect(page.getByText('Yanig could not load earthquake data')).toBeVisible();
  await page.unrouteAll();
  await mockApis(page);
  await page.getByRole('button', { name: 'Try again' }).click();
  await expect(list(page).getByRole('button', { name: /Sablayan/ })).toBeVisible();
});

test('the browser says it went offline: the tracker says so, then loads when it is back online', async ({ page }) => {
  await mockApis(page);
  await page.goto('/guides');
  await page.evaluate(() => window.dispatchEvent(new Event('offline')));
  await page.locator('header').getByRole('link', { name: 'Tracker' }).first().click();
  await expect(page.getByText('You are offline.', { exact: false })).toBeVisible();
  await page.evaluate(() => window.dispatchEvent(new Event('online')));
  await expect(list(page).getByRole('button', { name: /Sablayan/ })).toBeVisible();
});

test.describe('with the service worker, as on a real phone', () => {
  test.use({ serviceWorkers: 'allow' });

  test('pages opened before still open with no internet, also after a reload', async ({ page, context }) => {
    await mockApis(context);
    await page.goto('/guides');
    // Wait until the service worker has stored the app and controls the page.
    await page.evaluate(async () => {
      await navigator.serviceWorker.ready;
    });
    await page.reload();
    await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
    await expect(page.locator('main h1').first()).toBeVisible();

    // Cut the network for the page and for the service worker. context.setOffline alone does not stop
    // the service worker's own requests in Chromium, so block every request at the context too.
    await context.setOffline(true);
    let offline = true;
    await context.route('**/*', (route) => (offline ? route.abort('internetdisconnected') : route.fallback()));
    await page.reload();
    // Prove the network is cut: a new address the service worker never saw cannot load.
    const reached = await page.evaluate(() => fetch(`/robots.txt?probe=${Date.now()}`).then(() => true, () => false));
    expect(reached).toBe(false);
    await expect(page.locator('main h1').first()).toBeVisible();
    await expect(page.getByRole('tab', { selected: true })).toHaveCount(1);
    await page.locator('header').getByRole('link', { name: 'About' }).first().click();
    await expect(page.locator('main h1').first()).toBeVisible();
    // A page never opened before also opens, because the service worker answers every page with the app.
    await page.goto('/resources');
    await expect(page.locator('main h1').first()).toBeVisible();
    offline = false;
    await context.setOffline(false);
  });
});

test('news server error: sample articles show with a clear label', async ({ page }) => {
  await mockApis(page, { news: 'http500' });
  await page.goto('/news');
  await expect(page.getByText(/sample/i).first()).toBeVisible();
});

test('news: an article with an unsafe link is not shown', async ({ page }) => {
  await mockApis(page);
  await page.goto('/news');
  await expect(page.getByRole('heading', { name: 'Magnitude 5 earthquake felt in Mindanao' })).toBeVisible();
  await expect(page.getByText('Unsafe link article')).toHaveCount(0);
  await expect(page.locator('a[href^="javascript:"]')).toHaveCount(0);
});

test('an unknown address shows a page-not-found notice with ways out', async ({ page }) => {
  await mockApis(page);
  await page.goto('/this-does-not-exist');
  await expect(page.getByRole('heading', { name: /does not exist/i })).toBeVisible();
  await page.getByRole('link', { name: 'Go to the home page' }).click();
  await expect(page).toHaveURL(/\/$/);
});

test('damaged saved settings do not stop the app', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('theme-storage', '{broken');
    localStorage.setItem('locale-storage', '"not an object"');
    for (const key of Object.keys(localStorage)) if (/kit/i.test(key)) localStorage.setItem(key, '{broken');
    localStorage.setItem('yanig-kit', '{broken');
  });
  await mockApis(page);
  for (const route of ['/', '/guides#kit', '/tracker']) {
    await page.goto(route);
    await expect(page.locator('main h1').first()).toBeVisible();
  }
  // The country fell back to the Philippines.
  await expect(page.locator('header').getByRole('button', { name: /country/i }).first()).toContainText('PH');
});

test('blocked storage (private browsing): the go bag still ticks for this visit', async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException('blocked', 'QuotaExceededError');
    };
    Storage.prototype.getItem = () => {
      throw new DOMException('blocked', 'SecurityError');
    };
  });
  await mockApis(page);
  await page.goto('/guides#kit');
  const box = page.getByRole('checkbox').first();
  await page.locator(`label[for="${await box.getAttribute('id')}"]`).click();
  await expect(box).toBeChecked();
});

test('guides: an unknown topic in the address opens the default topic', async ({ page }) => {
  await mockApis(page);
  await page.goto('/guides#nonsense');
  await expect(page.getByRole('tab', { selected: true })).toHaveCount(1);
});

test('finder: a search with no match says so, and odd input does not crash', async ({ page }) => {
  await mockApis(page);
  await page.goto('/emergency-finder');
  const search = page.getByRole('searchbox').or(page.getByPlaceholder(/cebu/i)).first();
  await search.fill('zzzz-no-city');
  await expect(page.getByText(/no city|no cities|walang/i).first()).toBeVisible();
  await search.fill('<script>alert(1)</script>🙂' + 'x'.repeat(500));
  await expect(page.getByText(/no city|no cities|walang/i).first()).toBeVisible();
  await search.fill('  CEBU  ');
  await expect(page.getByText('Cebu City').first()).toBeVisible();
});
