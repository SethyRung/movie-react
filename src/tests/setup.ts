import '@testing-library/jest-dom';
import { vi, beforeAll, afterEach, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { handlers } from './mocks/handlers';

// Mock IntersectionObserver
vi.stubGlobal('IntersectionObserver', class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
});

// Mock ResizeObserver
vi.stubGlobal('ResizeObserver', class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// MSW setup
export const server = setupServer(...handlers);

// Start server before all tests
beforeAll(() => server.listen());

// Reset handlers after each test
afterEach(() => server.resetHandlers());

// Close server after all tests
afterAll(() => server.close());