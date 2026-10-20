import { useId } from 'react';
import { useTranslation } from 'react-i18next';

const BLUE = 'hsl(var(--primary))';
const RED = 'hsl(var(--riso))';

const STEPS = ['drop', 'cover', 'hold'] as const;

/** A table, drawn the same in the Cover and Hold on panels. */
const Table = () => (
  <g fill={BLUE}>
    <rect x="28" y="56" width="154" height="11" />
    <rect x="38" y="67" width="8" height="63" />
    <rect x="164" y="67" width="8" height="63" />
  </g>
);

const Figure = ({ step }: { step: (typeof STEPS)[number] }) => {
  if (step === 'drop') {
    return (
      <>
        <g strokeLinecap="round" fill="none">
          <g transform="translate(3,2)" stroke={RED} opacity=".8">
            <path d="M74 88 L128 94" strokeWidth="18" />
            <path d="M128 96 L140 126 L170 127" strokeWidth="12" />
            <path d="M80 94 L78 127" strokeWidth="9" />
          </g>
          <circle cx="60" cy="80" r="12" fill={BLUE} />
          <path d="M74 88 L128 94" stroke={BLUE} strokeWidth="18" />
          <path d="M128 96 L140 126 L170 127" stroke={BLUE} strokeWidth="12" />
          <path d="M80 94 L78 127" stroke={BLUE} strokeWidth="9" />
        </g>
        <path d="M100 40 v24 m-10 -10 l10 10 l10 -10" stroke={RED} strokeWidth="5" fill="none" />
      </>
    );
  }
  if (step === 'cover') {
    return (
      <>
        <Table />
        <g strokeLinecap="round" fill="none">
          <circle cx="72" cy="100" r="11" fill={BLUE} />
          <path d="M84 104 L128 108" stroke={BLUE} strokeWidth="16" />
          <path d="M128 110 L138 127 L158 127" stroke={BLUE} strokeWidth="11" />
          <path d="M90 108 L88 127" stroke={BLUE} strokeWidth="8" />
        </g>
        <path d="M28 54 h154" stroke={RED} strokeWidth="4" transform="translate(2,3)" />
      </>
    );
  }
  return (
    <>
      <Table />
      <g strokeLinecap="round" fill="none">
        <circle cx="76" cy="100" r="11" fill={BLUE} />
        <path d="M88 104 L130 108" stroke={BLUE} strokeWidth="16" />
        <path d="M130 110 L140 127 L160 127" stroke={BLUE} strokeWidth="11" />
        <path d="M90 102 L52 92" stroke={BLUE} strokeWidth="8" />
        <circle cx="48" cy="92" r="6" fill={BLUE} />
        <path d="M84 96 L74 88" stroke={BLUE} strokeWidth="7" />
      </g>
      <g stroke={RED} strokeWidth="4" fill="none" strokeLinecap="round">
        <path d="M14 52 q-6 8 0 16" />
        <path d="M6 46 q-8 14 0 28" />
        <path d="M188 52 q6 8 0 16" />
        <path d="M196 46 q8 14 0 28" />
      </g>
    </>
  );
};

/** Three printed panels: Drop, Cover, Hold on. Each has a simple figure and one short instruction. */
const DropCoverHold = () => {
  const { t } = useTranslation('guides');
  const uid = useId().replace(/:/g, '');
  const dots = `dots-${uid}`;
  const floor = `floor-${uid}`;

  return (
    <div>
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <pattern id={dots} width="7" height="7" patternUnits="userSpaceOnUse">
            <circle cx="3.5" cy="3.5" r="1.7" fill={RED} />
          </pattern>
          <pattern id={floor} width="5" height="5" patternUnits="userSpaceOnUse">
            <circle cx="2.5" cy="2.5" r="1.3" fill={BLUE} />
          </pattern>
        </defs>
      </svg>
      <ol className="grid gap-4 sm:grid-cols-3">
        {STEPS.map((step, index) => (
          <li key={step} className="flex flex-col border-[3px] border-primary bg-card">
            <svg viewBox="0 0 200 150" className="block h-auto w-full border-b-[3px] border-primary" aria-hidden="true">
              <rect width="200" height="150" fill={`url(#${dots})`} opacity=".35" />
              <rect y="130" width="200" height="20" fill={`url(#${floor})`} />
              <Figure step={step} />
            </svg>
            <div className="flex flex-1 gap-3 p-4">
              <span className="font-display text-4xl font-black leading-none text-riso-text" aria-hidden="true">
                {index + 1}
              </span>
              <div>
                <h3 className="font-display text-3xl font-black uppercase leading-none text-primary">
                  <span className="sr-only">{t('dch.stepLabel', { n: index + 1 })} </span>
                  {t(`dch.steps.${step}.word`)}
                </h3>
                <p className="mt-2 text-base leading-snug">{t(`dch.steps.${step}.text`)}</p>
              </div>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-5 border-l-8 border-riso bg-card px-4 py-3 text-lg font-semibold leading-snug">
        {t('dch.noTable')}
      </p>
      <p className="mt-3 text-base text-muted-foreground">{t('dch.stay')}</p>
    </div>
  );
};

export default DropCoverHold;
