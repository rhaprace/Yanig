import { Icon } from 'leaflet';

export const DEFAULT_MAP_CENTER: [number, number] = [12.8797, 121.774];

export const DEFAULT_MAP_ZOOM = 6;

export const CITY_ZOOM_LEVEL = 12;

/** A map pin in the poster inks: red-orange fill with a blue ring. No emoji. */
const pinSvg = (fill: string, ring: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">` +
  `<path d="M16 38 C16 38 3 23 3 15 a13 13 0 0 1 26 0 c0 8 -13 23 -13 23z" fill="${fill}" stroke="${ring}" stroke-width="3"/>` +
  `<circle cx="16" cy="15" r="5" fill="${ring}"/></svg>`;

const toIcon = (svg: string, size: [number, number]) =>
  new Icon({
    iconUrl: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,
    iconSize: size,
    iconAnchor: [size[0] / 2, size[1]],
  });

export const createEmergencyIcon = (): Icon => toIcon(pinSvg('#ff4d2e', '#1d3b8b'), [28, 35]);

/** The pin for the city that is open. It is larger and blue, so it stands out. */
export const createSelectedIcon = (): Icon => toIcon(pinSvg('#1d3b8b', '#f2ead8'), [40, 50]);
