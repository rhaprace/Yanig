import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { KIT_ITEM_IDS, KIT_SECTIONS } from '@/utils/guide';
import { countReady, loadKitChecks, saveKitChecks, toggleKitItem } from './kitStorage';

/** The emergency kit as a list people can tick. The ticks stay in this browser. */
const KitChecklist = () => {
  const { t } = useTranslation('guides');
  const [checked, setChecked] = useState<Set<string>>(() => loadKitChecks(KIT_ITEM_IDS));

  useEffect(() => {
    saveKitChecks(checked);
  }, [checked]);

  const ready = countReady(checked, KIT_ITEM_IDS);
  const total = KIT_ITEM_IDS.length;
  const percent = Math.round((ready / total) * 100);

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 border-l-8 border-primary bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="font-display text-3xl font-black uppercase leading-none text-primary" aria-live="polite">
            {t('kitChecklist.progress', { ready, total })}
          </p>
          <div
            className="mt-3 h-4 w-full max-w-md border-2 border-primary"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={ready}
            aria-label={t('kitChecklist.progressLabel')}
          >
            <div className="h-full bg-riso" style={{ width: `${percent}%` }} />
          </div>
          <p className="mt-3 text-base text-muted-foreground">{t('kitChecklist.saved')}</p>
        </div>
        <Button type="button" variant="outline" onClick={() => setChecked(new Set())} disabled={ready === 0}>
          {t('kitChecklist.reset')}
        </Button>
      </div>

      <div className="grid gap-x-8 gap-y-10 md:grid-cols-2">
        {KIT_SECTIONS.map((section) => (
          <fieldset key={section.id} className="min-w-0 border-t-[3px] border-primary pt-4">
            <legend className="float-left mb-3 w-full font-display text-2xl font-black uppercase leading-none text-primary">
              {t(`guides.kit.sections.${section.id}.title`)}
            </legend>
            <ul className="clear-both">
              {section.items.map((itemId) => {
                const isChecked = checked.has(itemId);
                const inputId = `kit-${itemId}`;
                return (
                  <li key={itemId} className="border-b border-dashed border-primary/50">
                    <label htmlFor={inputId} className="flex min-h-12 cursor-pointer items-center gap-3 py-2">
                      <input
                        id={inputId}
                        type="checkbox"
                        className="peer sr-only"
                        checked={isChecked}
                        onChange={() => setChecked((current) => toggleKitItem(current, itemId))}
                      />
                      <span
                        aria-hidden="true"
                        className={`grid h-7 w-7 shrink-0 place-items-center rounded-sm border-[3px] border-primary peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring ${
                          isChecked ? 'bg-primary text-primary-foreground' : 'bg-card'
                        }`}
                      >
                        {isChecked && <Check className="h-5 w-5" strokeWidth={3.5} />}
                      </span>
                      <span className={`text-base leading-snug ${isChecked ? 'text-muted-foreground line-through decoration-riso decoration-2' : ''}`}>
                        {t(`guides.kit.sections.${section.id}.items.${itemId}`)}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </fieldset>
        ))}
      </div>
    </div>
  );
};

export default KitChecklist;
