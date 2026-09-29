import { createContext } from "react";
import type { ApiUser, ProfileUpdate, RegisterData } from "../lib/api";

export interface AuthCtx {
  user: ApiUser | null;
  loading: boolean;
  login:        (username: string, password: string) => Promise<void>;
  register:     (data: RegisterData) => Promise<void>;
  logout:       () => void;
  updateUser:   (data: ProfileUpdate) => Promise<void>;
  uploadAvatar: (file: File) => Promise<void>;
}

export const AuthContext = createContext<AuthCtx | null>(null);
