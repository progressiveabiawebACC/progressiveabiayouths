// ============================================================
// Secure Admin Authentication
// Credentials configured for: progressiveabiaweb@gmail.com
// Password configured for: PAYWEBadmin@2026
// Rate-limiting protection & ephemeral session management
// ============================================================

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { logActivity } from "@/lib/auditLog";

const SESSION_TOKEN_KEY = "pay_admin_auth_token";
const SESSION_EMAIL_KEY = "pay_admin_auth_email";
const ATTEMPTS_KEY = "pay_auth_failed_attempts";
const LOCKOUT_KEY = "pay_auth_lockout_until";

// Configured credentials with environment override support
const DEFAULT_ADMIN_EMAIL = "progressiveabiaweb@gmail.com";
const DEFAULT_ADMIN_PASSWORD = "PAYWEBadmin@2026";

const ENV_EMAIL = import.meta.env.VITE_ADMIN_EMAIL as string | undefined;
const ENV_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD as string | undefined;

const VALID_EMAIL = (ENV_EMAIL || DEFAULT_ADMIN_EMAIL).trim().toLowerCase();
const VALID_PASSWORD = (ENV_PASSWORD || DEFAULT_ADMIN_PASSWORD).trim();

interface AuthContextType {
  isAdmin: boolean;
  userEmail: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error: string | null }>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAdmin: false,
  userEmail: null,
  loading: true,
  signIn: async () => ({ success: false, error: null }),
  signOut: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const token = sessionStorage.getItem(SESSION_TOKEN_KEY);
      const email = sessionStorage.getItem(SESSION_EMAIL_KEY);

      if (token && email && email.toLowerCase() === VALID_EMAIL) {
        setIsAdmin(true);
        setUserEmail(email);
      } else {
        setIsAdmin(false);
        setUserEmail(null);
      }
    } catch {
      setIsAdmin(false);
      setUserEmail(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const signIn = async (
    emailInput: string,
    passwordInput: string
  ): Promise<{ success: boolean; error: string | null }> => {
    const cleanEmail = emailInput.trim().toLowerCase();
    const cleanPassword = passwordInput.trim();

    // 1. Check brute force lockout
    const lockoutUntil = Number(localStorage.getItem(LOCKOUT_KEY) || 0);
    const now = Date.now();
    if (lockoutUntil > now) {
      const remainingSeconds = Math.ceil((lockoutUntil - now) / 1000);
      return {
        success: false,
        error: `Too many failed attempts. Security cooldown active: try again in ${remainingSeconds} seconds.`,
      };
    }

    // 2. Validate credentials
    const isEmailValid = cleanEmail === VALID_EMAIL;
    const isPasswordValid = cleanPassword === VALID_PASSWORD;

    if (isEmailValid && isPasswordValid) {
      // Clear failure counter on success
      localStorage.removeItem(ATTEMPTS_KEY);
      localStorage.removeItem(LOCKOUT_KEY);

      // Generate random session token
      const sessionToken = "sec_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
      sessionStorage.setItem(SESSION_TOKEN_KEY, sessionToken);
      sessionStorage.setItem(SESSION_EMAIL_KEY, cleanEmail);

      setIsAdmin(true);
      setUserEmail(cleanEmail);

      logActivity("login", "Security", `Admin authenticated: ${cleanEmail}`);
      return { success: true, error: null };
    }

    // 3. Track failed attempt
    const currentAttempts = Number(localStorage.getItem(ATTEMPTS_KEY) || 0) + 1;
    localStorage.setItem(ATTEMPTS_KEY, String(currentAttempts));

    if (currentAttempts >= 5) {
      // 60-second lockout
      localStorage.setItem(LOCKOUT_KEY, String(Date.now() + 60000));
      return {
        success: false,
        error: "Too many failed attempts. Portal locked for 60 seconds for security.",
      };
    }

    const remainingAttempts = 5 - currentAttempts;
    return {
      success: false,
      error: `Invalid email or password. (${remainingAttempts} attempts remaining before temporary cooldown)`,
    };
  };

  const signOut = () => {
    sessionStorage.removeItem(SESSION_TOKEN_KEY);
    sessionStorage.removeItem(SESSION_EMAIL_KEY);
    setIsAdmin(false);
    setUserEmail(null);
  };

  return (
    <AuthContext.Provider value={{ isAdmin, userEmail, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
