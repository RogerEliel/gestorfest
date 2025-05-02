import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/integrations';

export const initSentry = () => {
  if (!import.meta.env.VITE_SENTRY_DSN) {
    console.warn('Sentry DSN not provided. Error tracking disabled.');
    return;
  }

  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [new BrowserTracing()],
    
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.5 : 1.0,
    
    // Disable Sentry in development unless explicitly enabled
    enabled: process.env.NODE_ENV === 'production' || import.meta.env.VITE_ENABLE_SENTRY_DEV === 'true',
    
    // Configure release and environment
    release: import.meta.env.VITE_APP_VERSION || '1.0.0',
    environment: import.meta.env.MODE || 'development',
    
    // Only send errors to Sentry if they are expected to be server errors.
    beforeSend(event) {
      // If it's a frontend bug we want to keep it
      return event;
    },
  });
};

// Utility function to log errors to Sentry
export const logError = (error: unknown, context?: Record<string, any>) => {
  console.error('Error:', error);
  
  if (import.meta.env.VITE_SENTRY_DSN) {
    Sentry.captureException(error, {
      extra: context,
    });
  }
};

// Function to track specific events
export const trackEvent = (name: string, data?: Record<string, any>) => {
  if (import.meta.env.VITE_SENTRY_DSN) {
    Sentry.captureMessage(`Event: ${name}`, {
      level: 'info',
      extra: data,
    });
  }
};

export default Sentry;
