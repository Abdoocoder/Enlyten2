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
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
