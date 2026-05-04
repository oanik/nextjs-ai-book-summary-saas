#!/bin/bash
set -euo pipefail

input="$(cat)"

# Parse JSON without jq dependency.
path="$(python3 -c 'import json,sys; d=json.load(sys.stdin); print(d.get("path") or d.get("file_path") or d.get("filePath") or d.get("target_file") or "")' <<< "$input")"

if [[ -n "$path" && "$path" =~ (^|/)\.env($|\.) ]]; then
  echo '{
    "permission": "deny",
    "user_message": "Reading .env files is blocked by project security hook.",
    "agent_message": "Denied read access to environment file."
  }'
  exit 0
fi

echo '{ "permission": "allow" }'
