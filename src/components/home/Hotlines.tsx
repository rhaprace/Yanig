import { useTranslation } from 'react-i18next';
import { useLocaleStore } from '@/store/localeStore';
import { toTelHref } from '@/utils/home';
import { BiTitle } from './BiTitle';
import { useBilingual } from './useBilingual';

/** Keys in common.json for each country name. */
const COUNTRY_KEYS: Record<string, string> = {
  US: 'country.us',
  JP: 'country.japan',
  MX: 'country.mexico',
  CL: 'country.chile',
  ID: 'country.indonesia',
  PH: 'country.philippines',
};

export const Hotlines = () => {
  const { t } = useBilingual();
  const { t: tc } = useTranslation('common');
  const config = useLocaleStore((s) => s.countryConfig);
  const country = COUNTRY_KEYS[config.code] ? tc(COUNTRY_KEYS[config.code]) : config.name;
  const cols = config.emergencyNumbers.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-4';

  return (
    <section aria-labelledby="home-hotlines" className="page-wrap py-8">
      <BiTitle id="home-hotlines" k="hotlines.title" kicker={t('hotlines.kicker', { country })} />
      <ul className={`grid grid-cols-2 border-l-2 border-t-[3px] border-dashed border-primary/70 ${cols}`}>
        {config.emergencyNumbers.map((contact) => (
          <li key={`${contact.name}-${contact.number}`} className="border-b-2 border-r-2 border-dashed border-primary/70">
            <a
              href={toTelHref(contact.number, config.code)}
              className="flex h-full min-h-36 flex-col justify-between gap-3 p-3 no-underline hover:bg-riso/10 sm:p-4"
            >
              <span className="whitespace-nowrap font-display text-[1.7rem] font-black leading-none text-primary sm:text-3xl lg:text-4xl">
                {contact.number}
              </span>
              <span className="text-base font-bold leading-snug">
                {contact.name}
                <span className="block text-sm font-normal text-muted-foreground">{contact.description}</span>
              </span>
              <span className="text-sm font-bold uppercase tracking-widest text-riso-text">
                {t('hotlines.call')}
                <span className="sr-only"> {contact.name}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
};
