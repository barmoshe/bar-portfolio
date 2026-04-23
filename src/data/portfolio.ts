/**
 * Portfolio content - projects and contact info.
 *
 * Data lives in `portfolio.data.ts`, which is rewritten by the #admin
 * backoffice via the GitHub Contents API. This file keeps the stable public
 * surface (types, helpers, named exports) so consumers don't import the
 * auto-generated file directly. See `knowledge/06-data.md`.
 */

import { data } from './portfolio.data';

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

/** Contact surface - consumed by `Letter.tsx` (copy-to-clipboard + mailto) and Intro/Letter links. */
export type Contact = {
  email: string;
  github: string;
  linkedin: string;
  phone: string;
};

/** Full shape of `portfolio.data.ts`. The backoffice serializer round-trips this. */
export type PortfolioData = {
  projects: Project[];
  contact: Contact;
};

/** Projects grid. Deep-cloned so callers may sort/slice without mutating source data. */
export const projects: Project[] = data.projects.map((p) => ({
  ...p,
  extras: p.extras ? p.extras.map((e) => ({ ...e })) : undefined,
}));

export const contact: Contact = { ...data.contact };

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
