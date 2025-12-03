"use client";
import { SignIn } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';

export const SignInView = () => {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect_url');

  return (
    <SignIn
      redirectUrl={redirectUrl || '/'}
      afterSignInUrl={redirectUrl || '/'}
    />
  );
};
