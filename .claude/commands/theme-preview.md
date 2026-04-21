---
description: Start the dev server and open the design showcase route.
---

# /theme-preview

Starts the Vite dev server and points the user at the live design showcase so they can iterate on tokens with hot-reload.

## Steps

1. Check `package.json` for the `dev` script (should be `vite`).
2. Start the dev server in the background:
   ```bash
   npm run dev
   ```
3. Tell the user:
   - React showcase (live tokens via `getComputedStyle`): `http://localhost:5173/#showcase`
   - Standalone artifact (mirrored tokens): `http://localhost:5173/showcase.html`
4. Remind them: the React showcase hot-reloads on edits to `src/styles.css`; the standalone HTML does not — edit it in parallel if palette changes need to land in both.

## Stopping

The background process keeps running until the user explicitly stops it. If they want it down, suggest killing the Vite process or restarting the shell.

## Invariants

- Vite dev does not respect the `base: '/bar-portfolio/'` prefix, but Vite preview (`npm run preview`, port 4173) does. For a preview-parity check against prod, use `npm run preview` and hit `http://localhost:4173/bar-portfolio/#showcase`.
