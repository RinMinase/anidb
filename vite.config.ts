import { defineConfig } from "vite";

import preact from "@preact/preset-vite";
import svgr from "vite-plugin-svgr";
import biome from 'vite-plugin-biome';

export default defineConfig(({ command }) => {

  // Dev Plugins
  const isDev = command === 'serve'
  const devPlugins = [
    biome({ mode: "check", failOnError: false }),
  ]

  return {
    plugins: [
      preact(),
      svgr(),
      ...(isDev ? devPlugins : []),
    ],
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
  }
});
