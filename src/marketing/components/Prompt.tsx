import type { ReactNode } from 'react';

type Props = {
  children?: ReactNode;
  className?: string;
};

export default function Prompt({ children, className }: Props) {
  const cls = className ? `mp-prompt ${className}` : 'mp-prompt';
  return (
    <span className={cls}>
      <span className="mp-prompt__sigil" aria-hidden="true">$</span>
      {children ? <span className="mp-prompt__body">{children}</span> : null}
    </span>
  );
}
