import { useCallback, useEffect, useRef, useState } from 'react';
import { canRefresh, MIN_REFRESH_GAP_MS } from '@/utils/tracker';

/**
 * A refresh button that cannot spam the sources. It is allowed again a minute after the newest data or the
 * last tap, whichever is later. The check runs at tap time, so fast taps before the screen updates are ignored too.
 */
export const useRefreshGate = (updatedAt: number) => {
  const [, setTick] = useState(0);
  const lastTap = useRef(0);
  const since = Math.max(updatedAt, lastTap.current);
  const allowed = canRefresh(since, Date.now());

  useEffect(() => {
    if (allowed) return;
    const wait = Math.max(0, since + MIN_REFRESH_GAP_MS - Date.now()) + 50;
    const timer = window.setTimeout(() => setTick((n) => n + 1), wait);
    return () => window.clearTimeout(timer);
  }, [allowed, since]);

  /** Runs refresh only when allowed now. Returns whether it ran. */
  const tryRefresh = useCallback(
    (refresh: () => unknown): boolean => {
      const now = Date.now();
      if (!canRefresh(Math.max(updatedAt, lastTap.current), now)) return false;
      lastTap.current = now;
      setTick((n) => n + 1);
      refresh();
      return true;
    },
    [updatedAt],
  );

  return { allowed, tryRefresh };
};
