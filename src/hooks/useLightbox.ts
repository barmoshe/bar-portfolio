import { useCallback, useState } from 'react';

export function useLightbox() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const open = useCallback((idx: number) => setOpenIdx(idx), []);
  const close = useCallback(() => setOpenIdx(null), []);
  return { openIdx, open, close };
}
