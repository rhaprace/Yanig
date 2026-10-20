import { useTranslation } from 'react-i18next';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { Button } from '@/components/ui/button';
import { BottomStrip } from '@/components/pages/BottomStrip';

/** Tells the person that a new version of Yanig is ready, and lets them reload. */
export const PWAUpdatePrompt = () => {
  const { t } = useTranslation('about');
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisterError(error: Error) {
      console.error('SW registration error', error);
    },
  });

  if (!needRefresh) return null;

  return (
    <BottomStrip
      labelId="pwa-update-title"
      title={t('prompts.update.title')}
      text={t('prompts.update.text')}
      actions={
        <>
          <Button onClick={() => updateServiceWorker(true)}>{t('prompts.update.reload')}</Button>
          <Button onClick={() => setNeedRefresh(false)} variant="outline">
            {t('prompts.update.later')}
          </Button>
        </>
      }
    />
  );
};

export default PWAUpdatePrompt;
