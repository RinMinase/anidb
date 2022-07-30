import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

import { VitePWA } from 'vite-plugin-pwa'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact(), tsconfigPaths(), VitePWA()],
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  },
})
