import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const DISMISS_KEY = 'pwa-install-dismissed';
const DISMISS_DAYS = 7;
const DAY_MS = 1000 * 60 * 60 * 24;

/** True when the person closed the install message less than 7 days ago. */
export const wasDismissedRecently = (dismissedAt: string | null, now: number = Date.now()): boolean => {
  if (!dismissedAt) return false;
  const time = parseInt(dismissedAt, 10);
  if (!Number.isFinite(time)) return false;
  return now - time >= 0 && (now - time) / DAY_MS < DISMISS_DAYS;
};

const readDismissed = (): string | null => {
  try {
    return localStorage.getItem(DISMISS_KEY);
  } catch {
    return null;
  }
};

export const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(() => wasDismissedRecently(readDismissed()));

  useEffect(() => {
    if (window.matchMedia?.('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt) return false;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    return outcome === 'accepted';
  };

  const dismissPrompt = () => {
    setDismissed(true);
    setDeferredPrompt(null);
    try {
      localStorage.setItem(DISMISS_KEY, Date.now().toString());
    } catch {
      // Storage can be blocked. The message still closes for this visit.
    }
  };

  return {
    isInstallable: deferredPrompt !== null,
    isInstalled,
    promptInstall,
    dismissPrompt,
    shouldShowPrompt: deferredPrompt !== null && !isInstalled && !dismissed,
  };
};

export default usePWAInstall;
