
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_SENTRY_DSN?: string;
  readonly VITE_GA_MEASUREMENT_ID?: string;
  readonly VITE_ENABLE_SENTRY_DEV?: string;
  readonly VITE_APP_VERSION?: string;
  readonly MODE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Global variables
interface Window {
  dataLayer?: any[];
  gtag?: (...args: any[]) => void;
  trackEvent?: (category: string, action: string, label?: string, value?: number) => void;
}

declare module 'swagger-ui-react';
