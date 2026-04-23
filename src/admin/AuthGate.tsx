/**
 * Password gate for the #admin backoffice.
 *
 * Compares SHA-256(input) against `ADMIN_PASSWORD_SHA256` below. The hash is
 * visible in the bundled JS, so this is deliberately a thin speed bump, not
 * real security - a determined visitor can brute-force a weak password.
 * On success, sets `sessionStorage['portfolio-admin-auth']` so reloads stay
 * authed within the tab.
 *
 * To change the password, regenerate the hash:
 *   node -e "console.log(require('crypto').createHash('sha256').update('NEW_PW').digest('hex'))"
 * and replace ADMIN_PASSWORD_SHA256 below.
 */

import { useState } from 'react';
import { sha256Hex, timingSafeEqual } from './crypto';
import { Button, TextField } from './fields';

// SHA-256 of the admin password. Rotate using the node one-liner in the file
// header. Do NOT commit the cleartext password anywhere - comment, PR body,
// commit message, issue, chat log. The hash alone is public by design.
const ADMIN_PASSWORD_SHA256 = '57d351019063bf6976fbc9dd2e9d8ee3a1a0791d8368296b0bd22e0f6563e417';
const SESSION_KEY = 'portfolio-admin-auth';

/** Returns true if the current tab has been authed this session. */
export function isAuthed(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1';
  } catch {
    return false;
  }
}

export function AuthGate(props: { onAuthed: () => void }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const hash = await sha256Hex(value);
      if (timingSafeEqual(hash, ADMIN_PASSWORD_SHA256)) {
        sessionStorage.setItem(SESSION_KEY, '1');
        props.onAuthed();
      } else {
        setError('Wrong password.');
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="admin-card" onSubmit={submit}>
      <h1 className="admin-heading">Backoffice</h1>
      <p className="admin-muted">Enter the admin password to continue.</p>
      <TextField label="Password" value={value} onChange={setValue} type="password" />
      {error ? <p className="admin-error">{error}</p> : null}
      <Button intent="primary" type="submit" disabled={busy || value.length === 0}>
        {busy ? 'Checking...' : 'Unlock'}
      </Button>
    </form>
  );
}
