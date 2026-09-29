// ─── Navigation ──────────────────────────────────────────────────────────────
export type AppPage = "date-flow" | "profile";

// ─── Date flow steps ─────────────────────────────────────────────────────────
export type DateStep =
  | "home"
  | "great"
  | "sad"
  | "understanding"
  | "free-date"
  | "proposal"
  | "excited"
  | "end";

// ─── Activities ──────────────────────────────────────────────────────────────
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

// ─── Misc ─────────────────────────────────────────────────────────────────────
export interface DateSelection {
  date: string;
  time: string;
}
