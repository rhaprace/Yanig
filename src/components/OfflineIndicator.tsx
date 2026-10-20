import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { WifiOff, Wifi } from 'lucide-react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

/**
 * A small printed label in the corner. It shows while offline,
 * and for 3 seconds after the connection comes back.
 */
export const OfflineIndicator = () => {
  const { t } = useTranslation('about');
  const isOnline = useOnlineStatus();
  const [wasOffline, setWasOffline] = useState(false);
  const [showOnline, setShowOnline] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true);
      setShowOnline(false);
      return;
    }
    if (wasOffline) {
      setShowOnline(true);
      const timer = setTimeout(() => {
        setShowOnline(false);
        setWasOffline(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  const visible = !isOnline || showOnline;

  return (
    <div role="status" aria-live="polite" className="contents">
      {visible && (
        <p
          className="fixed left-4 z-50 flex max-w-[calc(100vw-2rem)] items-center gap-2 border-2 border-primary bg-card px-3 py-2 text-sm font-semibold text-card-foreground shadow-[3px_3px_0_hsl(var(--riso))]"
          style={{ bottom: 'calc(var(--yanig-strip-h, 0px) + max(12px, env(safe-area-inset-bottom)))' }}
        >
          {isOnline ? (
            <Wifi className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          ) : (
            <WifiOff className="h-4 w-4 shrink-0 text-riso-text" aria-hidden="true" />
          )}
          {isOnline ? t('prompts.status.online') : t('prompts.status.offline')}
        </p>
      )}
    </div>
  );
};

export default OfflineIndicator;
