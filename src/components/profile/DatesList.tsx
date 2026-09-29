import { useEffect, useState } from "react";
import { apiDates, ApiError, type ApiDatePlan } from "../../lib/api";
import { ACTIVITY_LIST } from "../../types";

export function DatesList() {
  const [plans,   setPlans]   = useState<ApiDatePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [deleting, setDeleting] = useState<number | null>(null);

  const load = async () => {
    try {
      const data = await apiDates.list();
      setPlans(data);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Erreur de chargement.");
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer ce plan de rendez-vous ?")) return;
    setDeleting(id);
    try {
      await apiDates.delete(id);
      setPlans(p => p.filter(x => x.id !== id));
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Erreur de suppression.");
    } finally { setDeleting(null); }
  };

  if (loading) return <div className="text-rose-300 text-center py-8 font-body">Chargement...</div>;
  if (error)   return <div className="text-rose-400 text-center py-4 font-body">{error}</div>;
  if (!plans.length) return (
    <div className="text-center py-12">
      <div className="text-5xl mb-3">🗓️</div>
      <p className="text-rose-300 font-body">Aucun rendez-vous planifié pour l'instant.</p>
    </div>
  );

  return (
    <div className="space-y-4">
      {plans.map(plan => (
        <div key={plan.id} className="bg-white/70 rounded-2xl p-5 shadow-sm border border-rose-50 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              {/* Date + heure */}
              <div className="flex items-center gap-2 mb-2">
                <span className="font-display text-lg text-rose-600">📅 {plan.date}</span>
                {plan.time && <span className="text-rose-400 text-sm font-body">🕐 {plan.time}</span>}
                {plan.email_sent && (
                  <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-body">✅ Envoyé</span>
                )}
              </div>
              {/* Lieu */}
              {plan.location && (
                <p className="text-rose-400 text-sm font-body mb-2">📍 {plan.location}</p>
              )}
              {/* Activités */}
              {plan.activities.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {plan.activities.map(a => {
                    const meta = ACTIVITY_LIST.find(x => x.key === a.activity);
                    return (
                      <span key={a.id} className="text-xs bg-rose-100 text-rose-500 px-2 py-0.5 rounded-full font-body">
                        {meta?.emoji} {meta?.label ?? a.activity}
                      </span>
                    );
                  })}
                </div>
              )}
              {/* Excitation */}
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-2 bg-rose-50 rounded-full overflow-hidden max-w-[120px]">
                  <div className="h-full bg-gradient-to-r from-rose-400 to-rose-600 rounded-full transition-all"
                    style={{ width: `${plan.excitement}%` }} />
                </div>
                <span className="text-xs text-rose-400 font-body">💗 {plan.excitement}%</span>
              </div>
            </div>
            {/* Delete */}
            <button
              onClick={() => handleDelete(plan.id)}
              disabled={deleting === plan.id}
              className="text-rose-200 hover:text-rose-400 transition-colors text-lg shrink-0 mt-0.5"
              title="Supprimer"
            >
              {deleting === plan.id ? "..." : "🗑️"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
