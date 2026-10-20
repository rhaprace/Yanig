import { SEO } from '@/components/SEO';
import { LegalPage } from '@/components/pages/LegalPage';
import { getTermsSEO } from '@/utils/seo';

const Terms = () => (
  <>
    <SEO {...getTermsSEO()} />
    <LegalPage namespace="terms" />
  </>
);

export default Terms;
