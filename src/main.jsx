import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App, { AppRoutes, preloadRoute } from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import './index.css';

if ('serviceWorker' in navigator) {
  // Register after the page is idle so the worker's first-visit precache never competes with page load.
  const registerSw = () => navigator.serviceWorker.register('/sw.js').catch(() => {});
  window.addEventListener('load', () => {
    if ('requestIdleCallback' in window) window.requestIdleCallback(registerSw, { timeout: 4000 });
    else setTimeout(registerSw, 2000);
  });
}

const container = document.getElementById('root');
// /tools uses a query parameter to filter its visible list. That content differs
// from the canonical /tools prerender, so render it client-side instead of hydrating mismatched markup.
const hasQueryFilteredTools = window.location.pathname.replace(/\/+$/, '') === '/tools'
  && new URLSearchParams(window.location.search).has('category');
const isPrerendered = container?.dataset.prerendered === 'true' && !hasQueryFilteredTools;

const app = isPrerendered ? (
  <React.StrictMode>
    <HelmetProvider><BrowserRouter><AppRoutes /></BrowserRouter></HelmetProvider>
  </React.StrictMode>
) : (
  <React.StrictMode>
    <HelmetProvider><App /></HelmetProvider>
  </React.StrictMode>
);

const start = () => {
  if (isPrerendered) {
    hydrateRoot(container, app);
  } else {
    createRoot(container).render(app);
  }
};

// Tool pages are code-split: fetch this page's chunk first so hydration matches the prerendered HTML exactly.
preloadRoute(window.location.pathname).then(start, start);
