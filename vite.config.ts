import { defineConfig, PluginOption } from "vite";

import preact from "@preact/preset-vite";

import tsconfigPaths from "vite-tsconfig-paths";
import viteCompression from "vite-plugin-compression";
import eslint from "vite-plugin-eslint";
import svgr from "vite-plugin-svgr";

const eslintConfig: PluginOption = {
  ...eslint({
    include: ["./src/**/*.ts", "./src/**/*.tsx"],
    cache: true,
    failOnWarning: false,
    failOnError: false,
    lintOnStart: true,
  }),
  apply: "serve",
  enforce: "post",
};

const compressionConfig: PluginOption = {
  ...viteCompression({
    ext: ".jgz",
    verbose: false,
  }),
  apply: "build",
};

const compressionConfigBrotli: PluginOption = {
  ...viteCompression({
    algorithm: "brotliCompress",
    verbose: false,
  }),
  apply: "build",
};

export default defineConfig({
  plugins: [
    eslintConfig,
    compressionConfig,
    compressionConfigBrotli,
    preact(),
    svgr(),
    tsconfigPaths(),
  ],
  server: {
    port: 3000,
    host: true,
  },
});
