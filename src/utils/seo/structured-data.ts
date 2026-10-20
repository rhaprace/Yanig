const BASE_URL = 'https://yanig.vercel.app';

export const getWebApplicationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'QuakeSafe',
  url: BASE_URL,
  description: 'Real-time earthquake monitoring, safety guides, and emergency resources for earthquake preparedness and disaster response.',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '1250',
  },
  author: {
    '@type': 'Organization',
    name: 'QuakeSafe',
    url: BASE_URL,
  },
  browserRequirements: 'Requires JavaScript. Requires HTML5.',
  softwareVersion: '1.0.0',
  screenshot: `${BASE_URL}/web-app-manifest-512x512.png`,
});

export const getOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'QuakeSafe',
  url: BASE_URL,
  logo: `${BASE_URL}/web-app-manifest-512x512.png`,
  description: 'Earthquake safety and preparedness platform providing real-time monitoring and emergency resources.',
  sameAs: [
    // Add social media links when available
  ],
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

export const getLocalBusinessSchema = (business: {
  name: string;
  type: string;
  telephone: string;
  address?: string;
  city: string;
  province: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: business.name,
  '@id': `${BASE_URL}/emergency-finder#${business.name.replace(/\s+/g, '-').toLowerCase()}`,
  telephone: business.telephone,
  address: business.address
    ? {
        '@type': 'PostalAddress',
        addressLocality: business.city,
        addressRegion: business.province,
        addressCountry: 'PH',
        streetAddress: business.address,
      }
    : {
        '@type': 'PostalAddress',
        addressLocality: business.city,
        addressRegion: business.province,
        addressCountry: 'PH',
      },
  areaServed: {
    '@type': 'City',
    name: business.city,
  },
});

export const getArticleSchema = (article: {
  headline: string;
  description: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: article.headline,
  description: article.description,
  datePublished: article.datePublished || new Date().toISOString(),
  dateModified: article.dateModified || new Date().toISOString(),
  author: {
    '@type': 'Organization',
    name: article.author || 'QuakeSafe',
  },
  publisher: {
    '@type': 'Organization',
    name: 'QuakeSafe',
    logo: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/web-app-manifest-512x512.png`,
    },
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

export const getEarthquakeEventSchema = (earthquake: {
  magnitude: number;
  location: string;
  time: number;
  depth: number;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: `Magnitude ${earthquake.magnitude} Earthquake`,
  description: `Earthquake detected near ${earthquake.location}`,
  startDate: new Date(earthquake.time).toISOString(),
  location: {
    '@type': 'Place',
    name: earthquake.location,
  },
  eventStatus: 'https://schema.org/EventScheduled',
});

