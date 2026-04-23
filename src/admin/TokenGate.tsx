/**
 * PAT gate for the #admin backoffice.
 *
 * Stores a GitHub fine-grained Personal Access Token in localStorage so loads
 * between sessions don't re-prompt. The token is sensitive: anyone with
 * filesystem or XSS access to the browser can exfiltrate it. Scope it to
 * `barmoshe/bar-portfolio` with only `contents:write` and use a short expiry.
 */

import { useState } from 'react';
import { Button, TextField } from './fields';

const STORAGE_KEY = 'portfolio-admin-pat';

export function getStoredPat(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setStoredPat(pat: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, pat);
  } catch {
    /* localStorage may be unavailable (private mode, disabled); no-op */
  }
}

export function clearStoredPat(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* no-op */
  }
}

export function TokenGate(props: { onToken: (pat: string) => void }) {
  const [value, setValue] = useState('');
  return (
    <form
      className="admin-card"
      onSubmit={(e) => {
        e.preventDefault();
        if (value.trim().length === 0) return;
        setStoredPat(value.trim());
        props.onToken(value.trim());
      }}
    >
      <h1 className="admin-heading">Connect GitHub</h1>
      <p className="admin-muted">
        Paste a fine-grained Personal Access Token scoped to{' '}
        <code className="admin-code">barmoshe/bar-portfolio</code> with{' '}
        <code className="admin-code">Contents: Read and write</code>. Stored in localStorage on this
        device.
      </p>
      <TextField label="Token" value={value} onChange={setValue} type="password" monospace />
      <Button intent="primary" type="submit" disabled={value.trim().length === 0}>
        Save token
      </Button>
    </form>
  );
}
