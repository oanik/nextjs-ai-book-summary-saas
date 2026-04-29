import { DefaultSession } from 'next-auth';

import type { SubscriptionTier, UserRole } from '../prisma/generated/prisma/client';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      subscriptionTier: SubscriptionTier;
    } & DefaultSession['user'];
  }

  interface User {
    role: UserRole;
    subscriptionTier: SubscriptionTier;
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    id: string;
    role: UserRole;
    subscriptionTier: SubscriptionTier;
  }
}
