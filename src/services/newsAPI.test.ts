import { describe, expect, it } from 'vitest';
import { cleanNewsText, isTruncated, safeHttpUrl, transformNewsAPIArticle } from './newsAPI';

const base = {
  source: { id: null, name: 'Example News' },
  author: 'A. Writer',
  title: 'Magnitude 6 earthquake hits coast',
  description: 'A strong earthquake shook the coast.',
  url: 'https://example.com/story',
  urlToImage: 'https://example.com/pic.jpg',
  publishedAt: '2026-10-19T08:00:00Z',
  content: 'A strong earthquake shook the coast on Sunday… [+1234 chars]',
};

describe('safeHttpUrl', () => {
  it('keeps http and https links', () => {
    expect(safeHttpUrl('https://example.com/a')).toBe('https://example.com/a');
    expect(safeHttpUrl('http://example.com/a')).toBe('http://example.com/a');
  });

  it('blocks javascript:, data: and broken links', () => {
    expect(safeHttpUrl('javascript:alert(1)')).toBeUndefined();
    expect(safeHttpUrl(' JavaScript:alert(1)')).toBeUndefined();
    expect(safeHttpUrl('data:text/html,<script>alert(1)</script>')).toBeUndefined();
    expect(safeHttpUrl('/relative/path')).toBeUndefined();
    expect(safeHttpUrl('')).toBeUndefined();
    expect(safeHttpUrl(null)).toBeUndefined();
    expect(safeHttpUrl(42)).toBeUndefined();
  });
});

describe('cleanNewsText', () => {
  it('removes the NewsAPI "[+N chars]" marker', () => {
    expect(cleanNewsText('Some text… [+1234 chars]')).toBe('Some text…');
    expect(isTruncated('Some text… [+1234 chars]')).toBe(true);
    expect(isTruncated('Full text.')).toBe(false);
  });

  it('removes HTML tags and handles missing values', () => {
    expect(cleanNewsText('<b>Bold</b> <img src=x onerror=alert(1)>text')).toBe('Bold text');
    expect(cleanNewsText(undefined)).toBe('');
  });
});

describe('transformNewsAPIArticle', () => {
  it('maps a NewsAPI article', () => {
    const article = transformNewsAPIArticle(base, 0)!;
    expect(article.title).toBe(base.title);
    expect(article.source).toBe('Example News');
    expect(article.url).toBe('https://example.com/story');
    expect(article.imageUrl).toBe('https://example.com/pic.jpg');
    expect(article.content).not.toContain('[+');
  });

  it('drops articles with an unsafe or missing link', () => {
    expect(transformNewsAPIArticle({ ...base, url: 'javascript:alert(1)' }, 0)).toBeNull();
    expect(transformNewsAPIArticle({ ...base, url: null }, 0)).toBeNull();
  });

  it('drops articles that NewsAPI removed', () => {
    expect(transformNewsAPIArticle({ ...base, title: '[Removed]' }, 0)).toBeNull();
    expect(transformNewsAPIArticle({ ...base, title: '' }, 0)).toBeNull();
  });

  it('drops an unsafe image but keeps the article', () => {
    const article = transformNewsAPIArticle({ ...base, urlToImage: 'javascript:alert(1)' }, 0)!;
    expect(article.imageUrl).toBeUndefined();
  });

  it('handles a missing source, author and date', () => {
    const article = transformNewsAPIArticle({ ...base, source: null, author: null, publishedAt: 'not a date' }, 3)!;
    expect(article.author).toBe('');
    expect(article.source).toBeUndefined();
    expect(article.datePublished).toBe('');
  });
});
