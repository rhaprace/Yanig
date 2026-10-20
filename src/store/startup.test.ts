import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getCountryConfig } from '@/config/countries';

describe('starting with damaged saved settings', () => {
  beforeEach(() => {
    vi.resetModules();
    localStorage.clear();
    document.documentElement.className = '';
  });

  it('does not crash on a damaged theme value, and uses the system theme', async () => {
    localStorage.setItem('theme-storage', '{not json');
    await expect(import('./useThemeStore')).resolves.toBeDefined();
    expect(document.documentElement.classList.contains('light') || document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('uses a saved dark theme', async () => {
    localStorage.setItem('theme-storage', JSON.stringify({ state: { theme: 'dark' }, version: 0 }));
    await import('./useThemeStore');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('ignores a saved theme name it does not know', async () => {
    localStorage.setItem('theme-storage', JSON.stringify({ state: { theme: 'purple' }, version: 0 }));
    await import('./useThemeStore');
    expect(document.documentElement.classList.contains('purple')).toBe(false);
  });
});

describe('getCountryConfig', () => {
  it('falls back to the Philippines for an unknown country code', () => {
    expect(getCountryConfig('XX').code).toBe('PH');
    expect(getCountryConfig('').code).toBe('PH');
  });
});
