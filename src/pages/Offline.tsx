import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SEO } from '@/components/SEO';
import { PageHero } from '@/components/poster';
import { refreshPage } from '@/utils/offline';
import { getOfflineSEO } from '@/utils/seo';

const list = (value: unknown): string[] => (Array.isArray(value) ? value.filter((v) => typeof v === 'string') : []);

const Offline = () => {
  const { t } = useTranslation('about');
  const works = list(t('offlinePage.works', { returnObjects: true }));
  const needs = list(t('offlinePage.needs', { returnObjects: true }));

  return (
    <>
      <SEO {...getOfflineSEO()} />
      <PageHero kicker={t('offlinePage.kicker')} title={t('offlinePage.title')} intro={<p>{t('offlinePage.intro')}</p>}>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={refreshPage} size="lg">
            <RefreshCw aria-hidden="true" />
            {t('offlinePage.tryAgain')}
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/guides">{t('offlinePage.guides')}</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/emergency-finder">{t('offlinePage.hotlines')}</Link>
          </Button>
        </div>
      </PageHero>

      <div className="page-wrap grid gap-0 border-t-[3px] border-primary text-[17px] md:grid-cols-2">
        <section className="py-6 md:pr-8" aria-labelledby="offline-works">
          <h2 id="offline-works" className="mb-3 font-display text-3xl font-black uppercase leading-none text-primary">
            {t('offlinePage.worksTitle')}
          </h2>
          <ul className="grid gap-2 pl-5 marker:text-riso [list-style:square]">
            {works.map((item) => (
              <li key={item} className="pl-1">
                {item}
              </li>
            ))}
          </ul>
        </section>
        <section
          className="border-t border-dashed border-primary py-6 md:border-l md:border-t-0 md:pl-8"
          aria-labelledby="offline-needs"
        >
          <h2 id="offline-needs" className="mb-3 font-display text-3xl font-black uppercase leading-none text-primary">
            {t('offlinePage.needsTitle')}
          </h2>
          <ul className="grid gap-2 pl-5 marker:text-riso [list-style:square]">
            {needs.map((item) => (
              <li key={item} className="pl-1">
                {item}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
};

export default Offline;
