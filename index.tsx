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
const registerServiceWorker = () => {
  // Check if service workers are supported
  if ('serviceWorker' in navigator) {
    // Use an absolute URL to prevent cross-origin issues in sandboxed environments.
    const swUrl = `${window.location.origin}/service-worker.js`;
    navigator.serviceWorker.register(swUrl)
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(error => {
        // Log the specific error for better debugging.
        console.error('Service Worker registration failed:', error);
      });
  }
};

// Register the service worker after the page has fully loaded.
// This approach is more robust because it handles cases where the script
// runs after the 'load' event has already fired.
if (document.readyState === 'complete') {
  registerServiceWorker();
} else {
  window.addEventListener('load', registerServiceWorker);
}
