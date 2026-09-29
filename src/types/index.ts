// ─── Navigation ──────────────────────────────────────────────────────────────
export type AppPage = "date-flow" | "profile";

// ─── Date flow steps ─────────────────────────────────────────────────────────
export type DateStep =
  | "home"
  | "great"
  | "sad"
  | "free-date"
  | "proposal"
  | "excited"
  | "end";

// ─── Activities ──────────────────────────────────────────────────────────────
// Doit rester synchronisé avec ACTIVITY_CHOICES (sweet_date_api/api/models.py).
export type DateActivity = "walk" | "movie" | "meal" | "game" | "other" | "photos";

export interface ActivityMeta {
  key:   DateActivity;
  label: string;
  emoji: string;
}

export const ACTIVITY_LIST: ActivityMeta[] = [
  { key: "walk",   label: "Se promener",        emoji: "🌸" },
  { key: "movie",  label: "Regarder un film",   emoji: "🎬" },
  { key: "meal",   label: "Dîner ensemble",     emoji: "🍽️" },
  { key: "game",   label: "Jouer ensemble",     emoji: "🎮" },
  { key: "other",  label: "Autre chose",        emoji: "✨" },
  { key: "photos", label: "Prendre des photos", emoji: "📸" },
];

export function activityLabel(key: string): string {
  const meta = ACTIVITY_LIST.find(a => a.key === key);
  return meta ? `${meta.emoji} ${meta.label}` : key;
}
