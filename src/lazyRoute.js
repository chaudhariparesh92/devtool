import { createElement, lazy } from 'react';

// Route-level code splitting that stays compatible with prerendering + hydration.
//
// - Before the chunk is loaded, the wrapper renders a React.lazy component (needs a <Suspense> parent).
// - Once the chunk has loaded, the wrapper renders the real component synchronously, so
//   renderToString() (prerender) and hydrateRoot() (browser) see exactly the same markup as before.
// - Call `Wrapper.preload()` (see preloadRoute in App.jsx) and wait for it BEFORE rendering a route
//   on the server or hydrating it in the browser.
export function lazyRoute(loader) {
  let resolved = null;
  let pending = null;

  const load = () => {
    if (!pending) {
      pending = loader().then((mod) => {
        resolved = mod.default || mod;
        return resolved;
      });
    }
    return pending;
  };

  const Lazy = lazy(() => load().then((component) => ({ default: component })));

  function RouteComponent(props) {
    return resolved ? createElement(resolved, props) : createElement(Lazy, props);
  }

  RouteComponent.preload = load;
  return RouteComponent;
}
