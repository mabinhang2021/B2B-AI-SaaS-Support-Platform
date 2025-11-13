'use client';

import { AuthLayout } from '../layouts/auth-layout';
import { Authenticated, Unauthenticated, AuthLoading } from 'convex/react';
import { SignInView } from '../views/sign-in-view';
import { useAuth } from '@clerk/nextjs';

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();

  return (
    <>
      <AuthLoading>
        <AuthLayout>
          <p>loading</p>
        </AuthLayout>
      </AuthLoading>
      <Authenticated>{children} </Authenticated>
      <Unauthenticated>
        <AuthLayout>
          <SignInView />
        </AuthLayout>
      </Unauthenticated>
    </>
  );
};
