import { useTranslation } from 'react-i18next';
import { MAGNITUDE_STEP_LABELS, type MagnitudeStep } from '@/utils/tracker';
import { MagnitudeDot } from './MagnitudeDot';

const STEP_SAMPLES: Record<MagnitudeStep, number> = { 0: 3, 1: 4, 2: 5, 3: 6 };
const STEPS: MagnitudeStep[] = [0, 1, 2, 3];

export const MapLegend = () => {
  const { t } = useTranslation('tracker');
  return (
    <div className="yq-ink mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-base">
      <span className="font-display font-bold uppercase tracking-[0.12em] text-riso-text">{t('map.legend')}</span>
      <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
        {STEPS.map((step) => (
          <li key={step} className="flex items-center gap-2">
            <span className="flex w-8 justify-center">
              <MagnitudeDot mag={STEP_SAMPLES[step]} />
            </span>
            <span className="font-semibold tabular-nums">{MAGNITUDE_STEP_LABELS[step]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
