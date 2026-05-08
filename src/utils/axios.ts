import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { envConfig } from "./env";

const api = axios.create({
  baseURL: envConfig.API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: inject API key
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.params = config.params ?? {};
    config.params.api_key = envConfig.API_KEY;
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// Response interceptor: normalize errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      const url = error.config?.url ?? "unknown";

      if (status === 401) {
        console.error(`[TMDB] Authentication failed for ${url}`);
      } else if (status === 404) {
        console.error(`[TMDB] Resource not found: ${url}`);
      } else if (status >= 500) {
        console.error(`[TMDB] Server error (${status}) for ${url}`);
      } else {
        console.error(`[TMDB] HTTP ${status} for ${url}`);
      }
    } else if (error.request) {
      console.error("[TMDB] Network error — no response received");
    } else {
      console.error(`[TMDB] Request setup error: ${error.message}`);
    }

    return Promise.reject(error);
  },
);

export { api };
