const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long", day: "numeric", month: "long", year: "numeric",
});

/** "2026-11-20" -> "Vendredi 20 novembre 2026" (sans décalage de fuseau). */
export function formatDate(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  const text = dateFormatter.format(new Date(y, m - 1, d));
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** "18:45:00" -> "18h45" */
export function formatTime(time: string): string {
  const [h, m] = time.split(":");
  return `${h}h${m}`;
}

/** Date du jour au format "YYYY-MM-DD" (heure locale), pour <input type="date" min>. */
export function todayIso(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}
