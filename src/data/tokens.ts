/**
 * Typed catalog of CSS custom property names used across the portfolio.
 *
 * The source of truth is `src/styles.css` (`:root` and `html.dark` blocks).
 * This module mirrors those names so TypeScript consumers (notably the design
 * showcase under `src/components/showcase/`) get autocomplete and string-literal
 * checking. No values are duplicated here - `cssVar(t)` emits `var(--t)`.
 *
 * See `knowledge/02-design-system.md` for the three-tier token model.
 */

export const COLOR_TOKENS = [
  'paper',
  'paper-2',
  'surface-1',
  'surface-2',
  'surface-strong',
  'surface-strong-fg',
  'ink',
  'ink-soft',
  'ink-faint',
  'border',
  'red',
  'green',
  'blue',
  'yellow',
  'magenta',
  'purple',
  'cyan',
  'shadow',
] as const;

export type ColorToken = (typeof COLOR_TOKENS)[number];

export const TYPE_TOKENS = ['serif', 'display', 'mono', 'hand'] as const;
export type TypeToken = (typeof TYPE_TOKENS)[number];

/** Returns `var(--<token>)` - use inline in style objects. */
export const cssVar = (t: ColorToken | TypeToken): string => `var(--${t})`;

/** Buckets for grid rendering in the showcase. */
export const COLOR_BUCKETS = {
  surfaces: ['paper', 'paper-2', 'surface-1', 'surface-2', 'surface-strong'],
  ink: ['ink', 'ink-soft', 'ink-faint'],
  accents: ['red', 'green', 'blue', 'yellow', 'magenta', 'purple', 'cyan'],
  structure: ['border', 'shadow'],
} as const satisfies Record<string, readonly ColorToken[]>;
