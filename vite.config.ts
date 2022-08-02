import { defineConfig } from "vite";

import preact from "@preact/preset-vite";

import tsconfigPaths from "vite-tsconfig-paths";
import viteCompression from "vite-plugin-compression";

import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact(), tsconfigPaths(), VitePWA(), viteCompression()],
  esbuild: {
    logOverride: { "this-is-undefined-in-esm": "silent" },
  },
});
