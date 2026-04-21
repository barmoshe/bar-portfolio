import { useEffect, useRef, useState } from 'react';

// Kicks off an Image() fetch for each URL the moment the component mounts so
// the browser cache is warm by the time real <img> tags render later. Treats
// errors as "done" so a single missing asset can't leave the UI pinned to a
// 4/5 progress bar.
export function useAssetPreload(urls: string[]) {
  const [loaded, setLoaded] = useState(0);
  const total = urls.length;
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    if (!urls.length) return;

    let cancelled = false;
    let count = 0;
    urls.forEach((u) => {
      const img = new Image();
      const finish = () => {
        if (cancelled) return;
        count += 1;
        setLoaded(count);
      };
      img.onload = finish;
      img.onerror = finish;
      img.src = u;
    });
    return () => {
      cancelled = true;
    };
  }, [urls]);

  return { loaded, total, done: total > 0 ? loaded >= total : true };
}
