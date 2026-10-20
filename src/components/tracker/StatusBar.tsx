import { RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { formatDateTime, SOURCE_LABELS } from '@/utils/tracker';

interface StatusBarProps {
  /** When the shown data was loaded, in ms. 0 when nothing loaded yet. */
  updatedAt: number;
  isFetching: boolean;
  /** True when the last check failed but older data is still on screen. */
  staleError: boolean;
  onRefresh: () => void;
  /** False right after new data arrived: the button waits a minute. */
  canRefresh: boolean;
}

const SOURCES = Object.values(SOURCE_LABELS).join(' · ');

export const StatusBar = ({ updatedAt, isFetching, staleError, onRefresh, canRefresh }: StatusBarProps) => {
  const { t, i18n } = useTranslation('tracker');
  const time = updatedAt ? formatDateTime(updatedAt, i18n.language) : '';

  return (
    <section
      aria-label={t('status.sources')}
      className="flex flex-col gap-4 border-y-4 border-primary py-4 md:flex-row md:items-center md:justify-between"
    >
      <div className="min-w-0 border-l-[6px] border-riso pl-3">
        <p className="font-display text-xl font-black uppercase leading-tight text-primary">{t('status.interval')}</p>
        <p className="mt-1 text-base" aria-live="polite">
          {isFetching ? (
            t('status.checking')
          ) : time ? (
            <time dateTime={new Date(updatedAt).toISOString()}>{t('status.lastUpdated', { time })}</time>
          ) : null}
        </p>
        {staleError && time && (
          <p className="mt-1 text-base font-semibold text-riso-text">{t('status.staleError', { time })}</p>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <p className="text-base">
          <span className="font-display font-bold uppercase tracking-[0.12em] text-riso-text">
            {t('status.sources')}
          </span>{' '}
          <span className="font-semibold">{SOURCES}</span>
        </p>
        <Button variant="outline" onClick={onRefresh} disabled={isFetching || !canRefresh} className="text-base">
          <RefreshCw aria-hidden="true" />
          {canRefresh || isFetching ? t('status.refresh') : t('status.upToDate')}
        </Button>
      </div>
    </section>
  );
};
