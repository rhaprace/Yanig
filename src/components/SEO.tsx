import { Helmet } from 'react-helmet-async';
import { BASE_URL, SITE_NAME, buildFullTitle, serializeJsonLd } from '@/utils/seo/site';

export interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  noindex?: boolean;
  nofollow?: boolean;
  structuredData?: object | object[];
}

const DEFAULT_KEYWORDS = [
  'Yanig',
  'earthquake safety',
  'earthquake preparedness',
  'Philippines',
  'lindol',
  'emergency hotlines',
  'safety guides',
];

const DEFAULT_OG_IMAGE = `${BASE_URL}/web-app-manifest-512x512.png`;

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords = [],
  canonicalUrl,
  ogType = 'website',
  ogImage = DEFAULT_OG_IMAGE,
  twitterCard = 'summary_large_image',
  noindex = false,
  nofollow = false,
  structuredData,
}) => {
  const fullTitle = buildFullTitle(title);
  const allKeywords = [...DEFAULT_KEYWORDS, ...keywords].join(', ');
  const canonical = canonicalUrl || `${BASE_URL}${window.location.pathname}`;
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${BASE_URL}${ogImage}`;

  const robotsContent = [
    noindex ? 'noindex' : 'index',
    nofollow ? 'nofollow' : 'follow',
  ].join(', ');

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={allKeywords} />
      <meta name="robots" content={robotsContent} />
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />

      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:url" content={canonical} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImage} />

      {structuredData && (
        <script type="application/ld+json">
          {serializeJsonLd(Array.isArray(structuredData) ? structuredData : [structuredData])}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;

