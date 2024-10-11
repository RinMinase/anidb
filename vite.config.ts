import { defineConfig, PluginOption } from "vite";

import preact from "@preact/preset-vite";
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

export default defineConfig({
  plugins: [eslintConfig, preact(), svgr()],
  server: {
    port: 3000,
    host: true,
  },
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/common'
    }
  }
});
