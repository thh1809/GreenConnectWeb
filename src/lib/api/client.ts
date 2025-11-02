import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";

/**
 * Axios instance với config mặc định
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor - Thêm token vào headers
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Thêm token nếu có (từ localStorage hoặc cookie)
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor - Handle errors globally
 */
apiClient.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Unauthorized - Clear token and redirect to login
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        // window.location.href = "/login";
      }
    }

    // Trả về error để component có thể handle
    return Promise.reject(error);
  }
);

export default apiClient;

