import React from 'react'
import ReactDOM from 'react-dom/client'
import * as Sentry from '@sentry/react'
import App from './App.jsx'
import './i18n'

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllInputs: true,
      blockAllMedia: false,
    }),
  ],
  tracesSampleRate: import.meta.env.PROD ? 0.2 : 1.0,
  replaysSessionSampleRate: 0.05,
  replaysOnErrorSampleRate: 1.0,
  sendDefaultPii: false,
  environment: import.meta.env.MODE,
  ignoreErrors: [
    // React Strict Mode double-invokes effects, causing two simultaneous Supabase
    // auth lock acquisitions. The second request steals the lock from the first,
    // throwing an unhandled rejection inside the GoTrue library — not app code.
    /Lock .* was released because another request stole it/,
    /Lock .* was not released within/,
  ],
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
