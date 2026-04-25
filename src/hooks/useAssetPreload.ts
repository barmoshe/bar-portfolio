import { useEffect, useState } from 'react';

// Kicks off an Image() fetch for each URL the moment the component mounts so
// the browser cache is warm by the time real <img> tags render later. Treats
// errors as "done" so a single missing asset can't leave the UI pinned to a
// 4/5 progress bar.
//
// No "started once" ref guard: under React StrictMode the effect runs, the
// cleanup flips its `cancelled` flag, then the effect runs again. A ref guard
// prevented the second pass from binding callbacks, so the first pass's
// cancelled closure swallowed every onload and `loaded` was stuck at 0. The
// browser dedupes the duplicate Image() requests via its HTTP cache anyway.
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
