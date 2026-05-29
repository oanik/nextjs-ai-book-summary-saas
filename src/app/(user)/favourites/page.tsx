import React, { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { favouritesHelpers } from '@features/favourites/lib/helpers';
import { getUserFavourites } from '@features/favourites/model/getUserFavourites';
import { auth } from '@lib/auth';

import { FavouritesClient } from './favourites-client';

function FavouritesSkeleton() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="h-9 w-64 bg-gray-200 rounded animate-pulse" />
        <div className="h-5 w-96 bg-gray-100 rounded animate-pulse mt-2" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3].map((item) => (
          <div key={item} className="h-48 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    </div>
  );
}

export default async function FavouritesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const favouritesPromise = getUserFavourites(session.user.id);
  const canUseFavourites = favouritesHelpers.canUseFavourites(session.user.subscriptionTier);

  return (
    <Suspense fallback={<FavouritesSkeleton />}>
      <FavouritesClient favouritesPromise={favouritesPromise} canUseFavourites={canUseFavourites} />
    </Suspense>
  );
}
