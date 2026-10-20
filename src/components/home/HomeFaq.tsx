import { BiTitle } from './BiTitle';
import { useBilingual } from './useBilingual';

const COLUMNS = [
  ['source', 'warn'],
  ['offline', 'free'],
] as const;

export const HomeFaq = () => {
  const { t } = useBilingual();
  return (
    <section aria-labelledby="home-faq" className="page-wrap py-8">
      <BiTitle id="home-faq" k="faq.title" />
      <div className="grid md:grid-cols-2 md:gap-x-10">
        {COLUMNS.map((column) => (
          <div key={column[0]}>
            {column.map((id) => (
              <details key={id} className="group border-b border-dashed border-primary">
                <summary className="relative flex min-h-11 cursor-pointer list-none items-center py-3 pr-10 text-lg font-bold text-primary [&::-webkit-details-marker]:hidden">
                  {t(`faq.${id}.q`)}
                  <span aria-hidden="true" className="absolute right-1 font-display text-3xl font-black text-riso-text">
                    <span className="group-open:hidden">+</span>
                    <span className="hidden group-open:inline">−</span>
                  </span>
                </summary>
                <p className="pb-4">{t(`faq.${id}.a`)}</p>
              </details>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};
