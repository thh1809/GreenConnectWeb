import { STORAGE_KEYS } from '@/lib/constants';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com';

/**
 * Lấy giá trị cookie theo tên
 * @param name - Tên cookie
 * @returns Giá trị cookie hoặc null nếu không tìm thấy
 */
const getCookieValue = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const value = document.cookie
    .split('; ')
    .find(row => row.startsWith(`${name}=`));
  return value ? decodeURIComponent(value.split('=')[1]) : null;
};

/**
 * Lấy Authorization header từ token
 * Ưu tiên: localStorage > sessionStorage > cookie > env variable
 * @returns Object chứa Authorization header hoặc object rỗng
 */
const getAuthHeader = (): Record<string, string> => {
  let token: string | null | undefined = undefined;

  if (typeof window !== 'undefined') {
    token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) ?? sessionStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (!token) {
      token = getCookieValue(STORAGE_KEYS.AUTH_TOKEN);
    }
  } else {
    token = process.env.API_TOKEN;
  }

  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Thực hiện API request với error handling và authentication tự động
 * @param endpoint - API endpoint (có thể có hoặc không có leading slash)
 * @param options - Fetch options (method, body, headers, etc.)
 * @returns Promise với response data
 * @throws Error nếu request thất bại hoặc response không ok
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${
    endpoint.startsWith('/') ? '' : '/'
  }${endpoint}`;

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    
    // Handle 401 Unauthorized - redirect to login
    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        // Clear auth tokens
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        sessionStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        document.cookie = `${STORAGE_KEYS.AUTH_TOKEN}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
        
        // Redirect to login page
        window.location.href = '/admin/login';
      }
    }
    
    throw new Error(
      `API Error: ${response.status} - ${
        response.statusText
      }. Details: ${JSON.stringify(errorData)}`
    );
  }

  const contentType = response.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    return response.json() as Promise<T>;
  }

  return response.text() as Promise<T>;
}

export const get = <T>(endpoint: string) =>
  apiRequest<T>(endpoint, { method: 'GET' });

export const post = <T, B = unknown>(endpoint: string, body?: B) =>
  apiRequest<T>(endpoint, {
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  });

export const put = <T, B = unknown>(endpoint: string, body?: B) =>
  apiRequest<T>(endpoint, {
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
  });

export const patch = <T, B = unknown>(endpoint: string, body?: B) =>
  apiRequest<T>(endpoint, {
    method: 'PATCH',
    body: body ? JSON.stringify(body) : undefined,
  });

export const del = <T>(endpoint: string) =>
  apiRequest<T>(endpoint, { method: 'DELETE' });

const apiClient = {
  get,
  post,
  put,
  patch,
  del,
};

export default apiClient;
