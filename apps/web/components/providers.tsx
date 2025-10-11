"use client"

import * as React from "react"
import { ConvexProvider,ConvexReactClient } from "convex/react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { useAuth } from '@clerk/nextjs'
import { ReactNode } from 'react'

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error('Missing NEXT_PUBLIC_CONVEX_URL in your .env file')
}


const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL || "")

export  function Providers({ children }: { children: ReactNode }) {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  )
}