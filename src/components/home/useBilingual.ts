import { useTranslation } from 'react-i18next';
import { secondLanguage } from '@/utils/home';

/** `t` for the reader's language and `t2` for the second line on the poster (Tagalog, or English under Tagalog). */
export const useBilingual = () => {
  const { t, i18n } = useTranslation('home');
  const lang2 = secondLanguage(i18n.language ?? 'en');
  const t2 = i18n.getFixedT(lang2, 'home');
  return { t, t2, lang2, language: i18n.language ?? 'en' };
};
