import { defineConfig, Plugin } from "vite";

import preact from "@preact/preset-vite";
import svgr from "vite-plugin-svgr";

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

/**
 * Biome Plugin
 */

// @ts-expect-error No types installed
import { exec } from "child_process";
// @ts-expect-error No types installed
import path from "path";
import { debounce } from 'es-toolkit'

type Mode = "lint" | "format" | "check";
type LogFormat = "pretty" | "compact" | "check";
type LogLevel = "info" | "warn" | "error";

interface BiomePluginOptions {
  mode?: Mode;
  files?: string;
  logLevel?: LogLevel;
  logFormat?: LogFormat;
  failOnError?: boolean;
}

const biome = (options: BiomePluginOptions = {}): Plugin => {
  const executeCommand = async () => {
    const filesPath = path
      // @ts-expect-error No types installed
      .join(process.cwd(), options.files ?? ".")
      .replace(/(\\\s+)/g, "\\\\$1");

    const commandList = [
      "npx @biomejs/biome",
      options.mode ?? "lint",
      `"${filesPath}"`,
      "--colors=force",
      options.logLevel && `--diagnostic-level=${options.logLevel}`,
      options.logFormat && `--log-kind=${options.logFormat}`,
    ];

    const command = commandList.filter(Boolean).join(" ");

    return new Promise<void>((resolve, reject) => {
      // @ts-expect-error No types installed
      exec(command, { cwd: process.cwd() }, (error, stdout, stderr) => {
        if (stderr) console.error(`Biome Stderr:\n${stderr}`);
        if (stdout) console.log(`Biome Output:\n${stdout}`);

        if (error) {
          console.log(error.code);

          if (!stderr.includes("lint/style")) {
            console.error(`Biome Execution Error: ${error.message}`);
          }

          if (options.failOnError) reject(`Build failed due to Biome errors.`);
        }

        resolve();
      });
    });
  };

  const debouncedExecuteCommand = debounce(executeCommand, 300);

  return {
    name: "vite-plugin-biome",
    async buildStart() {
      await executeCommand();
    },
    async handleHotUpdate() {
      debouncedExecuteCommand();
    },
  };
};
