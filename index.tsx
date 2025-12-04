import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// --- Service Worker Registration ---
const registerServiceWorker = async () => {
  // Check if service workers are supported
  if ('serviceWorker' in navigator) {
    try {
      // Use an absolute URL to prevent cross-origin issues in sandboxed environments.
      const swUrl = `${window.location.origin}/service-worker.js`;
      const registration = await navigator.serviceWorker.register(swUrl);
      console.log('Service Worker registered with scope:', registration.scope);
    } catch (error) {
      // Gracefully handle specific registration errors common in restricted environments
      const isInvalidState = error instanceof Error && error.message.includes('invalid state');
      
      if (isInvalidState) {
         console.log('Service Worker skipped: Document is in an invalid state (likely a restricted preview environment).');
      } else {
         console.warn('Service Worker registration failed:', error);
      }
    }
  }
};

// Register the service worker after the page has fully loaded.
if (document.readyState === 'complete') {
  registerServiceWorker();
} else {
  window.addEventListener('load', registerServiceWorker);
}