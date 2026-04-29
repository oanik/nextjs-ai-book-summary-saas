'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

const LoginPage = () => {
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsSigningIn(true);
      await signIn('google', { callbackUrl: '/dashboard' });
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/30 md:grid-cols-2">
        <section className="flex flex-col justify-between bg-linear-to-br from-indigo-600 via-blue-600 to-cyan-500 p-8">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/80">BookWise</p>
            <h1 className="mt-6 text-3xl font-semibold leading-tight text-white md:text-4xl">
              Welcome back to your reading dashboard
            </h1>
            <p className="mt-4 max-w-sm text-sm text-blue-100/90">
              Sign in to continue reading summaries, manage your favorites, and track your progress.
            </p>
          </div>

          <p className="mt-8 text-xs text-blue-100/80">Secure authentication powered by Google and NextAuth.</p>
        </section>

        <section className="flex items-center justify-center p-8 md:p-10">
          <div className="w-full max-w-sm">
            <h2 className="text-2xl font-semibold text-white">Sign in</h2>
            <p className="mt-2 text-sm text-slate-400">Use your Google account to access BookWise.</p>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isSigningIn}
              className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm font-medium text-white transition hover:border-slate-500 hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path
                  d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h6.45a5.5 5.5 0 0 1-2.39 3.61v3h3.86c2.26-2.08 3.57-5.14 3.57-8.64Z"
                  fill="#4285F4"
                />
                <path
                  d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.86-3c-1.07.72-2.44 1.15-4.09 1.15-3.15 0-5.82-2.12-6.78-4.98H1.24v3.09A12 12 0 0 0 12 24Z"
                  fill="#34A853"
                />
                <path
                  d="M5.22 14.26A7.2 7.2 0 0 1 4.84 12c0-.79.14-1.55.38-2.26V6.65H1.24A12 12 0 0 0 0 12c0 1.94.46 3.78 1.24 5.35l3.98-3.09Z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 4.77c1.76 0 3.34.61 4.58 1.81l3.43-3.43A11.4 11.4 0 0 0 12 0 12 12 0 0 0 1.24 6.65l3.98 3.09C6.18 6.89 8.85 4.77 12 4.77Z"
                  fill="#EA4335"
                />
              </svg>
              {isSigningIn ? 'Redirecting to Google...' : 'Continue with Google'}
            </button>

            <p className="mt-6 text-xs text-slate-500">By signing in, you agree to our terms and privacy policy.</p>

            <Link href="/" className="mt-6 inline-block text-sm text-indigo-300 transition hover:text-indigo-200">
              Back to home
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
};

export default LoginPage;
