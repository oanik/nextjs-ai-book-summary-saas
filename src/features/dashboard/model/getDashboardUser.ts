import { prisma } from '../../../../lib/db/prisma';

export async function getDashboardUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      subscriptionTier: true,
      subscriptionStatus: true,
      subscriptionStartDate: true,
      subscriptionEndDateTime: true,
      audioListenTime: true,
      createdAt: true,
    },
  });

  if (!user) return null;

  return {
    ...user,
    subscriptionStartDate: user.subscriptionStartDate?.toISOString() ?? null,
    subscriptionEndDateTime: user.subscriptionEndDateTime?.toISOString() ?? null,
    createdAt: user.createdAt.toISOString(),
  };
}
