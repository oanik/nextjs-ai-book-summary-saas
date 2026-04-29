import { NextResponse } from 'next/server';

import { auth } from '../../../../../../lib/auth';
import { prisma } from '../../../../../../lib/db/prisma';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        subscriptionTier: true,
        subscriptionStartDate: true,
        subscriptionEndDateTime: true,
        audioListenTime: true,
        createdAt: true,
      },
    });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(user, { status: 200 });
  } catch {
    return new Response('Internal Server Error', { status: 500 });
  }
}
