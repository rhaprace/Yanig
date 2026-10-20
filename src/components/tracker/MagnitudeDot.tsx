import { magnitudeStep } from '@/utils/tracker';
import './tracker-map.css';

/** The same dot as the map marker, for the legend and the list. */
export const MagnitudeDot = ({ mag, className = '' }: { mag: number; className?: string }) => (
  <span aria-hidden="true" className={`yq-dot yq-step-${magnitudeStep(mag)} shrink-0 ${className}`} />
);
