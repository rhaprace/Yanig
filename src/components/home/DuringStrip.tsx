import { useRef, useState, type KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { STEP_COUNT, stepForKey } from '@/utils/home';
import { BiTitle } from './BiTitle';
import { StepFigure } from './StepFigure';
import { useBilingual } from './useBilingual';

const STEPS = ['drop', 'cover', 'hold'] as const;

export const DuringStrip = () => {
  const { t, t2, lang2, language } = useBilingual();
  const [step, setStep] = useState(0);
  const panels = useRef<(HTMLButtonElement | null)[]>([]);
  const showSecond = !language.startsWith(lang2);
  const key = STEPS[step];

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const next = stepForKey(event.key, step);
    if (next === null) return;
    event.preventDefault();
    setStep(next);
    panels.current[next]?.focus();
  };

  return (
    <section aria-labelledby="home-during" className="page-wrap py-8">
      <BiTitle id="home-during" k="during.title" kicker={t('during.kicker')} intro={t('during.intro')} />

      <div role="group" aria-label={t('during.stripLabel')} onKeyDown={onKeyDown} className="grid grid-cols-3 gap-2 sm:gap-4">
        {STEPS.map((name, i) => {
          const current = i === step;
          return (
            <button
              key={name}
              ref={(el) => {
                panels.current[i] = el;
              }}
              type="button"
              aria-current={current ? 'step' : undefined}
              aria-label={`${t('during.stepOf', { n: i + 1 })}: ${t(`during.steps.${name}.name`)}`}
              onClick={() => setStep(i)}
              className={`flex flex-col border-[3px] border-primary bg-card text-left transition-opacity ${
                current ? 'shadow-[6px_6px_0_hsl(var(--riso))]' : 'opacity-60 hover:opacity-90'
              }`}
            >
              <span className="block border-b-[3px] border-primary">
                <StepFigure step={i as 0 | 1 | 2} active={current} />
              </span>
              <span className="flex flex-col gap-0.5 px-2 pb-2 pt-1.5 sm:flex-row sm:items-baseline sm:gap-3 sm:px-3">
                <span className="font-display text-xl font-black leading-none text-riso-text sm:text-3xl">{i + 1}</span>
                <span className="font-display text-xl font-black uppercase leading-none text-primary sm:text-3xl lg:text-4xl">
                  {t(`during.steps.${name}.name`)}
                  {showSecond && (
                    <small lang={lang2} className="mt-1 hidden font-sans text-sm font-normal normal-case italic text-muted-foreground sm:block">
                      {t2(`during.steps.${name}.name`)}
                    </small>
                  )}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 grid gap-4 border-l-8 border-primary bg-secondary p-4 sm:p-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
        <div aria-live="polite">
          <p className="text-sm font-semibold uppercase tracking-widest text-riso-text">{t('during.stepOf', { n: step + 1 })}</p>
          <p className="mt-1 text-xl font-bold leading-snug md:text-2xl">{t(`during.steps.${key}.text`)}</p>
          {showSecond && (
            <p lang={lang2} className="mt-1 italic text-muted-foreground">
              {t2(`during.steps.${key}.text`)}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="lg"
            aria-disabled={step === 0}
            className="aria-disabled:cursor-default aria-disabled:opacity-40"
            onClick={() => setStep(Math.max(step - 1, 0))}
          >
            {t('during.back')}
          </Button>
          <Button
            type="button"
            size="lg"
            aria-disabled={step === STEP_COUNT - 1}
            className="aria-disabled:cursor-default aria-disabled:opacity-40"
            onClick={() => setStep(Math.min(step + 1, STEP_COUNT - 1))}
          >
            {t('during.next')}
          </Button>
        </div>
      </div>

      <p className="mt-4 flex items-start gap-3 font-bold text-riso-text">
        <svg viewBox="0 0 24 24" aria-hidden="true" className="mt-0.5 h-6 w-6 flex-none">
          <circle cx="12" cy="12" r="9.5" fill="none" className="stroke-riso" strokeWidth="3" />
          <path d="M5.5 18.5 L18.5 5.5" className="stroke-riso" strokeWidth="3" />
        </svg>
        <span>
          {t('during.door')}
          {showSecond && (
            <span lang={lang2} className="block font-normal italic text-muted-foreground">
              {t2('during.door')}
            </span>
          )}
        </span>
      </p>
      <Link
        to="/guides"
        className="mt-2 inline-flex min-h-11 items-center font-semibold text-primary underline decoration-riso decoration-2 underline-offset-4"
      >
        {t('during.guideLink')}
      </Link>
    </section>
  );
};
