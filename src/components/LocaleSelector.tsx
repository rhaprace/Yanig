import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLocaleStore } from '@/store/localeStore';
import { useTranslation } from 'react-i18next';

const LocaleSelector = () => {
  const { t } = useTranslation('common');
  const { countryCode, language, setCountry, setLanguage } = useLocaleStore();

  const countries = [
    { code: 'PH', name: t('country.philippines') },
    { code: 'ID', name: t('country.indonesia') },
    { code: 'JP', name: t('country.japan') },
    { code: 'US', name: t('country.us') },
    { code: 'MX', name: t('country.mexico') },
    { code: 'CL', name: t('country.chile') },
  ];

  const languages = [
    { code: 'en', name: t('language.english') },
    { code: 'tl', name: t('language.tagalog') },
    { code: 'es', name: t('language.spanish') },
    { code: 'ja', name: t('language.japanese') },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex h-10 items-center gap-2 rounded-sm border-2 border-primary-foreground px-2 font-display text-lg font-black uppercase"
        aria-label={t('menu.place')}
      >
        <Globe className="h-5 w-5" />
        <span>{countryCode}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>{t('country.select')}</DropdownMenuLabel>
        {countries.map((country) => (
          <DropdownMenuItem
            key={country.code}
            onClick={() => setCountry(country.code)}
            className={countryCode === country.code ? 'bg-muted font-semibold' : ''}
          >
            <span className="mr-2 w-7 font-display font-black">{country.code}</span>
            {country.name}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuLabel>{t('language.select')}</DropdownMenuLabel>
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={language === lang.code ? 'bg-muted font-semibold' : ''}
          >
            <span className="mr-2 w-7 font-display font-black uppercase">{lang.code}</span>
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LocaleSelector;
