export const envConfig = {
  API_URL: import.meta.env.VITE_API_URL,
  API_KEY: import.meta.env.VITE_API_KEY,
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Movie Website',
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
} as const;

export type EnvConfig = typeof envConfig;