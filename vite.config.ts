import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@components": resolve(__dirname, "src/components"),
      "@features": resolve(__dirname, "src/features"),
      "@pages": resolve(__dirname, "src/pages"),
      "@hooks": resolve(__dirname, "src/hooks"),
      "@types": resolve(__dirname, "src/types"),
      "@utils": resolve(__dirname, "src/utils"),
      "@assets": resolve(__dirname, "src/assets"),
      "@tests": resolve(__dirname, "src/tests"),
      "@lib": resolve(__dirname, "src/lib"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React ecosystem
          if (id.includes('react') || id.includes('react-dom')) {
            return 'vendor-react';
          }
          if (id.includes('react-router')) {
            return 'vendor-router';
          }
          if (id.includes('@tanstack/react-query')) {
            return 'vendor-query';
          }
          if (id.includes('zustand')) {
            return 'vendor-store';
          }
          if (id.includes('axios')) {
            return 'vendor-http';
          }

          // UI libraries
          if (id.includes('@iconify') || id.includes('lucide')) {
            return 'ui-icons';
          }
          if (id.includes('clsx') || id.includes('tailwind-merge') || id.includes('class-variance-authority')) {
            return 'ui-utils';
          }
          if (id.includes('@radix-ui')) {
            return 'ui-radix';
          }

          // Feature modules
          if (id.includes('src/features/movies')) {
            return 'feature-movies';
          }
          if (id.includes('src/features')) {
            return 'features';
          }

          // Page components
          if (id.includes('src/pages')) {
            return 'pages';
          }

          // UI components
          if (id.includes('src/components/ui')) {
            return 'ui-components';
          }
          if (id.includes('src/components')) {
            return 'components';
          }

          // Utility libraries
          if (id.includes('src/utils')) {
            return 'utils';
          }

          // Keep other vendor dependencies separate
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop()?.replace(/\.[^.]*$/, '') : 'chunk';
          return `assets/js/${facadeModuleId}-[hash].js`;
        },
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const extType = assetInfo.name?.split('.').pop();
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType || '')) {
            return `assets/images/[name]-[hash].[ext]`;
          }
          if (/woff2?|eot|ttf|otf/i.test(extType || '')) {
            return `assets/fonts/[name]-[hash].[ext]`;
          }
          return `assets/[name]-[hash].[ext]`;
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    assetsInlineLimit: 4096,
    cssCodeSplit: true,
    sourcemap: true,
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'zustand',
      'axios',
      'clsx',
      'tailwind-merge',
    ],
  },
});
