import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { SEO } from '@/components/SEO';
import { PageHero, SectionTitle } from '@/components/poster';
import DropCoverHold from '@/components/guides/DropCoverHold';
import KitChecklist from '@/components/guides/KitChecklist';
import { DEFAULT_GUIDE, GUIDE_IDS, getGuideSections, isGuideId, type GuideId } from '@/utils/guide';
import { getGuidesSEO } from '@/utils/seo';

const guideFromHash = (): GuideId => {
  const hash = typeof window === 'undefined' ? '' : window.location.hash.slice(1);
  return isGuideId(hash) ? hash : DEFAULT_GUIDE;
};

const Guides = () => {
  const { t } = useTranslation('guides');
  const [selected, setSelected] = useState<GuideId>(guideFromHash);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    const onHashChange = () => setSelected(guideFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const select = (id: GuideId, focus = false) => {
    setSelected(id);
    // Keep the topic in the address, so a link such as /guides#kit opens the right tab.
    window.history.replaceState(null, '', `#${id}`);
    if (focus) tabRefs.current[id]?.focus();
  };

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const index = GUIDE_IDS.indexOf(selected);
    const last = GUIDE_IDS.length - 1;
    const next: Record<string, number> = {
      ArrowRight: index === last ? 0 : index + 1,
      ArrowDown: index === last ? 0 : index + 1,
      ArrowLeft: index === 0 ? last : index - 1,
      ArrowUp: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    };
    if (!(event.key in next)) return;
    event.preventDefault();
    select(GUIDE_IDS[next[event.key]], true);
  };

  return (
    <>
      <SEO {...getGuidesSEO()} />
      <PageHero kicker={t('kicker')} title={t('title')} intro={t('subtitle')} />

      <div className="page-wrap pb-16">
        <div
          role="tablist"
          aria-label={t('tabsLabel')}
          className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6"
        >
          {GUIDE_IDS.map((id, index) => {
            const isActive = id === selected;
            return (
              <button
                key={id}
                ref={(el) => {
                  tabRefs.current[id] = el;
                }}
                id={`tab-${id}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => select(id)}
                onKeyDown={onTabKeyDown}
                className={`flex min-h-14 items-center gap-2 rounded-sm border-[3px] border-primary px-3 py-2 text-left font-display text-xl font-black uppercase leading-none ${
                  isActive ? 'bg-primary text-primary-foreground shadow-[4px_4px_0_hsl(var(--riso))]' : 'bg-card text-primary hover:bg-accent'
                }`}
              >
                <span className={isActive ? 'opacity-80' : 'text-riso-text'} aria-hidden="true">
                  {index + 1}
                </span>
                <span>{t(`guides.${id}.short`)}</span>
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id={`panel-${selected}`}
          aria-labelledby={`tab-${selected}`}
          tabIndex={0}
          className="mt-10 focus-visible:outline-offset-8"
        >
          <SectionTitle
            kicker={t('topicCount', { n: GUIDE_IDS.indexOf(selected) + 1, total: GUIDE_IDS.length })}
            title={t(`guides.${selected}.title`)}
            intro={t(`guides.${selected}.description`)}
          />

          {selected === 'during' && (
            <div className="mb-10">
              <DropCoverHold />
            </div>
          )}

          {selected === 'kit' ? (
            <KitChecklist />
          ) : (
            <div className="grid gap-x-8 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
              {getGuideSections(t, selected).map((section) => (
                  <section key={section.id} className="min-w-0 border-t-[3px] border-primary pt-4">
                    <h3 className="mb-3 font-display text-2xl font-black uppercase leading-none text-primary">
                      {section.title}
                    </h3>
                    <ul className="list-disc space-y-2 pl-5 text-base leading-relaxed marker:text-riso">
                      {section.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  </section>
                ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Guides;
