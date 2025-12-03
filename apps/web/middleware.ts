import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/', '/docs(.*)' ]);

const isOrgFreeRoute = createRouteMatcher([
  '/org-selection(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/docs(.*)' 
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, orgId } = await auth();

  // Protect routes that require authentication
  if (!isPublicRoute(req)) {
    const url = req.nextUrl.clone();
    // If user is not authenticated, redirect to sign-in with the original URL as redirect parameter
    if (!userId) {
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', url.pathname + url.search);
      return NextResponse.redirect(signInUrl);
    }
  }

  // Handle organization selection for authenticated users
  if (userId && !orgId && !isOrgFreeRoute(req)) {
    const url = req.nextUrl.clone();
    const searchParams = new URLSearchParams({
      redirectUrl: url.pathname + url.search,
    });
    const orgSelection = new URL(
      `/org-selection?${searchParams.toString()}`,
      req.url,
    );
    return NextResponse.redirect(orgSelection);
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
