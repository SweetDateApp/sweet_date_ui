import type { ApiDatePlan } from "../../lib/api";
import { ACTIVITY_LIST } from "../../types";

interface Props { plans: ApiDatePlan[]; loading: boolean; error: string; }

export function ActivityChart({ plans, loading, error }: Props) {
  // Nombre d'occurrences de chaque activité sur tous les plans
  const counts: Record<string, number> = {};
  plans.forEach(plan => plan.activities.forEach(a => { counts[a.activity] = (counts[a.activity] ?? 0) + 1; }));
  const bars = ACTIVITY_LIST
    .map(({ key, label, emoji }) => ({ key, label, emoji, count: counts[key] ?? 0 }))
    .sort((a, b) => b.count - a.count);

  if (loading) return <div className="text-rose-300 text-center py-6 font-body">Chargement...</div>;
  if (error)   return <div className="text-rose-400 text-center py-4 font-body">{error}</div>;

  const total = bars.reduce((s, b) => s + b.count, 0);

  if (total === 0) return (
    <div className="text-center py-8">
      <div className="text-4xl mb-2">📊</div>
      <p className="text-rose-300 font-body text-sm">Pas encore de données d'activités.</p>
    </div>
  );

  const max = Math.max(...bars.map(b => b.count), 1);

  return (
    <div className="space-y-3">
      {bars.map(bar => (
        <div key={bar.key} className="flex items-center gap-3">
          {/* Label */}
          <div className="w-36 shrink-0 flex items-center gap-1.5">
            <span className="text-base">{bar.emoji}</span>
            <span className="text-xs text-rose-500 font-body truncate">{bar.label}</span>
          </div>
          {/* Bar */}
          <div className="flex-1 h-6 bg-rose-50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-400 to-rose-500 rounded-full transition-all duration-700 flex items-center justify-end pr-2"
              style={{ width: bar.count > 0 ? `${(bar.count / max) * 100}%` : "0%" }}
            >
              {bar.count > 0 && (
                <span className="text-white text-xs font-bold">{bar.count}</span>
              )}
            </div>
          </div>
          {/* % */}
          <span className="text-xs text-rose-300 font-body w-10 text-right shrink-0">
            {total > 0 ? Math.round((bar.count / total) * 100) : 0}%
          </span>
        </div>
      ))}
      <p className="text-xs text-rose-200 font-body text-right pt-1">{total} activité{total > 1 ? "s" : ""} au total</p>
    </div>
  );
}
