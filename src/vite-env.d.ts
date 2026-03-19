/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CLERK_PUBLISHABLE_KEY: string
  readonly VITE_OPENROUTER_API_KEY?: string
  readonly VITE_APP_TITLE?: string
  readonly VITE_APP_DESCRIPTION?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
