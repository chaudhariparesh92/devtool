import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App, { AppRoutes } from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import './index.css';

if ('serviceWorker' in navigator) { window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {})); }

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

if (isPrerendered) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
