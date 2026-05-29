import type { SubscriptionTier } from '../../../../prisma/generated/prisma/client';

export const canUseFavourites = (tier: SubscriptionTier | string): boolean => tier !== 'FREE';

export const favouritesHelpers = {
  canUseFavourites,
};
