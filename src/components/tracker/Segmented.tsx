import { useId } from 'react';

export interface SegmentOption<T extends string | number> {
  value: T;
  label: string;
  /** Longer text for screen readers, when the label is short (for example "M4+"). */
  ariaLabel?: string;
}

interface SegmentedProps<T extends string | number> {
  label: string;
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

/** A row of toggle buttons. Exactly one is pressed. */
export function Segmented<T extends string | number>({ label, options, value, onChange }: SegmentedProps<T>) {
  const labelId = useId();
  return (
    <div className="min-w-0">
      <p id={labelId} className="mb-1.5 font-display text-base font-bold uppercase tracking-[0.12em] text-riso-text">
        {label}
      </p>
      <div role="group" aria-labelledby={labelId} className="inline-flex max-w-full flex-wrap border-2 border-primary">
        {options.map((option, i) => {
          const pressed = option.value === value;
          return (
            <button
              key={String(option.value)}
              type="button"
              aria-pressed={pressed}
              aria-label={option.ariaLabel}
              onClick={() => onChange(option.value)}
              className={`min-h-11 px-3 text-base font-bold transition-colors ${
                i > 0 ? 'border-l-2 border-primary' : ''
              } ${pressed ? 'bg-primary text-primary-foreground' : 'bg-transparent text-primary hover:bg-primary/10'}`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
