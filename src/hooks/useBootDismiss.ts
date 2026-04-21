import { useEffect } from 'react';

export function useBootDismiss(active: boolean, onDismiss: () => void): void {
  useEffect(() => {
    if (!active) return;
    const onKey = () => onDismiss();
    const onPointer = (e: PointerEvent) => {
      const target = e.target as Element | null;
      if (target?.closest('.strip') || target?.closest('.toggle')) return;
      onDismiss();
    };
    addEventListener('keydown', onKey);
    addEventListener('pointerdown', onPointer);
    return () => {
      removeEventListener('keydown', onKey);
      removeEventListener('pointerdown', onPointer);
    };
  }, [active, onDismiss]);
}
