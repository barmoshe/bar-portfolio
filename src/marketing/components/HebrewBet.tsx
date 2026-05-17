/**
 * Custom Hebrew letter ב (bet) rendered as an SVG path. The bet is
 * the first letter of "Bar" and of "בנייה" (building) — used as the
 * recurring graphic motif of the editorial issue. Drawn as a solid
 * geometric form (no strokes) so it scales as a poster element and
 * accepts `currentColor` for theming.
 *
 * viewBox is 0 0 200 220 — wider-than-tall to match the bet's shape
 * (the long horizontal foot extending to the left in RTL reading).
 */
type Props = {
  className?: string;
};

export default function HebrewBet({ className }: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 220"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M 22 18
           L 152 18
           Q 178 18 178 50
           L 178 88
           Q 178 110 154 110
           L 60 110
           L 60 178
           L 188 178
           L 188 208
           L 22 208
           Z
           M 60 48
           L 60 80
           L 142 80
           Q 148 80 148 72
           L 148 56
           Q 148 48 142 48
           Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}
