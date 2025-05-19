import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const isTest = process.env.NODE_ENV === 'test';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react({
    fastRefresh: !isTest, 
    jsxRuntime: 'automatic',
  }), tailwindcss()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.js",
  },
});
