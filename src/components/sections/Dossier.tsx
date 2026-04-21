import HeroSlides from '../HeroSlides';

export default function Dossier() {
  return (
    <article className="page" id="dossier">
      <div className="folio">
        <b>01</b> // WHOAMI
      </div>

      <aside className="id-card">
        <span className="tape" aria-hidden="true" />
        <HeroSlides />
        <div className="id-meta">
          <b>NAME</b>
          <span>Bar Moshe</span>
          <b>ROLE</b>
          <span>Software Engineer</span>
          <b>FOCUS</b>
          <span>Full-Stack · AI-native · Builder</span>
          <b>REACH</b>
          <span>
            <a href="https://github.com/barmoshe" target="_blank" rel="noopener">
              github.com/barmoshe
            </a>
          </span>
        </div>
      </aside>

      <div className="bio">
        <p className="byline">
          From idea to the thing that runs - with people, with AI, with whatever.
        </p>
        <h1>
          Most things <em>just need</em>
          <br />
          doing.
        </h1>
        <div className="drop">
          <p>
            I'm Bar - a full-stack engineer with a builder's habit and an AI-native reflex.
            I like closing the gap between an idea and the thing that runs it: a feature
            shipped, a script that saves someone an afternoon, a weekend experiment that
            quietly becomes a tool I use daily.
          </p>
        </div>

        <p>
          I make software for a living and keep making it on the side: small tools,
          music-leaning experiments, half-formed ideas pulled forward until they hold. The
          through-line isn't a stack or a title.
        </p>

        <p
          style={{
            margin: '20px 0 0',
            fontFamily: 'var(--display)',
            fontSize: 'clamp(1.15rem,1.8vw,1.35rem)',
            lineHeight: 1.3,
            fontWeight: 700,
            color: 'var(--ink)',
            letterSpacing: '-0.005em',
          }}
        >
          It's the habit of starting and the belief that{' '}
          <em>&ldquo;everything is only one prompt away&rdquo;</em>.
        </p>

        <p className="toolline">
          <b>WORKING ON</b>
          Full-stack product work · AI-assisted tooling · small things that make bigger
          things possible.
        </p>
      </div>
    </article>
  );
}
