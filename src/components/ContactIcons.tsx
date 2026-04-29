/**
 * Inline SVG icons for the Letter contact cards. All icons use
 * `currentColor` so they inherit the host element's color and theme-flip
 * automatically. 24×24 viewBox; pass `size` to scale.
 */
import type { SVGProps } from 'react';

type IconProps = { size?: number } & Omit<SVGProps<SVGSVGElement>, 'width' | 'height'>;

function Svg({ size = 18, children, ...rest }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <Svg fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </Svg>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <Svg fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </Svg>
  );
}

export function LinkedInIcon(props: IconProps) {
  return (
    <Svg fill="currentColor" {...props}>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zm1.78 13.02H3.56V9h3.56v11.45z" />
    </Svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <Svg fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export function WhatsAppIcon(props: IconProps) {
  return (
    <Svg fill="currentColor" {...props}>
      <path d="M17.6 14.18c-.27-.13-1.6-.79-1.85-.88s-.43-.13-.61.13-.7.88-.86 1.06-.32.2-.59.07a7.6 7.6 0 0 1-2.23-1.38 8.39 8.39 0 0 1-1.55-1.93c-.16-.27 0-.41.12-.55s.27-.31.4-.47a1.86 1.86 0 0 0 .27-.45.49.49 0 0 0 0-.47c-.07-.13-.61-1.46-.83-2s-.44-.45-.61-.46H8.7a1 1 0 0 0-.74.34A3.07 3.07 0 0 0 7 9.4a5.32 5.32 0 0 0 1.12 2.83A12.18 12.18 0 0 0 13.32 17c2.63 1 2.63.69 3.11.65a2.81 2.81 0 0 0 1.85-1.31 2.27 2.27 0 0 0 .16-1.31c-.07-.12-.24-.18-.51-.31zM12 2a10 10 0 0 0-8.66 15l-1.3 4.74 4.86-1.27A10 10 0 1 0 12 2z" />
    </Svg>
  );
}

export function GitHubIcon(props: IconProps) {
  return (
    <Svg fill="currentColor" {...props}>
      <path d="M12 .3a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.04c-3.34.73-4.04-1.61-4.04-1.61a3.18 3.18 0 0 0-1.34-1.76c-1.09-.74.08-.73.08-.73a2.52 2.52 0 0 1 1.84 1.24 2.56 2.56 0 0 0 3.5 1 2.57 2.57 0 0 1 .76-1.6c-2.66-.3-5.46-1.33-5.46-5.93a4.64 4.64 0 0 1 1.24-3.22 4.31 4.31 0 0 1 .12-3.18s1-.32 3.3 1.23a11.4 11.4 0 0 1 6 0c2.3-1.55 3.3-1.23 3.3-1.23a4.31 4.31 0 0 1 .12 3.18 4.63 4.63 0 0 1 1.24 3.22c0 4.61-2.81 5.62-5.48 5.92a2.86 2.86 0 0 1 .82 2.22v3.29c0 .32.22.7.82.58A12 12 0 0 0 12 .3z" />
    </Svg>
  );
}

export function MediumIcon(props: IconProps) {
  return (
    <Svg fill="currentColor" {...props}>
      <path d="M13.54 12a6.8 6.8 0 0 1-6.77 6.82A6.8 6.8 0 0 1 0 12a6.8 6.8 0 0 1 6.77-6.82A6.8 6.8 0 0 1 13.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42s-3.39-2.88-3.39-6.42 1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
    </Svg>
  );
}

export function FacebookIcon(props: IconProps) {
  return (
    <Svg fill="currentColor" {...props}>
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12z" />
    </Svg>
  );
}
