import { prisma } from '@lib/db/prisma';

import type { FavouriteBook } from './types';

export async function getUserFavourites(userId: string): Promise<FavouriteBook[]> {
  const favourites = await prisma.userFavorite.findMany({
    where: { userId },
    select: {
      id: true,
      bookId: true,
      createdAt: true,
      book: {
        select: {
          id: true,
          title: true,
          author: true,
          slug: true,
          coverImageUrl: true,
          category: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return favourites.map((favourite) => ({
    id: favourite.id,
    bookId: favourite.bookId,
    createdAt: favourite.createdAt.toISOString(),
    book: favourite.book,
  }));
}
