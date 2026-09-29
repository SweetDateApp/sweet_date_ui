import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import { apiAuth, auth, type ApiUser } from "../lib/api";

export interface RegisterData {
  username: string; password: string; password_confirm: string;
  email_partner1: string; email_partner2: string;
}

interface AuthCtx {
  user: ApiUser | null;
  loading: boolean;
  login:         (username: string, password: string) => Promise<void>;
  register:      (data: RegisterData) => Promise<void>;
  logout:        () => void;
  updateUser:    (data: { username?: string; email_partner1?: string; email_partner2?: string }) => Promise<void>;
  uploadAvatar:  (file: File) => Promise<void>;
}

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = auth.getAccess();
    if (!token) { setLoading(false); return; }
    apiAuth.me().then(setUser).catch(() => auth.clear()).finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const res = await apiAuth.login(username, password);
    auth.set(res.tokens.access, res.tokens.refresh);
    setUser(res.user);
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    const res = await apiAuth.register(data);
    auth.set(res.tokens.access, res.tokens.refresh);
    setUser(res.user);
  }, []);

  const logout = useCallback(() => { auth.clear(); setUser(null); }, []);

  const updateUser = useCallback(async (data: { username?: string; email_partner1?: string; email_partner2?: string }) => {
    const updated = await apiAuth.updateProfile(data);
    setUser(updated);
  }, []);

  const uploadAvatar = useCallback(async (file: File) => {
    const updated = await apiAuth.uploadAvatar(file);
    setUser(updated);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, uploadAvatar }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
