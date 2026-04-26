import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import MarketingApp from './MarketingApp';
import '../styles.css';

if (import.meta.env.DEV) {
  import('@axe-core/react').then(({ default: axe }) => {
    axe(React, ReactDOM, 1000);
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MarketingApp />
  </StrictMode>,
);
