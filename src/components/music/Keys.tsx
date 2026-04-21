import { useEffect, useState } from 'react';
import { PENTATONIC_MIDI, QWERTY_MAP, midiToName } from '../../lib/audio';

interface KeysProps {
  onNoteOn: (midi: number) => void;
  onNoteOff: (midi: number) => void;
  active: boolean;
}

export default function Keys({ onNoteOn, onNoteOff, active }: KeysProps) {
  const [held, setHeld] = useState<Set<number>>(() => new Set());

  useEffect(() => {
    if (!active) return;

    const press = (midi: number) => {
      setHeld((prev) => {
        if (prev.has(midi)) return prev;
        const next = new Set(prev);
        next.add(midi);
        onNoteOn(midi);
        return next;
      });
    };
    const release = (midi: number) => {
      setHeld((prev) => {
        if (!prev.has(midi)) return prev;
        const next = new Set(prev);
        next.delete(midi);
        onNoteOff(midi);
        return next;
      });
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
      const idx = QWERTY_MAP.indexOf(e.key.toLowerCase());
      if (idx === -1) return;
      e.preventDefault();
      press(PENTATONIC_MIDI[idx]);
    };
    const onKeyUp = (e: KeyboardEvent) => {
      const idx = QWERTY_MAP.indexOf(e.key.toLowerCase());
      if (idx === -1) return;
      release(PENTATONIC_MIDI[idx]);
    };
    const onBlur = () => {
      setHeld((prev) => {
        prev.forEach((midi) => onNoteOff(midi));
        return new Set();
      });
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
    };
  }, [active, onNoteOn, onNoteOff]);

  return (
    <div className="synth-keys" role="group" aria-label="Synth keys">
      {PENTATONIC_MIDI.map((midi, i) => {
        const noteName = midiToName(midi);
        const letter = QWERTY_MAP[i].toUpperCase();
        const isHeld = held.has(midi);
        const rotate = (i % 2 === 0 ? -0.4 : 0.3) + (i - 6) * 0.05;
        return (
          <button
            key={midi}
            type="button"
            className={`synth-key${isHeld ? ' is-held' : ''}`}
            aria-label={noteName}
            aria-pressed={isHeld}
            style={{ transform: `rotate(${rotate}deg)` }}
            onPointerDown={(e) => {
              e.preventDefault();
              (e.currentTarget as HTMLButtonElement).setPointerCapture(e.pointerId);
              setHeld((prev) => {
                if (prev.has(midi)) return prev;
                const next = new Set(prev);
                next.add(midi);
                onNoteOn(midi);
                return next;
              });
            }}
            onPointerUp={() => {
              setHeld((prev) => {
                if (!prev.has(midi)) return prev;
                const next = new Set(prev);
                next.delete(midi);
                onNoteOff(midi);
                return next;
              });
            }}
            onPointerCancel={() => {
              setHeld((prev) => {
                if (!prev.has(midi)) return prev;
                const next = new Set(prev);
                next.delete(midi);
                onNoteOff(midi);
                return next;
              });
            }}
            onPointerLeave={(e) => {
              if (e.buttons === 0) return;
              setHeld((prev) => {
                if (!prev.has(midi)) return prev;
                const next = new Set(prev);
                next.delete(midi);
                onNoteOff(midi);
                return next;
              });
            }}
          >
            <span className="synth-key__note">{noteName}</span>
            <span className="synth-key__letter">{letter}</span>
          </button>
        );
      })}
    </div>
  );
}
