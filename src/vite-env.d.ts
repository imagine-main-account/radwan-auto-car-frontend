interface ImportMetaEnv {
  /** Real backend base URL. Leave empty to use the mock API in `public/mock-api`. */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
