import { prisma } from '@lib/db/prisma';

export async function isBookFavourited(userId: string, bookId: number): Promise<boolean> {
  const favourite = await prisma.userFavorite.findUnique({
    where: {
      userId_bookId: {
        userId,
        bookId,
      },
    },
    select: { id: true },
  });

  return favourite !== null;
}
