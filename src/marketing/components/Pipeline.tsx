type Stage = {
  num: string;
  label: string;
  status: string;
};

type Props = {
  stages: Stage[];
  caption?: string;
};

export default function Pipeline({ stages, caption }: Props) {
  return (
    <figure className="mp-pipeline" role="group" aria-label={caption}>
      <ol className="mp-pipeline__row">
        {stages.map((s, i) => (
          <li className="mp-pipeline__node" key={s.num}>
            <div className="mp-pipeline__cell">
              <span className="mp-pipeline__num" aria-hidden="true">[ {s.num} ]</span>
              <span className="mp-pipeline__label">{s.label}</span>
              <span className="mp-pipeline__status" aria-hidden="true">{s.status}</span>
            </div>
            {i < stages.length - 1 ? (
              <span className="mp-pipeline__arrow" aria-hidden="true">{'──▶'}</span>
            ) : null}
          </li>
        ))}
      </ol>
      {caption ? <figcaption className="visually-hidden">{caption}</figcaption> : null}
    </figure>
  );
}
