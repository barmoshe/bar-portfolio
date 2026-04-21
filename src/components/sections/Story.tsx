export default function Story() {
  return (
    <article className="page" id="story">
      <div className="folio">
        <b>02</b> // PATH
      </div>
      <span className="stamp">A PATH</span>
      <h2 className="headline">
        Got here by <em>doing things.</em>
      </h2>
      <p className="dek">
        Music school → CS degree → shipping full-stack now. Not a straight line, but a line
        nonetheless.
      </p>
      <hr className="rule" />

      <div className="cols" style={{ marginTop: 32 }}>
        <div>
          <h3>Now</h3>
          <ul>
            <li>
              <strong>Joomsy</strong> - Software Engineer, Full-Stack. May 2025–present.
            </li>
            <li>
              <strong>Wochit</strong> - Customer Support Engineer. Nov 2021–present.
            </li>
          </ul>
        </div>
        <div>
          <h3>Education</h3>
          <ul>
            <li>
              <strong>Afeka</strong> - B.S. Computer Science
            </li>
            <li>
              <strong>Wix</strong> - DevOps Workshop
            </li>
            <li>
              <strong>Coding Academy</strong> - Full-Stack BootCamp
            </li>
            <li>
              <strong>BPM College</strong> - Music
            </li>
          </ul>
        </div>
      </div>

      <div
        style={{
          marginTop: 40,
          background: 'var(--paper)',
          border: '1.5px solid var(--green)',
          padding: 18,
          transform: 'rotate(1.2deg)',
          boxShadow: '5px 6px 0 var(--green)',
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: 'var(--mono)',
            fontSize: 12,
            letterSpacing: '.1em',
            textTransform: 'uppercase',
            color: 'var(--ink-soft)',
          }}
        >
          How I work
        </p>
        <p style={{ margin: '10px 0 0', fontStyle: 'italic', color: 'var(--ink)' }}>
          Start small. Ship early. Listen to whoever's using it. Fix what actually matters.
        </p>
      </div>
    </article>
  );
}
