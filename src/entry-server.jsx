import React from 'react';
import { renderToString } from 'react-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from './App.jsx';

export function renderPage(path) {
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
