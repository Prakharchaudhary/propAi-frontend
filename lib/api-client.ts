import axios, { AxiosError, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios';

// ─── Base Axios Instance ──────────────────────────────────────────────────────

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request Interceptor ──────────────────────────────────────────────────────

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Attach auth token if available (e.g. from localStorage or cookie)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('propai_admin_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response Interceptor ─────────────────────────────────────────────────────

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Clear stored token and redirect to admin login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('propai_admin_token');
        if (window.location.pathname.startsWith('/admin')) {
          window.location.href = '/admin/login';
        }
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
