// app/components/ConditionalLayout.tsx
'use client'
import { usePathname } from 'next/navigation'
import Navigation from './Navigation'
import Footer from './Footer'
import ChallengeNavigation from './ChallengeNavigation'

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isChallengePage = pathname?.startsWith('/challenges/')

  if (isChallengePage) {
    // Challenge layout with ChallengeNavigation
    return (
      <>
        <ChallengeNavigation />
        <div className="min-h-screen">{children}</div>
      </>
    )
  }

  // Normal layout with Navigation/Footer
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  )
}