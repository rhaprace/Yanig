import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import type { NewsArticle } from '@/types/news';
import { ExternalLink } from '@/components/pages/ExternalLink';
import { Stamp } from '@/components/poster';
import { safeHttpUrl } from '@/services/newsAPI';
import { formatArticleDate, toContentBlocks } from './format';

interface NewsArticleDetailProps {
  article: NewsArticle;
  isSample: boolean;
  onBack: () => void;
}

const backClass =
  'inline-flex min-h-11 items-center gap-2 border-2 border-primary px-4 font-semibold text-primary hover:bg-accent';

export const NewsArticleDetail = ({ article, isSample, onBack }: NewsArticleDetailProps) => {
  const { t, i18n } = useTranslation('about');
  const [imageFailed, setImageFailed] = useState(false);
  const date = isSample ? '' : formatArticleDate(article.datePublished, i18n.language);
  const url = safeHttpUrl(article.url);
  const imageUrl = safeHttpUrl(article.imageUrl);
  const meta = [article.author && article.author !== article.source ? t('news.by', { author: article.author }) : '', date]
    .filter(Boolean)
    .join(' · ');

  return (
    <div className="page-wrap pb-6 pt-8 md:pt-12">
      <div className="mx-auto max-w-3xl">
        <button type="button" onClick={onBack} className={backClass}>
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {t('news.back')}
        </button>
      </div>

      <article className="mx-auto mt-8 max-w-3xl border-2 border-primary/25 bg-card text-card-foreground">
        {imageUrl && !imageFailed && (
          <img
            src={imageUrl}
            alt=""
            referrerPolicy="no-referrer"
            onError={() => setImageFailed(true)}
            className="max-h-96 w-full border-b-2 border-primary/25 object-cover contrast-125 grayscale"
          />
        )}
        <div className="p-5 sm:p-8">
          {isSample && (
            <div className="mb-5 flex flex-wrap items-center gap-4">
              <Stamp>{t('news.sampleStamp')}</Stamp>
              <p className="max-w-prose text-base text-muted-foreground">{t('news.sampleNote')}</p>
            </div>
          )}
          <p className="font-display text-sm font-bold uppercase tracking-[0.14em] text-riso-text">
            {t(`news.categories.${article.category}`)}
            {!isSample && article.source ? ` · ${article.source}` : ''}
          </p>
          <h1 className="misreg mt-2 font-display text-4xl font-black uppercase leading-[0.95] text-primary sm:text-5xl">
            {article.title}
          </h1>
          {meta && <p className="mt-4 text-sm text-muted-foreground">{meta}</p>}
          {article.excerpt && (
            <p className="mt-5 border-l-[6px] border-riso pl-3 text-lg font-semibold leading-relaxed">{article.excerpt}</p>
          )}

          <div className="mt-6 grid gap-4 text-[17px] leading-relaxed">
            {toContentBlocks(article.content === article.excerpt ? '' : article.content).map((block, index) => {
              if (block.type === 'heading') {
                return (
                  <h2 key={index} className="mt-2 font-display text-2xl font-black uppercase text-primary">
                    {block.text}
                  </h2>
                );
              }
              if (block.type === 'list') {
                const ListTag = block.ordered ? 'ol' : 'ul';
                return (
                  <ListTag
                    key={index}
                    className={`grid gap-2 pl-6 marker:font-bold marker:text-riso ${block.ordered ? 'list-decimal' : '[list-style:square]'}`}
                  >
                    {block.items.map((item) => (
                      <li key={item} className="pl-1">
                        {item}
                      </li>
                    ))}
                  </ListTag>
                );
              }
              return <p key={index}>{block.text}</p>;
            })}
          </div>

          {url && (
            <div className="mt-8 border-t-2 border-dashed border-primary/50 pt-6">
              {!isSample && <p className="mb-3 text-muted-foreground">{t('news.truncated')}</p>}
              <ExternalLink
                href={url}
                className="inline-flex min-h-12 items-center rounded-sm bg-primary px-5 py-2 font-semibold text-primary-foreground shadow-[3px_3px_0_hsl(var(--riso))]"
              >
                {article.source ? t('news.readFull', { source: article.source }) : t('news.readFullNoSource')}
              </ExternalLink>
            </div>
          )}
        </div>
      </article>

      <div className="mx-auto mt-8 max-w-3xl">
        <button type="button" onClick={onBack} className={backClass}>
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {t('news.back')}
        </button>
      </div>
    </div>
  );
};

export default NewsArticleDetail;
