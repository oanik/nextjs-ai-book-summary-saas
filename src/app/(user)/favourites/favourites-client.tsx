'use client';

import React, { use, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { removeFavourite } from '@features/favourites/api/client';
import type { FavouriteBook } from '@features/favourites/model/types';
import toast from 'react-hot-toast';

type Props = {
  favouritesPromise: Promise<FavouriteBook[]>;
  canUseFavourites: boolean;
};

export function FavouritesClient({ favouritesPromise, canUseFavourites }: Props) {
  const initialFavourites = use(favouritesPromise);
  const [favourites, setFavourites] = useState(initialFavourites);
  const [removingBookId, setRemovingBookId] = useState<number | null>(null);

  const handleRemove = async (bookId: number) => {
    setRemovingBookId(bookId);

    const result = await removeFavourite(bookId);

    if (result.ok) {
      setFavourites((current) => current.filter((favourite) => favourite.bookId !== bookId));
      toast.success('Removed from favourites');
    } else {
      toast.error(result.data.error ?? 'Failed to remove favourite');
    }

    setRemovingBookId(null);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Favourites</h1>
        <p className="text-gray-600 mt-2">Books you have saved for quick access</p>
      </div>

      {!canUseFavourites && (
        <div className="mb-8 bg-indigo-50 border border-indigo-200 rounded-xl p-6">
          <h2 className="text-lg font-bold text-indigo-900 mb-2">Upgrade to use favourites</h2>
          <p className="text-indigo-700 mb-4">
            Saving books to favourites is available on paid plans. Upgrade your subscription to start building your
            reading list.
          </p>
          <Link
            href="/dashboard"
            className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            View subscription plans
          </Link>
        </div>
      )}

      {favourites.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">❤️</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No favourites yet</h3>
          <p className="text-gray-600 mb-6">
            {canUseFavourites
              ? 'Browse books and tap the heart icon to save them here.'
              : 'Upgrade your plan to start saving books to your favourites.'}
          </p>
          <Link
            href="/books"
            className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Browse Books
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {favourites.map((favourite) => (
            <article
              key={favourite.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex gap-4">
                  {favourite.book.coverImageUrl ? (
                    <Image
                      src={favourite.book.coverImageUrl}
                      alt={favourite.book.title}
                      width={64}
                      height={96}
                      className="h-24 w-16 rounded object-cover shrink-0"
                    />
                  ) : (
                    <div className="h-24 w-16 bg-gray-200 rounded flex items-center justify-center shrink-0">
                      <span className="text-2xl">📖</span>
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium mb-2">
                      {favourite.book.category.name}
                    </span>
                    <h2 className="font-bold text-gray-900 truncate">{favourite.book.title}</h2>
                    <p className="text-sm text-gray-600 mt-1">{favourite.book.author}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Saved {new Date(favourite.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-6">
                  <Link
                    href={`/books/${favourite.book.id}/details`}
                    className="flex-1 text-center px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                  >
                    View Book
                  </Link>
                  {canUseFavourites && (
                    <button
                      type="button"
                      onClick={() => handleRemove(favourite.bookId)}
                      disabled={removingBookId === favourite.bookId}
                      className="px-4 py-2 border border-red-200 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      {removingBookId === favourite.bookId ? 'Removing...' : 'Remove'}
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
