// ============================================================
// Local auth — replaces Supabase Auth
// Password is set via VITE_ADMIN_PASSWORD env variable.
// Session lives in sessionStorage (auto-clears on browser close).
// ============================================================

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const SESSION_KEY = "pay_admin_session";
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD as string | undefined;

interface AuthContextType {
  isAdmin: boolean;
  loading: boolean;
  signIn: (password: string) => { success: boolean; error: string | null };
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAdmin: false,
  loading: false,
  signIn: () => ({ success: false, error: null }),
  signOut: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = sessionStorage.getItem(SESSION_KEY);
    setIsAdmin(session === "1");
    setLoading(false);
  }, []);

  const signIn = (password: string): { success: boolean; error: string | null } => {
    if (!ADMIN_PASSWORD) {
      // No password set — allow access in dev mode with a warning
      console.warn("[PAY Admin] VITE_ADMIN_PASSWORD is not set. Allowing access in dev mode.");
      sessionStorage.setItem(SESSION_KEY, "1");
      setIsAdmin(true);
      return { success: true, error: null };
    }

    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "1");
      setIsAdmin(true);
      return { success: true, error: null };
    }

    return { success: false, error: "Incorrect password. Please try again." };
  };

  const signOut = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isAdmin, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
