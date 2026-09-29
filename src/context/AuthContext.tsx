import { useState, useEffect, useCallback, useMemo } from "react";
import type { ReactNode } from "react";
import { apiAuth, auth, setSessionExpiredHandler, type ApiUser, type ProfileUpdate, type RegisterData } from "../lib/api";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(() => auth.getAccess() !== null);

  useEffect(() => {
    setSessionExpiredHandler(() => setUser(null));
    if (!auth.getAccess()) return;
    apiAuth.me()
      .then(setUser)
      .catch(() => auth.clear())
      .finally(() => setLoading(false));
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

  const updateUser = useCallback(async (data: ProfileUpdate) => {
    setUser(await apiAuth.updateProfile(data));
  }, []);

  const uploadAvatar = useCallback(async (file: File) => {
    setUser(await apiAuth.uploadAvatar(file));
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, register, logout, updateUser, uploadAvatar }),
    [user, loading, login, register, logout, updateUser, uploadAvatar],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
