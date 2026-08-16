import axios from 'axios';

export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:8000'
    : 'https://jat-backend-5f2n.onrender.com');


// Centralized Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let logoutCallback = null;

export const setLogoutCallback = (cb) => {
  logoutCallback = cb;
};

// Request Interceptor: Attach Bearer access token if present
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('cf_access_token');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Automatic token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/api/auth/token/')
    ) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('cf_refresh_token');

      if (!refreshToken) {
        if (logoutCallback) logoutCallback();
        return Promise.reject(error);
      }

      try {
        // Use standard axios call (separate from main instance) to avoid recursive interceptor loops
        const response = await axios.post(`${API_BASE_URL}/api/auth/token/refresh/`, {
          refresh: refreshToken,
        });

        const newAccessToken = response.data.access;
        localStorage.setItem('cf_access_token', newAccessToken);

        // Update authorization header for retried request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token failed or expired -> clear tokens and trigger logout
        localStorage.removeItem('cf_access_token');
        localStorage.removeItem('cf_refresh_token');
        localStorage.removeItem('cf_user');
        if (logoutCallback) logoutCallback();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
