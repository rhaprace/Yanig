import type { SEOProps } from '@/components/SEO';
import type { NewsArticle } from '@/types/news';
import {
  getWebApplicationSchema,
  getOrganizationSchema,
  getBreadcrumbSchema,
  getArticleSchema,
} from './structured-data';

export const getHomeSEO = (): SEOProps => ({
  title: 'QuakeSafe - Earthquake Monitoring & Preparedness Platform',
  description: 'Real-time earthquake monitoring, safety guides, and emergency resources. Stay prepared and informed with QuakeSafe - your comprehensive earthquake safety platform.',
  keywords: [
    'earthquake monitoring',
    'real-time earthquake data',
    'earthquake preparedness Philippines',
    'seismic activity tracker',
    'disaster response',
    'emergency preparedness',
  ],
  canonicalUrl: 'https://yanig.vercel.app/',
  structuredData: [
    getWebApplicationSchema(),
    getOrganizationSchema(),
  ],
});

export const getTrackerSEO = (): SEOProps => ({
  title: 'Earthquake Tracker - Real-Time Seismic Activity Monitor',
  description: 'Track earthquakes worldwide in real-time. View magnitude, location, depth, and time of recent seismic events on an interactive map with multi-source data.',
  keywords: [
    'earthquake tracker',
    'real-time earthquake map',
    'seismic activity monitor',
    'earthquake data',
    'USGS earthquake',
    'global earthquake tracking',
    'earthquake alerts',
  ],
  canonicalUrl: 'https://yanig.vercel.app/tracker',
  structuredData: [
    getBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Earthquake Tracker', url: '/tracker' },
    ]),
    getWebApplicationSchema(),
  ],
});

export const getGuidesSEO = (): SEOProps => ({
  title: 'Earthquake Safety Guides - Before, During & After Preparedness',
  description: 'Comprehensive earthquake safety guides covering preparation, response during earthquakes, and recovery. Learn essential safety measures and emergency procedures.',
  keywords: [
    'earthquake safety guide',
    'earthquake preparedness tips',
    'what to do during earthquake',
    'earthquake survival guide',
    'emergency procedures',
    'disaster preparedness checklist',
    'earthquake safety measures',
  ],
  canonicalUrl: 'https://yanig.vercel.app/guides',
  structuredData: [
    getBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Safety Guides', url: '/guides' },
    ]),
    getArticleSchema({
      headline: 'Comprehensive Earthquake Safety Guides',
      description: 'Essential earthquake preparedness and safety information for before, during, and after seismic events.',
    }),
  ],
});

export const getResourcesSEO = (): SEOProps => ({
  title: 'Emergency Resources - Earthquake Preparedness Organizations & Tools',
  description: 'Access emergency resources, volunteer organizations, and preparedness tools. Connect with disaster response agencies and find essential earthquake safety resources.',
  keywords: [
    'emergency resources',
    'disaster preparedness organizations',
    'earthquake relief organizations',
    'volunteer disaster response',
    'emergency contact numbers',
    'disaster response agencies',
  ],
  canonicalUrl: 'https://yanig.vercel.app/resources',
  structuredData: [
    getBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Resources', url: '/resources' },
    ]),
    getArticleSchema({
      headline: 'Emergency Resources and Organizations',
      description: 'Comprehensive directory of emergency resources, volunteer organizations, and disaster preparedness tools.',
    }),
  ],
});

export const getEmergencyFinderSEO = (): SEOProps => ({
  title: 'Regional Emergency Finder - Philippines Emergency Contacts & Resources',
  description: 'Find local emergency contacts, hospitals, evacuation centers, and government hotlines across Philippine cities. Quick access to regional disaster response resources.',
  keywords: [
    'Philippines emergency contacts',
    'regional emergency finder',
    'local emergency numbers Philippines',
    'evacuation centers Philippines',
    'hospital emergency hotline',
    'disaster response Philippines',
    'emergency services locator',
    'Philippine emergency resources',
  ],
  canonicalUrl: 'https://yanig.vercel.app/emergency-finder',
  structuredData: [
    getBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Emergency Finder', url: '/emergency-finder' },
    ]),
  ],
});

export const getAboutSEO = (): SEOProps => ({
  title: 'About QuakeSafe - Earthquake Safety & Preparedness Mission',
  description: 'Learn about QuakeSafe\'s mission to provide accessible earthquake safety information, real-time monitoring, and emergency resources to communities worldwide.',
  keywords: [
    'earthquake safety platform',
    'disaster preparedness mission',
    'earthquake monitoring service',
    'community safety',
    'earthquake data sources',
  ],
  canonicalUrl: 'https://yanig.vercel.app/about',
  structuredData: [
    getBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'About', url: '/about' },
    ]),
    getOrganizationSchema(),
    getArticleSchema({
      headline: 'About QuakeSafe - Our Mission and Vision',
      description: 'QuakeSafe provides comprehensive earthquake safety information and real-time monitoring to help communities prepare for and respond to seismic events.',
    }),
  ],
});

export const getPrivacySEO = (): SEOProps => ({
  title: 'Privacy Policy - QuakeSafe Data Protection & Privacy',
  description: 'QuakeSafe privacy policy explaining how we collect, use, and protect your data. Learn about our commitment to user privacy and data security.',
  keywords: [
    'privacy policy',
    'data protection',
    'user privacy',
    'data security',
  ],
  canonicalUrl: 'https://yanig.vercel.app/privacy',
  noindex: false, // Keep indexed for transparency
  structuredData: [
    getBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Privacy Policy', url: '/privacy' },
    ]),
  ],
});

export const getTermsSEO = (): SEOProps => ({
  title: 'Terms of Service - QuakeSafe Usage Terms & Conditions',
  description: 'QuakeSafe terms of service outlining user responsibilities, service usage guidelines, and legal disclaimers for earthquake monitoring and safety information.',
  keywords: [
    'terms of service',
    'usage terms',
    'service agreement',
    'legal disclaimer',
  ],
  canonicalUrl: 'https://yanig.vercel.app/terms',
  noindex: false, // Keep indexed for transparency
  structuredData: [
    getBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Terms of Service', url: '/terms' },
    ]),
  ],
});

export const getOfflineSEO = (): SEOProps => ({
  title: 'Offline - QuakeSafe',
  description: 'You are currently offline. QuakeSafe works offline with cached data for emergency access.',
  noindex: true, // Don't index offline page
  nofollow: true,
});

export const getNewsSEO = (): SEOProps => ({
  title: 'Earthquake News & Updates - Latest Safety Information & Research',
  description: 'Stay informed with the latest earthquake news, safety tips, research findings, and community stories. Expert insights on earthquake preparedness and seismic activity.',
  keywords: [
    'earthquake news',
    'seismic activity updates',
    'earthquake safety news',
    'earthquake research',
    'disaster preparedness news',
    'earthquake technology',
    'community earthquake stories',
  ],
  canonicalUrl: 'https://yanig.vercel.app/news',
  ogType: 'website',
  structuredData: [
    getBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'News', url: '/news' },
    ]),
  ],
});

export const getNewsArticleSEO = (article: NewsArticle): SEOProps => ({
  title: `${article.title} - QuakeSafe News`,
  description: article.excerpt,
  keywords: [
    ...article.tags,
    'earthquake news',
    'earthquake safety',
    'seismic activity',
  ],
  canonicalUrl: `https://yanig.vercel.app/news/${article.id}`,
  ogType: 'article',
  structuredData: [
    getBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'News', url: '/news' },
      { name: article.title, url: `/news/${article.id}` },
    ]),
    getArticleSchema({
      headline: article.title,
      description: article.excerpt,
      datePublished: article.datePublished,
      dateModified: article.dateModified || article.datePublished,
      author: article.author,
    }),
  ],
});

