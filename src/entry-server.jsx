import React from 'react';
import { renderToString } from 'react-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes, preloadRoute } from './App.jsx';

export async function renderPage(path) {
  await preloadRoute(path);
  const helmetContext = {};
  const markup = renderToString(
    <HelmetProvider context={helmetContext}>
      <MemoryRouter initialEntries={[path]}>
        <AppRoutes />
      </MemoryRouter>
    </HelmetProvider>
  );
  return { markup, helmet: helmetContext.helmet };
}
