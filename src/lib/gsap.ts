/**
 * Single-module GSAP registrar.
 *
 * All GSAP plugins register here so there is exactly one registration site -
 * re-registering plugins per-component can leak ScrollTrigger instances on
 * hot-reload. Import `gsap` and helpers from here, never from `'gsap'` directly.
 *
 * See `knowledge/04-animation.md` for animation conventions (matchMedia,
 * reduced-motion, scope tethering with `useGSAP`).
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { Flip } from 'gsap/Flip';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, SplitText, Flip, useGSAP);

/** Shared defaults - every timeline / tween inherits these unless overridden. */
gsap.defaults({ ease: 'power3.out', duration: 0.6 });

export { gsap, ScrollTrigger, SplitText, Flip, useGSAP };

/** Matches users who asked the OS for reduced motion. Use for the static branch. */
export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
/** Matches users who are OK with motion. Wrap every animation in this branch. */
export const FULL_MOTION_QUERY = '(prefers-reduced-motion: no-preference)';
/** Mobile breakpoint matches `.tabbar @media max-width:820px` in styles.css. */
export const MOBILE_QUERY =
  '(prefers-reduced-motion: no-preference) and (max-width: 820px)';
/** Desktop branch - hover-capable, wider than the mobile tabbar. */
export const DESKTOP_QUERY =
  '(prefers-reduced-motion: no-preference) and (min-width: 821px)';

/**
 * Default "stale" threshold for scroll reveals: if a section has been
 * off-screen for this long, re-entering replays the animation from its
 * initial state. Short enough that TabBar jumps feel fresh; long enough
 * that continuous scrolling back a section doesn't retrigger reveals.
 * Tune per-section via the `staleAfterMs` option on `createReveal`.
 */
export const DEFAULT_REVEAL_STALE_MS = 8000;
