import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Kicker, Stamp } from '@/components/poster';
import { useBilingual } from './useBilingual';

export const HomeHero = () => {
  const { t, t2, lang2 } = useBilingual();
  return (
    <section aria-labelledby="home-title" className="page-wrap pb-8 pt-8 md:pt-10">
      <Kicker className="mb-3">{t('hero.kicker')}</Kicker>
      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <h1
          id="home-title"
          className="misreg max-w-4xl font-display text-[2.6rem] font-black uppercase leading-[0.92] text-primary sm:text-6xl lg:text-7xl"
        >
          {t('hero.title')}
          <span
            lang={lang2}
            className="mt-3 block max-w-[34ch] font-sans text-lg font-normal normal-case italic leading-snug tracking-normal text-muted-foreground [text-shadow:none] md:text-2xl"
          >
            {t2('hero.title')}
          </span>
        </h1>
        <Stamp className="justify-self-start text-center text-2xl sm:mb-2 sm:justify-self-end">
          {t('hero.stamp')}
          <small className="block font-sans text-xs font-semibold normal-case tracking-wider">{t('hero.stampSmall')}</small>
        </Stamp>
      </div>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-foreground/85">{t('hero.intro')}</p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Button asChild size="lg">
          <Link to="/guides">{t('hero.ctaGuides')}</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link to="/tracker">{t('hero.ctaTracker')}</Link>
        </Button>
      </div>
    </section>
  );
};
