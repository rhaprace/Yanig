import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { EarthquakeFeature } from '@/types/common';
import { formatDateTime, formatMagnitude, formatTimeAgo, getSource, SOURCE_LABELS } from '@/utils/tracker';
import { MagnitudeDot } from './MagnitudeDot';

interface QuakeListProps {
  quakes: EarthquakeFeature[];
  selectedId: string | null;
  onSelect: (quake: EarthquakeFeature) => void;
  now: number;
  /** Extra classes for the scroll box, for example a max height next to the map. */
  className?: string;
}

export const QuakeList = ({ quakes, selectedId, onSelect, now, className = '' }: QuakeListProps) => {
  const { t, i18n } = useTranslation('tracker');
  const boxRef = useRef<HTMLDivElement>(null);

  // When a marker on the map is selected, scroll the list box (not the page) to the item.
  useEffect(() => {
    const box = boxRef.current;
    if (!box || !selectedId || box.scrollHeight <= box.clientHeight) return;
    const item = box.querySelector<HTMLElement>(`[data-quake-id="${CSS.escape(selectedId)}"]`);
    if (!item) return;
    const top = item.offsetTop; // The box is "relative", so this is the offset inside the box.
    if (top < box.scrollTop || top + item.offsetHeight > box.scrollTop + box.clientHeight) {
      box.scrollTop = Math.max(0, top - box.clientHeight / 3);
    }
  }, [selectedId]);

  return (
    <div ref={boxRef} className={`relative border-t-4 border-primary ${className}`}>
      <ol className="divide-y-2 divide-dashed divide-primary/40">
        {quakes.map((quake) => {
          const selected = quake.id === selectedId;
          const { mag, place, time } = quake.properties;
          const depth = quake.geometry.coordinates[2];
          return (
            <li key={quake.id} data-quake-id={quake.id}>
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => onSelect(quake)}
                className={`yq-ink grid min-h-11 w-full grid-cols-[5.25rem_minmax(0,1fr)] items-center gap-3 px-2 py-3 text-left transition-colors sm:px-3 ${
                  selected ? 'bg-primary text-primary-foreground' : 'hover:bg-primary/10'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="flex w-7 justify-center">
                    <MagnitudeDot mag={mag} />
                  </span>
                  <span className="sr-only">{t('list.magnitude', { mag: formatMagnitude(mag) })}</span>
                  <span
                    aria-hidden="true"
                    className={`font-display text-4xl font-black leading-none tabular-nums ${
                      selected ? 'text-primary-foreground' : 'text-primary'
                    }`}
                  >
                    {formatMagnitude(mag)}
                  </span>
                </span>
                <span className="min-w-0">
                  <span className="block break-words font-semibold leading-snug">{place}</span>
                  <span
                    className={`mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-base ${
                      selected ? 'text-primary-foreground/90' : 'text-muted-foreground'
                    }`}
                  >
                    <time dateTime={new Date(time).toISOString()} title={formatDateTime(time, i18n.language)}>
                      {formatTimeAgo(time, now, i18n.language)}
                    </time>
                    <span>{t('list.depth', { depth: Math.round(depth) })}</span>
                    <span
                      className={`border-2 px-1.5 text-sm font-bold uppercase leading-5 tracking-wider ${
                        selected ? 'border-primary-foreground' : 'border-primary/60 text-primary'
                      }`}
                    >
                      <span className="sr-only">{t('list.source', { source: '' })}</span>
                      {SOURCE_LABELS[getSource(quake)]}
                    </span>
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
};
