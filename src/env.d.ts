/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEV_TEST: string
  readonly VITE_HRA_SERVICE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
