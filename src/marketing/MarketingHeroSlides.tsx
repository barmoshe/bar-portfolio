import HeroSlides from '../components/HeroSlides';
import { marketingHeroSlides } from '../data/marketingHeroSlides';

/**
 * Marketing hero slideshow. Wraps the portfolio's HeroSlides component
 * with marketing-only data and Hebrew accessibility labels. Swap the
 * import in `data/marketingHeroSlides` to change what plays here — no
 * component edits needed.
 */
export default function MarketingHeroSlides() {
  return (
    <HeroSlides
      slides={marketingHeroSlides}
      ariaLabel="בר משה - דיוקנים"
      pauseLabel={{
        paused: 'הפעל מחדש את סלייד-שואו הדיוקנים',
        playing: 'השהה את סלייד-שואו הדיוקנים',
      }}
    />
  );
}
