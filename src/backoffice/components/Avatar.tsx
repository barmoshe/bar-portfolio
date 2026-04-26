import type { Client } from '../data/types';

export default function Avatar({ client, size = 36 }: { client: Client; size?: number }) {
  return (
    <span
      className="bo-avatar"
      style={{ background: client.color, width: size, height: size, fontSize: size * 0.42 }}
      aria-hidden="true"
    >
      {client.initials}
    </span>
  );
}
