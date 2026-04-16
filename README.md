# Next Project Test

Small learning project built with `Next.js 16` and the App Router. The codebase currently mixes `TypeScript` and `JavaScript` route files and demonstrates both server-rendered and client-interactive pages.

## Stack

- `Next.js 16`
- `React 19`
- `TypeScript 5`
- `ESLint 9`
- `Prettier 3`
- `Tailwind CSS 4` installed

## Project Structure

- `src/app` contains App Router pages and route-local components.
- `src/app/api/page.tsx` shows a server-rendered page with data fetching.
- `src/app/api/ProductListClient.tsx` shows a colocated client component for interactivity.
- `src/app/about` contains an example of route-local CSS Modules.
- `public` stores static assets such as images.

## Development

Start the local dev server:

```bash
npm run dev
```

Build the project:

```bash
npm run build
```

Run linting:

```bash
npm run lint
```

Open [http://localhost:3000](http://localhost:3000) in the browser.

## Code Style

- Use single quotes and semicolons.
- Keep trailing commas where valid.
- Use 2 spaces for indentation.
- Keep line length around `120` characters.
- Use double quotes in JSX attributes.
- Let Prettier format files on save.
- Let ESLint auto-fix safe issues on save.

## Conventions

- Prefer Server Components by default in App Router pages.
- Add `'use client';` only when state, effects, or browser-only interactivity are needed.
- Keep reusable interactive UI in small colocated components.
- Use `next/image` for local images.
- Keep styling consistent with the surrounding area: CSS Modules where already used, simple classes where already used.
- Do not perform broad refactors unless there is a specific reason.
- Do not convert `.jsx` files to `.tsx` unless requested.

## Internal Guidance

General project instructions for AI-assisted edits live in `AGENTS.md`.
