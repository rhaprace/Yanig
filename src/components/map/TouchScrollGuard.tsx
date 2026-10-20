import { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import { useTranslation } from 'react-i18next';
import { isTouchFirst } from '@/utils/touch';

/**
 * On touch screens, one finger scrolls the page and two fingers move and zoom the map.
 * Without this, a finger that lands on the map while scrolling pans the map sideways and the page does not move.
 */
const TouchScrollGuard = () => {
  const map = useMap();
  const { t } = useTranslation('common');
  const [hint, setHint] = useState(false);

  useEffect(() => {
    if (!isTouchFirst()) return;
    map.dragging.disable();
    const container = map.getContainer();
    let timer: number | undefined;
    const onTouchMove = (event: TouchEvent) => {
      if (event.touches.length !== 1) return;
      setHint(true);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setHint(false), 1400);
    };
    container.addEventListener('touchmove', onTouchMove, { passive: true });
    return () => {
      container.removeEventListener('touchmove', onTouchMove);
      window.clearTimeout(timer);
      map.dragging.enable();
    };
  }, [map]);

  if (!hint) return null;
  return (
    <div
      role="status"
      className="pointer-events-none absolute inset-0 z-[1000] grid place-items-center bg-primary/60 p-4 text-center font-display text-2xl font-black uppercase text-primary-foreground"
    >
      {t('map.twoFingers')}
    </div>
  );
};

export default TouchScrollGuard;
