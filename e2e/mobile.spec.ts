import { devices, expect, test, type Page } from '@playwright/test';
import { mockApis } from './fixtures';

// A real phone setup: touch, mobile viewport. The Pixel profile runs in Chromium, so touch can be sent through CDP.
const { defaultBrowserType: _ignored, ...pixel } = devices['Pixel 7'];
test.use(pixel);

/** Swipe up with one finger, drifting a little sideways like a real thumb. Returns how far the page scrolled. */
const swipeUp = async (page: Page, x: number, y: number) => {
  const cdp = await page.context().newCDPSession(page);
  const before = await page.evaluate(() => window.scrollY);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
  for (let i = 1; i <= 12; i++) {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x + i * 3, y: y - i * 20 }] });
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await page.waitForTimeout(500);
  return (await page.evaluate(() => window.scrollY)) - before;
};

for (const route of ['/tracker', '/emergency-finder']) {
  test(`${route}: one finger on the map scrolls the page, and the map does not slide sideways`, async ({ page }) => {
    await mockApis(page);
    await page.goto(route);
    const map = page.locator('.leaflet-container').first();
    await expect(map).toBeVisible();
    await map.evaluate((el) => window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 80));
    const box = (await map.boundingBox())!;
    const pane = () => page.locator('.leaflet-map-pane').first().evaluate((el) => (el as HTMLElement).style.transform);
    const panBefore = await pane();

    const scrolled = await swipeUp(page, box.x + box.width / 2, box.y + box.height / 2 + 100);
    expect(scrolled).toBeGreaterThan(100);
    expect(await pane()).toBe(panBefore);
    expect(await page.evaluate(() => window.scrollX)).toBe(0);
  });
}

test('home: the shaking figure stops after a moment', async ({ page }) => {
  await mockApis(page);
  await page.goto('/');
  // The table shakes on step 3, Hold on.
  for (let i = 0; i < 2; i++) await page.getByRole('button', { name: /next/i }).first().click();
  const shaking = page.locator('.yanig-shake').first();
  await expect(shaking).toHaveCount(1);
  await page.waitForTimeout(1500);
  const running = await shaking.evaluate((el) => el.getAnimations().filter((a) => a.playState === 'running').length);
  expect(running).toBe(0);
});
