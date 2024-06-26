/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_NOTIFICATIONS_API_URL: string;
  readonly VITE_NOTIFICATIONS_PUBLIC_KEY: string;
  readonly VITE_ALCHEMY_API_KEY: string;
  readonly VITE_WALLETCONNECT_PROJECT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
