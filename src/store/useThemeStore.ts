import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'dark' | 'light' | 'system';

interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const applyTheme = (value: Theme) => {
  // A saved value can be anything. Only the three known themes are used.
  const theme: Theme = value === 'dark' || value === 'light' ? value : 'system';
  const root = window.document.documentElement;
  root.classList.remove('light', 'dark');

  if (theme === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
    root.classList.add(systemTheme);
  } else {
    root.classList.add(theme);
  }
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'system',
      setTheme: (theme: Theme) => {
        set({ theme });
        applyTheme(theme);
      },
      toggleTheme: () => {
        const currentTheme = get().theme;
        let newTheme: Theme;
        
        if (currentTheme === 'light') {
          newTheme = 'dark';
        } else if (currentTheme === 'dark') {
          newTheme = 'light';
        } else {
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';
          newTheme = systemTheme === 'dark' ? 'light' : 'dark';
        }
        
        set({ theme: newTheme });
        applyTheme(newTheme);
      },
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyTheme(state.theme);
        }
      },
    }
  )
);
if (typeof window !== 'undefined') {
  // A damaged or blocked saved value must not stop the app from starting.
  let saved: unknown;
  try {
    saved = JSON.parse(localStorage.getItem('theme-storage') ?? 'null')?.state?.theme;
  } catch {
    saved = undefined;
  }
  applyTheme(saved === 'dark' || saved === 'light' ? saved : 'system');
}
