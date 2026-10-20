import { SEO } from '@/components/SEO';
import { LegalPage } from '@/components/pages/LegalPage';
import { getPrivacySEO } from '@/utils/seo';

const Privacy = () => (
  <>
    <SEO {...getPrivacySEO()} />
    <LegalPage namespace="privacy" />
  </>
);

export default Privacy;
