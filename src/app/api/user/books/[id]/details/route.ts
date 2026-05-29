import { NextRequest, NextResponse } from 'next/server';
import { favouritesHelpers } from '@features/favourites/lib/helpers';
import { isBookFavourited } from '@features/favourites/model/isBookFavourited';
import { auth } from '@lib/auth';
import { prisma } from '@lib/db/prisma';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const book = await prisma.book.findUnique({
      where: { id: parseInt(id) },
      include: {
        category: {
          select: {
            name: true,
          },
        },
        summary: true,
        chapters: {
          orderBy: {
            chapterNumber: 'asc',
          },
        },
      },
    });

    if (!book) {
      return NextResponse.json({ error: 'Book Not Found' }, { status: 404 });
    }

    const canUseFavourites = favouritesHelpers.canUseFavourites(session.user.subscriptionTier);
    const isFavourited = canUseFavourites ? await isBookFavourited(session.user.id ?? '', book.id) : false;

    return NextResponse.json({
      ...book,
      isFavourited,
      canUseFavourites,
    });
  } catch (error) {
    console.error('Error fetching book details', error);
    return NextResponse.json({ error: 'Failed to fetch book details' }, { status: 500 });
  }
}
