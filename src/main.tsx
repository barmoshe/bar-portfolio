import { StrictMode, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import Showcase from './components/showcase/Showcase';
import './styles.css';

// Hash-driven top-level switch (not react-router) per knowledge/99-caveats.md.
// Evaluated once at mount; a hash change requires a reload - which matches
// the "artifact route" intent and keeps admin/showcase chunks out of the
// portfolio bundle.
const hash = typeof window !== 'undefined' ? window.location.hash : '';

// Admin is lazy-loaded so GSAP, HeroSlides, and section code never enter the
// #admin bundle. The portfolio never imports anything from `src/admin/**`.
const AdminApp = lazy(() => import('./admin/AdminApp'));

function Root() {
  if (hash === '#admin') {
    return (
      <Suspense fallback={<div className="admin-root" />}>
        <AdminApp />
      </Suspense>
    );
  }
  if (hash === '#showcase') return <Showcase />;
  return <App />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
