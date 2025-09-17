/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
  readonly glob: (pattern: string, options?: {
    query?: string;
    import?: string;
    eager?: boolean;
    as?: string;
  }) => Record<string, () => Promise<string>>;
}