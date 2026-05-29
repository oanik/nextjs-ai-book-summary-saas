import { NextRequest, NextResponse } from 'next/server';
import { favouritesHelpers } from '@features/favourites/lib/helpers';
import { getUserFavourites } from '@features/favourites/model/getUserFavourites';
import { auth } from '@lib/auth';
import { prisma } from '@lib/db/prisma';
import { z } from 'zod';

const addFavouriteSchema = z.object({
  bookId: z.number().int().positive('Book ID must be a positive integer'),
});

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const favourites = await getUserFavourites(session.user.id);

    return NextResponse.json(favourites);
  } catch (error) {
    console.error('Error fetching favourites', error);
    return NextResponse.json({ error: 'Failed to fetch favourites' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!favouritesHelpers.canUseFavourites(session.user.subscriptionTier)) {
      return NextResponse.json(
        { error: 'Favourites are available on paid plans. Upgrade to add books to your favourites.' },
        { status: 403 },
      );
    }

    const validation = addFavouriteSchema.safeParse(await request.json());

    if (!validation.success) {
      const errors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          errors[issue.path[0].toString()] = issue.message;
        }
      });
      return NextResponse.json({ error: 'Validation failed', errors }, { status: 400 });
    }

    const { bookId } = validation.data;

    const book = await prisma.book.findUnique({
      where: { id: bookId },
      select: { id: true },
    });

    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    const existing = await prisma.userFavorite.findUnique({
      where: {
        userId_bookId: {
          userId: session.user.id,
          bookId,
        },
      },
      select: { id: true },
    });

    if (existing) {
      return NextResponse.json({ id: existing.id, bookId }, { status: 200 });
    }

    const favourite = await prisma.userFavorite.create({
      data: {
        userId: session.user.id,
        bookId,
      },
      select: {
        id: true,
        bookId: true,
      },
    });

    return NextResponse.json(favourite, { status: 201 });
  } catch (error) {
    console.error('Error adding favourite', error);
    return NextResponse.json({ error: 'Failed to add favourite' }, { status: 500 });
  }
}
