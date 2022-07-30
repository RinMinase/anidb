import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

import { VitePWA } from "vite-plugin-pwa";
import tsconfigPaths from "vite-tsconfig-paths";
import viteCompression from "vite-plugin-compression";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact(), tsconfigPaths(), VitePWA(), viteCompression()],
  esbuild: {
    logOverride: { "this-is-undefined-in-esm": "silent" },
  },
});
