#!/bin/bash
set -euo pipefail

input="$(cat)"

# Shell hook payload exposes the command field.
command="$(python3 -c 'import json,sys; d=json.load(sys.stdin); print(d.get("command") or "")' <<< "$input")"
normalized=" $command "

# Block shell-level reads/searches against .env files.
if [[ "$normalized" =~ [[:space:]](rg|grep|cat|less|more|awk|sed|head|tail)[[:space:]] ]] && [[ "$normalized" =~ (^|[[:space:]/])\.env([.[:alnum:]_-]*)([[:space:]]|$) ]]; then
  echo '{
    "permission": "deny",
    "user_message": "Shell access to .env files is blocked by project security hook.",
    "agent_message": "Denied shell command that attempts to read/search an environment file."
  }'
  exit 0
fi

echo '{ "permission": "allow" }'
