import type { SEOProps } from '@/components/SEO';
import type { NewsArticle } from '@/types/news';
import { getWebApplicationSchema, getBreadcrumbSchema } from './structured-data';
import { BASE_URL } from './site';

const SOURCES = 'USGS, GeoNet and BMKG';

export const getHomeSEO = (): SEOProps => ({
  title: 'Yanig: Earthquake safety for the Philippines',
  description: `See recent earthquakes near the Philippines from ${SOURCES}. Learn Drop, Cover, Hold on. Find emergency hotlines. Free, in English and Tagalog.`,
  keywords: ['recent earthquakes Philippines', 'earthquake preparedness Philippines', 'Drop Cover Hold on'],
  canonicalUrl: `${BASE_URL}/`,
  structuredData: [getWebApplicationSchema()],
});

export const getTrackerSEO = (): SEOProps => ({
  title: 'Recent earthquakes: map and list',
  description: `A map and list of recent earthquakes from ${SOURCES}. Yanig checks for new data every 10 minutes. Magnitudes are first estimates.`,
  keywords: ['earthquake map', 'recent earthquakes', 'earthquake list', 'USGS', 'GeoNet', 'BMKG'],
  canonicalUrl: `${BASE_URL}/tracker`,
  structuredData: [
    getBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Recent earthquakes', url: '/tracker' },
    ]),
  ],
});

export const getGuidesSEO = (): SEOProps => ({
  title: 'Earthquake safety steps: before, during and after',
  description: 'What to do before, during and after an earthquake. Drop, Cover, Hold on, and a checklist for your emergency kit.',
  keywords: ['earthquake safety guide', 'what to do during an earthquake', 'emergency kit checklist', 'go-bag'],
  canonicalUrl: `${BASE_URL}/guides`,
  structuredData: [
    getBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Safety guides', url: '/guides' },
    ]),
  ],
});

export const getResourcesSEO = (): SEOProps => ({
  title: 'Emergency numbers and agencies',
  description: 'National emergency numbers, government agencies for earthquakes and disasters, and ways to volunteer.',
  keywords: ['emergency resources', 'emergency hotlines', 'disaster preparedness'],
  canonicalUrl: `${BASE_URL}/resources`,
  structuredData: [
    getBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Resources', url: '/resources' },
    ]),
  ],
});

export const getEmergencyFinderSEO = (): SEOProps => ({
  title: 'Emergency hotlines for Philippine cities',
  description: 'Find emergency hotlines, hospitals and disaster offices for cities in the Philippines. Check numbers with your local government.',
  keywords: ['Philippines emergency hotlines', 'local emergency numbers Philippines', 'disaster office hotline'],
  canonicalUrl: `${BASE_URL}/emergency-finder`,
  structuredData: [
    getBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Emergency hotlines', url: '/emergency-finder' },
    ]),
  ],
});

export const getAboutSEO = (): SEOProps => ({
  title: 'About Yanig',
  description: `What Yanig does and does not do. Earthquake data from ${SOURCES}, checked every 10 minutes. No alerts. Made by Rafael Race.`,
  keywords: ['about Yanig', 'earthquake data sources'],
  canonicalUrl: `${BASE_URL}/about`,
  structuredData: [
    getBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'About', url: '/about' },
    ]),
    getWebApplicationSchema(),
  ],
});

export const getPrivacySEO = (): SEOProps => ({
  title: 'Privacy notice',
  description: 'Yanig has no accounts, cookies or trackers. Your settings stay in your browser. See which services your browser contacts.',
  keywords: ['privacy notice'],
  canonicalUrl: `${BASE_URL}/privacy`,
  structuredData: [
    getBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Privacy', url: '/privacy' },
    ]),
  ],
});

export const getTermsSEO = (): SEOProps => ({
  title: 'Terms of use',
  description: 'Yanig is a free information website. It is not an alert system and cannot predict earthquakes. Data can be late or wrong.',
  keywords: ['terms of use'],
  canonicalUrl: `${BASE_URL}/terms`,
  structuredData: [
    getBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Terms', url: '/terms' },
    ]),
  ],
});

export const getOfflineSEO = (): SEOProps => ({
  title: 'You are offline',
  description: 'Your device has no internet connection. Pages you opened before work without internet.',
  noindex: true,
  nofollow: true,
});

export const getNewsSEO = (): SEOProps => ({
  title: 'Earthquake news',
  description: 'Earthquake news from news sites around the world, through NewsAPI. Yanig does not write or check these articles.',
  keywords: ['earthquake news'],
  canonicalUrl: `${BASE_URL}/news`,
  structuredData: [
    getBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'News', url: '/news' },
    ]),
  ],
});

/**
 * An article opened on the news page. It has no URL of its own in Yanig, so the canonical
 * URL stays /news and the page is not indexed. Other sites publish the articles, so no Article schema.
 */
export const getNewsArticleSEO = (article: NewsArticle): SEOProps => ({
  title: article.title,
  description: article.excerpt || 'Earthquake news on Yanig.',
  canonicalUrl: `${BASE_URL}/news`,
  ogType: 'article',
  noindex: true,
});
