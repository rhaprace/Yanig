import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import YanigMark from '@/components/brand/YanigMark';

const Footer = () => {
  const { t } = useTranslation('common');

  const quickLinks = [
    { name: t('footer.about'), href: '/about' },
    { name: t('footer.privacy'), href: '/privacy' },
    { name: t('footer.terms'), href: '/terms' },
  ];

  return (
    <footer className="mt-16 bg-primary text-primary-foreground">
      <div className="page-wrap grid gap-6 py-10 md:grid-cols-[1fr_auto] md:items-end">
        <div className="grid gap-3">
          <div className="flex items-center gap-3">
            <YanigMark className="h-9 w-9 rounded-md ring-2 ring-primary-foreground" />
            <span className="font-display text-3xl font-black uppercase">Yanig</span>
          </div>
          <p className="max-w-prose text-sm opacity-90">{t('footer.dataSource')}</p>
          <p className="text-sm opacity-90">
            {t('footer.rights')} {t('footer.developer')} <span className="font-semibold">Rafael Race</span>.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Footer">
          {quickLinks.map((link) => (
            <Link key={link.href} to={link.href} className="font-display text-lg font-bold uppercase tracking-wider hover:underline">
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
