import React from 'react';

export default function A11yTestPage() {
  return (
    <main style={{ maxWidth: '760px', margin: '2rem auto', padding: '0 1rem' }}>
      <h1>Accessibility Lint Test Page</h1>
      <p>
        This page is intentionally simple. The accessibility checks come from ESLint (`jsx-a11y`) and run when you use
        <code> npm run lint</code>.
      </p>

      <section aria-labelledby="good-example-title" style={{ marginTop: '1.5rem' }}>
        <h2 id="good-example-title">Good example</h2>
        <label htmlFor="email">Email address</label>
        <input id="email" type="email" name="email" autoComplete="email" />
      </section>

      <section aria-labelledby="how-to-test-title" style={{ marginTop: '1.5rem' }}>
        <h2 id="how-to-test-title">How to test jsx-a11y rules</h2>
        <ol>
          <li>Open this file.</li>
          <li>
            Temporarily add an image without alt text, for example: <code>{'<img src="/next.svg" />'}</code>
          </li>
          <li>Run `npm run lint` and you should see an accessibility error.</li>
          <li>
            Add <code>alt=&quot;...&quot;</code> and run lint again to confirm the error is gone.
          </li>
        </ol>
      </section>
    </main>
  );
}
