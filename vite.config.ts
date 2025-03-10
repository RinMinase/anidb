import {
  defineConfig,
} from "vite";

import preact from "@preact/preset-vite";
import svgr from "vite-plugin-svgr";
import biome from 'vite-plugin-biome';

export default defineConfig({
  plugins: [preact(), svgr(), biome({ mode: "check", failOnError: false }) ],
  server: {
    port: 3000,
    host: true,
  },
  resolve: {
    alias: {
      "@": "/src",
      "@components": "/src/common",
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
  },
});
