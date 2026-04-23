/**
 * Portfolio content - projects and contact info.
 *
 * There is no CMS and no loader. All content is code so changes are reviewable
 * in diffs. See `knowledge/06-data.md` and `recipes/add-project.md`.
 */

/** A secondary link on a project card (article, listing, etc.). */
export type ProjectExtra = { label: string; url: string };

/** One project card in the `#repos` grid. */
export type Project = {
  /** Short name, rendered on the card. */
  name: string;
  /** Long-form copy. Use `' - '` to separate the hook from detail; `shortDesc` truncates at that point. */
  description: string;
  /** Primary language or space-dot-separated polyglot (e.g. `'Go · Python · TypeScript'`). Drives `iconFor`. */
  language: string;
  /** Absolute URL for the card's primary click target. */
  url: string;
  /** Optional secondary links rendered in the lightbox footer. */
  extras?: ProjectExtra[];
};

export const projects: Project[] = [
  {
    name: 'Israelify',
    description:
      'Spotify-style music app built as a pair project during the Coding Academy bootcamp. React frontend paired with a Node.js + MongoDB backend in a sibling repo - REST API, auth, middleware, and a custom logger.',
    language: 'JavaScript',
    url: 'https://github.com/Gal-Or/IsraelifyApp',
    extras: [
      {
        label: 'Backend repo →',
        url: 'https://github.com/barmoshe/Israelify-backend',
      },
      {
        label: 'Read the write-up →',
        url: 'https://www.linkedin.com/posts/barmoshe_proud-to-present-israelifyspotify-web-clone-share-7224361235268476928-Qu9-',
      },
    ],
  },
  {
    name: 'temporal-data-processing',
    description:
      "A single Temporal workflow that orchestrates three language workers - Go, Python, and TypeScript, each on its own task queue - to process data end-to-end. Featured on Temporal's Code Exchange with a companion Medium write-up.",
    language: 'Go · Python · TypeScript',
    url: 'https://github.com/barmoshe/data-processing-service',
    extras: [
      {
        label: 'Temporal Code Exchange',
        url: 'https://temporal.io/code-exchange/cross-language-data-processing-service-with-temporal',
      },
      {
        label: 'Read the Medium article',
        url: 'https://medium.com/@barmoshe/building-a-cross-language-data-processing-service-with-temporal-a-practical-guide-bf0fb1155d46',
      },
    ],
  },
  {
    name: 'Biome Synth',
    description:
      'Started as a Claude skill that interviews you with AskUserQuestion until it has a full project brief — no technical background needed. Used that brief to build the actual app: a five-biome browser instrument with an AI DJ that composes through DRIFT · PULSE · BLOOM · SURGE · DISSOLVE. Tone.js + Three.js + Canvas2D, polished in Lovable.',
    language: 'TypeScript',
    url: 'https://github.com/barmoshe/cosmic-chord-synth',
    extras: [
      {
        label: 'Play the live app →',
        url: 'https://biome-synth.lovable.app/',
      },
    ],
  },
];

/** Contact surface - consumed by `Letter.tsx` (copy-to-clipboard + mailto) and Intro/Letter links. */
export const contact = {
  email: '1barmoshe1@gmail.com',
  github: 'https://github.com/barmoshe',
  linkedin: 'https://www.linkedin.com/in/barmoshe/',
  phone: '+972546561465',
};

/** Language → glyph map used by `iconFor`. Extend only for languages expected to recur. */
const LANG_ICON: Record<string, string> = {
  TypeScript: '</>',
  JavaScript: '{}',
  Go: 'fn',
  Python: 'λ',
  Rust: '>_',
  Claude: '✦',
};

/**
 * Returns the card glyph for a language string.
 * - Exact match against `LANG_ICON`.
 * - Polyglot strings (containing `·`) fall back to `'∞'`.
 * - Unknown single languages fall back to `'{ }'`.
 */
export function iconFor(lang: string): string {
  return LANG_ICON[lang] ?? (lang.includes('·') ? '∞' : '{ }');
}

/**
 * Truncates a description for card previews.
 * 1. Splits on `' - '` (em-dash-flanked hyphen) or `'. '` (sentence end).
 * 2. Keeps the first segment.
 * 3. Caps at 110 characters with an ellipsis.
 */
export function shortDesc(d: string): string {
  const s = (d || '').split(' - ')[0].split('. ')[0];
  return s.length > 110 ? s.slice(0, 107).trimEnd() + '…' : s;
}
