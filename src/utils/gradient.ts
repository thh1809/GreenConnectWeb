/**
 * Utility functions cho gradients theo theme
 */

import { theme } from '@/config/theme';

/**
 * Tạo linear gradient từ theme colors
 */
export function createGradient(
  type: 'primary' | 'secondary',
  direction: 'to-right' | 'to-bottom' | 'to-left' | 'to-top' = 'to-right'
): string {
  const gradient = theme.colors.gradients[type];
  const [start, end] = gradient;

  const directions = {
    'to-right': 'to right',
    'to-bottom': 'to bottom',
    'to-left': 'to left',
    'to-top': 'to top',
  };

  return `linear-gradient(${directions[direction]}, ${start}, ${end})`;
}

/**
 * Lấy gradient colors để dùng trong CSS-in-JS
 */
export function getGradientColors(type: 'primary' | 'secondary'): [string, string] {
  return theme.colors.gradients[type] as [string, string];
}

