import { useBilingual } from './useBilingual';

export const OfflineNote = () => {
  const { t } = useBilingual();
  return (
    <div className="relative bg-secondary p-5 sm:p-6">
      <span aria-hidden="true" className="halftone-red absolute right-3 top-3 h-14 w-14 rounded-full opacity-60" />
      <h2 id="home-offline" className="relative max-w-[16ch] font-display text-3xl font-black uppercase leading-none text-primary">
        {t('offline.title')}
      </h2>
      <p className="mt-3">{t('offline.install')}</p>
      <p className="mt-2">{t('offline.before')}</p>
      <p className="mt-2">{t('offline.needsInternet')}</p>
    </div>
  );
};
