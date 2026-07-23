import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
    globals: true,
    css: true,
  },
  resolve: {
    alias: {
      // Matches the "@/..." alias used throughout the app
      // (e.g. "@/components/ui/button"). Update if your vite.config.js
      // points "@" somewhere other than ./src.
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
