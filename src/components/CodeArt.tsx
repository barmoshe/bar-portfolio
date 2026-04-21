type Props = { idx: number };

const COLORS: [string, string][] = [
  ['oklch(0.55 0.16 200)', 'oklch(0.85 0.14 110)'],
  ['oklch(0.60 0.2 25)', 'oklch(0.88 0.14 60)'],
  ['oklch(0.45 0.12 250)', 'oklch(0.82 0.12 135)'],
  ['oklch(0.50 0.14 140)', 'oklch(0.88 0.12 180)'],
];
const ICONS = ['</>', '{}', 'fn', 'λ', '∞', '>_'];

export default function CodeArt({ idx }: Props) {
  const [c0, c1] = COLORS[idx % COLORS.length]!;
  const icon = ICONS[idx % ICONS.length]!;
  const gradId = `cg${idx}`;

  return (
    <svg
      viewBox="0 0 200 100"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={c0} />
          <stop offset="100%" stopColor={c1} />
        </linearGradient>
      </defs>
      <rect width="200" height="100" fill={`url(#${gradId})`} />
      <text
        x="100"
        y="50"
        textAnchor="middle"
        dy=".3em"
        fontFamily="monospace"
        fontSize="32"
        fill="oklch(0.98 0 0 / .9)"
        fontWeight="700"
      >
        {icon}
      </text>
    </svg>
  );
}
