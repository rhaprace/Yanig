import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { useThemeStore } from '@/store/useThemeStore';
import { useLocaleStore } from '@/store/localeStore';
import LocaleSelector from '@/components/LocaleSelector';
import YanigMark from '@/components/brand/YanigMark';
import { useTranslation } from 'react-i18next';

const isDark = (theme: string) =>
  theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useThemeStore();
  const { countryCode, language, setLanguage } = useLocaleStore();
  const { t } = useTranslation('common');

  const navItems = [
    { name: t('navigation.home'), path: '/' },
    { name: t('navigation.tracker'), path: '/tracker' },
    { name: t('navigation.guides'), path: '/guides' },
    { name: t('navigation.resources'), path: '/resources' },
    ...(countryCode === 'PH' ? [{ name: t('navigation.emergencyFinder'), path: '/emergency-finder' }] : []),
    { name: t('navigation.news'), path: '/news' },
    { name: t('navigation.about'), path: '/about' },
  ];

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `whitespace-nowrap font-display text-lg font-bold uppercase tracking-wider underline-offset-[6px] decoration-[3px] decoration-riso hover:underline ${
      isActive ? 'underline' : ''
    }`;

  const dark = isDark(theme);

  return (
    <header className="sticky top-0 z-50 w-full bg-primary text-primary-foreground shadow-[0_3px_0_hsl(var(--riso))]">
      <div className="page-wrap flex min-h-16 items-center gap-4 py-2">
        <Link to="/" className="flex shrink-0 items-center gap-3" aria-label="Yanig">
          <YanigMark className="h-10 w-10 rounded-md ring-2 ring-primary-foreground" />
          <span className="leading-none">
            <span className="block font-display text-3xl font-black uppercase tracking-wide">Yanig</span>
            <span className="hidden text-[11px] font-semibold uppercase tracking-[0.14em] opacity-85 sm:block xl:hidden 2xl:block">
              {t('tagline')}
            </span>
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-5 xl:flex" aria-label="Main">
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path} end className={navClass}>
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 xl:ml-4">
          <div className="hidden overflow-hidden rounded-sm border-2 border-primary-foreground sm:flex" role="group" aria-label={t('language.select')}>
            {(['en', 'tl'] as const).map((code) => (
              <button
                key={code}
                type="button"
                aria-pressed={language === code}
                onClick={() => setLanguage(code)}
                className={`min-h-10 px-3 font-display text-lg font-black uppercase ${
                  language === code ? 'bg-primary-foreground text-primary' : ''
                }`}
              >
                {code}
              </button>
            ))}
          </div>
          <LocaleSelector />
          <button
            type="button"
            onClick={toggleTheme}
            className="grid h-10 w-10 place-items-center rounded-sm border-2 border-primary-foreground"
            aria-label={dark ? t('menu.light') : t('menu.dark')}
          >
            {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="grid h-10 w-10 place-items-center rounded-sm border-2 border-primary-foreground xl:hidden"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav"
            aria-label={isMenuOpen ? t('menu.close') : t('menu.open')}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <nav id="mobile-nav" className="page-wrap grid gap-1 pb-4 xl:hidden" aria-label="Main">
          <div className="mb-2 flex overflow-hidden rounded-sm border-2 border-primary-foreground sm:hidden" role="group" aria-label={t('language.select')}>
            {(['en', 'tl'] as const).map((code) => (
              <button
                key={code}
                type="button"
                aria-pressed={language === code}
                onClick={() => setLanguage(code)}
                className={`min-h-11 flex-1 font-display text-lg font-black uppercase ${
                  language === code ? 'bg-primary-foreground text-primary' : ''
                }`}
              >
                {code === 'en' ? 'English' : 'Tagalog'}
              </button>
            ))}
          </div>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end
              onClick={() => setIsMenuOpen(false)}
              className={(s) => `${navClass(s)} py-2 text-2xl`}
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Header;
