import { describe, it, expect, vi } from 'vitest';
import { withApiKey } from '../../src/utils/axios';

// Mock axios
vi.mock('axios', async () => {
  const actual = await vi.importActual('axios');
  return {
    ...actual,
    create: vi.fn(() => ({
      get: vi.fn(),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
    })),
  };
});

describe('Axios configuration', () => {
  it('should have withApiKey configured with correct baseURL', () => {
    expect(withApiKey.defaults.baseURL).toBe('https://api.themoviedb.org/3');
    expect(withApiKey.defaults.timeout).toBe(10000);
  });

  it('should have request interceptors configured', () => {
    expect(withApiKey.interceptors.request.use).toBeDefined();
    expect(withApiKey.interceptors.response.use).toBeDefined();
  });
});