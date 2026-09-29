import type { ApiDatePlan } from "../../lib/api";
import { formatDate, formatTime } from "../../lib/format";
import { activityLabel } from "../../types";

interface Props {
  plans: ApiDatePlan[];
  loading: boolean;
  error: string;
  busyId: number | null;
  remove: (id: number) => void;
  sendInvitation: (id: number) => void;
}

export function DatesList({ plans, loading, error, busyId, remove, sendInvitation }: Props) {
  if (loading) return <div className="text-rose-300 text-center py-8 font-body">Chargement...</div>;

  const handleDelete = (id: number) => {
    if (confirm("Supprimer ce plan de rendez-vous ?")) remove(id);
  };

  return (
    <div className="space-y-4">
      {error && <div className="text-rose-400 text-center text-sm font-body">{error}</div>}

      {!plans.length && !error && (
        <div className="text-center py-12">
          <div className="text-5xl mb-3">🗓️</div>
          <p className="text-rose-300 font-body">Aucun rendez-vous planifié pour l'instant.</p>
        </div>
      )}

      {plans.map(plan => {
        const busy = busyId === plan.id;
        return (
          <div key={plan.id} className="bg-white/70 rounded-2xl p-5 shadow-sm border border-rose-50 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center flex-wrap gap-2 mb-2">
                  <span className="font-display text-lg text-rose-600">📅 {formatDate(plan.date)}</span>
                  {plan.time && <span className="text-rose-400 text-sm font-body">🕐 {formatTime(plan.time)}</span>}
                  {plan.email_sent && (
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-body">✅ Envoyé</span>
                  )}
                </div>
                {plan.location && <p className="text-rose-400 text-sm font-body mb-2 break-words">📍 {plan.location}</p>}
                {plan.activities.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {plan.activities.map(a => (
                      <span key={a.id} className="text-xs bg-rose-100 text-rose-500 px-2 py-0.5 rounded-full font-body">
                        {activityLabel(a.activity)}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-2 bg-rose-50 rounded-full overflow-hidden max-w-[120px]">
                    <div className="h-full bg-gradient-to-r from-rose-400 to-rose-600 rounded-full transition-all"
                      style={{ width: `${plan.excitement}%` }} />
                  </div>
                  <span className="text-xs text-rose-400 font-body">💗 {plan.excitement}%</span>
                </div>
                {!plan.email_sent && (
                  <button onClick={() => sendInvitation(plan.id)} disabled={busy}
                    className="mt-3 text-xs font-body text-rose-500 hover:text-rose-600 underline underline-offset-4 disabled:opacity-50">
                    {busy ? "Envoi..." : "✉️ Envoyer l'invitation"}
                  </button>
                )}
              </div>
              <button
                onClick={() => handleDelete(plan.id)}
                disabled={busy}
                className="text-rose-200 hover:text-rose-400 transition-colors text-lg shrink-0 mt-0.5 disabled:opacity-50"
                title="Supprimer"
                aria-label="Supprimer"
              >
                {busy ? "..." : "🗑️"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
