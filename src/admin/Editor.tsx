import { useMemo, useState } from 'react';
import type { PortfolioData } from '../data/portfolio';
import { Button, Tabs } from './fields';
import { clearStoredPat } from './TokenGate';
import { ContactTab } from './tabs/ContactTab';
import { ProjectsTab } from './tabs/ProjectsTab';
import { SaveTab } from './tabs/SaveTab';

type TabId = 'projects' | 'contact' | 'save';

export function Editor(props: {
  pat: string;
  initialData: PortfolioData;
  initialSha: string;
  onLogout: () => void;
  onResetToken: () => void;
}) {
  const { pat, initialData, initialSha, onLogout, onResetToken } = props;

  const [original, setOriginal] = useState<PortfolioData>(initialData);
  const [edited, setEdited] = useState<PortfolioData>(initialData);
  const [sha, setSha] = useState(initialSha);
  const [tab, setTab] = useState<TabId>('projects');

  const dirtyScope = useMemo(() => computeDirty(original, edited), [original, edited]);

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <div>
          <h1 className="admin-heading">Portfolio editor</h1>
          <p className="admin-muted-small">
            Editing <code className="admin-code">src/data/portfolio.data.ts</code> on{' '}
            <code className="admin-code">main</code>.
          </p>
        </div>
        <div className="admin-header-actions">
          <Button
            onClick={() => {
              clearStoredPat();
              onResetToken();
            }}
          >
            Reset token
          </Button>
          <Button intent="danger" onClick={onLogout}>
            Lock
          </Button>
        </div>
      </header>

      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { id: 'projects', label: 'Projects', dirty: dirtyScope.projects },
          { id: 'contact', label: 'Contact', dirty: dirtyScope.contact },
          { id: 'save', label: 'Publish', dirty: dirtyScope.projects || dirtyScope.contact },
        ]}
      />

      <div className="admin-panel">
        {tab === 'projects' ? (
          <ProjectsTab
            value={edited.projects}
            onChange={(projects) => setEdited({ ...edited, projects })}
          />
        ) : null}
        {tab === 'contact' ? (
          <ContactTab
            value={edited.contact}
            onChange={(contact) => setEdited({ ...edited, contact })}
          />
        ) : null}
        {tab === 'save' ? (
          <SaveTab
            pat={pat}
            original={original}
            edited={edited}
            sha={sha}
            onSaved={(info) => {
              setSha(info.sha);
              setOriginal(info.data);
              // Keep edited === original after publish so the diff clears.
              setEdited(info.data);
            }}
          />
        ) : null}
      </div>
    </div>
  );
}

function computeDirty(original: PortfolioData, edited: PortfolioData) {
  return {
    projects: JSON.stringify(original.projects) !== JSON.stringify(edited.projects),
    contact: JSON.stringify(original.contact) !== JSON.stringify(edited.contact),
  };
}
