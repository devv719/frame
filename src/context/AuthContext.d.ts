import type { User } from "firebase/auth";

/**
 * Type declarations for the AuthContext module (AuthContext.jsx).
 * Gives TypeScript consumers proper types without converting the file to .tsx.
 */

export interface AuthContextValue {
  user: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

export function AuthProvider(props: { children: React.ReactNode }): JSX.Element;
export function useAuth(): AuthContextValue;
