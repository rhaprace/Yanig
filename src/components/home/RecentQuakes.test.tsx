import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import i18n from '@/i18n/config';
import { RecentQuakes } from './RecentQuakes';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const hook = vi.hoisted(() => ({ value: {} as Record<string, unknown> }));
vi.mock('@/hooks/useMultiSourceEarthquakeData', () => ({ useMultiSourceEarthquakeData: () => hook.value }));

const feature = (id: string, minutesAgo: number, net: string, depth: number) => ({
  id,
  type: 'Feature',
  properties: { mag: 4.56, place: `Place ${id}`, time: Date.now() - minutesAgo * 60_000, net },
  geometry: { type: 'Point', coordinates: [120, 14, depth] },
});

describe('RecentQuakes', () => {
  let host: HTMLDivElement;
  let root: Root;
  const refetch = vi.fn();

  const render = () =>
    act(() =>
      root.render(
        <MemoryRouter>
          <RecentQuakes />
        </MemoryRouter>
      )
    );

  beforeEach(async () => {
    await i18n.changeLanguage('en');
    refetch.mockReset();
    host = document.createElement('div');
    document.body.appendChild(host);
    root = createRoot(host);
  });

  afterEach(() => {
    act(() => root.unmount());
    host.remove();
  });

  it('shows the five newest quakes with magnitude, depth, time and source', () => {
    hook.value = {
      data: { features: [1, 2, 3, 4, 5, 6].map((n) => feature(`q${n}`, n * 10, n === 1 ? 'geonet' : 'us', 12)) },
      isLoading: false,
      isFetching: false,
      refetch,
    };
    render();
    const rows = host.querySelectorAll('ol li');
    expect(rows).toHaveLength(5);
    expect(rows[0].textContent).toContain('4.6');
    expect(rows[0].textContent).toContain('Place q1');
    expect(rows[0].textContent).toContain('12 km deep');
    expect(rows[0].textContent).toContain('10 minutes ago');
    expect(rows[0].textContent).toContain('Source: GeoNet');
    expect(host.textContent).not.toContain('q6');
    expect(host.textContent).toContain('Yanig checks for new data every 10 minutes.');
  });

  it('shows quiet placeholder rows while loading, with no visible loading text', () => {
    hook.value = { data: undefined, isLoading: true, isFetching: true, refetch };
    render();
    expect(host.querySelector('[aria-busy="true"]')).not.toBeNull();
    expect(host.querySelectorAll('ol[aria-hidden="true"] li')).toHaveLength(5);
    expect(host.querySelector('[role="alert"]')).toBeNull();
  });

  it('shows a plain message and a retry button when there is no data', () => {
    hook.value = { data: { features: [] }, isLoading: false, isFetching: false, refetch };
    render();
    const alert = host.querySelector('[role="alert"]')!;
    expect(alert.textContent).toContain('Yanig cannot get earthquake data now.');
    act(() => alert.querySelector('button')!.click());
    expect(refetch).toHaveBeenCalledTimes(1);
  });
});
