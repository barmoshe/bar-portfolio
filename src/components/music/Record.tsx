import { useCallback, useEffect, useRef, useState } from 'react';
import type { Synth } from '../../lib/audio';

interface RecordProps {
  getSynth: () => Synth | null;
  disabled?: boolean;
}

const DURATION_MS = 8000;
const MIMES: readonly string[] = [
  'audio/webm;codecs=opus',
  'audio/webm',
  'audio/ogg;codecs=opus',
  'audio/ogg',
];

const pickMime = () => {
  if (typeof window === 'undefined' || typeof MediaRecorder === 'undefined') return null;
  return MIMES.find((m) => MediaRecorder.isTypeSupported(m)) ?? null;
};

const extFromMime = (mime: string) =>
  mime.startsWith('audio/ogg') ? 'ogg' : 'webm';

const filename = (ext: string) => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `synth-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}.${ext}`;
};

type Phase = 'idle' | 'recording' | 'ready' | 'unsupported';

export default function Record({ getSynth, disabled = false }: RecordProps) {
  const [phase, setPhase] = useState<Phase>(() => (pickMime() ? 'idle' : 'unsupported'));
  const [remaining, setRemaining] = useState(0);
  const [href, setHref] = useState<string | null>(null);
  const [ext, setExt] = useState('webm');
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cleanupTimers = () => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    if (stopTimerRef.current) clearTimeout(stopTimerRef.current);
    countdownRef.current = null;
    stopTimerRef.current = null;
  };

  useEffect(() => {
    return () => {
      cleanupTimers();
      if (href) URL.revokeObjectURL(href);
      try {
        recorderRef.current?.stop();
      } catch {
        /* already stopped */
      }
    };
  }, [href]);

  const startRecording = useCallback(() => {
    const synth = getSynth();
    const mime = pickMime();
    if (!synth || !mime) {
      setPhase('unsupported');
      return;
    }
    if (href) {
      URL.revokeObjectURL(href);
      setHref(null);
    }

    const stream = synth.getRecordingStream();
    const rec = new MediaRecorder(stream, { mimeType: mime });
    recorderRef.current = rec;
    chunksRef.current = [];

    rec.addEventListener('dataavailable', (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    });
    rec.addEventListener('stop', () => {
      cleanupTimers();
      const blob = new Blob(chunksRef.current, { type: mime });
      chunksRef.current = [];
      const url = URL.createObjectURL(blob);
      setHref(url);
      setExt(extFromMime(mime));
      setPhase('ready');
    });

    rec.start();
    setPhase('recording');
    setRemaining(Math.ceil(DURATION_MS / 1000));

    countdownRef.current = setInterval(() => {
      setRemaining((r) => Math.max(0, r - 1));
    }, 1000);
    stopTimerRef.current = setTimeout(() => {
      try {
        rec.stop();
      } catch {
        /* already stopped */
      }
    }, DURATION_MS);
  }, [getSynth, href]);

  const reset = () => {
    if (href) URL.revokeObjectURL(href);
    setHref(null);
    setPhase('idle');
  };

  if (phase === 'unsupported') {
    return (
      <p className="synth-record synth-record--off" aria-live="polite">
        recording unavailable in this browser
      </p>
    );
  }

  return (
    <div className="synth-record">
      {phase === 'idle' && (
        <button type="button" onClick={startRecording} disabled={disabled}>
          ● record 8s
        </button>
      )}
      {phase === 'recording' && (
        <button type="button" disabled aria-live="polite">
          recording… {remaining}s
        </button>
      )}
      {phase === 'ready' && href && (
        <>
          <a href={href} download={filename(ext)}>
            ↓ download {ext} clip
          </a>
          <button type="button" onClick={reset} className="synth-record__reset">
            reset
          </button>
        </>
      )}
    </div>
  );
}
