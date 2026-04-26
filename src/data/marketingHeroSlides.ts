/**
 * Marketing-page hero slides. Currently same portraits as the portfolio,
 * but kept in a separate file so the marketing surface can swap to a
 * different visual set later (project screenshots, audience photos, etc.)
 * without touching the HeroSlides component.
 */

import type { Slide } from './heroSlides';

export const marketingHeroSlides: Slide[] = [
  { src: 'portraits/img0.png', alt: 'בר משה - דיוקן 0', caption: 'בר · 01' },
  { src: 'portraits/img4.png', alt: 'בר משה - דיוקן 4', caption: 'בר · 02' },
  { src: 'portraits/img7.png', alt: 'בר משה - דיוקן 7', caption: 'בר · 03' },
  { src: 'portraits/img11.png', alt: 'בר משה - דיוקן 11', caption: 'בר · 04' },
  { src: 'portraits/img14.png', alt: 'בר משה - דיוקן 14', caption: 'בר · 05' },
];
