// Application Constants

// API Configuration
export const API_ENDPOINTS = {
  AUTH: '/api/v1/auth',
  USERS: '/api/v1/users',
  POSTS: '/api/v1/posts',
  CATEGORIES: '/api/v1/scrap-categories',
  COMPLAINTS: '/api/v1/complaints',
  REPORTS: '/api/v1/reports',
  PRICES: '/api/v1/prices',
  REWARD_ITEMS: '/api/v1/rewards',
  REWARD_ITEMS_DETAIL: '/api/v1/reward-items',
  PACKAGES: '/api/v1/packages',
  VERIFICATIONS: '/api/v1/admin/verifications',
} as const;

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  USER: 'user',
  COLLECTOR: 'collector',
} as const;

// User Status
export const USER_STATUS = {
  ACTIVE: 'active',
  BANNED: 'banned',
  PENDING: 'pending',
} as const;

// Complaint Status
export const COMPLAINT_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
} as const;

// Post Status
export const POST_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

// Transaction Status
export const TRANSACTION_STATUS = {
  SCHEDULED: 'Scheduled',
  COMPLETED: 'Completed',
  FAILED: 'Failed',
  SUCCESS: 'Success',
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
} as const;

// Cache Times (in milliseconds)
export const CACHE_TIME = {
  SHORT: 1 * 60 * 1000, // 1 minute
  MEDIUM: 5 * 60 * 1000, // 5 minutes
  LONG: 30 * 60 * 1000, // 30 minutes
} as const;

// Theme
export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  THEME: 'theme',
  SIDEBAR_COLLAPSED: 'sidebar-collapsed',
} as const;

