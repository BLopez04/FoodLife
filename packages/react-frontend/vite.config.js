import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import vitePluginSass from 'vite-plugin-sass';
import Terminal from "vite-plugin-terminal";

export default defineConfig({
  plugins: [
    react(),
    vitePluginSass(),
    Terminal({
      console: 'terminal',
      output: ['terminal', 'console']
    })
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "./scss/_variables.scss";
          @import "./scss/_signup.scss";
          @import "./scss/_login.scss";
          @import "./scss/_variables.scss";
          `
      }
    }
  },
  build: {
    rollupOptions: {
      external: ['/@id/__x00__virtual:terminal/console']
    }
  }
});
