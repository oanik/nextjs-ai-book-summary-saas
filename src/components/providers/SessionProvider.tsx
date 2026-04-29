'use client';

import React from 'react';
import { Session } from 'next-auth';
import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';

interface Props {
  children: React.ReactNode;
  session?: Session | null;
}

const SessionProvider = ({ children, session }: Props) => {
  return (
    <NextAuthSessionProvider session={session}>
      {children}
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
    </NextAuthSessionProvider>
  );
};

export default SessionProvider;
