/**
 * Top-level of the #admin route.
 *
 * Flow: AuthGate -> TokenGate -> load current data from GitHub -> Editor.
 * Deliberately imports NOTHING from `src/components/**` so GSAP and the hero
 * chunk stay out of the admin bundle.
 */

import { useEffect, useState } from 'react';
import type { PortfolioData } from '../data/portfolio';
import { AuthGate, isAuthed } from './AuthGate';
import { Editor } from './Editor';
import { GitHubError, loadDataFile } from './github';
import { TokenGate, getStoredPat } from './TokenGate';

type Phase =
  | { kind: 'auth' }
  | { kind: 'token' }
  | { kind: 'loading'; pat: string }
  | { kind: 'error'; pat: string; message: string }
  | { kind: 'ready'; pat: string; data: PortfolioData; sha: string };

export default function AdminApp() {
  const [phase, setPhase] = useState<Phase>(() => (isAuthed() ? initialPhaseAfterAuth() : { kind: 'auth' }));

  useEffect(() => {
    if (phase.kind === 'loading') {
      let cancelled = false;
      (async () => {
        try {
          const { data, sha } = await loadDataFile(phase.pat);
          if (!cancelled) setPhase({ kind: 'ready', pat: phase.pat, data, sha });
        } catch (err) {
          if (cancelled) return;
          const message = err instanceof GitHubError ? err.message : err instanceof Error ? err.message : String(err);
          setPhase({ kind: 'error', pat: phase.pat, message });
        }
      })();
      return () => {
        cancelled = true;
      };
    }
  }, [phase]);

  return (
    <div className="admin-root">
      {phase.kind === 'auth' ? (
        <AuthGate onAuthed={() => setPhase(initialPhaseAfterAuth())} />
      ) : null}
      {phase.kind === 'token' ? (
        <TokenGate onToken={(pat) => setPhase({ kind: 'loading', pat })} />
      ) : null}
      {phase.kind === 'loading' ? (
        <div className="admin-card">
          <p className="admin-muted">Loading current data from GitHub...</p>
        </div>
      ) : null}
      {phase.kind === 'error' ? (
        <div className="admin-card">
          <h1 className="admin-heading">Couldn&rsquo;t load</h1>
          <p className="admin-error">{phase.message}</p>
          <button
            className="admin-button admin-button-ghost"
            onClick={() => setPhase({ kind: 'token' })}
            type="button"
          >
            Re-enter token
          </button>
        </div>
      ) : null}
      {phase.kind === 'ready' ? (
        <Editor
          pat={phase.pat}
          initialData={phase.data}
          initialSha={phase.sha}
          onLogout={() => {
            sessionStorage.removeItem('portfolio-admin-auth');
            setPhase({ kind: 'auth' });
          }}
          onResetToken={() => setPhase({ kind: 'token' })}
        />
      ) : null}
    </div>
  );
}

function initialPhaseAfterAuth(): Phase {
  const pat = getStoredPat();
  return pat ? { kind: 'loading', pat } : { kind: 'token' };
}
