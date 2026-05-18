type State = 'ok' | 'pending' | 'live' | 'note';

type Props = {
  label: string;
  status: string;
  state?: State;
  srLabel?: string;
};

export default function BuildLine({ label, status, state = 'ok', srLabel }: Props) {
  return (
    <li className="mp-buildline" data-state={state}>
      <span className="mp-buildline__arrow" aria-hidden="true">{'>'}</span>
      <span className="mp-buildline__label">{label}</span>
      <span className="mp-buildline__leader" aria-hidden="true" />
      <span className="mp-buildline__status">[{status}]</span>
      {srLabel ? <span className="visually-hidden">{srLabel}</span> : null}
    </li>
  );
}
