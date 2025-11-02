/**
 * Đồng bộ màu giữa Flutter AppColors và web theme
 * Sử dụng để định nghĩa CSS variables hoặc import trong theme.ts
 */

export const colors = {
  // ===== CORE BACKGROUNDS =====
  background: {
    light: '#F5F5F5', // AppColors.background
    dark: '#121212',  // AppColorsDark.background
  },
  surface: {
    light: '#FFFFFF', // AppColors.surface
    dark: '#1E1E1E',  // AppColorsDark.surface
  },

  // ===== BRAND & STATUS =====
  primary: {
    base: '#21BC5A', // Brand primary green
    gradientStart: '#29C562', // LinearPrimary start
    gradientEnd: '#70D194',   // LinearPrimary end
  },
  warning: {
    base: '#FFD83D', // Warning color
    update: '#F96E38', // Warning for updates
  },
  danger: {
    base: '#C72323', // Error/destructive
  },

  // ===== BORDER & INPUT =====
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
} as const;
