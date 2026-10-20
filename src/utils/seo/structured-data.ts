import { AUTHOR_NAME, BASE_URL, SITE_NAME } from './site';

const author = { '@type': 'Person', name: AUTHOR_NAME };

/** Yanig as a free web app. No ratings, no review counts, no claims the app does not back. */
export const getWebApplicationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: SITE_NAME,
  url: BASE_URL,
  description:
    'Recent earthquakes near the Philippines from USGS, GeoNet and BMKG, checked every 10 minutes. Safety steps and emergency hotlines. Free, no account.',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: ['en', 'tl', 'es', 'ja'],
  isAccessibleForFree: true,
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'PHP',
  },
  author,
  browserRequirements: 'Requires JavaScript.',
});

export const getBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: `${BASE_URL}${item.url}`,
  })),
});

export const getFAQSchema = (faqs: Array<{ question: string; answer: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
});

export const getHowToSchema = (guide: {
  name: string;
  description: string;
  steps: Array<{ name: string; text: string }>;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: guide.name,
  description: guide.description,
  step: guide.steps.map((step, index) => ({
    '@type': 'HowToStep',
    position: index + 1,
    name: step.name,
    text: step.text,
  })),
});

/** A page written for Yanig. Dates are only added when they are known. */
export const getArticleSchema = (article: {
  headline: string;
  description: string;
  datePublished?: string;
  dateModified?: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: article.headline,
  description: article.description,
  ...(article.datePublished ? { datePublished: article.datePublished } : {}),
  ...(article.dateModified ? { dateModified: article.dateModified } : {}),
  author,
  publisher: {
    '@type': 'Person',
    name: AUTHOR_NAME,
  },
});

export const getItemListSchema = (items: Array<{ name: string; description: string; url: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    description: item.description,
    url: item.url,
  })),
});
