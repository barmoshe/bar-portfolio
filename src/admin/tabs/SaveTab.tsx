import { useMemo, useState } from 'react';
import type { PortfolioData } from '../../data/portfolio';
import { Button, TextField } from '../fields';
import { GitHubError, saveDataFile } from '../github';
import { serialize } from '../serializer';

export function SaveTab(props: {
  pat: string;
  original: PortfolioData;
  edited: PortfolioData;
  sha: string;
  onSaved: (info: { sha: string; commitUrl: string | null; data: PortfolioData }) => void;
}) {
  const { pat, original, edited, sha, onSaved } = props;
  const [message, setMessage] = useState(() => defaultCommitMessage(original, edited));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ commitUrl: string | null } | null>(null);

  const hasChanges = useMemo(
    () => JSON.stringify(original) !== JSON.stringify(edited),
    [original, edited],
  );

  const preview = useMemo(() => serialize(edited), [edited]);

  async function save() {
    setError(null);
    setSuccess(null);
    setBusy(true);
    try {
      const result = await saveDataFile(pat, edited, sha, message.trim() || 'content: update via #admin');
      onSaved({ sha: result.sha, commitUrl: result.commitUrl, data: edited });
      setSuccess({ commitUrl: result.commitUrl });
    } catch (err) {
      if (err instanceof GitHubError) setError(err.message);
      else setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="admin-section">
      <h2 className="admin-section-heading">Review &amp; publish</h2>
      {!hasChanges ? (
        <p className="admin-muted">No pending changes.</p>
      ) : (
        <>
          <p className="admin-muted">
            Saving commits <code className="admin-code">src/data/portfolio.data.ts</code> to{' '}
            <code className="admin-code">main</code>. The deploy workflow picks it up and the live
            site refreshes in ~60-90s.
          </p>
          <TextField label="Commit message" value={message} onChange={setMessage} monospace />
          <div className="admin-diff">
            <div className="admin-diff-heading">New file preview</div>
            <pre className="admin-diff-pre">{preview}</pre>
          </div>
          <Button intent="primary" onClick={save} disabled={busy}>
            {busy ? 'Publishing...' : 'Publish to main'}
          </Button>
        </>
      )}
      {error ? <p className="admin-error">{error}</p> : null}
      {success ? (
        <p className="admin-success">
          Published.{' '}
          {success.commitUrl ? (
            <a href={success.commitUrl} target="_blank" rel="noopener">
              View commit
            </a>
          ) : null}
        </p>
      ) : null}
    </section>
  );
}

/** Auto-compose a commit message from the top-level diff scope. */
function defaultCommitMessage(original: PortfolioData, edited: PortfolioData): string {
  const changedKeys: string[] = [];
  for (const key of Object.keys(edited) as (keyof PortfolioData)[]) {
    if (JSON.stringify(original[key]) !== JSON.stringify(edited[key])) changedKeys.push(key);
  }
  if (changedKeys.length === 0) return 'content: no-op via #admin';
  return `content: update ${changedKeys.join(', ')} via #admin`;
}
