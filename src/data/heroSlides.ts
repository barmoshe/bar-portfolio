/**
 * Portfolio hero slides. The portrait set rendered by HeroSlides.tsx.
 * Centralized here so non-portfolio surfaces (e.g. the marketing page)
 * can import a different list and pass it into the same component.
 */

export type Slide = { src: string; alt: string; caption: string };

export const portfolioHeroSlides: Slide[] = [
  { src: 'portraits/img0.png', alt: 'Bar Moshe - portrait 0', caption: 'portrait · 0' },
  { src: 'portraits/img1.png', alt: 'Bar Moshe - portrait 1', caption: 'portrait · 1' },
  { src: 'portraits/img2.png', alt: 'Bar Moshe - portrait 2', caption: 'portrait · 2' },
  { src: 'portraits/img3.png', alt: 'Bar Moshe - portrait 3', caption: 'portrait · 3' },
  { src: 'portraits/img4.png', alt: 'Bar Moshe - portrait 4', caption: 'portrait · 4' },
  { src: 'portraits/img5.png', alt: 'Bar Moshe - portrait 5', caption: 'portrait · 5' },
  { src: 'portraits/img6.png', alt: 'Bar Moshe - portrait 6', caption: 'portrait · 6' },
  { src: 'portraits/img7.png', alt: 'Bar Moshe - portrait 7', caption: 'portrait · 7' },
  { src: 'portraits/img9.png', alt: 'Bar Moshe - portrait 9', caption: 'portrait · 9' },
  { src: 'portraits/img10.png', alt: 'Bar Moshe - portrait 10', caption: 'portrait · 10' },
  { src: 'portraits/img11.png', alt: 'Bar Moshe - portrait 11', caption: 'portrait · 11' },
  { src: 'portraits/img12.png', alt: 'Bar Moshe - portrait 12', caption: 'portrait · 12' },
  { src: 'portraits/img13.png', alt: 'Bar Moshe - portrait 13', caption: 'portrait · 13' },
  { src: 'portraits/img14.png', alt: 'Bar Moshe - portrait 14', caption: 'portrait · 14' },
  { src: 'portraits/img15.png', alt: 'Bar Moshe - portrait 15', caption: 'portrait · 15' },
  { src: 'portraits/img16.png', alt: 'Bar Moshe - painterly cubist portrait', caption: 'portrait · 16 · painterly' },
  { src: 'portraits/img17.png', alt: 'Bar Moshe - cartoon portrait', caption: 'portrait · 17 · cartoon' },
  { src: 'portraits/img18.png', alt: 'Bar Moshe - stained-glass cubist portrait', caption: 'portrait · 18 · stained-glass' },
  { src: 'portraits/img19.png', alt: 'Bar Moshe - blue-only variation of portrait 18', caption: 'portrait · 19 · blue' },
  { src: 'portraits/img20.png', alt: 'Bar Moshe - fiery portrait', caption: 'portrait · 20 · fire' },
  { src: 'portraits/img21.png', alt: 'Bar Moshe - cosmic blue lightning portrait', caption: 'portrait · 21 · cosmic' },
  { src: 'portraits/img22.png', alt: 'Bar Moshe - Simpsons-style portrait in a verdant forest', caption: 'portrait · 22 · forest' },
];
