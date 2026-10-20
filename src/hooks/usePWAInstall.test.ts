import { describe, expect, it } from 'vitest';
import { wasDismissedRecently } from './usePWAInstall';

const DAY = 24 * 60 * 60 * 1000;
const now = Date.UTC(2026, 9, 20);

describe('wasDismissedRecently', () => {
  it('is false when the message was never closed', () => {
    expect(wasDismissedRecently(null, now)).toBe(false);
  });

  it('is true within 7 days of closing', () => {
    expect(wasDismissedRecently(String(now - 6 * DAY), now)).toBe(true);
  });

  it('is false 7 days or more after closing', () => {
    expect(wasDismissedRecently(String(now - 7 * DAY), now)).toBe(false);
  });

  it('is false for a bad or future value', () => {
    expect(wasDismissedRecently('not a number', now)).toBe(false);
    expect(wasDismissedRecently(String(now + DAY), now)).toBe(false);
  });
});
