import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';

// Build-time only entry, consumed by scripts/prerender.mjs.
// Must never import main.tsx, which touches browser globals at module scope.
export function render(path: string): string {
  return renderToString(
    <StrictMode>
      <App ssrPath={path} />
    </StrictMode>,
  );
}
