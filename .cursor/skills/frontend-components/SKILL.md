# React Skills Cheat Sheet (TypeScript + Next.js)

---

# Skill: Create React Component (TypeScript)

## Goal

Create a typed, reusable React component.

## Rules

- Use function component
- Use named export
- Type props explicitly
- Keep component small and focused

## Example

```ts
type Props = {
  title: string
}

export function Header({ title }: Props) {
  return <h1>{title}</h1>
}
```

---

# Skill: Decide Server vs Client Component

## Goal

Choose correct component type in Next.js App Router.

## Use Server Component when:

- Fetching data
- Rendering static or async content
- No interactivity needed

## Use Client Component when:

- Using state (`useState`)
- Using effects (`useEffect`)
- Handling events (`onClick`, `onChange`)
- Using browser APIs

## Rule

Default to Server → opt into Client only when required

## Example

```ts
// Server Component
export default async function Page() {
  const data = await fetchData()
  return <div>{data}</div>
}
```

---

# Skill: Extract Custom Hook

## Goal

Move reusable logic out of components.

## When to extract

- Logic reused in multiple components
- Component becomes too large
- Business logic mixed with UI

## Example

```ts
import { useState } from 'react';

function useCounter() {
  const [count, setCount] = useState(0);

  const increment = () => setCount((c) => c + 1);

  return { count, increment };
}
```

---

# Skill: Optimize React Component

## Goal

Prevent unnecessary re-renders and reduce bundle size.

## Techniques

- Memoize expensive calculations (`useMemo`)
- Stabilize callbacks (`useCallback`)
- Split large components
- Use dynamic imports for heavy UI

## Example

```ts
import { useMemo } from 'react';

const value = useMemo(() => computeExpensive(data), [data]);
```

---
