interface ImportMetaEnv {
  /** Backend base URL, e.g. https://radwan-auto-car-backend.vercel.app (required). */
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
