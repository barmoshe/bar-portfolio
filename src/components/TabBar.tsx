import { useSectionObserver } from '../hooks/useSectionObserver';

const SECTIONS = ['dossier', 'experience', 'repos', 'notes', 'letter'] as const;

export default function TabBar() {
  const activeId = useSectionObserver(SECTIONS);
  const isCurrent = (id: string) =>
    activeId === id ? { 'aria-current': 'true' as const } : {};

  return (
    <nav className="tabbar" aria-label="Mobile sections">
      <a href="#dossier" data-target="dossier" aria-label="About" {...isCurrent('dossier')}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
        </svg>
        <span>About</span>
      </a>
      <a
        href="#experience"
        data-target="experience"
        aria-label="Work"
        {...isCurrent('experience')}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="7" width="18" height="13" rx="2" />
          <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
        <span>Work</span>
      </a>
      <a href="#repos" data-target="repos" aria-label="Open Source" {...isCurrent('repos')}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8 18l-6-6 6-6" />
          <path d="M16 6l6 6-6 6" />
        </svg>
        <span>Repos</span>
      </a>
      <a href="#notes" data-target="notes" aria-label="Writing" {...isCurrent('notes')}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 5h16M4 10h16M4 15h10M4 20h8" />
        </svg>
        <span>Notes</span>
      </a>
      <a href="#letter" data-target="letter" aria-label="Contact" {...isCurrent('letter')}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 7l9 6 9-6" />
          <rect x="3" y="5" width="18" height="14" rx="2" />
        </svg>
        <span>Contact</span>
      </a>
    </nav>
  );
}
