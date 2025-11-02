/**
 * API Endpoints configuration
 */
export const API_ENDPOINTS = {
  // Auth
  auth: {
    login: "/auth/login",
    logout: "/auth/logout",
    refresh: "/auth/refresh",
    me: "/auth/me",
  },
  // Users
  users: {
    list: "/users",
    detail: (id: string) => `/users/${id}`,
    create: "/users",
    update: (id: string) => `/users/${id}`,
    delete: (id: string) => `/users/${id}`,
  },
} as const;

