# Design System Start

This folder contains reusable UI primitives for the BookWise design system.

## First component: `Button`

`Button` is the first shared primitive and supports:

- Variants: `primary`, `secondary`, `ghost`, `danger`
- Sizes: `sm`, `md`, `lg`
- States: `disabled`, `loading`
- Optional icons: `leftIcon`, `rightIcon`
- Layout option: `fullWidth`

## Component conventions

- Keep API typed and predictable.
- Prefer props for visual variants over one-off class overrides.
- Add a Storybook story for every new shared component.
- Start small: primitives first (`Button`, `Input`, `Badge`, `Card`), then compose.

## Suggested next components

1. `Input` (text, error, helper text, disabled)
2. `Textarea`
3. `Select`
4. `Badge`
5. `Card`
