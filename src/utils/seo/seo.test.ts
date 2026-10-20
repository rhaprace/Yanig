import { describe, expect, it } from 'vitest';
import * as pages from './page-seo-config';
import { getWebApplicationSchema } from './structured-data';
import { buildFullTitle, serializeJsonLd } from './site';
import type { NewsArticle } from '@/types/news';

const article: NewsArticle = {
  id: 'news-0',
  title: 'Story</script><img src=x onerror=alert(1)>',
  excerpt: 'Excerpt',
  content: '',
  author: '',
  datePublished: '',
  category: 'safety',
  tags: [],
  readTime: 1,
};

const configs = Object.entries(pages).map(([name, fn]) => [
  name,
  name === 'getNewsArticleSEO' ? (fn as typeof pages.getNewsArticleSEO)(article) : (fn as () => ReturnType<typeof pages.getHomeSEO>)(),
] as const);

// Negations ("No alerts", "not an alert system") are allowed.
// Claims the app does not back: no real-time data, no alerts, no PHIVOLCS data, the old name.
const FALSE_CLAIMS = [/real-?\s?time/i, /\blive\b/i, /(?<!(not an |no ))\balerts?\b/i, /phivolcs/i, /quakesafe/i, /notification/i, /aggregateRating/i];

describe('page SEO config', () => {
  it('covers every page', () => {
    const names = configs.map(([name]) => name);
    for (const page of ['Home', 'Tracker', 'Guides', 'Resources', 'EmergencyFinder', 'About', 'Privacy', 'Terms', 'Offline', 'News']) {
      expect(names).toContain(`get${page}SEO`);
    }
  });

  it.each(configs)('%s has a title and a description', (_name, config) => {
    expect(config.title.trim().length).toBeGreaterThan(0);
    expect(config.description.trim().length).toBeGreaterThan(0);
    expect(buildFullTitle(config.title)).toMatch(/Yanig/);
  });

  it.each(configs.filter(([name]) => name !== 'getNewsArticleSEO'))('%s makes no false claims', (_name, config) => {
    const text = JSON.stringify(config);
    for (const claim of FALSE_CLAIMS) {
      expect(text).not.toMatch(claim);
    }
  });

  it('gives every page a different title', () => {
    const titles = configs.filter(([name]) => name !== 'getNewsArticleSEO').map(([, c]) => c.title);
    expect(new Set(titles).size).toBe(titles.length);
  });

  it('does not index an opened news article and points it at /news', () => {
    const config = pages.getNewsArticleSEO(article);
    expect(config.noindex).toBe(true);
    expect(config.canonicalUrl).toMatch(/\/news$/);
  });
});

describe('structured data', () => {
  it('has no fake rating and names the real maker', () => {
    const schema = getWebApplicationSchema();
    expect(schema).not.toHaveProperty('aggregateRating');
    expect(schema.name).toBe('Yanig');
    expect(schema.author.name).toBe('Rafael Race');
    expect(schema.description).toMatch(/10 minutes/);
  });

  it('cannot be closed early by text from a news title', () => {
    const json = serializeJsonLd([{ name: article.title }]);
    expect(json).not.toContain('</script>');
    expect(json).not.toContain('<');
    expect(JSON.parse(json)[0].name).toBe(article.title);
  });
});

describe('buildFullTitle', () => {
  it('adds the site name once', () => {
    expect(buildFullTitle('About Yanig')).toBe('About Yanig');
    expect(buildFullTitle('Privacy notice')).toBe('Privacy notice | Yanig');
  });
});
