/**
 * Theme configuration cho GreenConnect
 * Đồng bộ hoàn toàn với AppColors (Flutter)
 */

export const theme = {
  colors: {
    // ===== CORE BACKGROUNDS =====
    background: {
      light: '#F5F5F5', // AppColors.background
      dark: '#121212',  // AppColorsDark.background
    },
    surface: {
      light: '#FFFFFF', // AppColors.surface
      dark: '#1E1E1E',  // AppColorsDark.surface
    },

    // ===== BRAND & STATUS COLORS =====
    primary: {
      base: '#21BC5A', // Brand primary green
      gradientStart: '#29C562',
      gradientEnd: '#70D194',
    },
    warning: {
      base: '#FFD83D', // Main warning
      update: '#F96E38', // Warning for updates
    },
    danger: {
      base: '#C72323', // Error/destructive
    },

    // ===== BORDERS & INPUTS =====
    border: {
      light: '#EEEEEE',
      dark: '#333333',
    },
    input: {
      backgroundLight: '#F5F5F5',
      backgroundDark: '#2C2C2C',
    },

    // ===== TEXT COLORS =====
    text: {
      primaryLight: '#000000',
      secondaryLight: '#738C80',
      primaryDark: '#EFEFEF',
      secondaryDark: '#9FBBAF',
      hintDark: '#7A8B80',
    },

    // ===== GRADIENTS =====
    gradients: {
      primary: ['#29C562', '#70D194'],
      secondary: ['#F3F3D4', '#D6F0D8'],
    },

    // ===== NEUTRALS (for Tailwind & UI consistency) =====
    neutral: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#E5E5E5',
      300: '#D4D4D4',
      400: '#A3A3A3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
      950: '#0A0A0A',
    },
  },

  // ===== SPACING =====
  spacing: {
    xs: '0.5rem',    // 8px
    sm: '0.75rem',   // 12px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
    '4xl': '6rem',   // 96px
  },

  // ===== BORDER RADIUS =====
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px',
  },

  // ===== TYPOGRAPHY =====
  typography: {
    fontFamily: {
      sans: 'var(--font-geist-sans)',
      mono: 'var(--font-geist-mono)',
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    },
  },

  // ===== BREAKPOINTS =====
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
} as const;

export type Theme = typeof theme;
