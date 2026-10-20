/**
 * Common type definitions used across the application
 */
import type { LucideIcon } from 'lucide-react';


export interface CardData {
  title: string;
  description: string;
}

export interface FeatureCard extends CardData {
  icon?: LucideIcon;
}

export interface NumberedCard extends CardData {
  number: string;
  link: string;
}

export interface ExternalLink {
  name: string;
  description: string;
  url: string;
  type: string;
}

export interface EmergencyContact {
  name: string;
  number: string;
  description: string;
  type: string;
}

export interface ResourceCategory {
  category: string;
  description: string;
  items: string[];
}

export interface GuideSection {
  subtitle: string;
  points: string[];
}

export interface Guide {
  id: string;
  title: string;
  icon: LucideIcon;
  description: string;
  content: GuideSection[];
}

export interface StatData {
  value: string;
  label: string;
  description: string;
}

export interface LegalSection {
  id: string;
  title: string;
  content: string | string[];
}


/** The agencies Yanig reads earthquake data from. */
export type EarthquakeSource = 'usgs' | 'geonet' | 'bmkg';

/** Earthquake properties in the USGS GeoJSON shape. GeoNet and BMKG data is converted to it. */
export interface EarthquakeProperties {
  mag: number;
  place: string;
  /** Origin time, in milliseconds since 1970 (UTC). */
  time: number;
  updated: number;
  tz?: number | null;
  url: string;
  detail: string;
  felt?: number | null;
  cdi?: number | null;
  mmi?: number | null;
  alert?: string | null;
  status: string;
  tsunami: number;
  sig: number;
  net: string;
  code: string;
  ids: string;
  sources: string;
  types: string;
  nst?: number | null;
  dmin?: number | null;
  rms: number;
  gap?: number | null;
  magType: string;
  type: string;
  title: string;
  /** The agency this record came from. Set by Yanig, not by the APIs. */
  source?: EarthquakeSource;
}

export interface EarthquakeGeometry {
  type: 'Point';
  /** [longitude, latitude, depth in km] */
  coordinates: [number, number, number];
}

export interface EarthquakeFeature {
  type: 'Feature';
  properties: EarthquakeProperties;
  geometry: EarthquakeGeometry;
  id: string;
}

export interface EarthquakeResponse {
  type: 'FeatureCollection';
  metadata: {
    generated: number;
    url: string;
    title: string;
    status: number;
    api: string;
    count: number;
  };
  features: EarthquakeFeature[];
}
