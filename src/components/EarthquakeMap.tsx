import { useEffect, useMemo, useRef } from 'react';
import TouchScrollGuard from '@/components/map/TouchScrollGuard';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { DivIcon, LatLngBounds, type Marker as LeafletMarker } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '@/components/tracker/tracker-map.css';
import { useTranslation } from 'react-i18next';
import type { EarthquakeFeature } from '@/types/common';
import {
  PH_BOUNDS,
  SOURCE_LABELS,
  formatDateTime,
  formatMagnitude,
  getSource,
  magnitudeStep,
  type MagnitudeStep,
  type RegionFilter,
} from '@/utils/tracker';

interface EarthquakeMapProps {
  earthquakes: EarthquakeFeature[];
  selectedId?: string | null;
  onSelect?: (quake: EarthquakeFeature) => void;
  /** The map fits its view again when this changes (for example when a filter changes). */
  region?: RegionFilter;
  fitKey?: string;
  className?: string;
}

const iconCache = new Map<string, DivIcon>();
const markerIcon = (step: MagnitudeStep, selected: boolean): DivIcon => {
  const key = `${step}-${selected}`;
  let icon = iconCache.get(key);
  if (!icon) {
    const size = [12, 16, 22, 30][step] + (selected ? 12 : 0);
    icon = new DivIcon({
      className: `yq-marker${selected ? ' is-selected' : ''}`,
      html: `<span class="yq-dot yq-step-${step}"></span>`,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
      popupAnchor: [0, -size / 2],
    });
    iconCache.set(key, icon);
  }
  return icon;
};

const PH_LATLNG_BOUNDS = new LatLngBounds([PH_BOUNDS.minLat, PH_BOUNDS.minLon], [PH_BOUNDS.maxLat, PH_BOUNDS.maxLon]);

/** Fits the view, follows the selection, and keeps the map sized to its frame. */
const MapController = ({
  earthquakes,
  selectedId,
  region,
  fitKey,
  markers,
}: {
  earthquakes: EarthquakeFeature[];
  selectedId?: string | null;
  region?: RegionFilter;
  fitKey?: string;
  markers: React.MutableRefObject<Map<string, LeafletMarker>>;
}) => {
  const map = useMap();
  const lastFit = useRef<string | null>(null);
  const handledSelection = useRef<string | null>(null);

  useEffect(() => {
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(map.getContainer());
    return () => observer.disconnect();
  }, [map]);

  // Fit the view when the filters change, or when the first data arrives. Not on every refresh.
  useEffect(() => {
    const key = `${fitKey}|${earthquakes.length > 0}`;
    if (lastFit.current === key) return;
    lastFit.current = key;
    if (region === 'ph') {
      map.fitBounds(PH_LATLNG_BOUNDS, { padding: [8, 8] });
      return;
    }
    const bounds = new LatLngBounds([]);
    earthquakes.forEach((q) => bounds.extend([q.geometry.coordinates[1], q.geometry.coordinates[0]]));
    if (bounds.isValid()) map.fitBounds(bounds, { padding: [24, 24], maxZoom: 6 });
    else map.setView([12, 122], 4);
  }, [map, fitKey, region, earthquakes]);

  // Zoom to the selected earthquake and open its popup. Only once per selection, not on every refresh.
  useEffect(() => {
    if (!selectedId) {
      handledSelection.current = null;
      return;
    }
    if (handledSelection.current === selectedId) return;
    const quake = earthquakes.find((q) => q.id === selectedId);
    const marker = markers.current.get(selectedId);
    if (!quake || !marker) return;
    handledSelection.current = selectedId;
    if (marker.isPopupOpen()) return; // The person clicked the marker itself. Do not move the map.
    const [lng, lat] = quake.geometry.coordinates;
    map.setView([lat, lng], Math.max(map.getZoom(), 7), { animate: true });
    marker.openPopup();
  }, [map, selectedId, earthquakes, markers]);

  return null;
};

const EarthquakeMap = ({
  earthquakes,
  selectedId = null,
  onSelect,
  region,
  fitKey,
  className = 'h-[400px]',
}: EarthquakeMapProps) => {
  const { t, i18n } = useTranslation('tracker');
  const markers = useRef(new Map<string, LeafletMarker>());

  // Draw small earthquakes first, so big ones sit on top.
  const ordered = useMemo(() => [...earthquakes].sort((a, b) => a.properties.mag - b.properties.mag), [earthquakes]);

  return (
    <div className={`yq-map relative w-full border-4 border-primary bg-card ${className}`}>
      <MapContainer
        center={[12, 122]}
        zoom={5}
        worldCopyJump
        style={{ height: '100%', width: '100%' }}
        className="z-0"
        aria-label={t('map.label')}
      >
        <TouchScrollGuard />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapController
          earthquakes={earthquakes}
          selectedId={selectedId}
          region={region}
          fitKey={fitKey}
          markers={markers}
        />
        {ordered.map((quake) => {
          const [lng, lat, depth] = quake.geometry.coordinates;
          const { mag, place, time, url } = quake.properties;
          const selected = quake.id === selectedId;
          const source = SOURCE_LABELS[getSource(quake)];
          return (
            <Marker
              key={quake.id}
              position={[lat, lng]}
              icon={markerIcon(magnitudeStep(mag), selected)}
              title={`M${formatMagnitude(mag)} ${place}`}
              alt={`M${formatMagnitude(mag)} ${place}`}
              zIndexOffset={selected ? 1000 : magnitudeStep(mag) * 100}
              ref={(marker) => {
                if (marker) markers.current.set(quake.id, marker);
                else markers.current.delete(quake.id);
              }}
              eventHandlers={{ click: () => onSelect?.(quake) }}
            >
              <Popup>
                <div className="m-0 font-display text-3xl font-black uppercase leading-none text-primary">
                  M {formatMagnitude(mag)}
                </div>
                <div className="m-0 mt-2 font-semibold">{place}</div>
                <dl className="m-0 mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-[15px]">
                  <dt className="font-semibold">{t('map.time')}</dt>
                  <dd className="m-0">{formatDateTime(time, i18n.language)}</dd>
                  <dt className="font-semibold">{t('map.depth')}</dt>
                  <dd className="m-0">{Math.round(depth)} km</dd>
                  <dt className="font-semibold">{t('map.source')}</dt>
                  <dd className="m-0">{source}</dd>
                </dl>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex min-h-11 items-center font-semibold text-primary underline underline-offset-4"
                >
                  {t('map.details', { source })}
                </a>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default EarthquakeMap;
