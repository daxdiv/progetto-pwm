/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SERVER_URL: string;
  readonly VITE_SPOTIFY_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
