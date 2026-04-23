/**
 * Round-trip codec for `src/data/portfolio.data.ts`.
 *
 * The admin is the sole writer, so the file format is load-bearing: a fixed
 * header, a `export const data: PortfolioData = ` prefix, a single JSON
 * object literal, and a `};\n` suffix. Parse strips prefix/suffix and hands
 * the middle to JSON.parse. Emit recreates the header deterministically so
 * commits produce minimal diffs.
 */

import type { PortfolioData } from '../data/portfolio';

const HEADER = `/* AUTO-GENERATED - edited via #admin. Do not hand-edit this file.
 * Schema contract: src/admin/serializer.ts. The parser locates \`export const
 * data = \` and takes everything through the matching \`};\` as strict JSON.
 * Types flow from PortfolioData in \`./portfolio\` (import-type cycle is safe).
 */
import type { PortfolioData } from './portfolio';

`;

const PREFIX = 'export const data: PortfolioData = ';
const SUFFIX = ';\n';

/** Produce the full file text for a given data object. Deterministic (2-space JSON). */
export function serialize(data: PortfolioData): string {
  return HEADER + PREFIX + JSON.stringify(data, null, 2) + SUFFIX;
}

/** Extract the data object from a serialized file. Throws on malformed input. */
export function parse(text: string): PortfolioData {
  const start = text.indexOf(PREFIX);
  if (start < 0) throw new Error('portfolio.data.ts: missing `export const data: PortfolioData = ` prefix');
  const jsonStart = start + PREFIX.length;
  // The JSON value ends at the last `};\n` occurrence (tolerant of trailing whitespace/newlines).
  const trimmed = text.replace(/\s+$/, '');
  if (!trimmed.endsWith('};')) throw new Error('portfolio.data.ts: missing `};` suffix');
  const jsonEnd = trimmed.length - 1; // position of the `;`
  const json = trimmed.slice(jsonStart, jsonEnd);
  return JSON.parse(json) as PortfolioData;
}
