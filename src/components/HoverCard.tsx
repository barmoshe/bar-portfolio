import { useState, type CSSProperties, type ReactNode } from 'react';

type Props = {
  href: string;
  target?: string;
  rel?: string;
  rest: CSSProperties;
  hover: CSSProperties;
  children: ReactNode;
};

export default function HoverCard({
  href,
  target,
  rel,
  rest,
  hover,
  children,
}: Props) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      style={hovered ? { ...rest, ...hover } : rest}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      {children}
    </a>
  );
}
