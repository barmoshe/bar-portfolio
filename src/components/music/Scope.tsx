import { useEffect, useRef } from 'react';
import { FULL_MOTION_QUERY } from '../../lib/gsap';

interface ScopeProps {
  getAnalyser: () => AnalyserNode | null;
  active: boolean;
}

export default function Scope({ getAnalyser, active }: ScopeProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const strokeRef = useRef<string>('currentColor');

  // Resolve theme-sensitive stroke color at mount + on theme change.
  useEffect(() => {
    const readStroke = () => {
      const cs = getComputedStyle(document.documentElement);
      const tok = document.documentElement.classList.contains('dark')
        ? '--cyan'
        : '--magenta';
      const v = cs.getPropertyValue(tok).trim();
      strokeRef.current = v || 'currentColor';
    };
    readStroke();
    const obs = new MutationObserver(readStroke);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const ctx2d = canvas.getContext('2d');
    const motionOk = window.matchMedia(FULL_MOTION_QUERY).matches;

    const drawStatic = () => {
      if (!ctx2d) return;
      ctx2d.clearRect(0, 0, canvas.width, canvas.height);
      ctx2d.strokeStyle = strokeRef.current;
      ctx2d.lineWidth = 1 * dpr;
      ctx2d.beginPath();
      ctx2d.moveTo(0, canvas.height / 2);
      ctx2d.lineTo(canvas.width, canvas.height / 2);
      ctx2d.stroke();
    };

    if (!active || !motionOk) {
      drawStatic();
      return () => ro.disconnect();
    }

    let buf: Uint8Array<ArrayBuffer> | null = null;
    const draw = () => {
      const analyser = getAnalyser();
      if (!analyser || !ctx2d) {
        drawStatic();
        rafRef.current = requestAnimationFrame(draw);
        return;
      }
      if (!buf || buf.length !== analyser.frequencyBinCount) {
        buf = new Uint8Array(new ArrayBuffer(analyser.frequencyBinCount));
      }
      analyser.getByteTimeDomainData(buf);

      const w = canvas.width;
      const h = canvas.height;
      ctx2d.clearRect(0, 0, w, h);
      ctx2d.strokeStyle = strokeRef.current;
      ctx2d.lineWidth = 1.25 * dpr;
      ctx2d.beginPath();
      const slice = w / buf.length;
      for (let i = 0; i < buf.length; i += 1) {
        const v = buf[i] / 128 - 1; // -1..1
        const y = h / 2 + (v * h) / 2;
        const x = i * slice;
        if (i === 0) ctx2d.moveTo(x, y);
        else ctx2d.lineTo(x, y);
      }
      ctx2d.stroke();

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      ro.disconnect();
    };
  }, [active, getAnalyser]);

  return <canvas className="synth-scope" ref={canvasRef} aria-hidden="true" />;
}
