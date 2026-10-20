import { useTranslation } from 'react-i18next';
import { PageHero } from '@/components/poster';
import { ExternalLink } from './ExternalLink';
import { parseLegalSections } from './legal';

const num = (index: number) => String(index + 1).padStart(2, '0');

/** Privacy notice and terms of use: a long printed notice with numbered sections. */
export const LegalPage = ({ namespace }: { namespace: 'privacy' | 'terms' }) => {
  const { t } = useTranslation(namespace);
  const sections = parseLegalSections(t('sections', { returnObjects: true }));

  const contents = (
    <ol className="grid gap-1">
      {sections.map((section, index) => (
        <li key={section.id}>
          <a
            href={`#${section.id}`}
            className="flex min-h-11 items-baseline gap-3 py-2 font-semibold text-primary underline-offset-4 hover:underline"
          >
            <span className="font-display text-lg font-black text-riso-text">{num(index)}</span>
            <span>{section.title}</span>
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <>
      <PageHero kicker={t('kicker')} title={t('title')} intro={<p>{t('intro')}</p>}>
        <p className="mt-6 inline-block border-l-[6px] border-riso pl-3 text-base font-semibold">
          {t('lastUpdated')}: {t('date')}
        </p>
      </PageHero>

      <div className="page-wrap grid gap-10 pb-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
        <nav aria-label={t('contents')} className="lg:sticky lg:top-24 lg:self-start">
          <details className="border-y-2 border-primary lg:hidden">
            <summary className="flex min-h-12 cursor-pointer items-center font-display text-xl font-black uppercase text-primary">
              {t('contents')}
            </summary>
            <div className="pb-3">{contents}</div>
          </details>
          <div className="hidden lg:block">
            <p className="poster-rule mb-2 pt-3 font-display text-xl font-black uppercase text-primary">{t('contents')}</p>
            {contents}
          </div>
        </nav>

        <article className="grid max-w-[70ch] gap-12 text-[17px] leading-relaxed">
          {sections.map((section, index) => (
            <section
              key={section.id}
              id={section.id}
              aria-labelledby={`${section.id}-title`}
              className={`scroll-mt-24 ${section.warning ? 'border-l-8 border-riso bg-card p-5 sm:p-6' : ''}`}
            >
              <h2
                id={`${section.id}-title`}
                className="mb-4 flex items-baseline gap-3 font-display text-3xl font-black uppercase leading-none text-primary"
              >
                <span className="text-riso-text">{num(index)}</span>
                <span>{section.title}</span>
              </h2>
              <div className="grid gap-3">
                {section.paragraphs.map((text) => (
                  <p key={text}>{text}</p>
                ))}
                {section.items.length > 0 && (
                  <ul className="grid gap-2 pl-5 marker:text-riso [list-style:square]">
                    {section.items.map((item) => (
                      <li key={item} className="pl-1">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
                {section.after.map((text) => (
                  <p key={text}>{text}</p>
                ))}
                {section.link && (
                  <p>
                    <ExternalLink
                      href={section.link.href}
                      className="inline-flex min-h-11 items-center font-semibold text-primary underline decoration-riso decoration-2 underline-offset-4"
                    >
                      {section.link.label}
                    </ExternalLink>
                  </p>
                )}
              </div>
            </section>
          ))}
        </article>
      </div>
    </>
  );
};

export default LegalPage;
