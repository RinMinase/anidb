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
      "@": "/src",
      "@components": "/src/common",
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,

    // Chunk by imported module
    // rollupOptions: {
    //   output: {
    //     manualChunks(id) {
    //       if (id.includes("node_modules")) {
    //         return id
    //           .toString()
    //           .split("node_modules/")[1]
    //           .split("/")[0]
    //           .toString();
    //       }
    //     },
    //   },
    // },
  },
});
