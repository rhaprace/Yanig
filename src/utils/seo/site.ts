export const SITE_NAME = 'Yanig';
export const BASE_URL = 'https://yanig.vercel.app';
export const AUTHOR_NAME = 'Rafael Race';

/** "Page | Yanig", unless the title already names Yanig. */
export const buildFullTitle = (title: string): string =>
  title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

/**
 * JSON for a <script type="application/ld+json"> tag. Escapes "<", ">" and "&" so text from
 * outside (for example a news title with "</script>") cannot close the tag and run as HTML.
 */
export const serializeJsonLd = (data: unknown): string =>
  JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
