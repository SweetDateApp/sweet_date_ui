// ---- Configuration ----
const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

// ---- Storage helpers ----
const TOKEN_KEY   = "sd_access";
const REFRESH_KEY = "sd_refresh";

export const auth = {
  getAccess:  ()        => localStorage.getItem(TOKEN_KEY),
  getRefresh: ()        => localStorage.getItem(REFRESH_KEY),
  set:        (a: string, r: string) => {
    localStorage.setItem(TOKEN_KEY, a);
    localStorage.setItem(REFRESH_KEY, r);
  },
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

// ---- Base fetch avec JWT auto-refresh ----
async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  retry = true,
): Promise<T> {
  const token = auth.getAccess();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  // Token expiré → tenter un refresh
  if (res.status === 401 && retry) {
    const refreshed = await tryRefresh();
    if (refreshed) return apiFetch<T>(path, options, false);
    auth.clear();
    throw new ApiError(401, "Session expirée. Veuillez vous reconnecter.");
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const d = data as Record<string, unknown>;
    const message: string =
      typeof d?.detail === "string"
        ? d.detail
        : (Object.values(d).flat() as string[]).join(" ") || "Erreur inconnue";
    throw new ApiError(res.status, message);
  }
  return data as T;
}

async function tryRefresh(): Promise<boolean> {
  const refresh = auth.getRefresh();
  if (!refresh) return false;
  try {
    const res = await fetch(`${BASE_URL}/auth/refresh/`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ refresh }),
    });
    if (!res.ok) return false;
    const { access, refresh: newRefresh } = await res.json();
    auth.set(access, newRefresh ?? refresh);
    return true;
  } catch {
    return false;
  }
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// ---- Types ----
export interface ApiUser {
  id: number;
  username: string;
  email_partner1: string;
  email_partner2: string;
  created_at: string;
}

export interface ApiDatePlan {
  id: number;
  date: string;
  time: string | null;
  location: string;
  excitement: number;
  activities: { id: number; activity: string }[];
  email_sent: boolean;
  email_sent_at: string | null;
  created_at: string;
}

export interface AuthResponse {
  user: ApiUser;
  tokens: { access: string; refresh: string };
}

// ---- API calls ----
export const apiAuth = {
  register: (data: {
    username: string;
    password: string;
    password_confirm: string;
    email_partner1: string;
    email_partner2: string;
  }) =>
    apiFetch<AuthResponse>("/auth/register/", {
      method: "POST",
      body:   JSON.stringify(data),
    }),

  login: (username: string, password: string) =>
    apiFetch<AuthResponse>("/auth/login/", {
      method: "POST",
      body:   JSON.stringify({ username, password }),
    }),

  me: () => apiFetch<ApiUser>("/auth/me/"),
};

export const apiDates: {
  list: () => Promise<ApiDatePlan[]>;
  create: (data: { date: string; time?: string; location?: string; excitement?: number; activity_keys?: string[] }) => Promise<ApiDatePlan>;
  update: (id: number, data: { date?: string; time?: string; location?: string; excitement?: number; activity_keys?: string[] }) => Promise<ApiDatePlan>;
  delete: (id: number) => Promise<void>;
  sendInvitation: (id: number) => Promise<{ detail: string; sent_to: string[] }>;
} = {
  list: () => apiFetch<ApiDatePlan[]>("/dates/"),

  create: (data: {
    date: string;
    time?: string;
    location?: string;
    excitement?: number;
    activity_keys?: string[];
  }) =>
    apiFetch<ApiDatePlan>("/dates/", {
      method: "POST",
      body:   JSON.stringify(data),
    }),

  update: (id: number, data: { date?: string; time?: string; location?: string; excitement?: number; activity_keys?: string[] }) =>
    apiFetch<ApiDatePlan>(`/dates/${id}/`, {
      method: "PATCH",
      body:   JSON.stringify(data),
    }),

  delete: (id: number) =>
    apiFetch<void>(`/dates/${id}/`, { method: "DELETE" }),

  sendInvitation: (id: number) =>
    apiFetch<{ detail: string; sent_to: string[] }>(`/dates/${id}/send/`, {
      method: "POST",
    }),
};
