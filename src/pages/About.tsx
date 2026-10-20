import { useTranslation } from 'react-i18next';
import { SEO } from '@/components/SEO';
import { PageHero, SectionTitle, Stamp } from '@/components/poster';
import { ExternalLink } from '@/components/pages/ExternalLink';
import { dataSources, PHIVOLCS_URL, SOURCE_CODE_URL } from '@/utils/about';
import { getAboutSEO } from '@/utils/seo';

const list = (value: unknown): string[] => (Array.isArray(value) ? value.filter((v) => typeof v === 'string') : []);

const linkClass =
  'inline-flex min-h-11 items-center font-semibold text-primary underline decoration-riso decoration-2 underline-offset-4';

const About = () => {
  const { t } = useTranslation('about');

  const does = list(t('does.items', { returnObjects: true }));
  const doesNot = list(t('doesNot.items', { returnObjects: true }));
  const offline = list(t('offline.items', { returnObjects: true }));
  const maker = list(t('maker.items', { returnObjects: true }));

  return (
    <>
      <SEO {...getAboutSEO()} />
      <PageHero kicker={t('kicker')} title={t('title')} intro={<p>{t('intro')}</p>}>
        <div className="mt-6">
          <Stamp>
            {t('stamp')}
            <small className="block font-sans text-xs font-semibold tracking-[0.08em]">{t('stampSub')}</small>
          </Stamp>
        </div>
      </PageHero>

      <div className="page-wrap grid gap-14 text-[17px] leading-relaxed">
        <section className="grid gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]" aria-labelledby="does">
          <div>
            <SectionTitle id="does" title={t('does.title')} />
            <ol className="grid">
              {does.map((item, index) => (
                <li key={item} className="flex gap-4 border-b border-dashed border-primary/60 py-3">
                  <span className="w-8 shrink-0 font-display text-3xl font-black leading-none text-riso-text">
                    {index + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </div>

          <aside className="relative self-start border-[3px] border-riso bg-card p-5 sm:p-6" aria-labelledby="does-not">
            <span className="halftone-red absolute right-3 top-3 h-14 w-14 rounded-full opacity-60" aria-hidden="true" />
            <h2 id="does-not" className="relative mb-4 max-w-[80%] font-display text-3xl font-black uppercase leading-none text-primary">
              {t('doesNot.title')}
            </h2>
            <ul className="relative grid gap-3 pl-5 font-semibold marker:text-riso [list-style:square]">
              {doesNot.map((item) => (
                <li key={item} className="pl-1">
                  {item}
                </li>
              ))}
            </ul>
          </aside>
        </section>

        <section aria-labelledby="data">
          <SectionTitle id="data" kicker={t('data.kicker')} title={t('data.title')} intro={t('data.intro')} />
          <ul>
            {dataSources.map((source) => (
              <li
                key={source.id}
                className="grid gap-x-6 gap-y-1 border-b border-dashed border-primary/60 py-4 sm:grid-cols-[8rem_minmax(0,1fr)_auto] sm:items-center"
              >
                <span className="font-display text-4xl font-black uppercase leading-none text-primary">
                  {t(`data.sources.${source.id}.name`)}
                </span>
                <span>
                  <span className="block font-semibold">{t(`data.sources.${source.id}.full`)}</span>
                  <span className="text-muted-foreground">{t(`data.sources.${source.id}.text`)}</span>
                </span>
                <ExternalLink href={source.url} className={linkClass}>
                  {t('data.visit', { name: t(`data.sources.${source.id}.name`) })}
                </ExternalLink>
              </li>
            ))}
          </ul>
          <p className="mt-4 max-w-2xl border-l-[6px] border-riso pl-3">{t('data.estimate')}</p>
        </section>

        <section aria-labelledby="official" className="bg-primary px-5 py-8 text-primary-foreground sm:px-8">
          <p className="mb-2 font-display text-base font-bold uppercase tracking-[0.16em] opacity-90">{t('official.kicker')}</p>
          <h2 id="official" className="font-display text-4xl font-black uppercase leading-none md:text-5xl">
            {t('official.title')}
          </h2>
          <p className="mt-4 max-w-2xl">{t('official.text1')}</p>
          <p className="mt-2 max-w-2xl">{t('official.text2')}</p>
          <ExternalLink
            href={PHIVOLCS_URL}
            className="mt-5 inline-flex min-h-12 items-center rounded-sm bg-primary-foreground px-5 font-semibold text-primary shadow-[3px_3px_0_hsl(var(--riso))]"
          >
            {t('official.link')}
          </ExternalLink>
        </section>

        <section className="grid border-t-[3px] border-primary md:grid-cols-3" aria-label={t('kicker')}>
          <div className="py-5 md:pr-6">
            <h2 className="mb-3 font-display text-3xl font-black uppercase leading-none text-primary">{t('offline.title')}</h2>
            <ul className="grid gap-2 pl-5 marker:text-riso [list-style:square]">
              {offline.map((item) => (
                <li key={item} className="pl-1">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="border-t border-dashed border-primary py-5 md:border-l md:border-t-0 md:px-6">
            <h2 className="mb-3 font-display text-3xl font-black uppercase leading-none text-primary">{t('languages.title')}</h2>
            <p>{t('languages.text')}</p>
          </div>
          <div className="border-t border-dashed border-primary py-5 md:border-l md:border-t-0 md:pl-6">
            <h2 className="mb-3 font-display text-3xl font-black uppercase leading-none text-primary">{t('maker.title')}</h2>
            <ul className="grid gap-2 pl-5 marker:text-riso [list-style:square]">
              {maker.map((item) => (
                <li key={item} className="pl-1">
                  {item}
                </li>
              ))}
            </ul>
            <ExternalLink href={SOURCE_CODE_URL} className={`${linkClass} mt-2`}>
              {t('maker.link')}
            </ExternalLink>
          </div>
        </section>
      </div>
    </>
  );
};

export default About;
