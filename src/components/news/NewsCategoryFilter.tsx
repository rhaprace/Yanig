import { useTranslation } from 'react-i18next';
import { NEWS_CATEGORY_IDS } from '@/data/news';

interface NewsCategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export const NewsCategoryFilter = ({ selectedCategory, onCategoryChange }: NewsCategoryFilterProps) => {
  const { t } = useTranslation('about');

  return (
    <div role="group" aria-label={t('news.categoryLabel')} className="flex flex-wrap gap-2">
      {NEWS_CATEGORY_IDS.map((id) => {
        const isActive = selectedCategory === id;
        return (
          <button
            key={id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onCategoryChange(id)}
            className={`min-h-11 border-2 border-primary px-4 font-semibold transition-colors ${
              isActive ? 'bg-primary text-primary-foreground' : 'text-primary hover:bg-accent'
            }`}
          >
            {t(`news.categories.${id}`)}
          </button>
        );
      })}
    </div>
  );
};

export default NewsCategoryFilter;
