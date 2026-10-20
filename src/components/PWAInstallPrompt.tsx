import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { BottomStrip } from '@/components/pages/BottomStrip';
import { usePWAInstall } from '@/hooks/usePWAInstall';

/** "Add to home screen" strip. It shows only when the browser offers install, a few seconds after load. No sound. */
export const PWAInstallPrompt = () => {
  const { t } = useTranslation('about');
  const { shouldShowPrompt, promptInstall, dismissPrompt } = usePWAInstall();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!shouldShowPrompt) return;
    const timer = setTimeout(() => setReady(true), 3000);
    return () => clearTimeout(timer);
  }, [shouldShowPrompt]);

  if (!shouldShowPrompt || !ready) return null;

  const handleInstall = async () => {
    const accepted = await promptInstall();
    if (!accepted) dismissPrompt();
  };

  return (
    <BottomStrip
      labelId="pwa-install-title"
      title={t('prompts.install.title')}
      text={t('prompts.install.text')}
      actions={
        <>
          <Button onClick={handleInstall}>{t('prompts.install.install')}</Button>
          <Button onClick={dismissPrompt} variant="outline">
            {t('prompts.install.dismiss')}
          </Button>
        </>
      }
    />
  );
};

export default PWAInstallPrompt;
