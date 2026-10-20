import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { NewsArticle } from '@/types/news';
import { formatArticleDate } from './format';

interface NewsArticleCardProps {
  article: NewsArticle;
  isSample: boolean;
  onOpen: (article: NewsArticle) => void;
}

/** One clipped notice on the news board. */
export const NewsArticleCard = ({ article, isSample, onOpen }: NewsArticleCardProps) => {
  const { t, i18n } = useTranslation('about');
  const [imageFailed, setImageFailed] = useState(false);
  const date = isSample ? '' : formatArticleDate(article.datePublished, i18n.language);
  const titleId = `news-title-${article.id}`;

  return (
    <article
      aria-labelledby={titleId}
      className="relative flex h-full flex-col border-2 border-primary/25 bg-card text-card-foreground md:group-odd:-rotate-[0.6deg] md:group-even:rotate-[0.5deg]"
    >
      {/* the clip that holds the notice to the board */}
      <span
        className="absolute -top-3 left-1/2 z-10 h-6 w-16 -translate-x-1/2 bg-primary/80"
        aria-hidden="true"
      />
      {article.imageUrl && !imageFailed && (
        <img
          src={article.imageUrl}
          alt=""
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setImageFailed(true)}
          className="h-44 w-full border-b-2 border-primary/25 object-cover contrast-125 grayscale"
        />
      )}
      <div className="flex flex-1 flex-col gap-3 p-5 pt-6">
        <p className="font-display text-sm font-bold uppercase tracking-[0.14em] text-riso-text">
          {t(`news.categories.${article.category}`)}
          {!isSample && article.source ? ` · ${article.source}` : ''}
        </p>
        <h2 id={titleId} className="font-sans text-xl font-bold normal-case leading-snug tracking-normal text-primary">
          {article.title}
        </h2>
        {article.excerpt && <p className="line-clamp-4 text-base text-foreground/85">{article.excerpt}</p>}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-2">
          {date ? <span className="text-sm text-muted-foreground">{date}</span> : <span />}
          <button
            type="button"
            onClick={() => onOpen(article)}
            className="inline-flex min-h-11 items-center border-2 border-primary px-4 font-semibold text-primary hover:bg-primary hover:text-primary-foreground"
          >
            {t('news.read')}
            <span className="sr-only">: {article.title}</span>
          </button>
        </div>
      </div>
    </article>
  );
};

export default NewsArticleCard;
