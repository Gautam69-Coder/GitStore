import axios from 'axios';

/**
 * Computes the backend API base URL.
 * Supports:
 * - VITE_API_URL or VITE_API_BASE_URL (e.g., https://your-server.onrender.com or /api)
 * - Automatically ensures /api suffix if a root domain URL is passed
 * - Defaults to '/api' for local Vite dev server proxy
 */
const getBaseURL = () => {
  const envUrl =
    import.meta.env.VITE_API_URL ||
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_BACKEND_URL ||
    '/api';

  const trimmed = envUrl.trim().replace(/\/+$/, '');

  if (!trimmed) {
    return '/api';
  }

  // If a full remote URL is provided (e.g., https://api.gitstore.com) without /api, append it
  if (
    (trimmed.startsWith('http://') || trimmed.startsWith('https://')) &&
    !trimmed.endsWith('/api')
  ) {
    return `${trimmed}/api`;
  }

  return trimmed;
};

export const API_BASE_URL = getBaseURL();

/**
 * Production-ready Axios instance configured with base URL, timeout,
 * and automatic Bearer token authentication headers.
 */
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Attach GitHub PAT or session token from localStorage
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('gitstore_token');
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Standardize error extraction and handle authorization errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected network error occurred';

    const err = new Error(message);
    err.status = error.response?.status;
    err.data = error.response?.data;
    err.isAxiosError = true;

    return Promise.reject(err);
  }
);

export default axiosInstance;
