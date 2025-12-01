import type { ReactNode } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import type { User } from '@types';

// Re-export useAuth that uses Auth0 SDK
export const useAuth = () => {
  const auth0 = useAuth0();

  // Map Auth0 user to our User type
  const user: User | null = auth0.user ? {
    id: auth0.user.sub || '',
    email: auth0.user.email || '',
    name: auth0.user.name || '',
    picture: auth0.user.picture,
    email_verified: auth0.user.email_verified,
  } : null;

  return {
    user,
    token: null, // Token is managed internally by Auth0 SDK
    isAuthenticated: auth0.isAuthenticated,
    isLoading: auth0.isLoading,
    login: async () => {
      await auth0.loginWithRedirect();
    },
    logout: () => {
      auth0.logout({ logoutParams: { returnTo: window.location.origin } });
    },
  };
};

interface AuthProviderProps {
  children: ReactNode;
}

// This component is now just a pass-through since Auth0Provider is in main.tsx
export const AuthProvider = ({ children }: AuthProviderProps) => {
  return <>{children}</>;
};
