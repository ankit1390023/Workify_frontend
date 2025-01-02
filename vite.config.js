// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"), // This maps '@' to 'src' directory
    },
  },
  assetsInclude: ['**/*.svg'], // Ensures SVG files are handled correctly
});
