import { describe, expect, it } from 'vitest';
import { formatArticleDate, toContentBlocks } from './format';

describe('formatArticleDate', () => {
  it('formats a valid date', () => {
    expect(formatArticleDate('2026-10-19T08:00:00Z', 'en')).toMatch(/2026/);
  });

  it('returns an empty string for a missing or bad date', () => {
    expect(formatArticleDate('', 'en')).toBe('');
    expect(formatArticleDate(undefined, 'en')).toBe('');
    expect(formatArticleDate('not a date', 'en')).toBe('');
  });

  it('works for Tagalog', () => {
    expect(formatArticleDate('2026-10-19T08:00:00Z', 'tl')).toMatch(/2026/);
  });
});

describe('toContentBlocks', () => {
  it('splits paragraphs, lists and headings', () => {
    const blocks = toContentBlocks('**Heading**\n\nFirst line.\n\n- a\n- b\n\n1. one\n2. two');
    expect(blocks).toEqual([
      { type: 'heading', text: 'Heading' },
      { type: 'paragraph', text: 'First line.' },
      { type: 'list', ordered: false, items: ['a', 'b'] },
      { type: 'list', ordered: true, items: ['one', 'two'] },
    ]);
  });

  it('keeps HTML as plain text for React to escape', () => {
    const blocks = toContentBlocks('<script>alert(1)</script>');
    expect(blocks).toEqual([{ type: 'paragraph', text: '<script>alert(1)</script>' }]);
  });

  it('handles empty content', () => {
    expect(toContentBlocks('')).toEqual([]);
  });
});
