import { defineConfig } from "vite";
import dotenv from "dotenv";

import preact from "@preact/preset-vite";

import tsconfigPaths from "vite-tsconfig-paths";
import viteCompression from "vite-plugin-compression";
import { createHtmlPlugin } from "vite-plugin-html";

import { VitePWA } from "vite-plugin-pwa";

const { parsed } = dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    preact(),
    createHtmlPlugin({ inject: { data: parsed } }),
    tsconfigPaths(),
    VitePWA(),
    viteCompression({ ext: ".jgz" }),
  ],
  esbuild: {
    logOverride: { "this-is-undefined-in-esm": "silent" },
  },
});
