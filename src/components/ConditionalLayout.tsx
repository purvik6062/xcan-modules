// app/components/ConditionalLayout.tsx
'use client'
import { usePathname } from 'next/navigation'
import Navigation from './Navigation'
import Footer from './Footer'
import ChallengeNavigation from './ChallengeNavigation'
import WalletProtectedWrapper from './WalletProtectedWrapper'

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isChallengePage = pathname?.startsWith('/challenges/')
  const isHomePage = pathname === '/'

  // Allow home page without wallet connection for marketing/landing purposes
  if (isHomePage) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <div className="flex-1">{children}</div>
        <Footer />
      </div>
    )
  }

  // All other routes require wallet connection
  return (
    <WalletProtectedWrapper>
      {isChallengePage ? (
        // Challenge layout with ChallengeNavigation
        <>
          <ChallengeNavigation />
          <div className="min-h-screen">{children}</div>
        </>
      ) : (
        // Normal layout with Navigation/Footer
        <div className="flex flex-col min-h-screen">
          <Navigation />
          <div className="flex-1">{children}</div>
          <Footer />
        </div>
      )}
    </WalletProtectedWrapper>
  )
}