'use client';

import React from 'react';

interface CategoriesErrorProps {
  error: Error;
  reset: () => void;
}

export default function CategoriesError({ error, reset }: CategoriesErrorProps) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-6">
      <h2 className="text-lg font-semibold text-red-800">Unable to load categories</h2>
      <p className="mt-2 text-sm text-red-700">
        {error.message || 'Something went wrong while fetching categories.'}
      </p>
      <button
        className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
        onClick={reset}
        type="button"
      >
        Try again
      </button>
    </div>
  );
}
