#!/bin/bash

set -euo pipefail

staged_files=()
while IFS= read -r -d '' file; do
  staged_files+=("$file")
done < <(git diff --cached --name-only -z --diff-filter=ACMR)

if [ "${#staged_files[@]}" -eq 0 ]; then
  echo "No staged files to check."
  exit 0
fi

staged_files_text=$(printf '%s\n' "${staged_files[@]}")
staged_diff=$(git diff --cached --unified=0 --no-color --diff-filter=ACMR)

secret_check=$(STAGED_FILES="$staged_files_text" STAGED_DIFF="$staged_diff" node <<'NODE'
const files = (process.env.STAGED_FILES || '').split('\n').map((value) => value.trim()).filter(Boolean);
const diff = process.env.STAGED_DIFF || '';

const blockedFilePattern = /(^|\/)\.env(?![^/]*\.(example|sample|template)$)[^/]*$/i;
const blockedFiles = files.filter((file) => blockedFilePattern.test(file));

const secretPatterns = [
  { label: 'OpenAI key', regex: /sk-[A-Za-z0-9_-]{20,}/ },
  { label: 'AWS access key', regex: /AKIA[0-9A-Z]{16}/ },
  { label: 'GitHub token', regex: /\bgh[pousr]_[A-Za-z0-9]{20,}\b/ },
  { label: 'Stripe live secret', regex: /\bsk_live_[A-Za-z0-9]{16,}\b/ },
  { label: 'Private key block', regex: /-----BEGIN [A-Z ]*PRIVATE KEY-----/ },
  {
    label: 'Credential assignment',
    regex:
      /\b(api[_-]?key|secret|token|password|passwd|client[_-]?secret|access[_-]?token|refresh[_-]?token)\b\s*[:=]\s*["'][^"']{8,}["']/i,
  },
];

const matches = [];
for (const line of diff.split('\n')) {
  if (!line.startsWith('+') || line.startsWith('+++')) {
    continue;
  }

  for (const pattern of secretPatterns) {
    if (pattern.regex.test(line)) {
      matches.push(`${pattern.label}: ${line.slice(1).trim()}`);
      break;
    }
  }
}

if (blockedFiles.length === 0 && matches.length === 0) {
  process.stdout.write(JSON.stringify({ ok: true }));
  process.exit(0);
}

const details = [];
if (blockedFiles.length > 0) {
  details.push(`Blocked staged env files: ${blockedFiles.join(', ')}`);
}

if (matches.length > 0) {
  details.push(`Suspicious added lines:\n${matches.slice(0, 5).join('\n')}`);
}

process.stdout.write(
  JSON.stringify({
    ok: false,
    message:
      'Potential secret leak detected in staged changes. Remove the secret, move it to environment variables, or unstage the file before committing.',
    details: details.join('\n\n'),
  }),
);
NODE
)

if [[ $(printf '%s' "$secret_check" | node -e "let data='';process.stdin.on('data',(chunk)=>data+=chunk);process.stdin.on('end',()=>{const parsed=JSON.parse(data || '{}');process.stdout.write(String(parsed.ok === true));});") != "true" ]]; then
  echo
  echo "Secret check failed."
  printf '%s' "$secret_check" | node -e "let data='';process.stdin.on('data',(chunk)=>data+=chunk);process.stdin.on('end',()=>{const parsed=JSON.parse(data || '{}');if(parsed.message) console.log(parsed.message);if(parsed.details) console.log('\n' + parsed.details);});"
  exit 1
fi

echo
echo "Running Prettier on staged files..."
npx prettier --check --ignore-unknown "${staged_files[@]}"

lintable_files=()
for file in "${staged_files[@]}"; do
  case "$file" in
    *.js|*.jsx|*.ts|*.tsx|*.mjs|*.cjs)
      lintable_files+=("$file")
      ;;
  esac
done

if [ "${#lintable_files[@]}" -gt 0 ]; then
  echo
  echo "Running ESLint on staged files..."
  npx eslint --max-warnings=0 "${lintable_files[@]}"
else
  echo
  echo "No staged JS/TS files to lint."
fi

echo
echo "Pre-commit checks passed."
