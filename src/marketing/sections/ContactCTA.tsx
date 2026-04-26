import { useRef, type ComponentType } from 'react';
import { gsap, useGSAP, SplitText, FULL_MOTION_QUERY } from '../../lib/gsap';
import { createReveal } from '../../lib/scrollReveal';
import { attachInkBleed } from '../../lib/inkBleed';
import { contact } from '../../data/portfolio';
import {
  MailIcon,
  PhoneIcon,
  LinkedInIcon,
  GitHubIcon,
} from '../../components/ContactIcons';

const CONTACT_STALE_MS = 15000;

const SUBJECT = encodeURIComponent('שלום בר, מעוניין/ת לדבר על פרויקט');
const BODY = encodeURIComponent(
  'היי בר,\n\nיש לי רעיון/פרויקט שאשמח להתייעץ עליו:\n\n',
);

type Channel = {
  key: string;
  label: string;
  value: string;
  href: string;
  Icon: ComponentType<{ size?: number }>;
  accent: string;
};

const channels: Channel[] = [
  {
    key: 'email',
    label: 'מייל',
    value: contact.email,
    href: `mailto:${contact.email}?subject=${SUBJECT}&body=${BODY}`,
    Icon: MailIcon,
    accent: 'var(--green)',
  },
  {
    key: 'phone',
    label: 'טלפון',
    value: contact.phone,
    href: `tel:${contact.phone}`,
    Icon: PhoneIcon,
    accent: 'var(--blue)',
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    value: 'barmoshe',
    href: contact.linkedin,
    Icon: LinkedInIcon,
    accent: 'var(--ocean)',
  },
  {
    key: 'github',
    label: 'GitHub',
    value: 'barmoshe',
    href: contact.github,
    Icon: GitHubIcon,
    accent: 'var(--magenta)',
  },
];

export default function ContactCTA() {
  const rootRef = useRef<HTMLElement | null>(null);
  const channelsRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const grid = channelsRef.current;
      if (!root || !grid) return;
      const headline = root.querySelector<HTMLElement>('.headline');
      const dek = root.querySelector<HTMLElement>('.dek');
      const cta = root.querySelector<HTMLElement>('.contact-cta');
      const cards = Array.from(grid.children) as HTMLElement[];

      const mm = gsap.matchMedia();
      mm.add(FULL_MOTION_QUERY, () => {
        let split: SplitText | null = null;
        let cleanupBleed: (() => void) | null = null;

        if (headline) {
          split = new SplitText(headline, { type: 'chars,words' });
          createReveal(
            split.chars,
            { opacity: 0, yPercent: 80, rotate: -6 },
            {
              opacity: 1,
              yPercent: 0,
              rotate: 0,
              duration: 0.7,
              stagger: 0.04,
              ease: 'back.out(1.8)',
            },
            { trigger: headline, start: 'top 80%', staleAfterMs: CONTACT_STALE_MS },
          );
          cleanupBleed = attachInkBleed(headline, 'letter');
        }

        if (dek) {
          createReveal(
            dek,
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.6, delay: 0.15 },
            { trigger: dek, start: 'top 85%', staleAfterMs: CONTACT_STALE_MS },
          );
        }

        if (cards.length) {
          createReveal(
            cards,
            { opacity: 0, y: 18 },
            { opacity: 1, y: 0, duration: 0.55, stagger: 0.07 },
            { trigger: grid, start: 'top 85%', staleAfterMs: CONTACT_STALE_MS },
          );
        }

        if (cta) {
          createReveal(
            cta,
            { opacity: 0, y: 18 },
            { opacity: 1, y: 0, duration: 0.55 },
            { trigger: cta, start: 'top 90%', staleAfterMs: CONTACT_STALE_MS },
          );
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
    <article className="page contact-page" id="contact" ref={rootRef} tabIndex={-1}>
      <div className="folio">
        <b>03</b> // יצירת קשר
      </div>
      <h2 className="headline">בואו נדבר.</h2>
      <p className="dek">
        שיחה ראשונה ללא התחייבות. מספרים לי על הרעיון, אני אומר אם וזה משהו שאני יכול לעזור איתו —
        ואיך נראה צעד הבא.
      </p>

      <div
        ref={channelsRef}
        className="contact-channels"
        style={{
          marginTop: 36,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
        }}
      >
        {channels.map(({ key, label, value, href, Icon, accent }) => {
          const isExternal = href.startsWith('http');
          return (
            <a
              key={key}
              href={href}
              {...(isExternal
                ? { target: '_blank', rel: 'noreferrer noopener' }
                : {})}
              className="contact-card"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '14px 18px',
                background: 'var(--card-bg)',
                border: '1.5px solid var(--card-border)',
                boxShadow: `5px 6px 0 ${accent}`,
                color: 'var(--ink)',
                textDecoration: 'none',
                fontFamily: 'var(--serif)',
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  display: 'inline-flex',
                  width: 36,
                  height: 36,
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: accent,
                  color: 'var(--paper)',
                  border: '1.5px solid var(--ink)',
                }}
              >
                <Icon size={20} />
              </span>
              <span style={{ display: 'grid', gap: 2, minWidth: 0 }}>
                <span
                  style={{
                    fontFamily: 'var(--mono)',
                    fontSize: 11,
                    letterSpacing: '.16em',
                    textTransform: 'uppercase',
                    color: 'var(--ink-soft)',
                  }}
                >
                  {label}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--mono)',
                    fontSize: 14,
                    color: 'var(--ink)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {value}
                </span>
              </span>
            </a>
          );
        })}
      </div>

      <p
        className="contact-cta"
        style={{
          marginTop: 40,
          textAlign: 'center',
        }}
      >
        <a className="enter" href={`mailto:${contact.email}?subject=${SUBJECT}&body=${BODY}`}>
          שלחו לי מייל
        </a>
      </p>

      <p
        className="contact-footer"
        style={{
          marginTop: 28,
          textAlign: 'center',
          fontFamily: 'var(--serif)',
          fontStyle: 'italic',
          color: 'var(--ink-soft)',
          fontSize: '.95rem',
        }}
      >
        או בואו{' '}
        <a href={import.meta.env.BASE_URL} style={{ color: 'var(--green)' }}>
          חזרה לפורטפוליו
        </a>{' '}
        לראות עבודות קודמות.
      </p>
    </article>
  );
}
