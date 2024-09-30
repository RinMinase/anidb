/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_API_KEY: string;
  readonly VITE_CUSTOM_TITLE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
