/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_RECIPIENT_NAME: string;
  readonly VITE_YES_MESSAGE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
