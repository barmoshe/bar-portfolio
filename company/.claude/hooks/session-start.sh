#!/usr/bin/env bash
# SessionStart briefing. stdout is injected into Claude's context. Keep it fast
# and adaptive: branch + status, the cwd's STATUS.md, and recent decisions.
set -euo pipefail

echo "## Workshop briefing"

branch="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo '(no git)')"
echo "- branch: ${branch}"

dirty="$(git status --porcelain 2>/dev/null | head -n 5 || true)"
if [ -n "$dirty" ]; then
  echo "- uncommitted changes:"
  echo "$dirty" | sed 's/^/    /'
fi

if [ -f STATUS.md ]; then
  echo
  echo "### STATUS.md (current dir)"
  sed 's/^/  /' STATUS.md
fi

# repo-root decisions/ — show the most recent few
dir="decisions"
[ -d "$dir" ] || dir="$(git rev-parse --show-toplevel 2>/dev/null)/decisions"
if [ -d "$dir" ]; then
  echo
  echo "### recent decisions"
  ls -1 "$dir" 2>/dev/null | grep -E '\.md$' | sort | tail -n 5 | sed 's/^/  - /'
fi

exit 0
