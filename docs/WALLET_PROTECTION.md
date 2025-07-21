# Wallet Protection System

This implementation provides a comprehensive wallet protection system that prevents unauthorized access to protected routes when users don't have their wallets connected.

## Overview

The wallet protection system consists of three main components:

1. **WalletProtectedWrapper** - A wrapper component that checks wallet connection status
2. **useWalletProtection** - A custom hook for wallet protection logic
3. **ConditionalLayout** - Updated to integrate wallet protection into the app structure

## How It Works

### Automatic Route Protection

All routes except the home page (`/`) are automatically protected by wallet connection requirements. When a user tries to access a protected route without a connected wallet, they'll see a beautiful connection prompt.

### Supported Authentication Methods

The system supports multiple authentication methods:

- **External Wallets** (MetaMask, WalletConnect, etc.)
- **Social Logins** (Google, Farcaster)
- **Embedded Wallets** (Privy's embedded wallets)

### Connection Logic

The system checks for wallet connection in this order:

1. Social login authentication (Google/Farcaster) - automatically considered authenticated
2. Real wallet connection (external wallets) - requires both authentication and connection
3. Embedded wallets are filtered out for real wallet connections but still supported

## Components

### WalletProtectedWrapper

A React component that wraps protected content and shows a connection prompt when needed.

```tsx
import WalletProtectedWrapper from "@/components/WalletProtectedWrapper";

function ProtectedPage() {
  return (
    <WalletProtectedWrapper>
      <div>This content is only accessible with a connected wallet</div>
    </WalletProtectedWrapper>
  );
}
```

**Features:**

- Beautiful loading state while Privy initializes
- Animated connection prompt with clear call-to-action
- Responsive design that works on all screen sizes
- Educational links for users new to crypto wallets

### useWalletProtection Hook

A custom hook that provides wallet protection logic and state.

```tsx
import { useWalletProtection } from "@/hooks/useWalletProtection";

function MyComponent() {
  const { isWalletConnected, isReady, authenticated, user, requireConnection } =
    useWalletProtection();

  const handleProtectedAction = () => {
    try {
      requireConnection(); // Throws error if not connected
      // Proceed with protected action
    } catch (error) {
      console.log("Wallet connection required");
    }
  };

  if (!isReady) return <div>Loading...</div>;
  if (!isWalletConnected) return <div>Please connect your wallet</div>;

  return <div>Protected content</div>;
}
```

**Hook Options:**

```tsx
const options = {
  redirectTo: "/login", // Where to redirect if not connected
  autoRedirect: true, // Whether to automatically redirect
};

const protection = useWalletProtection(options);
```

## Configuration

### Route Exceptions

Currently, only the home page (`/`) is excluded from wallet protection. To add more exceptions, modify the `ConditionalLayout.tsx`:

```tsx
const isHomePage = pathname === "/";
const isPublicRoute = pathname === "/about" || pathname === "/docs";

if (isHomePage || isPublicRoute) {
  // Allow access without wallet
}
```

### Connection Requirements

The wallet connection logic can be customized in both components by modifying the `hasWalletConnected()` or `isWalletConnected()` functions.

## User Experience

### Loading States

- Shows spinner while Privy initializes
- Smooth transitions between states

### Connection Prompt

- Clear explanation of why wallet connection is needed
- Prominent connect button using existing ConnectWallet component
- Educational links for new users
- Terms of service acknowledgment

### Visual Design

- Consistent with app's design system
- Gradient backgrounds matching the app theme
- Responsive layout for all screen sizes
- Smooth animations using Framer Motion

## Security Considerations

1. **Authentication Verification**: The system verifies both Privy authentication and actual wallet connection
2. **Real Wallet Detection**: Filters out embedded wallets when checking for "real" wallet connections
3. **Social Login Support**: Properly handles social authentication methods
4. **Token Validation**: Works with existing JWT token system for API calls

## Integration

The wallet protection is automatically integrated into the app through the `ConditionalLayout` component. No additional setup is required for new routes - they are protected by default.

To disable protection for specific routes, add them to the exception list in `ConditionalLayout.tsx`.

## Future Enhancements

Potential improvements to consider:

- Role-based access control
- Temporary guest access with limited features
- Progressive wallet connection (allow browsing, require connection for interactions)
- Custom protection levels for different route groups
