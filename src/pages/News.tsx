import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshCw } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { PageHero, Stamp } from '@/components/poster';
import { NewsArticleCard, NewsArticleDetail, NewsCategoryFilter } from '@/components/news';
import { useNews } from '@/hooks/useNews';
import { getNewsSEO, getNewsArticleSEO } from '@/utils/seo';
import type { NewsArticle } from '@/types/news';
import { useRefreshGate } from '@/hooks/useRefreshGate';

const News = () => {
  const { t } = useTranslation('about');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const { data, isLoading, refetch, isFetching, dataUpdatedAt } = useNews();
  const { allowed: refreshAllowed, tryRefresh } = useRefreshGate(data ? dataUpdatedAt : 0);

  const articles = data?.articles ?? [];
  const isSample = data?.isSample ?? false;
  const filtered = selectedCategory === 'all' ? articles : articles.filter((a) => a.category === selectedCategory);

  const openArticle = (article: NewsArticle | null) => {
    setSelectedArticle(article);
    window.scrollTo({ top: 0 });
  };

  if (selectedArticle) {
    return (
      <>
        <SEO {...getNewsArticleSEO(selectedArticle)} />
        <NewsArticleDetail article={selectedArticle} isSample={isSample} onBack={() => openArticle(null)} />
      </>
    );
  }

  return (
    <>
      <SEO {...getNewsSEO()} />
      <PageHero kicker={t('news.kicker')} title={t('news.title')} intro={<p>{t('news.intro')}</p>}>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => !isFetching && tryRefresh(() => refetch({ cancelRefetch: false }))}
            disabled={isFetching || !refreshAllowed}
            className="inline-flex min-h-11 items-center gap-2 border-2 border-primary px-4 font-semibold text-primary hover:bg-accent disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'motion-safe:animate-spin' : ''}`} aria-hidden="true" />
            {isFetching ? t('news.refreshing') : t('news.refresh')}
          </button>
          {!isSample && !isLoading && <p className="max-w-xl text-base text-muted-foreground">{t('news.sourceNote')}</p>}
        </div>
      </PageHero>

      <div className="page-wrap">
        {isSample && (
          <div className="mb-6 flex flex-wrap items-center gap-4 border-y-2 border-dashed border-riso py-4" role="note">
            <Stamp>{t('news.sampleStamp')}</Stamp>
            <p className="max-w-2xl">{t('news.sampleNote')}</p>
          </div>
        )}

        <NewsCategoryFilter selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />

        <div className="mt-6 bg-board px-4 pb-8 pt-10 sm:px-6" aria-busy={isLoading}>
          {isLoading ? (
            <p className="bg-card p-5 font-semibold" role="status">
              {t('news.loading')}
            </p>
          ) : filtered.length === 0 ? (
            <p className="bg-card p-5" role="status">
              {t('news.empty')}
            </p>
          ) : (
            <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((article) => (
                <li key={article.id} className="group">
                  <NewsArticleCard article={article} isSample={isSample} onOpen={openArticle} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default News;
