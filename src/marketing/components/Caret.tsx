type Props = {
  className?: string;
};

export default function Caret({ className }: Props) {
  const cls = className ? `mp-caret ${className}` : 'mp-caret';
  return (
    <span className={cls} aria-hidden="true">
      <span className="mp-caret__block">▌</span>
    </span>
  );
}
