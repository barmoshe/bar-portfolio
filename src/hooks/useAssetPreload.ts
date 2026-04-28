import { useEffect, useState } from 'react';

// Module-level "already kicked off" set so that:
//   1) React StrictMode's double-invocation of the effect doesn't fire two
//      parallel fetches per URL.
//   2) A second component using the same URL (or a remount on the same page)
//      can short-circuit immediately.
// We only de-dupe the *initiation* of work; per-mount progress state still
// uses fresh closures so setLoaded fires for whichever pass is alive.
const startedUrls = new Set<string>();

function preloadOne(url: string, onDone: () => void) {
  // <link rel="preload" as="image"> tells the browser this is a real
  // resource (high priority, treated as a Hint) rather than a JS-triggered
  // background fetch like new Image() - it's the canonical "warm the cache
  // before the actual <img> mounts" mechanism.
  if (!startedUrls.has(url)) {
    startedUrls.add(url);
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  }
  // Image() in parallel just to track progress. The browser cache dedupes
  // this against the <link rel="preload"> request, so it's free.
  const img = new Image();
  img.onload = onDone;
  img.onerror = onDone;
  img.src = url;
}

// Returns { loaded, total, done } so a UI can render progress. Errors count
// as "done" so a single missing asset can't pin the bar at 14/15.
export function useAssetPreload(urls: string[]) {
  const [loaded, setLoaded] = useState(0);
  const total = urls.length;

  useEffect(() => {
    if (!urls.length) {
      setLoaded(0);
      return;
    }
    let cancelled = false;
    let count = 0;
    setLoaded(0);
    urls.forEach((u) => {
      preloadOne(u, () => {
        if (cancelled) return;
        count += 1;
        setLoaded(count);
      });
    });
    return () => {
      cancelled = true;
    };
  }, [urls]);

  return { loaded, total, done: total > 0 ? loaded >= total : true };
}
