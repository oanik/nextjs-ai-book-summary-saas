import { NextRequest, NextResponse } from 'next/server';
import { favouritesHelpers } from '@features/favourites/lib/helpers';
import { auth } from '@lib/auth';
import { prisma } from '@lib/db/prisma';

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ bookId: string }> }) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!favouritesHelpers.canUseFavourites(session.user.subscriptionTier)) {
      return NextResponse.json(
        { error: 'Favourites are available on paid plans. Upgrade to manage your favourites.' },
        { status: 403 },
      );
    }

    const { bookId: bookIdParam } = await params;
    const bookId = parseInt(bookIdParam, 10);

    if (Number.isNaN(bookId)) {
      return NextResponse.json({ error: 'Invalid book ID' }, { status: 400 });
    }

    const favourite = await prisma.userFavorite.findUnique({
      where: {
        userId_bookId: {
          userId: session.user.id,
          bookId,
        },
      },
      select: { id: true },
    });

    if (!favourite) {
      return NextResponse.json({ error: 'Favourite not found' }, { status: 404 });
    }

    await prisma.userFavorite.delete({
      where: { id: favourite.id },
    });

    return NextResponse.json({ bookId });
  } catch (error) {
    console.error('Error removing favourite', error);
    return NextResponse.json({ error: 'Failed to remove favourite' }, { status: 500 });
  }
}
