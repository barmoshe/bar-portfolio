import type { CSSProperties } from 'react';

const trackCard = (rotate: string): CSSProperties => ({
  position: 'relative',
  background: 'var(--paper)',
  border: '1.5px dashed var(--green)',
  padding: 22,
  transform: `rotate(${rotate})`,
  boxShadow: '5px 6px 0 var(--green)',
  minHeight: 220,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
});

const kicker: CSSProperties = {
  margin: 0,
  fontFamily: 'var(--mono)',
  fontSize: 11,
  letterSpacing: '.22em',
  textTransform: 'uppercase',
  color: 'var(--green)',
};

const title: CSSProperties = {
  fontFamily: 'var(--display)',
  fontSize: '1.6rem',
  margin: '8px 0 0',
  lineHeight: 1.05,
};

const desc: CSSProperties = {
  margin: '10px 0 0',
  color: 'var(--ink-soft)',
  fontFamily: 'var(--serif)',
};

const foot = (rotate: string): CSSProperties => ({
  margin: 0,
  fontFamily: 'var(--hand)',
  color: 'var(--green)',
  fontSize: 18,
  transform: `rotate(${rotate})`,
  alignSelf: 'flex-end',
});

export default function Music() {
  return (
    <article className="page" id="music">
      <div className="folio">
        <b>05</b> // OFF-KEYBOARD
      </div>
      <span className="stamp">MUSIC</span>
      <h2 className="headline">
        The other <em>instrument.</em>
      </h2>
      <p className="dek">
        Before the editor, there was a DAW. Music is where a lot of my thinking about
        systems, timing, and craft started - and where it keeps going.
      </p>

      <div
        style={{
          marginTop: 36,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))',
          gap: 20,
          alignItems: 'stretch',
        }}
      >
        <div style={trackCard('-1deg')}>
          <div>
            <p style={kicker}>Track 01 · //TODO</p>
            <h3 style={title}>Coming soon.</h3>
            <p style={desc}>
              Placeholder for an Ableton track. Embed, waveform, or short clip will go here.
            </p>
          </div>
          <p style={foot('-2deg')}>▶ soon.</p>
        </div>

        <div style={trackCard('1.2deg')}>
          <div>
            <p style={kicker}>Track 02 · //TODO</p>
            <h3 style={title}>Also soon.</h3>
            <p style={desc}>Another slot for a track or MIDI GPT-generated loop.</p>
          </div>
          <p style={foot('2deg')}>♪ ♪ ♪</p>
        </div>

        <div
          style={{
            ...trackCard('-.6deg'),
            background: 'var(--ink)',
            color: 'var(--paper)',
            border: '1.5px solid var(--ink)',
          }}
        >
          <div>
            <p style={kicker}>Training</p>
            <h3 style={{ ...title, color: 'var(--paper)' }}>
              Ableton Live 10 - certified user.
            </h3>
            <p style={{ ...desc, color: 'oklch(0.9 0.02 85)' }}>
              Studied music production at <strong>BPM College</strong> (2019). The obsession
              with loops, layering and modular thinking translated straight into how I work
              on software.
            </p>
          </div>
          <p style={foot('-2deg')}>// todo: story.</p>
        </div>
      </div>

      <p
        style={{
          margin: '28px 0 0',
          fontFamily: 'var(--mono)',
          fontSize: 11,
          letterSpacing: '.2em',
          textTransform: 'uppercase',
          color: 'var(--ink-soft)',
        }}
      >
        // TODO - fill this section with real tracks and a short write-up.
      </p>
    </article>
  );
}
