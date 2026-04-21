import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import Showcase from './components/showcase/Showcase';
import './styles.css';

// #showcase hash route — renders the design-system preview instead of the
// portfolio. Kept as a top-level switch (not react-router) per
// knowledge/99-caveats.md. Evaluated once at mount; a hash change requires a
// reload, which matches the "artifact route" intent.
const isShowcase =
  typeof window !== 'undefined' && window.location.hash === '#showcase';

createRoot(document.getElementById('root')!).render(
  <StrictMode>{isShowcase ? <Showcase /> : <App />}</StrictMode>,
);
