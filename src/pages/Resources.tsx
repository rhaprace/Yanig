import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ExternalLink, Phone } from 'lucide-react';
import { useLocaleStore } from '@/store/localeStore';
import { SEO } from '@/components/SEO';
import { PageHero, SectionTitle } from '@/components/poster';
import { Button } from '@/components/ui/button';
import { philippinesCities } from '@/data/philippines-regions';
import { getLocalResources, getVolunteerOrganizations, toTelHref } from '@/utils/resources';
import { getResourcesSEO } from '@/utils/seo';

const Resources: React.FC = () => {
  const { countryCode, countryConfig } = useLocaleStore();
  const { t } = useTranslation('resources');

  const localResources = getLocalResources(t, countryCode);
  const volunteerOrganizations = getVolunteerOrganizations(t, countryCode);

  return (
    <>
      <SEO {...getResourcesSEO()} />
      <PageHero kicker={t('kicker')} title={t('title')} intro={t('subtitle')} />

      <div className="page-wrap space-y-14 pb-16">
        <section aria-labelledby="hotlines">
          <SectionTitle id="hotlines" title={t('sections.hotlines.title')} intro={t('sections.hotlines.subtitle', { country: countryConfig.name })} />
          <ul className="grid gap-4 sm:grid-cols-2">
            {countryConfig.emergencyNumbers.map((contact, index) => {
              const href = toTelHref(contact.number);
              const first = index === 0;
              return (
                <li key={`${contact.name}-${contact.number}`} className={first ? 'sm:col-span-2' : ''}>
                  <a
                    href={href ?? undefined}
                    aria-label={t('sections.hotlines.call', { name: contact.name, number: contact.number })}
                    className={`group flex h-full flex-col gap-2 rounded-sm border-[3px] border-primary p-5 hover:shadow-[5px_5px_0_hsl(var(--riso))] ${
                      first ? 'bg-primary text-primary-foreground' : 'bg-card'
                    }`}
                  >
                    <span className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <span className="text-lg font-bold">{contact.name}</span>
                      <span className={`text-sm font-bold uppercase tracking-[0.14em] ${first ? 'opacity-85' : 'text-riso-text'}`}>
                        {contact.type}
                      </span>
                    </span>
                    <span
                      className={`flex items-center gap-3 font-display font-black leading-none tracking-wide ${
                        first ? 'text-7xl sm:text-8xl' : 'text-[2.5rem] text-primary sm:text-5xl lg:text-6xl'
                      } whitespace-nowrap`}
                    >
                      <Phone className="h-8 w-8 shrink-0 sm:h-10 sm:w-10" aria-hidden="true" strokeWidth={2.5} />
                      {contact.number}
                    </span>
                    <span className={`text-base ${first ? 'opacity-90' : 'text-muted-foreground'}`}>{contact.description}</span>
                  </a>
                </li>
              );
            })}
          </ul>

          {countryCode === 'PH' && (
            <div className="mt-6 flex flex-col gap-4 border-l-8 border-riso bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-display text-2xl font-black uppercase leading-none text-primary">
                  {t('sections.cityFinder.title')}
                </h3>
                <p className="mt-2 text-base">{t('sections.cityFinder.text', { count: philippinesCities.length })}</p>
              </div>
              <Button asChild size="lg" className="shrink-0">
                <Link to="/emergency-finder">
                  {t('sections.cityFinder.link')}
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            </div>
          )}
        </section>

        <section aria-labelledby="agencies">
          <SectionTitle id="agencies" title={t('sections.agencies.title')} intro={t('sections.agencies.subtitle')} />
          <ul className="border-t-2 border-primary">
            {countryConfig.agencies.map((agency) => (
              <li key={agency.name} className="border-b border-dashed border-primary/60">
                <a
                  href={agency.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid gap-1 py-4 hover:bg-accent sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-6 sm:px-2"
                >
                  <span className="min-w-0">
                    <span className="block text-sm font-bold uppercase tracking-[0.14em] text-riso-text">{agency.type}</span>
                    <span className="block font-display text-2xl font-black uppercase leading-tight text-primary">
                      {agency.name}
                    </span>
                    <span className="mt-1 block text-base text-foreground/85">{agency.description}</span>
                  </span>
                  <span className="inline-flex items-center gap-2 break-all text-sm font-semibold text-primary underline underline-offset-4">
                    {new URL(agency.url).hostname.replace(/^www\./, '')}
                    <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span className="sr-only">{t('sections.agencies.opens')}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        {localResources.length > 0 && (
          <section aria-labelledby="local">
            <SectionTitle id="local" title={t('sections.local.title')} intro={t('sections.local.subtitle')} />
            <div className="grid gap-x-8 gap-y-8 md:grid-cols-3">
              {localResources.map((resource) => (
                <div key={resource.category} className="min-w-0 border-t-[3px] border-primary pt-4">
                  <h3 className="font-display text-2xl font-black uppercase leading-none text-primary">{resource.category}</h3>
                  <p className="mt-2 text-base text-muted-foreground">{resource.description}</p>
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-base marker:text-riso">
                    {resource.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {volunteerOrganizations.length > 0 && (
          <section aria-labelledby="volunteer">
            <SectionTitle id="volunteer" title={t('sections.volunteer.title')} intro={t('sections.volunteer.subtitle')} />
            <ul className="grid gap-4 sm:grid-cols-2">
              {volunteerOrganizations.map((org) => (
                <li key={org.name}>
                  <a
                    href={org.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-full flex-col gap-2 rounded-sm border-2 border-primary bg-card p-5 hover:bg-accent"
                  >
                    <span className="text-sm font-bold uppercase tracking-[0.14em] text-riso-text">{org.type}</span>
                    <span className="flex items-start justify-between gap-3 font-display text-2xl font-black uppercase leading-tight text-primary">
                      {org.name}
                      <ExternalLink className="mt-1 h-5 w-5 shrink-0" aria-hidden="true" />
                    </span>
                    <span className="text-base text-foreground/85">{org.description}</span>
                    <span className="sr-only">{t('sections.agencies.opens')}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <aside className="halftone-blue border-[3px] border-primary p-1">
          <div className="bg-background p-5">
            <h2 className="font-display text-2xl font-black uppercase text-primary">{t('disclaimer.title')}</h2>
            <p className="mt-2 text-base">{t('disclaimer.text')}</p>
          </div>
        </aside>
      </div>
    </>
  );
};

export default Resources;
