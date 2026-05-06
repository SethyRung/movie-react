import axios from "axios";
import { envConfig } from "./env";

// TMDB API client with API key
export const withApiKey = axios.create({
  baseURL: envConfig.API_URL,
  timeout: 10000,
});

// Authenticated API client with Bearer token
export const withAuth = axios.create({
  baseURL: envConfig.API_URL,
  timeout: 10000,
});

// Public API client without authentication
export const withoutAuth = axios.create({
  timeout: 10000,
});

// Setup interceptors for TMDB API
withApiKey.interceptors.request.use(
  (config) => {
    // Ensure params object exists
    config.params = config.params || {};
    config.params.api_key = envConfig.API_KEY;
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  (error) => Promise.reject(error),
);

// Setup interceptors for authenticated API
withAuth.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  (error) => Promise.reject(error),
);

// Setup interceptors for public API
withoutAuth.interceptors.request.use(
  (config) => {
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptors for error handling
[withApiKey, withAuth, withoutAuth].forEach((instance) => {
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Handle auth errors
        console.error("Authentication error");
        // Redirect to login or refresh token
      }
      return Promise.reject(error);
    },
  );
});

// Re-export for backward compatibility
export default {
  withAuth,
  withoutAuth,
  withApiKey,
};
