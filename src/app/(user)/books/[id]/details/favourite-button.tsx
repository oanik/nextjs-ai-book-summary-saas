'use client';

import React, { useState } from 'react';
import { addFavourite, removeFavourite } from '@features/favourites/api/client';
import toast from 'react-hot-toast';

type Props = {
  bookId: number;
  initialIsFavourited: boolean;
  canUseFavourites: boolean;
};

export function FavouriteButton({ bookId, initialIsFavourited, canUseFavourites }: Props) {
  const [isFavourited, setIsFavourited] = useState(initialIsFavourited);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    if (!canUseFavourites) {
      toast.error('Upgrade to a paid plan to save favourites');
      return;
    }

    setIsLoading(true);

    if (isFavourited) {
      const result = await removeFavourite(bookId);

      if (result.ok) {
        setIsFavourited(false);
        toast.success('Removed from favourites');
      } else {
        toast.error(result.data.error ?? 'Failed to remove favourite');
      }
    } else {
      const result = await addFavourite({ bookId });

      if (result.ok) {
        setIsFavourited(true);
        toast.success('Added to favourites');
      } else {
        toast.error(result.data.error ?? 'Failed to add favourite');
      }
    }

    setIsLoading(false);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isLoading}
      title={
        canUseFavourites
          ? isFavourited
            ? 'Remove from favourites'
            : 'Add to favourites'
          : 'Upgrade to save favourites'
      }
      className={`px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 ${
        isFavourited
          ? 'bg-red-100 text-red-700 hover:bg-red-200'
          : canUseFavourites
            ? 'bg-pink-100 text-pink-700 hover:bg-pink-200'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
      }`}
    >
      {isLoading ? '...' : isFavourited ? '❤️ Favourited' : '🤍 Add to Favourites'}
    </button>
  );
}
