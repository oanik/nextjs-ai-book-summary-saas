import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

import type { SubscriptionTier, UserRole } from '../prisma/generated/prisma/client';
import { prisma } from './db/prisma';

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    signOut: '/logout',
    error: '/login',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email or password is required');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) {
          throw new Error('User not found');
        }

        const passwordsMatch = await bcrypt.compare(credentials.password as string, user.password);

        if (!passwordsMatch) {
          throw new Error('Invalid email or password');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.fullName,
          role: user.role,
          subscriptionTier: user.subscriptionTier,
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== 'google' || !user.email) {
        return true;
      }

      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
        select: { id: true },
      });

      if (!existingUser) {
        const passwordHash = await bcrypt.hash(randomUUID(), 10);
        await prisma.user.create({
          data: {
            email: user.email,
            fullName: user.name ?? user.email.split('@')[0],
            password: passwordHash,
          },
        });
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user?.email) {
        token.email = user.email;
      }

      if (!token.email) return token;

      const dbUser = await prisma.user.findUnique({
        where: { email: token.email },
        select: {
          id: true,
          role: true,
          subscriptionTier: true,
        },
      });

      if (!dbUser) return token;

      token.id = dbUser.id;
      token.role = dbUser.role;
      token.subscriptionTier = dbUser.subscriptionTier;

      return token;
    },
    async session({ session, token }) {
      const sessionUser = session.user as typeof session.user & {
        id: string;
        role: UserRole;
        subscriptionTier: SubscriptionTier;
      };
      if (session.user) {
        sessionUser.id = token.id as string;
        sessionUser.role = token.role as UserRole;
        sessionUser.subscriptionTier = token.subscriptionTier as SubscriptionTier;
      }
      return session;
    },
  },
});
