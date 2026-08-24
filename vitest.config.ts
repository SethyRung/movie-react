import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  test: {
    environment: "node",
    setupFiles: ["./src/test/setup.ts"],
    env: {
      TMDB_API_KEY: "test-key",
      TMDB_API_URL: "https://api.themoviedb.org/3",
    },
  },
});
