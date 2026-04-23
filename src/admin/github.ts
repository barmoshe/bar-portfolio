/**
 * GitHub Contents API client for the #admin backoffice.
 *
 * - loadDataFile: GET current `portfolio.data.ts` + blob sha (needed to PUT).
 * - saveDataFile: PUT new file content on the main branch; GitHub creates a
 *   commit, the deploy workflow runs, and GitHub Pages picks up the change
 *   in ~60-90s.
 *
 * Auth: user-supplied fine-grained Personal Access Token with `contents:write`
 * scoped to the `barmoshe/bar-portfolio` repo. Stored in localStorage under
 * `portfolio-admin-pat`.
 */

import type { PortfolioData } from '../data/portfolio';
import { parse, serialize } from './serializer';

const OWNER = 'barmoshe';
const REPO = 'bar-portfolio';
const PATH = 'src/data/portfolio.data.ts';
const BRANCH = 'main';

const API = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}`;

/** Response shape from `GET /contents`. */
type ContentsGetResponse = { content: string; sha: string; encoding: 'base64' };

/** Friendly error with a short reason string for the UI. */
export class GitHubError extends Error {
  constructor(public status: number, message: string, public body?: unknown) {
    super(message);
  }
}

function authHeaders(pat: string): HeadersInit {
  return {
    Authorization: `Bearer ${pat}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

/** Decode a GitHub base64 blob (may contain line breaks) to a UTF-8 string. */
function decodeBase64(b64: string): string {
  const clean = b64.replace(/\s+/g, '');
  const binary = atob(clean);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

/** Encode a UTF-8 string to a base64 blob suitable for the contents API. */
function encodeBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

/** Load the current portfolio data + file sha. Throws GitHubError on failure. */
export async function loadDataFile(pat: string): Promise<{ data: PortfolioData; sha: string }> {
  const res = await fetch(`${API}?ref=${BRANCH}`, { headers: authHeaders(pat) });
  if (!res.ok) {
    const body = await res.json().catch(() => undefined);
    throw new GitHubError(res.status, describeLoadError(res.status), body);
  }
  const json = (await res.json()) as ContentsGetResponse;
  if (json.encoding !== 'base64') {
    throw new GitHubError(500, `Unexpected encoding ${json.encoding}`, json);
  }
  const text = decodeBase64(json.content);
  const data = parse(text);
  return { data, sha: json.sha };
}

/** Save new data on `main`. Requires the previous blob sha. Returns the new sha. */
export async function saveDataFile(
  pat: string,
  data: PortfolioData,
  sha: string,
  message: string,
): Promise<{ sha: string; commitUrl: string | null }> {
  const text = serialize(data);
  const body = {
    message,
    content: encodeBase64(text),
    sha,
    branch: BRANCH,
  };
  const res = await fetch(API, {
    method: 'PUT',
    headers: { ...authHeaders(pat), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errBody = await res.json().catch(() => undefined);
    throw new GitHubError(res.status, describeSaveError(res.status), errBody);
  }
  const json = (await res.json()) as {
    content?: { sha?: string };
    commit?: { sha?: string; html_url?: string };
  };
  return {
    sha: json.content?.sha ?? sha,
    commitUrl: json.commit?.html_url ?? null,
  };
}

function describeLoadError(status: number): string {
  if (status === 401) return 'Token invalid or missing contents scope. Re-paste your PAT.';
  if (status === 403) return 'Forbidden. Token may be scoped to other repos or rate-limited.';
  if (status === 404) return 'portfolio.data.ts not found on main. Did the data split land?';
  return `Load failed (HTTP ${status}).`;
}

function describeSaveError(status: number): string {
  if (status === 401) return 'Token invalid or missing contents:write scope.';
  if (status === 403) return 'Forbidden. Ensure the token has contents:write for this repo.';
  if (status === 409 || status === 422)
    return 'Remote changed since load (sha mismatch). Reload and try again.';
  return `Save failed (HTTP ${status}).`;
}
