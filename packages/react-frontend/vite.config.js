import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import Terminal from "vite-plugin-terminal";

export default defineConfig({
  plugins: [
    react(),
    Terminal({
      console: 'terminal',
      output: ['terminal', 'console']
    })
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./scss/_variables.scss";`
      }
    }
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      external: ['/@id/__x00__virtual:terminal/console']
    }
  }
});
