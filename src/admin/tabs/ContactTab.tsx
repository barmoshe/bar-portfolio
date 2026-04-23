import type { Contact } from '../../data/portfolio';
import { TextField } from '../fields';

export function ContactTab(props: { value: Contact; onChange: (next: Contact) => void }) {
  const { value, onChange } = props;
  const patch = (partial: Partial<Contact>) => onChange({ ...value, ...partial });
  return (
    <section className="admin-section">
      <h2 className="admin-section-heading">Contact</h2>
      <p className="admin-muted">
        Rendered in <code className="admin-code">Letter.tsx</code>. The email and phone values
        also drive the <code className="admin-code">mailto:</code> and{' '}
        <code className="admin-code">tel:</code> hrefs.
      </p>
      <div className="admin-field-grid">
        <TextField
          label="Email"
          value={value.email}
          onChange={(email) => patch({ email })}
          type="email"
        />
        <TextField
          label="Phone"
          value={value.phone}
          onChange={(phone) => patch({ phone })}
          type="tel"
          placeholder="+972..."
        />
        <TextField
          label="GitHub URL"
          value={value.github}
          onChange={(github) => patch({ github })}
          type="url"
        />
        <TextField
          label="LinkedIn URL"
          value={value.linkedin}
          onChange={(linkedin) => patch({ linkedin })}
          type="url"
        />
      </div>
    </section>
  );
}
