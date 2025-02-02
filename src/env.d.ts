// src/env.d.ts
/// <reference types="vite/client" />

interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  
  interface ImportMetaEnv {
    readonly BASE_URL: string;
    // Add other Vite environment variables here if needed
  }