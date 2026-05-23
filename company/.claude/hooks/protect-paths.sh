#!/usr/bin/env bash
# PreToolUse(Edit|Write) guardrail — the deterministic half of scope-based
# autonomy. Blocks edits to immutable / sensitive business-scope paths.
# Exit 2 = block; stderr is shown to Claude.
set -euo pipefail

path="$(python3 -c 'import sys,json; print(json.load(sys.stdin).get("tool_input",{}).get("file_path",""))' 2>/dev/null || true)"

block() {
  echo "BLOCKED by protect-paths: $path" >&2
  echo "Reason: $1. This is a business-scope hard stop — confirm with the operator first." >&2
  exit 2
}

# strip leading absolute prefix so matching works on relative segments too
rel="${path#"$PWD"/}"

case "$rel" in
  archive/*|*/archive/*)            block "archive/ is immutable (frozen at handover)" ;;
  *.env|*.env.*|*.key|*.pem)        block "secret/credential file" ;;
  *secret*|*credentials*)           block "secret/credential file" ;;
  *contract*)                       block "contract file (money/legal scope)" ;;
esac

exit 0
