import { describe, expect, it } from 'vitest';
import { canRefresh, MIN_REFRESH_GAP_MS } from './tracker';

describe('canRefresh', () => {
  const now = 1_000_000_000;
  it('allows a refresh when nothing loaded yet', () => expect(canRefresh(0, now)).toBe(true));
  it('blocks a refresh right after new data', () => expect(canRefresh(now, now)).toBe(false));
  it('blocks a refresh one ms before the gap ends', () => expect(canRefresh(now - MIN_REFRESH_GAP_MS + 1, now)).toBe(false));
  it('allows a refresh when the gap ends', () => expect(canRefresh(now - MIN_REFRESH_GAP_MS, now)).toBe(true));
  it('blocks a refresh when the clock says the data is from the future', () => expect(canRefresh(now + 5000, now)).toBe(false));
});
