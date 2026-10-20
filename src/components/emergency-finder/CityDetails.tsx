import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Phone } from 'lucide-react';
import type { CityEmergencyData } from '@/types/emergency-finder';
import { toTelHref } from '@/utils/resources';

const TelLink = ({ number, label }: { number: string; label: string }) => {
  const href = toTelHref(number);
  if (!href) return <span className="font-display text-2xl font-black">{number}</span>;
  return (
    <a
      href={href}
      aria-label={`${label}: ${number}`}
      className="inline-flex min-h-11 items-center gap-2 font-display text-2xl font-black tracking-wide text-primary underline decoration-riso decoration-2 underline-offset-4"
    >
      <Phone className="h-5 w-5 shrink-0" aria-hidden="true" strokeWidth={2.5} />
      {number}
    </a>
  );
};

const ListHeading = ({ children }: { children: React.ReactNode }) => (
  <h3 className="mb-2 border-t-[3px] border-primary pt-3 font-display text-2xl font-black uppercase leading-none text-primary">
    {children}
  </h3>
);

interface CityDetailsProps {
  city: CityEmergencyData;
  regionName?: string;
  onBack: () => void;
}

/** One city: its local government, hotlines as tel: links, hospitals and evacuation centres (names only). */
export const CityDetails = forwardRef<HTMLHeadingElement, CityDetailsProps>(({ city, regionName, onBack }, headingRef) => {
  const { t } = useTranslation('resources');
  const { localGovernment } = city;

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex min-h-11 items-center gap-2 rounded-sm border-2 border-primary px-3 font-semibold text-primary hover:bg-accent"
      >
        <ArrowLeft className="h-5 w-5" aria-hidden="true" />
        {t('emergencyFinder.back')}
      </button>

      <div>
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="misreg font-display text-5xl font-black uppercase leading-[0.95] text-primary focus:outline-none"
        >
          {city.city}
        </h2>
        <p className="mt-2 text-base text-muted-foreground">
          {city.province} · {regionName ?? city.region}
        </p>
      </div>

      <section>
        <ListHeading>{t('emergencyFinder.localGovernment')}</ListHeading>
        <p className="text-base font-semibold">{localGovernment.name}</p>
        {localGovernment.hotline && <TelLink number={localGovernment.hotline} label={localGovernment.name} />}
        {localGovernment.address && <p className="text-base text-muted-foreground">{localGovernment.address}</p>}
      </section>

      <section>
        <ListHeading>{t('emergencyFinder.contacts')}</ListHeading>
        <ul>
          {city.contacts.map((contact) => (
            <li key={`${contact.name}-${contact.number}`} className="border-b border-dashed border-primary/50 py-2">
              <span className="block text-sm font-bold uppercase tracking-[0.12em] text-riso-text">
                {t(`emergencyFinder.types.${contact.type}`)}
              </span>
              <span className="block text-base">{contact.name}</span>
              <TelLink number={contact.number} label={contact.name} />
            </li>
          ))}
        </ul>
      </section>

      <section>
        <ListHeading>{t('emergencyFinder.hospitals')}</ListHeading>
        <ul className="list-disc space-y-1 pl-5 text-base marker:text-riso">
          {city.hospitals.map((hospital) => (
            <li key={hospital}>{hospital}</li>
          ))}
        </ul>
      </section>

      <section>
        <ListHeading>{t('emergencyFinder.evacuationCenters')}</ListHeading>
        <p className="mb-2 text-base text-muted-foreground">{t('emergencyFinder.evacuationNote')}</p>
        <ul className="list-disc space-y-1 pl-5 text-base marker:text-riso">
          {city.evacuationCenters.map((center) => (
            <li key={center}>{center}</li>
          ))}
        </ul>
      </section>
    </div>
  );
});

CityDetails.displayName = 'CityDetails';

export default CityDetails;
