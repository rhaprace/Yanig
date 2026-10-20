import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHero } from '@/components/poster';
import SEO from '@/components/SEO';

const NotFound = () => {
  const { t } = useTranslation('common');
  const links = [
    { to: '/', label: t('notFound.home') },
    { to: '/tracker', label: t('notFound.tracker') },
    { to: '/resources', label: t('notFound.hotlines') },
  ];
  return (
    <>
      <SEO title={t('notFound.title')} description={t('notFound.body')} noindex />
      <PageHero kicker="404" title={t('notFound.title')} intro={<p>{t('notFound.body')}</p>}>
        <ul className="mt-6 flex flex-wrap gap-3">
          {links.map((link) => (
            <li key={link.to}>
              <Link to={link.to} className="inline-flex min-h-11 items-center border-2 border-primary px-4 font-semibold text-primary hover:bg-accent">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </PageHero>
    </>
  );
};

export default NotFound;
