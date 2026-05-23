#!/usr/bin/env bash
# PreToolUse(Bash) guardrail. Blocks destructive shell regardless of how it's
# composed (pipes, &&, ;). Exit 2 = block; stderr is shown to Claude.
set -euo pipefail

cmd="$(python3 -c 'import sys,json; print(json.load(sys.stdin).get("tool_input",{}).get("command",""))' 2>/dev/null || true)"

block() {
  echo "BLOCKED by git-safe: $1" >&2
  echo "This is a business-scope hard stop. Confirm with the operator before retrying." >&2
  exit 2
}

# normalize whitespace for matching
norm="$(printf '%s' "$cmd" | tr -s '[:space:]' ' ')"

case "$norm" in
  *"git push --force"*|*"git push -f"*|*"push --force-with-lease"*) block "force push" ;;
  *"git reset --hard"*)                                             block "git reset --hard" ;;
  *"git checkout ."*|*"git checkout -- ."*)                         block "git checkout . (discards changes)" ;;
  *"git clean -f"*|*"git clean -df"*|*"git clean -fd"*)             block "git clean -f" ;;
  *"rm -rf"*|*"rm -fr"*)                                            block "rm -rf" ;;
  *"sudo "*)                                                        block "sudo" ;;
  *"chmod -R 777"*)                                                 block "chmod -R 777" ;;
  *"curl "*"| bash"*|*"curl "*"|bash"*|*"wget "*"| sh"*)            block "curl | bash" ;;
  *"git branch -D"*)                                                block "git branch -D (force delete)" ;;
esac

exit 0
