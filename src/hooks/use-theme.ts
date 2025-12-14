import { useEffect, useState } from 'react';
import { THEME, STORAGE_KEYS } from '@/lib/constants';

export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(() => {
    // Initialize theme from localStorage synchronously to avoid cascading renders
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) as 'light' | 'dark' | 'system' | null;
      if (savedTheme && Object.values(THEME).includes(savedTheme)) {
        return savedTheme;
      }
    }
    return THEME.LIGHT;
  });
  
  // Initialize mounted as true on client-side to avoid hydration mismatch
  // This is safe because we only use it to prevent SSR/client mismatch
  const [mounted] = useState(() => typeof window !== 'undefined');

  useEffect(() => {
    if (!mounted) return;

    if (theme === THEME.DARK) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(STORAGE_KEYS.THEME, THEME.DARK);
    } else if (theme === THEME.LIGHT) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(STORAGE_KEYS.THEME, THEME.LIGHT);
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme(prev => (prev === THEME.DARK ? THEME.LIGHT : THEME.DARK));
  };

  return {
    theme,
    setTheme,
    toggleTheme,
    mounted,
    isDark: theme === THEME.DARK,
  };
}

