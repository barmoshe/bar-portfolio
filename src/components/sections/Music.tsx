import { useRef } from 'react';
import { gsap, SplitText, useGSAP, FULL_MOTION_QUERY } from '../../lib/gsap';
import { attachInkBleed } from '../../lib/inkBleed';
import Synth from '../music/Synth';
import LinksStrip from '../music/LinksStrip';

export default function Music() {
  const rootRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const stamp = root.querySelector<HTMLElement>('.stamp');
      const headline = root.querySelector<HTMLElement>('.headline');
      const dek = root.querySelector<HTMLElement>('.dek');

      const mm = gsap.matchMedia();
      mm.add(FULL_MOTION_QUERY, () => {
        let split: SplitText | null = null;
        let cleanupBleed: (() => void) | null = null;

        if (stamp) {
          gsap.set(stamp, { opacity: 0, rotate: 10, scale: 0.8 });
          gsap.to(stamp, {
            opacity: 1,
            rotate: -3,
            scale: 1,
            duration: 0.6,
            ease: 'back.out(2)',
            scrollTrigger: { trigger: root, start: 'top 75%' },
          });
        }

        if (headline) {
          split = new SplitText(headline, { type: 'words' });
          gsap.set(split.words, { opacity: 0, yPercent: 80, rotate: -3 });
          gsap.to(split.words, {
            opacity: 1,
            yPercent: 0,
            rotate: 0,
            duration: 0.7,
            stagger: 0.06,
            ease: 'back.out(1.6)',
            scrollTrigger: { trigger: headline, start: 'top 80%' },
          });
          cleanupBleed = attachInkBleed(headline, 'music');
        }

        if (dek) {
          gsap.set(dek, { opacity: 0, y: 14 });
          gsap.to(dek, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            scrollTrigger: { trigger: dek, start: 'top 85%' },
          });
        }

        return () => {
          split?.revert();
          cleanupBleed?.();
        };
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <article className="page" id="music" ref={rootRef}>
      <div className="folio">
        <b>05</b> // OFF-KEYBOARD
      </div>
      <span className="stamp">MUSIC</span>
      <h2 className="headline">
        A small <em>instrument,</em> built by hand.
      </h2>
      <p className="dek">
        Built with Web Audio, no libraries. Click the keys, or use A–K on your keyboard.
      </p>

      <Synth />
      <LinksStrip />
    </article>
  );
}
