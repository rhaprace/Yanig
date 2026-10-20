import { describe, expect, it } from 'vitest';
import { loadNewsFeed } from './useNews';
import { getSampleArticles } from '@/data/news';
import type { NewsArticle } from '@/types/news';

const real: NewsArticle = {
  id: 'news-0',
  title: 'Real story',
  excerpt: 'Excerpt',
  content: 'Content',
  author: 'Writer',
  source: 'Example News',
  datePublished: '2026-10-19T08:00:00Z',
  category: 'safety',
  url: 'https://example.com/story',
  tags: [],
  readTime: 1,
};

describe('loadNewsFeed', () => {
  it('returns real articles and does not mark them as samples', async () => {
    const feed = await loadNewsFeed(async () => [real], 'en');
    expect(feed).toEqual({ articles: [real], isSample: false });
  });

  it('labels the fallback as sample articles when the request fails', async () => {
    const feed = await loadNewsFeed(async () => {
      throw new Error('500');
    }, 'en');
    expect(feed.isSample).toBe(true);
    expect(feed.articles).toEqual(getSampleArticles('en'));
  });

  it('labels the fallback as sample articles when NewsAPI returns nothing', async () => {
    const feed = await loadNewsFeed(async () => [], 'en');
    expect(feed.isSample).toBe(true);
    expect(feed.articles.length).toBeGreaterThan(0);
  });

  it('gives Tagalog sample articles for tl and English for other languages', async () => {
    const tl = await loadNewsFeed(async () => [], 'tl');
    const ja = await loadNewsFeed(async () => [], 'ja');
    expect(tl.articles[0].title).toBe(getSampleArticles('tl')[0].title);
    expect(tl.articles[0].title).not.toBe(getSampleArticles('en')[0].title);
    expect(ja.articles[0].title).toBe(getSampleArticles('en')[0].title);
  });
});

describe('sample articles', () => {
  it('are written by Yanig, have no outside links, and make no false claims', () => {
    for (const lang of ['en', 'tl']) {
      for (const article of getSampleArticles(lang)) {
        expect(article.author).toBe('Yanig');
        expect(article.url).toBeUndefined();
        const text = `${article.title} ${article.excerpt} ${article.content}`;
        expect(text).not.toMatch(/quakesafe|real-?time|early warning|\balerts?\b/i);
      }
    }
  });
});
