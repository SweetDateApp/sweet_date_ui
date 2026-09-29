import type { DateActivity } from "../types";

const BASE_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:8000/api").replace(/\/+$/, "");

// ─── Token storage ───────────────────────────────────────────────────────────
const TOKEN_KEY   = "sd_access";
const REFRESH_KEY = "sd_refresh";

export const auth = {
  getAccess:  () => localStorage.getItem(TOKEN_KEY),
  getRefresh: () => localStorage.getItem(REFRESH_KEY),
  set: (a: string, r: string) => {
    localStorage.setItem(TOKEN_KEY, a);
    localStorage.setItem(REFRESH_KEY, r);
  },
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

// Appelé quand la session ne peut plus être renouvelée (AuthProvider s'y abonne).
let onSessionExpired: () => void = () => {};
export function setSessionExpiredHandler(handler: () => void) {
  onSessionExpired = handler;
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function errorMessage(e: unknown, fallback: string): string {
  return e instanceof ApiError ? e.message : fallback;
}

// ─── Base fetch with JWT auto-refresh ────────────────────────────────────────
async function apiFetch<T>(path: string, options: RequestInit = {}, retry = true): Promise<T> {
  const token = auth.getAccess();
  const headers: Record<string, string> = { ...(options.headers as Record<string, string>) };
  // Pas de Content-Type pour FormData : le navigateur ajoute le boundary.
  if (!(options.body instanceof FormData)) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  } catch {
    throw new ApiError(0, "Impossible de joindre le serveur. Vérifiez votre connexion.");
  }

  // Un 401 sur une requête authentifiée = access token expiré. Sans token (ex. login), on garde le message du serveur.
  if (res.status === 401 && token && retry) {
    if (await refreshTokens()) return apiFetch<T>(path, options, false);
    auth.clear();
    onSessionExpired();
    throw new ApiError(401, "Session expirée. Veuillez vous reconnecter.");
  }

  if (res.status === 204) return undefined as T;

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, extractMessage(data));
  return data as T;
}

function extractMessage(data: unknown): string {
  if (data && typeof data === "object") {
    const d = data as Record<string, unknown>;
    if (typeof d.detail === "string") return d.detail;
    const messages = Object.values(d).flat().filter((m): m is string => typeof m === "string");
    if (messages.length) return messages.join(" ");
  }
  return "Une erreur inattendue est survenue.";
}

// Plusieurs requêtes peuvent expirer en même temps : un seul refresh à la fois.
let refreshing: Promise<boolean> | null = null;

function refreshTokens(): Promise<boolean> {
  refreshing ??= (async () => {
    const refresh = auth.getRefresh();
    if (!refresh) return false;
    try {
      const res = await fetch(`${BASE_URL}/auth/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      });
      if (!res.ok) return false;
      const { access, refresh: newRefresh } = await res.json();
      auth.set(access, newRefresh ?? refresh);
      return true;
    } catch {
      return false;
    }
  })().finally(() => { refreshing = null; });
  return refreshing;
}

// ─── Types ───────────────────────────────────────────────────────────────────
export interface ApiUser {
  id: number;
  username: string;
  email_partner1: string;
  email_partner2: string;
  avatar: string | null;
  created_at: string;
}

export interface ApiDatePlan {
  id: number;
  date: string;
  time: string | null;
  location: string;
  excitement: number;
  activities: { id: number; activity: DateActivity }[];
  email_sent: boolean;
  email_sent_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: ApiUser;
  tokens: { access: string; refresh: string };
}

export interface RegisterData {
  username: string;
  password: string;
  password_confirm: string;
  email_partner1: string;
  email_partner2: string;
}

export type ProfileUpdate = Partial<Pick<ApiUser, "username" | "email_partner1" | "email_partner2">>;

export interface DatePlanInput {
  date: string;
  time?: string | null;
  location?: string;
  excitement?: number;
  activity_keys?: DateActivity[];
}

export interface InvitationResponse {
  detail: string;
  plan: ApiDatePlan;
  sent_to: string[];
}

const json = (method: string, body: unknown): RequestInit => ({ method, body: JSON.stringify(body) });

// ─── Auth endpoints ──────────────────────────────────────────────────────────
export const apiAuth = {
  register: (data: RegisterData) => apiFetch<AuthResponse>("/auth/register/", json("POST", data)),

  login: (username: string, password: string) =>
    apiFetch<AuthResponse>("/auth/login/", json("POST", { username, password })),

  me: () => apiFetch<ApiUser>("/auth/me/"),

  updateProfile: (data: ProfileUpdate) => apiFetch<ApiUser>("/auth/me/", json("PATCH", data)),

  uploadAvatar: (file: File) => {
    const form = new FormData();
    form.append("avatar", file);
    return apiFetch<ApiUser>("/auth/me/", { method: "PATCH", body: form });
  },
};

// ─── Date plan endpoints ─────────────────────────────────────────────────────
export const apiDates = {
  list: () => apiFetch<ApiDatePlan[]>("/dates/"),

  create: (data: DatePlanInput) => apiFetch<ApiDatePlan>("/dates/", json("POST", data)),

  update: (id: number, data: Partial<DatePlanInput>) => apiFetch<ApiDatePlan>(`/dates/${id}/`, json("PATCH", data)),

  delete: (id: number) => apiFetch<void>(`/dates/${id}/`, { method: "DELETE" }),

  sendInvitation: (id: number) => apiFetch<InvitationResponse>(`/dates/${id}/send/`, { method: "POST" }),
};
