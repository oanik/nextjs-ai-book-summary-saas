import { DefaultSession } from 'next-auth';
import { SubscriptionTier, UserRole } from '@prisma/client';

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
