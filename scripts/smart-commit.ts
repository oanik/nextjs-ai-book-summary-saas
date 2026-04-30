#!/usr/bin/env node
/**
 * Smart commit: analyses staged diff with OpenAI and proposes a
 * Conventional Commits message before running `git commit`.
 *
 * Usage:
 *   npm run commit             – commit staged files only
 *   npm run commit -- --all    – stage everything first, then commit
 */

import { execSync, spawnSync } from 'child_process';
import OpenAI from 'openai';
import * as readline from 'readline';

import 'dotenv/config';

const COMMIT_MODEL = process.env.OPENAI_COMMIT_MODEL || 'gpt-4o-mini';
const MAX_DIFF_CHARS = 12_000;

// ──────────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────────

function run(cmd: string): string {
  try {
    return execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  } catch {
    return '';
  }
}

function ask(prompt: string): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function highlight(text: string): string {
  return `\x1b[36m${text}\x1b[0m`;
}

function bold(text: string): string {
  return `\x1b[1m${text}\x1b[0m`;
}

function dim(text: string): string {
  return `\x1b[2m${text}\x1b[0m`;
}

// ──────────────────────────────────────────────────────────────────────────────
// Main
// ──────────────────────────────────────────────────────────────────────────────

async function main() {
  const stageAll = process.argv.includes('--all');

  // Stage everything when requested
  if (stageAll) {
    console.log(dim('Staging all changes…'));
    run('git add -A');
  }

  // Check that there is something staged
  const stagedFiles = run('git diff --cached --name-only --diff-filter=ACMRD');
  if (!stagedFiles) {
    console.error('\n  Nothing staged. Stage your changes first or run with --all.\n');
    process.exit(1);
  }

  const fileList = stagedFiles.split('\n');
  console.log(`\n${bold('Staged files')} (${fileList.length}):`);
  fileList.forEach((f) => console.log(`  ${dim('▸')} ${f}`));

  // Grab the diff (truncated to keep token costs low)
  let diff = run('git diff --cached --unified=3 --no-color --diff-filter=ACMRD');
  if (diff.length > MAX_DIFF_CHARS) {
    diff = diff.slice(0, MAX_DIFF_CHARS) + '\n… (truncated)';
  }

  // Validate OpenAI key
  if (!process.env.OPENAI_API_KEY) {
    console.error('\n  OPENAI_API_KEY is not set. Add it to .env.\n');
    process.exit(1);
  }

  // Generate message
  console.log(`\n${dim('Generating commit message with OpenAI…')}`);

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const systemPrompt = `You are a senior software engineer who writes concise, accurate git commit messages.
Follow the Conventional Commits specification strictly:
  <type>(<optional scope>): <short summary in present tense, ≤72 chars>

  <optional body: bullet points explaining WHY, not WHAT>

Allowed types: feat, fix, docs, style, refactor, test, chore, build, ci, perf, revert.
- Use "feat" for new features, "fix" for bug fixes, "chore" for tooling/config/deps.
- The scope is the affected area (e.g. auth, db, ui, api, middleware, prisma).
- The summary MUST be lowercase and MUST NOT end with a period.
- Only add a body when the change is non-trivial and the body adds real value.
- Output ONLY the commit message, nothing else.`;

  const userPrompt = `Staged files:\n${fileList.join('\n')}\n\nDiff:\n${diff}`;

  let message: string;
  try {
    const response = await openai.chat.completions.create({
      model: COMMIT_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.2,
      max_tokens: 300,
    });
    message = response.choices[0]?.message?.content?.trim() ?? '';
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`\n  OpenAI request failed: ${msg}\n`);
    process.exit(1);
  }

  if (!message) {
    console.error('\n  OpenAI returned an empty message. Aborting.\n');
    process.exit(1);
  }

  // Show the generated message and let the user confirm / edit / abort
  console.log(`\n${bold('Proposed commit message:')}\n`);
  console.log(highlight('  ' + message.split('\n').join('\n  ')));
  console.log();

  const choice = await ask('  [y] commit  [e] edit  [n] abort  > ');

  if (choice === 'n' || choice === '') {
    console.log('\n  Aborted.\n');
    process.exit(0);
  }

  let finalMessage = message;

  if (choice === 'e') {
    const edited = await ask(`  Edit message (or press Enter to keep):\n  > `);
    if (edited) {
      finalMessage = edited;
    }
  }

  // Run git commit
  const result = spawnSync('git', ['commit', '-m', finalMessage], { stdio: 'inherit' });

  if (result.status !== 0) {
    console.error('\n  git commit failed.\n');
    process.exit(result.status ?? 1);
  }

  console.log(`\n${bold('Committed successfully.')}\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
