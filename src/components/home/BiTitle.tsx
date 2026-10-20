import { SectionTitle } from '@/components/poster';
import { useBilingual } from './useBilingual';

/** A poster section title with the second language as a small italic line under it. */
export const BiTitle = ({ k, kicker, id, intro }: { k: string; kicker?: string; id: string; intro?: string }) => {
  const { t, t2, lang2, language } = useBilingual();
  const showSecond = !language.startsWith(lang2);
  return (
    <SectionTitle
      id={id}
      kicker={kicker}
      intro={intro}
      title={
        <>
          {t(k)}
          {showSecond && (
            <span lang={lang2} className="mt-2 block font-sans text-lg font-normal normal-case italic tracking-normal text-muted-foreground md:text-xl">
              {t2(k)}
            </span>
          )}
        </>
      }
    />
  );
};
