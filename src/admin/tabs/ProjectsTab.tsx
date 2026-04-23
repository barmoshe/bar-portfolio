import type { Project, ProjectExtra } from '../../data/portfolio';
import { Button, ListEditor, TextArea, TextField } from '../fields';

const emptyProject = (): Project => ({
  name: '',
  description: '',
  language: '',
  url: '',
});

const emptyExtra = (): ProjectExtra => ({ label: '', url: '' });

export function ProjectsTab(props: { value: Project[]; onChange: (next: Project[]) => void }) {
  return (
    <section className="admin-section">
      <h2 className="admin-section-heading">Projects</h2>
      <p className="admin-muted">
        Cards in the <code className="admin-code">#repos</code> grid. Polyglot languages use{' '}
        <code className="admin-code">{'A · B · C'}</code>; `iconFor` maps single-language strings
        to glyphs.
      </p>
      <ListEditor
        items={props.value}
        onChange={props.onChange}
        emptyTemplate={emptyProject}
        addLabel="Add project"
        itemLabel={(p) => p.name || '(unnamed project)'}
        renderItem={(project, setProject) => (
          <ProjectFields project={project} onChange={setProject} />
        )}
      />
    </section>
  );
}

function ProjectFields(props: { project: Project; onChange: (next: Project) => void }) {
  const { project, onChange } = props;
  const patch = (partial: Partial<Project>) => onChange({ ...project, ...partial });

  const extras = project.extras ?? [];
  const setExtras = (next: ProjectExtra[]) =>
    patch({ extras: next.length === 0 ? undefined : next });

  return (
    <div className="admin-field-grid">
      <TextField label="Name" value={project.name} onChange={(name) => patch({ name })} />
      <TextField
        label="Language"
        value={project.language}
        onChange={(language) => patch({ language })}
        placeholder="TypeScript or Go · Python · TypeScript"
      />
      <TextField label="URL" value={project.url} onChange={(url) => patch({ url })} type="url" />
      <TextArea
        label="Description"
        value={project.description}
        onChange={(description) => patch({ description })}
        rows={5}
        placeholder="Hook - followed by detail; everything after ' - ' is trimmed in card previews."
      />
      <div className="admin-subsection">
        <div className="admin-subsection-header">
          <span className="admin-field-label">Extras (secondary links)</span>
          <Button
            onClick={() => setExtras([...extras, emptyExtra()])}
            disabled={extras.length >= 6}
          >
            + Add link
          </Button>
        </div>
        {extras.length === 0 ? (
          <p className="admin-muted-small">No extras.</p>
        ) : (
          <ListEditor
            items={extras}
            onChange={setExtras}
            emptyTemplate={emptyExtra}
            addLabel="Add link"
            itemLabel={(e) => e.label || '(unlabeled link)'}
            renderItem={(extra, setExtra) => (
              <div className="admin-field-grid">
                <TextField
                  label="Label"
                  value={extra.label}
                  onChange={(label) => setExtra({ ...extra, label })}
                />
                <TextField
                  label="URL"
                  value={extra.url}
                  onChange={(url) => setExtra({ ...extra, url })}
                  type="url"
                />
              </div>
            )}
          />
        )}
      </div>
    </div>
  );
}
