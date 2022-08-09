/// <reference types="vite/client" />

// export type Fragment = preact.JSX.Element

// namespace preact {
//   interface Component {
//     // This is a workaround for
//     // https://github.com/preactjs/preact/issues/1206
//     refs: Record<string, any>;
//   }
// }

// declare module "preact" {
//   export = preact;
// }

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_API_KEY: string
  readonly VITE_CUSTOM_TITLE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
