// app/auth-provider.tsx
// This component wraps the entire application to provide Auth0 authentication context.
'use client'; // This component runs on the client-side.

import { UserProvider } from '@auth0/nextjs-auth0/client'; // Import Auth0 UserProvider.
import React from 'react'; // Required for React components.

// UserProvider makes Auth0 user data (like login status, user info) available
// to all components wrapped within it.
export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return <UserProvider>{children}</UserProvider>;
}