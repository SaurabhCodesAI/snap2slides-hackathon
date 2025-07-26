// app/api/auth/[auth0].ts
// This dynamic API route handles all Auth0 authentication processes (login, logout, callback).

import { handleAuth } from '@auth0/nextjs-auth0';

// handleAuth is a utility from Auth0's SDK that sets up all necessary API routes
// for authentication (e.g., /api/auth/login, /api/auth/logout, /api/auth/callback).
export const GET = handleAuth();