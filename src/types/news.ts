export type NewsCategoryId = 'safety' | 'research' | 'preparedness' | 'technology' | 'community';

export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  /** The news site that published the article. */
  source?: string;
  datePublished: string;
  dateModified?: string;
  category: NewsCategoryId;
  imageUrl?: string;
  url?: string;
  tags: string[];
  readTime: number;
}

/** What the news page shows: real articles from NewsAPI, or Yanig's own sample articles. */
export interface NewsFeed {
  articles: NewsArticle[];
  /** True when NewsAPI gave nothing and the page shows the built-in sample articles. */
  isSample: boolean;
}
