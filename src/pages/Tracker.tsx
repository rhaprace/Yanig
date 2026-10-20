import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SEO } from '@/components/SEO';
import { PageHero } from '@/components/poster';
import { Button } from '@/components/ui/button';
import EarthquakeMap from '@/components/EarthquakeMap';
import { Segmented } from '@/components/tracker/Segmented';
import { StatusBar } from '@/components/tracker/StatusBar';
import { QuakeList } from '@/components/tracker/QuakeList';
import { MapLegend } from '@/components/tracker/MapLegend';
import { useMultiSourceEarthquakeData } from '@/hooks/useMultiSourceEarthquakeData';
import type { EarthquakeFeature } from '@/types/common';
import { getTrackerSEO } from '@/utils/seo';
import {
  DEFAULT_MAGNITUDE,
  DEFAULT_REGION,
  DEFAULT_SORT,
  DEFAULT_TRACKER_VIEW,
  MAGNITUDE_FILTERS,
  REGION_FILTERS,
  SORT_ORDERS,
  TRACKER_VIEWS,
  selectEarthquakes,
  type MagnitudeFilter,
  type RegionFilter,
  type SortOrder,
  type TrackerView,
} from '@/utils/tracker';

/** Re-render once a minute so "5 minutes ago" stays correct. */
const useNow = () => {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 60 * 1000);
    return () => window.clearInterval(id);
  }, []);
  return now;
};

const prefersReducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

const LoadingPlaceholder = ({ label }: { label: string }) => (
  <div role="status" className="grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
    <span className="sr-only">{label}</span>
    <div aria-hidden="true" className="h-[360px] border-4 border-primary/30 bg-muted/60 lg:h-[600px]" />
    <div aria-hidden="true" className="border-t-4 border-primary/30">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="flex items-center gap-4 border-b-2 border-dashed border-primary/20 px-3 py-4">
          <div className="h-9 w-14 bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 bg-muted" />
            <div className="h-4 w-1/2 bg-muted/70" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const Tracker = () => {
  const { t } = useTranslation('tracker');
  const { data, error, refetch, isFetching, isPending, dataUpdatedAt } = useMultiSourceEarthquakeData();
  const now = useNow();

  const [minMagnitude, setMinMagnitude] = useState<MagnitudeFilter>(DEFAULT_MAGNITUDE);
  const [sort, setSort] = useState<SortOrder>(DEFAULT_SORT);
  const [region, setRegion] = useState<RegionFilter>(DEFAULT_REGION);
  const [view, setView] = useState<TrackerView>(DEFAULT_TRACKER_VIEW);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const mapBoxRef = useRef<HTMLDivElement>(null);

  const quakes = useMemo(
    () => selectEarthquakes(data?.features ?? [], { minMagnitude, region, sort }),
    [data, minMagnitude, region, sort],
  );

  // A selection hidden by a filter is no longer selected.
  const activeSelectedId = selectedId && quakes.some((q) => q.id === selectedId) ? selectedId : null;

  const handleListSelect = useCallback(
    (quake: EarthquakeFeature) => {
      setSelectedId(quake.id);
      if (view === 'list') setView('both');
      // On small screens the map is above the list. Bring it into view.
      requestAnimationFrame(() => {
        const box = mapBoxRef.current;
        if (!box) return;
        const rect = box.getBoundingClientRect();
        if (rect.top < 0 || rect.top > window.innerHeight - 120) {
          box.scrollIntoView({
            behavior: prefersReducedMotion() ? 'auto' : 'smooth',
            block: 'start',
          });
        }
      });
    },
    [view],
  );

  const handleMapSelect = useCallback((quake: EarthquakeFeature) => setSelectedId(quake.id), []);
  const handleRefresh = () => void refetch();

  const seo = getTrackerSEO();
  const showMap = view === 'map' || view === 'both';
  const showList = view === 'list' || view === 'both';
  const fitKey = `${region}|${minMagnitude}`;

  return (
    <>
      <SEO
        {...seo}
        title={t('seo.title')}
        description={t('seo.description')}
        keywords={['earthquake tracker', 'Philippines earthquakes', 'lindol', 'USGS', 'GeoNet', 'BMKG']}
      />
      <PageHero kicker={t('hero.kicker')} title={t('hero.title')} intro={<p>{t('hero.intro')}</p>} />

      <div className="page-wrap pb-16">
        <StatusBar
          updatedAt={data ? dataUpdatedAt : 0}
          isFetching={isFetching}
          staleError={Boolean(error && data)}
          onRefresh={handleRefresh}
        />

        <div className="mt-6 flex flex-wrap items-end gap-x-6 gap-y-4">
          <Segmented
            label={t('controls.region')}
            value={region}
            onChange={setRegion}
            options={REGION_FILTERS.map((value) => ({
              value,
              label: t(`controls.${value}`),
            }))}
          />
          <Segmented
            label={t('controls.magnitude')}
            value={minMagnitude}
            onChange={setMinMagnitude}
            options={MAGNITUDE_FILTERS.map((value) =>
              value === 0
                ? { value, label: t('controls.magAll') }
                : {
                    value,
                    label: t('controls.magMin', { value }),
                    ariaLabel: t('controls.magMinLabel', { value }),
                  },
            )}
          />
          <Segmented
            label={t('controls.sort')}
            value={sort}
            onChange={setSort}
            options={SORT_ORDERS.map((value) => ({
              value,
              label: t(`controls.${value}`),
            }))}
          />
          <Segmented
            label={t('controls.view')}
            value={view}
            onChange={setView}
            options={TRACKER_VIEWS.map((value) => ({
              value,
              label: t(`controls.${value}`),
            }))}
          />
        </div>

        <div className="mt-8">
          {isPending ? (
            <LoadingPlaceholder label={t('loading')} />
          ) : !data ? (
            <div role="alert" className="border-l-8 border-riso bg-card px-5 py-6">
              <p className="font-display text-3xl font-black uppercase leading-tight text-primary">
                {t('error.title')}
              </p>
              <p className="mt-2 text-lg">{t('error.body')}</p>
              <Button className="mt-4 text-base" onClick={handleRefresh} disabled={isFetching}>
                {t('error.retry')}
              </Button>
            </div>
          ) : (
            <>
              {view === 'map' && quakes.length === 0 && (
                <p className="mb-4 border-y-4 border-primary px-2 py-6 text-lg font-semibold">{t('empty')}</p>
              )}
              <div className={view === 'both' ? 'grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]' : ''}>
                {showMap && (
                  <div ref={mapBoxRef} className="min-w-0 scroll-mt-24">
                    <EarthquakeMap
                      earthquakes={quakes}
                      selectedId={activeSelectedId}
                      onSelect={handleMapSelect}
                      region={region}
                      fitKey={fitKey}
                      className={
                        view === 'map' ? 'h-[420px] sm:h-[560px] lg:h-[640px]' : 'h-[360px] sm:h-[460px] lg:h-[600px]'
                      }
                    />
                    <MapLegend />
                  </div>
                )}
                {showList && (
                  <section aria-labelledby="quake-list-heading" className="min-w-0">
                    <div className="mb-2 flex items-baseline justify-between gap-3">
                      <h2
                        id="quake-list-heading"
                        className="font-display text-3xl font-black uppercase leading-none text-primary"
                      >
                        {t('list.heading')}
                      </h2>
                      <p className="text-base text-muted-foreground" aria-live="polite">
                        {t('list.count', { count: quakes.length })}
                      </p>
                    </div>
                    {quakes.length === 0 ? (
                      <p className="border-y-4 border-primary px-2 py-6 text-lg font-semibold">{t('empty')}</p>
                    ) : (
                      <QuakeList
                        quakes={quakes}
                        selectedId={activeSelectedId}
                        onSelect={handleListSelect}
                        now={now}
                        className={view === 'both' ? 'lg:max-h-[600px] lg:overflow-y-auto' : ''}
                      />
                    )}
                  </section>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Tracker;
