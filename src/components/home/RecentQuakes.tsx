import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useMultiSourceEarthquakeData } from '@/hooks/useMultiSourceEarthquakeData';
import { depthKm, homeQuakes, sourceName, timeAgo } from '@/utils/home';
import { BiTitle } from './BiTitle';
import { useBilingual } from './useBilingual';

const QUAKE_COUNT = 5;

export const RecentQuakes = () => {
  const { t, language } = useBilingual();
  const { data, isLoading, isFetching, refetch, fetchStatus } = useMultiSourceEarthquakeData();
  const { quakes, nearPhilippines } = homeQuakes(data?.features, QUAKE_COUNT);

  return (
    <section aria-labelledby="home-quakes" className="page-wrap py-8">
      <BiTitle id="home-quakes" k="quakes.title" kicker={t(nearPhilippines ? 'quakes.kickerNear' : 'quakes.kicker')} />

      {quakes.length > 0 ? (
        <ol>
          {quakes.map((quake) => {
            const depth = depthKm(quake);
            const mag = quake.properties.mag;
            return (
              <li
                key={quake.id}
                className="grid grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-3 border-b border-dashed border-primary/50 py-3 sm:grid-cols-[5.5rem_minmax(0,1fr)]"
              >
                <span className="relative isolate font-display text-5xl font-black leading-none text-primary sm:text-6xl">
                  <span aria-hidden="true" className="halftone-red absolute -left-1 top-1 -z-10 h-10 w-10 rounded-full opacity-80 sm:h-12 sm:w-12" />
                  <span className="sr-only">{t('quakes.magnitude', { mag: mag?.toFixed(1) })}</span>
                  <span aria-hidden="true">{mag?.toFixed(1) ?? '?'}</span>
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold leading-snug">{quake.properties.place}</span>
                  <span className="block text-base text-muted-foreground">
                    {depth === null ? t('quakes.depthUnknown') : t('quakes.depth', { km: depth })}
                    {' · '}
                    <time dateTime={new Date(quake.properties.time).toISOString()}>
                      {timeAgo(quake.properties.time, language)}
                    </time>
                    {' · '}
                    {t('quakes.source', { name: sourceName(quake.properties.net) })}
                  </span>
                </span>
              </li>
            );
          })}
        </ol>
      ) : !data && fetchStatus === 'paused' ? (
        <p role="status" className="border-l-8 border-riso bg-card p-4 font-semibold">{t('quakes.offline')}</p>
      ) : isLoading ? (
        <div aria-busy="true">
          <p className="sr-only" role="status">{t('quakes.loading')}</p>
          <ol aria-hidden="true">
            {Array.from({ length: QUAKE_COUNT }, (_, i) => (
              <li
                key={i}
                className="grid grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-3 border-b border-dashed border-primary/50 py-3 sm:grid-cols-[5.5rem_minmax(0,1fr)]"
              >
                <span className="block h-12 w-14 bg-primary/10" />
                <span className="block space-y-2">
                  <span className="block h-4 w-3/5 bg-primary/10" />
                  <span className="block h-4 w-2/5 bg-primary/10" />
                </span>
              </li>
            ))}
          </ol>
        </div>
      ) : (
        <div role="alert" className="flex flex-col items-start gap-3 border-l-8 border-riso bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
          <p>{t('quakes.error')}</p>
          <Button type="button" variant="outline" disabled={isFetching} onClick={() => refetch({ cancelRefetch: false })}>
            {t('quakes.retry')}
          </Button>
        </div>
      )}

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-base text-muted-foreground">{t('quakes.updates')}</p>
        <Link
          to="/tracker"
          className="inline-flex min-h-11 items-center font-semibold text-primary underline decoration-riso decoration-2 underline-offset-4"
        >
          {t('quakes.link')}
        </Link>
      </div>
    </section>
  );
};
