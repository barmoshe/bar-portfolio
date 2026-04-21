import { useCallback, useState } from 'react';

export type SourceRect = {
  left: number;
  top: number;
  width: number;
  height: number;
} | null;

export function useLightbox() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [sourceRect, setSourceRect] = useState<SourceRect>(null);

  const open = useCallback((idx: number, rect?: SourceRect) => {
    setSourceRect(rect ?? null);
    setOpenIdx(idx);
  }, []);
  const close = useCallback(() => setOpenIdx(null), []);

  return { openIdx, sourceRect, open, close };
}
