import { useCallback, useEffect, useState } from "react";
import { apiDates, errorMessage, type ApiDatePlan } from "../lib/api";

/** Plans de l'utilisateur, chargés à l'ouverture du profil. */
export function useDatePlans() {
  const [plans,   setPlans]   = useState<ApiDatePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [busyId,  setBusyId]  = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    apiDates.list()
      .then(data => { if (!cancelled) setPlans(data); })
      .catch(e => { if (!cancelled) setError(errorMessage(e, "Erreur de chargement.")); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const remove = useCallback(async (id: number) => {
    setBusyId(id); setError("");
    try {
      await apiDates.delete(id);
      setPlans(p => p.filter(x => x.id !== id));
    } catch (e) {
      setError(errorMessage(e, "Erreur de suppression."));
    } finally { setBusyId(null); }
  }, []);

  const sendInvitation = useCallback(async (id: number) => {
    setBusyId(id); setError("");
    try {
      const { plan } = await apiDates.sendInvitation(id);
      setPlans(p => p.map(x => (x.id === id ? plan : x)));
    } catch (e) {
      setError(errorMessage(e, "Erreur lors de l'envoi."));
    } finally { setBusyId(null); }
  }, []);

  return { plans, loading, error, busyId, remove, sendInvitation };
}
