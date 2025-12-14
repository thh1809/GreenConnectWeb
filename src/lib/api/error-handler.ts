import { ErrorHandler } from '@/components/error-handler';
import type { ReactNode } from 'react';
import React from 'react';

/**
 * API Error Handler Service
 * Provides error handling utilities that use UI components
 */

export type ApiError = {
  message: string;
  status?: number;
  code?: string;
};

/**
 * Format API error message
 */
export function formatApiError(error: unknown): string {
  if (error instanceof Error) {
    // Try to extract message from API error response
    const match = error.message.match(/Details: (\{.*\})/);
    if (match) {
      try {
        const details = JSON.parse(match[1]);
        if (details.message) return details.message;
      } catch {
        // Ignore parse errors
      }
    }
    return error.message;
  }
  return 'Đã xảy ra lỗi không xác định';
}

/**
 * Create error handler component props
 */
export function createErrorHandlerProps(
  error: unknown,
  onRetry?: () => void,
  onDismiss?: () => void
) {
  return {
    error: formatApiError(error),
    onRetry,
    onDismiss,
  };
}

/**
 * Render error handler component
 * This function allows services to use ErrorHandler component
 * Note: This function returns JSX, so it should be used in React components
 */
export function renderErrorHandler(
  error: unknown,
  onRetry?: () => void,
  onDismiss?: () => void
): ReactNode {
  // Using createElement instead of JSX to avoid parsing errors in .ts file
  return React.createElement(ErrorHandler, createErrorHandlerProps(error, onRetry, onDismiss));
}

