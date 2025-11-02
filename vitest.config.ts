import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    globals: true,
    include: [
      'tests/**/*.{test,spec}.{ts,tsx}',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: 'coverage',
      exclude: [
        'node_modules/',
        'coverage/',
        'src/tests/',
        '**/*.d.ts',
        '**/*.config.*',
        'src/main.tsx',
        'src/vite-env.d.ts',
      ],
      include: [
        'src/**/*.{ts,tsx,js,jsx}',
        'tests/**/*.{ts,tsx}',
      ],
      thresholds: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70,
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@features': resolve(__dirname, 'src/features'),
      '@pages': resolve(__dirname, 'src/pages'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@types': resolve(__dirname, 'src/types'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@assets': resolve(__dirname, 'src/assets'),
      '@tests': resolve(__dirname, 'src/tests'),
    },
  },
});