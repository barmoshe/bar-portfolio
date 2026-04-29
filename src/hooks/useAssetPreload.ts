import { useEffect, useState } from 'react';

// Module-level "already kicked off" set so that:
//   1) React StrictMode's double-invocation of the effect doesn't fire two
//      parallel fetches per URL.
//   2) A second component using the same URL (or a remount on the same page)
//      can short-circuit immediately.
// We only de-dupe the *initiation* of work; per-mount progress state still
// uses fresh closures so setLoaded fires for whichever pass is alive.
const startedUrls = new Set<string>();

type Priority = 'high' | 'low' | 'auto';

// Mirror the Priority Hint on the JS Image() instance so the browser
// doesn't downgrade what the <link> tag boosted. fetchPriority is in the
// HTML spec and shipped in all evergreen browsers, but feature-detect for
// safety on older runtimes.
function setPriority(img: HTMLImageElement, p: Priority) {
  if ('fetchPriority' in img) {
    (img as HTMLImageElement & { fetchPriority: Priority }).fetchPriority = p;
  }
}

// Resolve only when the image is *paintable*. onload fires when bytes have
// arrived; a paint at that moment can still flash a half-decoded frame.
// img.decode() is the right gate for "the slide will not flicker when the
// cover dismisses". Falls back to onload on browsers that lack decode().
function whenPaintable(img: HTMLImageElement): Promise<void> {
  if (typeof img.decode === 'function') {
    return img.decode().catch(() => undefined);
  }
  return new Promise((resolve) => {
    if (img.complete) {
      resolve();
      return;
    }
    img.onload = () => resolve();
    img.onerror = () => resolve();
  });
}

function preloadCritical(url: string, onReady: () => void) {
  // <link rel=preload> + fetchpriority=high is the canonical pair for the
  // single most important image on the page. The browser treats this as a
  // hard hint and slots the request above default-priority traffic.
  if (!startedUrls.has(url)) {
    startedUrls.add(url);
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    link.setAttribute('fetchpriority', 'high');
    document.head.appendChild(link);
  }
  // Image() in parallel just to track progress + decode. Cache-deduped
  // against the <link>, so it's free.
  const img = new Image();
  setPriority(img, 'high');
  img.src = url;
  whenPaintable(img).then(onReady);
}

function preloadBackground(url: string, onDone: () => void) {
  // No <link>: the cover only needs the visible slide ready to dismiss.
  // Adding 19 default-priority preload links would crowd the high-priority
  // slot and is exactly the bug we're fixing. A plain Image() at low
  // fetchPriority warms the cache for the carousel without competing.
  startedUrls.add(url);
  const img = new Image();
  setPriority(img, 'low');
  img.onload = onDone;
  img.onerror = onDone;
  img.src = url;
}

// Returns:
//   loaded / total  - aggregate counter for a progress UI
//   done            - all URLs finished (success or error)
//   ready           - the *first* URL is paintable; gate user-facing
//                     unblock (e.g. cover Enter button) on this, not on
//                     done/percent. Treats urls[0] as the critical asset.
//
// Errors count as "done" / "ready" so a single missing asset can't pin the
// cover open at 14/15 or block the user behind a broken slide.
export function useAssetPreload(urls: string[]) {
  const [loaded, setLoaded] = useState(0);
  const [ready, setReady] = useState(false);
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

    const tick = () => {
      if (cancelled) return;
      count += 1;
      setLoaded(count);
    };

    const [critical, ...rest] = urls;
    preloadCritical(critical!, () => {
      if (cancelled) return;
      setReady(true);
      tick();
    });
    rest.forEach((u) => preloadBackground(u, tick));

    return () => {
      cancelled = true;
    };
  }, [urls]);

  return {
    loaded,
    total,
    done: total > 0 ? loaded >= total : true,
    ready: total > 0 ? ready : true,
  };
}
