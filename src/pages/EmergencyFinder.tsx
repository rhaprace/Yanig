import { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { useTranslation } from 'react-i18next';
import { Phone } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { Kicker } from '@/components/poster';
import { philippinesCities, philippinesRegions, type CityEmergencyData } from '@/data/philippines-regions';
import {
  CITY_ZOOM_LEVEL,
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ZOOM,
  createEmergencyIcon,
  createSelectedIcon,
} from '@/utils/emergency-finder/map-config';
import { cityId, filterCities } from '@/utils/emergency-finder/search';
import { CityDetails, MapViewController, SearchBar } from '@/components/emergency-finder';
import { getEmergencyFinderSEO } from '@/utils/seo';
import 'leaflet/dist/leaflet.css';

const emergencyIcon = createEmergencyIcon();
const selectedIcon = createSelectedIcon();
const regionNames = new Map(philippinesRegions.map((region) => [region.code, region.name]));

const EmergencyFinder: React.FC = () => {
  const { t } = useTranslation('resources');
  const [selectedCity, setSelectedCity] = useState<CityEmergencyData | null>(null);
  const [query, setQuery] = useState('');
  const [view, setView] = useState<{ center: [number, number]; zoom: number }>({
    center: DEFAULT_MAP_CENTER,
    zoom: DEFAULT_MAP_ZOOM,
  });
  const detailsHeadingRef = useRef<HTMLHeadingElement>(null);
  const lastCityIdRef = useRef<string | null>(null);

  const results = useMemo(() => filterCities(philippinesCities, query), [query]);

  const selectCity = (city: CityEmergencyData) => {
    setSelectedCity(city);
    lastCityIdRef.current = cityId(city);
    setView({ center: city.coordinates, zoom: CITY_ZOOM_LEVEL });
  };

  const backToList = () => {
    setSelectedCity(null);
    setView({ center: DEFAULT_MAP_CENTER, zoom: DEFAULT_MAP_ZOOM });
  };

  // Move focus with the content, so keyboard and screen reader users stay in place.
  useEffect(() => {
    if (selectedCity) {
      detailsHeadingRef.current?.focus({ preventScroll: true });
      detailsHeadingRef.current?.scrollIntoView({ block: 'nearest' });
    } else if (lastCityIdRef.current) {
      document.getElementById(`city-${lastCityIdRef.current}`)?.focus();
    }
  }, [selectedCity]);

  const selectedId = selectedCity ? cityId(selectedCity) : null;

  return (
    <>
      <SEO {...getEmergencyFinderSEO()} />
      <div className="flex flex-col lg:grid lg:h-[calc(100dvh-4rem)] lg:grid-cols-[minmax(360px,440px)_minmax(0,1fr)] lg:grid-rows-[auto_minmax(0,1fr)]">
        <header className="px-4 pb-5 pt-6 lg:col-start-1 lg:row-start-1 lg:border-r-[3px] lg:border-primary lg:px-6">
          <Kicker className="mb-2">{t('emergencyFinder.kicker')}</Kicker>
          <h1 className="misreg font-display text-5xl font-black uppercase leading-[0.92] text-primary">
            {t('emergencyFinder.title')}
          </h1>
          <p className="mt-3 text-base">{t('emergencyFinder.intro')}</p>
          <div className="mt-4 border-l-8 border-riso bg-card px-4 py-3">
            <p className="text-base">{t('emergencyFinder.note', { count: philippinesCities.length })}</p>
            <a
              href="tel:911"
              className="mt-2 inline-flex min-h-11 items-center gap-2 font-display text-2xl font-black uppercase text-primary underline decoration-riso decoration-2 underline-offset-4"
            >
              <Phone className="h-5 w-5" aria-hidden="true" strokeWidth={2.5} />
              {t('emergencyFinder.call911')}
            </a>
          </div>
        </header>

        <div
          className="relative isolate z-0 h-[45vh] min-h-[280px] border-y-[3px] border-primary lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:h-auto lg:border-y-0"
          role="region"
          aria-label={t('emergencyFinder.mapLabel')}
        >
          <MapContainer center={DEFAULT_MAP_CENTER} zoom={DEFAULT_MAP_ZOOM} className="h-full w-full" zoomControl>
            <MapViewController center={view.center} zoom={view.zoom} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {philippinesCities.map((city) => {
              const id = cityId(city);
              const isSelected = id === selectedId;
              return (
                <Marker
                  key={id}
                  position={city.coordinates}
                  icon={isSelected ? selectedIcon : emergencyIcon}
                  zIndexOffset={isSelected ? 1000 : 0}
                  title={city.city}
                  alt={city.city}
                  eventHandlers={{ click: () => selectCity(city) }}
                />
              );
            })}
          </MapContainer>
        </div>

        <div className="px-4 pb-10 pt-5 lg:col-start-1 lg:row-start-2 lg:min-h-0 lg:overflow-y-auto lg:border-r-[3px] lg:border-t-[3px] lg:border-primary lg:px-6 lg:pb-8">
          {selectedCity ? (
            <CityDetails
              ref={detailsHeadingRef}
              city={selectedCity}
              regionName={regionNames.get(selectedCity.region)}
              onBack={backToList}
            />
          ) : (
            <>
              <SearchBar
                id="city-search"
                label={t('emergencyFinder.searchLabel')}
                placeholder={t('emergencyFinder.searchPlaceholder')}
                clearLabel={t('emergencyFinder.clear')}
                value={query}
                onChange={setQuery}
                onClear={() => setQuery('')}
                describedBy="city-count"
              />
              <p id="city-count" className="mt-3 text-base text-muted-foreground" aria-live="polite">
                {t('emergencyFinder.resultCount', { count: results.length })}
              </p>
              {results.length === 0 ? (
                <p className="mt-3 border-l-8 border-riso bg-card px-4 py-3 text-base">
                  {t('emergencyFinder.noResults', { query: query.trim() })}
                </p>
              ) : (
                <ul className="mt-2 border-t-2 border-primary" aria-label={t('emergencyFinder.cityList')}>
                  {results.map((city) => {
                    const id = cityId(city);
                    return (
                      <li key={id} className="border-b border-dashed border-primary/50">
                        <button
                          id={`city-${id}`}
                          type="button"
                          onClick={() => selectCity(city)}
                          className="flex min-h-12 w-full items-baseline justify-between gap-3 px-2 py-2 text-left hover:bg-accent"
                        >
                          <span className="font-display text-2xl font-black uppercase leading-tight text-primary">
                            {city.city}
                          </span>
                          <span className="text-right text-sm text-muted-foreground">{city.province}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default EmergencyFinder;
