import { clsx, type ClassValue } from 'clsx';

/**
 * Utility function để merge className với Tailwind classes
 * Hỗ trợ conditional classes và conflicts resolution
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

