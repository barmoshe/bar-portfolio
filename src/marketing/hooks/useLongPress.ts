import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Long-press confirm with rAF-driven progress. Touch-first: a tap that
 * is held for `ms` (default 600) fires `onConfirm`; a shorter release,
 * a finger drag past `cancelDistance`, or `onPointerCancel` aborts.
 *
 * Keyboard accessibility floor: Enter on the focused element fires
 * `onConfirm` immediately - keyboard users never have to hold.
 *
 * Reduced-motion: fires on simple click (no ring draw, no hold).
 *
 * Why 600ms: above Android's 500ms native long-press threshold so we
 * don't fight system gestures, below the 1000ms accessibility "Medium"
 * ceiling for hold-to-act controls.
 */
export type UseLongPressOptions = {
  ms?: number;
  cancelDistance?: number;
  onConfirm: () => void;
  onCancel?: () => void;
};

export type UseLongPressBindings = {
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerUp: (e: React.PointerEvent) => void;
  onPointerLeave: (e: React.PointerEvent) => void;
  onPointerCancel: (e: React.PointerEvent) => void;
  onPointerMove: (e: React.PointerEvent) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onClick: (e: React.MouseEvent) => void;
};

export type UseLongPressResult = {
  bind: UseLongPressBindings;
  progress: number;
  holding: boolean;
};

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function useLongPress({
  ms = 600,
  cancelDistance = 8,
  onConfirm,
  onCancel,
}: UseLongPressOptions): UseLongPressResult {
  const [progress, setProgress] = useState(0);
  const [holding, setHolding] = useState(false);

  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);
  const startPosRef = useRef<{ x: number; y: number } | null>(null);
  const confirmedRef = useRef<boolean>(false);
  // Keep handlers stable while letting the consumer pass fresh callbacks.
  const onConfirmRef = useRef(onConfirm);
  const onCancelRef = useRef(onCancel);
  useEffect(() => { onConfirmRef.current = onConfirm; }, [onConfirm]);
  useEffect(() => { onCancelRef.current = onCancel; }, [onCancel]);

  const cleanup = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    startPosRef.current = null;
    setHolding(false);
    setProgress(0);
  }, []);

  useEffect(() => cleanup, [cleanup]);

  const tick = useCallback(() => {
    const elapsed = performance.now() - startRef.current;
    const p = Math.min(1, elapsed / ms);
    setProgress(p);
    if (p >= 1) {
      if (!confirmedRef.current) {
        confirmedRef.current = true;
        onConfirmRef.current();
      }
      cleanup();
      return;
    }
    rafRef.current = requestAnimationFrame(tick);
  }, [ms, cleanup]);

  const start = useCallback(
    (x: number, y: number) => {
      confirmedRef.current = false;
      startRef.current = performance.now();
      startPosRef.current = { x, y };
      setHolding(true);
      setProgress(0);
      rafRef.current = requestAnimationFrame(tick);
    },
    [tick],
  );

  const abort = useCallback(() => {
    if (!holding) return;
    cleanup();
    onCancelRef.current?.();
  }, [holding, cleanup]);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      // Only react to primary button / touch / pen - ignore right-click etc.
      if (e.button !== undefined && e.button !== 0) return;
      if (prefersReducedMotion()) return;
      e.currentTarget.setPointerCapture?.(e.pointerId);
      start(e.clientX, e.clientY);
    },
    [start],
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (prefersReducedMotion()) return;
      if (!holding) return;
      // Released before the threshold = cancel.
      if (!confirmedRef.current) abort();
      e.currentTarget.releasePointerCapture?.(e.pointerId);
    },
    [holding, abort],
  );

  const onPointerLeave = useCallback(() => {
    if (holding && !confirmedRef.current) abort();
  }, [holding, abort]);

  const onPointerCancel = useCallback(() => {
    if (holding && !confirmedRef.current) abort();
  }, [holding, abort]);

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!holding || !startPosRef.current) return;
      const dx = e.clientX - startPosRef.current.x;
      const dy = e.clientY - startPosRef.current.y;
      if (Math.hypot(dx, dy) > cancelDistance) abort();
    },
    [holding, cancelDistance, abort],
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Keyboard accessibility: Enter or Space fires immediately, no hold.
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onConfirmRef.current();
      }
    },
    [],
  );

  const onClick = useCallback(
    (e: React.MouseEvent) => {
      // Reduced-motion or non-pointer environments fire on plain click.
      if (prefersReducedMotion()) {
        e.preventDefault();
        onConfirmRef.current();
      }
    },
    [],
  );

  return {
    bind: {
      onPointerDown,
      onPointerUp,
      onPointerLeave,
      onPointerCancel,
      onPointerMove,
      onKeyDown,
      onClick,
    },
    progress,
    holding,
  };
}
