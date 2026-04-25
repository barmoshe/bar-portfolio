import { useSectionObserver } from '../hooks/useSectionObserver';

const SECTIONS = ['intro', 'background', 'mixtape', 'repos', 'letter'] as const;

export default function TabBar() {
  const activeId = useSectionObserver(SECTIONS);

  const isCurrent = (id: string) =>
    activeId === id ? { 'aria-current': 'true' as const } : {};

  // After the browser scrolls to the hash target, move keyboard focus into
  // the section so subsequent Tab presses continue from there (WCAG 2.4.3
  // Focus Order). Each section <article class="page"> carries tabIndex=-1.
  const onAnchor = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const id = e.currentTarget.getAttribute('href')?.slice(1) ?? '';
    const target = document.getElementById(id);
    if (target instanceof HTMLElement) target.focus({ preventScroll: true });
  };

  return (
    <nav className="tabbar" aria-label="Mobile sections">
      <a href="#intro" data-target="intro" aria-label="About" onClick={onAnchor} {...isCurrent('intro')}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
        </svg>
        <span>About</span>
      </a>
      <a
        href="#background"
        data-target="background"
        aria-label="Background"
        onClick={onAnchor}
        {...isCurrent('background')}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="7" width="18" height="13" rx="2" />
          <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
        <span>Background</span>
      </a>
      <a href="#mixtape" data-target="mixtape" aria-label="Mixtape" onClick={onAnchor} {...isCurrent('mixtape')}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="6" width="18" height="12" rx="2" />
          <circle cx="9" cy="12" r="1.6" />
          <circle cx="15" cy="12" r="1.6" />
          <path d="M7 18 l-1 2 M17 18 l1 2" />
        </svg>
        <span>Mixtape</span>
      </a>
      <a href="#repos" data-target="repos" aria-label="Open Source" onClick={onAnchor} {...isCurrent('repos')}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8 18l-6-6 6-6" />
          <path d="M16 6l6 6-6 6" />
        </svg>
        <span>Repos</span>
      </a>
      <a href="#letter" data-target="letter" aria-label="Contact" onClick={onAnchor} {...isCurrent('letter')}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 7l9 6 9-6" />
          <rect x="3" y="5" width="18" height="14" rx="2" />
        </svg>
        <span>Contact</span>
      </a>
    </nav>
  );
}
