import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getCountryConfig, type CountryConfig } from '@/config/countries';
import i18n from '@/i18n/config';

interface LocaleState {
  countryCode: string;
  language: string;
  countryConfig: CountryConfig;
  setCountry: (countryCode: string) => void;
  setLanguage: (language: string) => void;
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      countryCode: 'PH',
      language: 'en',
      countryConfig: getCountryConfig('PH'),
      setCountry: (countryCode: string) => {
        const config = getCountryConfig(countryCode);
        // The country changes the hotlines and agencies. The language stays as the person chose it.
        set({ countryCode, countryConfig: config });
      },
      setLanguage: (language: string) => {
        set({ language });
        i18n.changeLanguage(language);
      },
    }),
    {
      name: 'locale-storage',
      partialize: ({ countryCode, language }) => ({ countryCode, language }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        useLocaleStore.setState({ countryConfig: getCountryConfig(state.countryCode) });
        if (i18n.language !== state.language) i18n.changeLanguage(state.language);
      },
    }
  )
);

