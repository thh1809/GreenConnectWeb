// lib/api.ts
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com';

const getCookieValue = (name: string) => {
  if (typeof document === 'undefined') return null;
  const value = document.cookie
    .split('; ')
    .find(row => row.startsWith(`${name}=`));
  return value ? decodeURIComponent(value.split('=')[1]) : null;
};

const getAuthHeader = (): Record<string, string> => {
  let token: string | null | undefined = undefined;

  if (typeof window !== 'undefined') {
    token = localStorage.getItem('authToken') ?? sessionStorage.getItem('authToken');
    if (!token) {
      token = getCookieValue('authToken');
    }
  } else {
    token = process.env.API_TOKEN;
  }

  return token ? { Authorization: `Bearer ${token}` } : {};
};

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

export const post = <T>(endpoint: string, body?: any) =>
  apiRequest<T>(endpoint, {
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  });

export const put = <T>(endpoint: string, body?: any) =>
  apiRequest<T>(endpoint, {
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
  });

export const patch = <T>(endpoint: string, body?: any) =>
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
