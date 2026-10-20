/** Date of an article in the reader's language. Returns '' when the date is missing or not valid. */
export const formatArticleDate = (iso: string | undefined, language: string = 'en'): string => {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const locale = language.startsWith('tl') ? 'fil-PH' : language;
  try {
    return date.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return date.toISOString().slice(0, 10);
  }
};

export type ContentBlock =
  | { type: 'heading'; text: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'paragraph'; text: string };

/**
 * Split plain article text into blocks. The output is plain strings that React escapes:
 * article text is never inserted as HTML.
 */
export const toContentBlocks = (content: string): ContentBlock[] =>
  content
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block): ContentBlock => {
      if (/^\*\*[^*]+\*\*$/.test(block)) {
        return { type: 'heading', text: block.replace(/\*\*/g, '') };
      }
      const lines = block.split('\n').map((line) => line.trim());
      if (lines.every((line) => line.startsWith('- '))) {
        return { type: 'list', ordered: false, items: lines.map((line) => line.slice(2)) };
      }
      if (lines.every((line) => /^\d+\.\s/.test(line))) {
        return { type: 'list', ordered: true, items: lines.map((line) => line.replace(/^\d+\.\s*/, '')) };
      }
      return { type: 'paragraph', text: block };
    });
