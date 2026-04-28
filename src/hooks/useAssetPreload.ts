import { useEffect, useState } from 'react';

// Module-level dedup so React StrictMode's double effect-invocation doesn't
// fire two parallel fetches per URL.
const started = new Set<string>();

function fetchOne(url: string, eager: boolean, onDone: () => void) {
  // <link rel="preload"> only for the eager (first) URL. It's a strong
  // priority hint; firing it for 20+ portraits would have them fight the
  // visible slide for bandwidth. Non-eager fetches use plain Image() at the
  // browser's default priority.
  if (eager && !started.has(url)) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  }
  started.add(url);
  const img = new Image();
  img.onload = img.onerror = onDone;
  img.src = url;
}

// Preload an ordered list of image URLs. The first URL is critical (eager
// preload hint + gates `ready`); the rest warm in the background. Errors
// count as "done" so a missing asset can't pin progress.
export function useAssetPreload(urls: string[]) {
  const [loaded, setLoaded] = useState(0);
  const [ready, setReady] = useState(urls.length === 0);
  const total = urls.length;

  useEffect(() => {
    if (!urls.length) {
      setLoaded(0);
      setReady(true);
      return;
    }
    let cancelled = false;
    let count = 0;
    setLoaded(0);
    setReady(false);
    urls.forEach((u, i) => {
      fetchOne(u, i === 0, () => {
        if (cancelled) return;
        count += 1;
        setLoaded(count);
        if (i === 0) setReady(true);
      });
    });
    return () => {
      cancelled = true;
    };
  }, [urls]);

  return { loaded, total, ready, done: total > 0 ? loaded >= total : true };
}
