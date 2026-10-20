import { beforeEach, describe, expect, it } from 'vitest';
import i18n from '@/i18n/config';
import { useLocaleStore } from './localeStore';

describe('localeStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useLocaleStore.setState({ countryCode: 'PH', language: 'en' });
  });

  it('starts in the Philippines', () => {
    expect(useLocaleStore.getState().countryCode).toBe('PH');
    expect(useLocaleStore.getState().countryConfig.code).toBe('PH');
  });

  it('keeps the chosen language when the country changes', async () => {
    useLocaleStore.getState().setLanguage('en');
    useLocaleStore.getState().setCountry('JP');
    expect(useLocaleStore.getState().language).toBe('en');
    expect(useLocaleStore.getState().countryConfig.code).toBe('JP');
    useLocaleStore.getState().setCountry('PH');
    expect(useLocaleStore.getState().language).toBe('en');
    expect(i18n.language).toBe('en');
  });
});
