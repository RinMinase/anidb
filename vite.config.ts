import { defineConfig, PluginOption } from "vite";

import preact from "@preact/preset-vite";

import tsconfigPaths from "vite-tsconfig-paths";
import viteCompression from "vite-plugin-compression";
import eslint from "vite-plugin-eslint";

const eslintConfig: PluginOption = {
  apply: "serve",
  enforce: "post",
  ...eslint({
    include: ["./src/**/*.ts", "./src/**/*.tsx"],
    cache: true,
    failOnWarning: false,
    failOnError: false,
    lintOnStart: true,
  }),
};

export default defineConfig({
  plugins: [
    eslintConfig,
    preact(),
    tsconfigPaths(),
    viteCompression({
      ext: ".jgz",
      verbose: false,
    }),
  ],
  esbuild: {
    logOverride: { "this-is-undefined-in-esm": "silent" },
  },
  server: {
    port: 3000,
    host: true,
  },
});
