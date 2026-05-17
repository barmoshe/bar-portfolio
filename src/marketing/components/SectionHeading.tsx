/**
 * Editorial section heading: a large hanging numeral in the margin,
 * an uppercase kicker, and the section title. Lays out as a 12-col
 * subgrid so the numeral aligns to the grid gutter regardless of
 * viewport width. RTL flips numeral to the right margin.
 */
type Props = {
  number: string;
  kicker: string;
  title: React.ReactNode;
  id?: string;
};

export default function SectionHeading({ number, kicker, title, id }: Props) {
  return (
    <header className="mp-h">
      <span className="mp-h__num" aria-hidden="true">{number}</span>
      <div className="mp-h__copy">
        <span className="mp-h__kicker">{kicker}</span>
        <h2 className="mp-h__title" id={id}>{title}</h2>
      </div>
    </header>
  );
}
