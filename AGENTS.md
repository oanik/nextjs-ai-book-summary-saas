# Project Instructions

## Overview
- This is a `Next.js 16` app using the App Router.
- The UI layer is built with `React 19`.
- The project uses a mixed setup: `TypeScript` is present and some routes use `.tsx`, while other routes still use `.jsx`.
- `Tailwind CSS v4` is installed, but the current codebase mainly uses plain JSX, CSS Modules, and existing global classes.

## Main Structure
- Keep application routes under `src/app`.
- Route files should continue to follow Next.js App Router conventions such as `page.tsx` or `page.jsx`.
- Reusable client-side UI for a route can live next to that route, as shown by `src/app/api/ProductListClient.tsx`.
- Route-local styles should stay close to the route, for example `aboutStyle.module.css`.
- Static assets should remain in `public`.

## Technology Notes
- Use Server Components by default in App Router pages.
- Add `'use client';` only when a component needs client-side state, effects, or event handlers.
- Prefer `next/image` for local images.
- For server-side data fetching, use `fetch()` with explicit caching behavior when it matters, for example `cache: 'no-store'`.
- Keep code compatible with the existing Next.js and React versions already defined in `package.json`.

## Code Style
- Follow the existing Prettier configuration:
- Use single quotes.
- Use semicolons.
- Keep trailing commas where valid.
- Always include parentheses around arrow function parameters.
- Use a `printWidth` of `120`.
- Use 2 spaces for indentation and do not use tabs.
- Keep bracket spacing enabled.
- Use double quotes in JSX attributes.

## Formatting And Linting
- Formatting is expected to run automatically on save through Prettier.
- ESLint auto-fixes are also configured to run on save.
- Before finishing meaningful changes, run `npm run lint` when possible.

## Implementation Conventions
- Prefer small, readable components and keep route files focused on page composition.
- When logic is reusable or interactive, extract it into a colocated component instead of overloading the page file.
- Use clear TypeScript types for fetched data and component props in `.tsx` files.
- Do not convert the whole project from `.jsx` to `.tsx` unless explicitly requested.
- Keep naming consistent and descriptive. For React components, prefer PascalCase component names.
- Keep imports tidy and grouped logically. If imports grow, sort them consistently.
- Prefer simple styling choices already used in the project before introducing a new styling pattern.

## Existing Patterns To Respect
- Some pages are intentionally simple and minimal. Do not add abstractions unless they improve clarity.
- The project currently mixes CSS Modules and global class usage; preserve the local pattern already used in each area.
- The `api` route example demonstrates server fetching plus a client component for interactivity. Follow that split when similar behavior is needed.

## When Updating This Project
- Make targeted changes rather than broad refactors.
- Preserve the existing folder layout unless there is a strong reason to restructure.
- Match the surrounding file style first, then improve consistency only where it helps readability.
<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
