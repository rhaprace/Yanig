import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { newsAPI } from '@/services/newsAPI';
import { getSampleArticles } from '@/data/news';
import type { NewsArticle, NewsFeed } from '@/types/news';

/**
 * Get real articles. When the request fails or returns nothing, use the sample articles
 * and mark the feed as a sample so the page can say so.
 */
export const loadNewsFeed = async (
  fetchArticles: () => Promise<NewsArticle[]>,
  language: string,
): Promise<NewsFeed> => {
  try {
    const articles = await fetchArticles();
    if (articles.length > 0) {
      return { articles, isSample: false };
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('News request failed. Showing sample articles.', error);
    }
  }
  return { articles: getSampleArticles(language), isSample: true };
};

export const useNews = (pageSize: number = 20) => {
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage ?? i18n.language ?? 'en';

  return useQuery<NewsFeed, Error>({
    queryKey: ['earthquake-news', pageSize, language],
    queryFn: () => loadNewsFeed(() => newsAPI.getEarthquakeNews(pageSize), language),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    // loadNewsFeed never throws: it falls back to the sample articles.
    retry: false,
  });
};

export default useNews;
