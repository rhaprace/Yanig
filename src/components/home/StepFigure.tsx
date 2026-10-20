import { useId } from 'react';

/** Hand-drawn figures for the Drop, Cover, Hold on strip. Colours come from the theme tokens. */
const Table = () => (
  <g className="fill-primary">
    <rect x="28" y="56" width="154" height="11" />
    <rect x="38" y="67" width="8" height="63" />
    <rect x="164" y="67" width="8" height="63" />
  </g>
);

export const StepFigure = ({ step, active }: { step: 0 | 1 | 2; active: boolean }) => {
  const id = useId().replace(/:/g, '');
  const dots = `dots-${id}`;
  const floor = `floor-${id}`;

  return (
    <svg viewBox="0 0 200 150" aria-hidden="true" focusable="false" className="block h-auto w-full">
      <defs>
        <pattern id={dots} width="7" height="7" patternUnits="userSpaceOnUse">
          <circle cx="3.5" cy="3.5" r="1.7" className="fill-riso" />
        </pattern>
        <pattern id={floor} width="5" height="5" patternUnits="userSpaceOnUse">
          <circle cx="2.5" cy="2.5" r="1.3" className="fill-primary" />
        </pattern>
        <style>{`
          @keyframes yanig-shake{0%,100%{transform:translate(0,0)}25%{transform:translate(-1.6px,.4px)}75%{transform:translate(1.6px,-.4px)}}
          @media (prefers-reduced-motion: no-preference){.yanig-shake{animation:yanig-shake .32s linear infinite;transform-box:fill-box}}
        `}</style>
      </defs>
      <rect width="200" height="150" fill={`url(#${dots})`} opacity=".4" />
      <rect y="130" width="200" height="20" fill={`url(#${floor})`} />

      {step === 0 && (
        <>
          <g fill="none" strokeLinecap="round">
            <g transform="translate(3,2)" className="stroke-riso" opacity=".8">
              <path d="M74 88 L128 94" strokeWidth="18" />
              <path d="M128 96 L140 126 L170 127" strokeWidth="12" />
              <path d="M80 94 L78 127" strokeWidth="9" />
            </g>
            <circle cx="60" cy="80" r="12" className="fill-primary" />
            <g className="stroke-primary">
              <path d="M74 88 L128 94" strokeWidth="18" />
              <path d="M128 96 L140 126 L170 127" strokeWidth="12" />
              <path d="M80 94 L78 127" strokeWidth="9" />
            </g>
          </g>
          <path d="M100 30 v28 m-11 -11 l11 11 l11 -11" className="stroke-riso" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}

      {step === 1 && (
        <>
          <Table />
          <g fill="none" strokeLinecap="round" className="stroke-primary">
            <circle cx="72" cy="100" r="11" className="fill-primary" stroke="none" />
            <path d="M84 104 L128 108" strokeWidth="16" />
            <path d="M128 110 L138 127 L158 127" strokeWidth="11" />
            <path d="M90 108 L88 127" strokeWidth="8" />
          </g>
          <path d="M28 54 h154" className="stroke-riso" strokeWidth="4" transform="translate(2,3)" />
        </>
      )}

      {step === 2 && (
        <>
          <g className={active ? 'yanig-shake' : undefined}>
            <Table />
          </g>
          <g fill="none" strokeLinecap="round" className="stroke-primary">
            <circle cx="76" cy="100" r="11" className="fill-primary" stroke="none" />
            <path d="M88 104 L130 108" strokeWidth="16" />
            <path d="M130 110 L140 127 L160 127" strokeWidth="11" />
            <path d="M90 102 L52 92" strokeWidth="8" />
            <circle cx="48" cy="92" r="6" className="fill-primary" stroke="none" />
            <path d="M84 96 L74 88" strokeWidth="7" />
          </g>
          <g className="stroke-riso" strokeWidth="4" fill="none" strokeLinecap="round">
            <path d="M14 52 q-6 8 0 16" />
            <path d="M6 46 q-8 14 0 28" />
            <path d="M188 52 q6 8 0 16" />
            <path d="M196 46 q8 14 0 28" />
          </g>
        </>
      )}
    </svg>
  );
};
