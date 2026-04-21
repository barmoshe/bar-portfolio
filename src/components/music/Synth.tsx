import { useCallback, useEffect, useRef, useState } from 'react';
import {
  createSynth,
  PENTATONIC_MIDI,
  type Synth as SynthApi,
  type Waveform,
} from '../../lib/audio';
import { gsap, useGSAP, FULL_MOTION_QUERY } from '../../lib/gsap';
import { attachInkBleed } from '../../lib/inkBleed';
import Keys from './Keys';
import Knob from './Knob';
import Scope from './Scope';
import Ripples, { type RipplesHandle } from './Ripples';
import Record from './Record';

/** Signature motif — a quiet 4-note pentatonic phrase played on wake. */
const MOTIF: ReadonlyArray<{ midi: number; at: number; dur: number }> = [
  { midi: PENTATONIC_MIDI[5], at: 0.0, dur: 0.35 }, // A4
  { midi: PENTATONIC_MIDI[7], at: 0.45, dur: 0.35 }, // D5
  { midi: PENTATONIC_MIDI[6], at: 0.9, dur: 0.35 }, // C5
  { midi: PENTATONIC_MIDI[4], at: 1.35, dur: 0.9 }, // G4
];

const IDLE_DELAY_MS = 12000;
const WAVEFORMS: readonly Waveform[] = ['sine', 'triangle', 'square', 'sawtooth'];

export default function Synth() {
  const [awake, setAwake] = useState(false);
  const synthRef = useRef<SynthApi | null>(null);
  const ripplesRef = useRef<RipplesHandle>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const motifTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idleMotifRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearMotif = () => {
    motifTimers.current.forEach(clearTimeout);
    motifTimers.current = [];
  };

  useEffect(() => {
    return () => {
      clearMotif();
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (idleMotifRef.current) clearTimeout(idleMotifRef.current);
      synthRef.current?.destroy();
      synthRef.current = null;
    };
  }, []);

  const scheduleMotif = useCallback((opts?: { gain?: number }) => {
    const synth = synthRef.current;
    if (!synth) return;
    clearMotif();
    const gain = opts?.gain ?? 1;
    MOTIF.forEach(({ midi, at, dur }) => {
      motifTimers.current.push(
        setTimeout(() => synth.noteOn(midi, { velocity: gain }), at * 1000),
      );
      motifTimers.current.push(
        setTimeout(() => synth.noteOff(midi), (at + dur) * 1000),
      );
    });
  }, []);

  const scheduleIdle = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (idleMotifRef.current) clearTimeout(idleMotifRef.current);
    idleTimerRef.current = setTimeout(() => {
      scheduleMotif({ gain: 0.45 });
      // Re-arm so the motif loops every ~IDLE_DELAY_MS until the next input.
      idleMotifRef.current = setTimeout(scheduleIdle, IDLE_DELAY_MS);
    }, IDLE_DELAY_MS);
  }, [scheduleMotif]);

  const cancelIdle = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (idleMotifRef.current) clearTimeout(idleMotifRef.current);
    idleTimerRef.current = null;
    idleMotifRef.current = null;
  }, []);

  const wake = useCallback(() => {
    if (awake) return;
    const synth = createSynth();
    synthRef.current = synth;
    setAwake(true);
    scheduleMotif();
    // Start idle watcher once the motif has finished playing.
    setTimeout(scheduleIdle, 3000);
  }, [awake, scheduleMotif, scheduleIdle]);

  const handleWakeKey = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      wake();
    }
  };

  const onNoteOn = useCallback(
    (midi: number) => {
      const synth = synthRef.current;
      if (!synth) return;
      clearMotif();
      cancelIdle();
      synth.noteOn(midi);
      const idx = PENTATONIC_MIDI.indexOf(midi);
      if (idx >= 0) {
        const pct = ((idx + 0.5) / PENTATONIC_MIDI.length) * 100;
        ripplesRef.current?.spawn(midi, pct);
      }
      scheduleIdle();
    },
    [cancelIdle, scheduleIdle],
  );
  const onNoteOff = useCallback((midi: number) => {
    synthRef.current?.noteOff(midi);
  }, []);

  const handleCutoff = useCallback((v: number) => {
    synthRef.current?.setCutoff(v);
  }, []);
  const handleWave = useCallback((v: number) => {
    synthRef.current?.setWave(WAVEFORMS[Math.max(0, Math.min(3, Math.round(v)))]);
  }, []);
  const getAnalyser = useCallback(() => synthRef.current?.getAnalyser() ?? null, []);

  // Ink-bleed + fade on the wake overlay. Only runs while the overlay is mounted.
  useGSAP(
    () => {
      if (awake) return;
      const root = rootRef.current;
      if (!root) return;
      const label = root.querySelector<HTMLElement>('.synth-wake__label');

      const mm = gsap.matchMedia();
      mm.add(FULL_MOTION_QUERY, () => {
        let cleanupBleed: (() => void) | null = null;
        if (label) {
          cleanupBleed = attachInkBleed(label, 'music', {
            from: 18,
            trigger: label,
            start: 'top 90%',
          });
        }
        return () => {
          cleanupBleed?.();
        };
      });

      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [awake] },
  );

  return (
    <div className="synth" data-awake={awake || undefined} ref={rootRef}>
      {!awake && (
        <button
          type="button"
          className="synth-wake"
          onClick={wake}
          onKeyDown={handleWakeKey}
          aria-label="Wake the instrument"
        >
          <span className="synth-wake__label">tap to wake</span>
          <span className="synth-wake__hint">A–K plays notes</span>
        </button>
      )}

      <div className="synth-controls" aria-hidden={!awake}>
        <Knob
          label="cutoff"
          min={120}
          max={8000}
          step={1}
          defaultValue={1200}
          log
          valueText={(v) => `${Math.round(v)} Hz`}
          onChange={handleCutoff}
          disabled={!awake}
        />
        <Scope getAnalyser={getAnalyser} active={awake} />
        <Knob
          label="wave"
          min={0}
          max={3}
          step={1}
          defaultValue={0}
          stepped
          valueText={(v) => WAVEFORMS[Math.round(v)].replace('sawtooth', 'saw')}
          onChange={handleWave}
          disabled={!awake}
        />
      </div>

      <Keys onNoteOn={onNoteOn} onNoteOff={onNoteOff} active={awake} />
      <Ripples ref={ripplesRef} />

      <Record getSynth={() => synthRef.current} disabled={!awake} />
    </div>
  );
}
