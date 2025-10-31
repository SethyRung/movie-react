import { describe, it, expect } from 'vitest';
import { envConfig } from './env';

describe('Environment configuration', () => {
  it('should have API_URL configured', () => {
    expect(envConfig.API_URL).toBe('https://api.themoviedb.org/3');
  });

  it('should have API_KEY configured', () => {
    expect(envConfig.API_KEY).toBeDefined();
    expect(envConfig.API_KEY).not.toBe('');
    expect(envConfig.API_KEY).not.toBe('API_KEY');
  });

  it('should have APP_NAME configured', () => {
    expect(envConfig.APP_NAME).toBe('Movie Website');
  });

  it('should have development flags', () => {
    expect(typeof envConfig.isDevelopment).toBe('boolean');
    expect(typeof envConfig.isProduction).toBe('boolean');
  });
});