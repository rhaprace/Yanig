import type { NewsArticle } from '@/types/news';

/** One article as NewsAPI sends it (our /api/news passes it through). */
export interface NewsAPIArticle {
  source?: { id: string | null; name: string | null } | null;
  author?: string | null;
  title?: string | null;
  description?: string | null;
  url?: string | null;
  urlToImage?: string | null;
  publishedAt?: string | null;
  content?: string | null;
}

/** Return the URL only when it is an absolute http(s) link. Blocks javascript:, data: and other schemes. */
export const safeHttpUrl = (value: unknown): string | undefined => {
  if (typeof value !== 'string' || value.trim() === '') return undefined;
  try {
    const parsed = new URL(value.trim());
    return parsed.protocol === 'https:' || parsed.protocol === 'http:' ? parsed.href : undefined;
  } catch {
    return undefined;
  }
};

/** Clean article text from NewsAPI: remove the "[+1234 chars]" marker, HTML tags and extra spaces. */
export const cleanNewsText = (value: unknown): string => {
  if (typeof value !== 'string') return '';
  return value
    .replace(/\s*(…|\.\.\.)?\s*\[\+\d+ chars\]\s*$/, '…')
    .replace(/<[^>]*>/g, '')
    .replace(/[ \t]+/g, ' ')
    .trim();
};

/** True when NewsAPI cut the article text short. */
export const isTruncated = (value: unknown): boolean =>
  typeof value === 'string' && /\[\+\d+ chars\]\s*$/.test(value);

export const categorizeArticle = (title: string, description: string): NewsArticle['category'] => {
  const text = `${title} ${description}`.toLowerCase();

  if (/\b(research|study|scientists?)\b/.test(text)) return 'research';
  if (/\b(technology|sensors?|detection)\b/.test(text)) return 'technology';
  if (/\b(prepare|preparedness|kit|drill)\b/.test(text)) return 'preparedness';
  if (/\b(community|volunteers?|relief)\b/.test(text)) return 'community';
  return 'safety';
};

const TAG_KEYWORDS = [
  'earthquake', 'seismic', 'tremor', 'magnitude', 'aftershock',
  'tsunami', 'fault', 'tectonic', 'preparedness', 'safety',
  'emergency', 'disaster', 'relief',
];

const extractTags = (text: string): string[] => {
  const lower = text.toLowerCase();
  return TAG_KEYWORDS.filter((keyword) => lower.includes(keyword)).slice(0, 5);
};

/**
 * Turn one NewsAPI article into a Yanig article.
 * Returns null when the article has no title, was removed by NewsAPI, or has no safe link.
 */
export const transformNewsAPIArticle = (article: NewsAPIArticle, index: number): NewsArticle | null => {
  const title = cleanNewsText(article.title);
  const url = safeHttpUrl(article.url);
  if (!title || title === '[Removed]' || !url) return null;

  const excerpt = cleanNewsText(article.description);
  const content = cleanNewsText(article.content) || excerpt;
  const source = cleanNewsText(article.source?.name) || undefined;
  const wordCount = content ? content.split(/\s+/).length : 0;
  const published = typeof article.publishedAt === 'string' && !Number.isNaN(Date.parse(article.publishedAt))
    ? article.publishedAt
    : '';

  return {
    id: `news-${index}-${url}`,
    title,
    excerpt,
    content,
    author: cleanNewsText(article.author) || source || '',
    source,
    datePublished: published,
    dateModified: published || undefined,
    category: categorizeArticle(title, excerpt),
    imageUrl: safeHttpUrl(article.urlToImage),
    url,
    tags: extractTags(`${title} ${excerpt}`),
    readTime: Math.max(1, Math.ceil(wordCount / 200)),
  };
};

export const newsAPI = {
  /** Ask the app's own server (/api/news). The server asks NewsAPI, so the key never reaches the browser. */
  getEarthquakeNews: async (pageSize: number = 20): Promise<NewsArticle[]> => {
    const response = await fetch(`/api/news?pageSize=${encodeURIComponent(String(pageSize))}`);

    if (!response.ok) {
      throw new Error(`News API error: ${response.status}`);
    }

    const data = await response.json();
    if (!data?.success || !Array.isArray(data.articles)) {
      throw new Error(typeof data?.error === 'string' ? data.error : 'Failed to fetch news');
    }

    return (data.articles as NewsAPIArticle[])
      .map((article, index) => transformNewsAPIArticle(article, index))
      .filter((article): article is NewsArticle => article !== null);
  },
};

export default newsAPI;
