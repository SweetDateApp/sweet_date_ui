import { useState } from "react";
import type { DateActivity } from "../types";
import { apiDates, ApiError, type ApiDatePlan } from "../lib/api";
import { useAuth } from "../context/AuthContext";

interface HomePageProps {
  onYes: () => void;
  onNo:  () => void;
}

type Section = "home" | "great" | "sad" | "understanding" | "free-date" | "proposal" | "excited" | "end";

const ACTIVITIES: { key: DateActivity; label: string; emoji: string }[] = [
  { key: "walk",   label: "Se promener",       emoji: "🌸" },
  { key: "movie",  label: "Regarder un film",  emoji: "🎬" },
  { key: "meal",   label: "Dîner ensemble",    emoji: "🍽️" },
  { key: "game",   label: "Jouer ensemble",    emoji: "🎮" },
  { key: "other",  label: "Autre chose",       emoji: "✨" },
  { key: "photos", label: "Prendre des photos",emoji: "📸" },
];

const inputCls = `
  px-4 py-3 rounded-2xl border-none outline-none bg-white/80
  text-rose-700 shadow-sm font-body text-base
  focus:shadow-[0_0_0_2px_rgba(255,42,78,0.2)] transition-all
`;

export function HomePage({ onYes, onNo }: HomePageProps) {
  const { user, logout } = useAuth();

  const [section,    setSection]    = useState<Section>("home");
  const [date,       setDate]       = useState("");
  const [time,       setTime]       = useState("");
  const [location,   setLocation]   = useState("");
  const [activities, setActivities] = useState<DateActivity[]>([]);
  const [excitement, setExcitement] = useState(0);
  const [plan,       setPlan]       = useState<ApiDatePlan | null>(null);
  const [saving,     setSaving]     = useState(false);
  const [sending,    setSending]    = useState(false);
  const [apiMsg,     setApiMsg]     = useState("");

  const go = (s: Section, delay = 400) => setTimeout(() => setSection(s), delay);

  const handleYes = () => { onYes(); go("great"); };
  const handleNo  = () => {
    onNo();
    setSection("sad");
    setTimeout(() => setSection("understanding"), 8000);
  };

  const toggleActivity = (key: DateActivity) => {
    setActivities(prev =>
      prev.includes(key) ? prev.filter(a => a !== key) : [...prev, key]
    );
  };

  /** Étape free-date → crée le plan en BDD */
  const handleSend = async () => {
    if (!date) { setApiMsg("Veuillez choisir une date."); return; }
    setSaving(true); setApiMsg("");
    try {
      const newPlan = await apiDates.create({
        date,
        time:     time  || undefined,
        location: location || undefined,
        excitement: 0,
        activity_keys: [],
      });
      setPlan(newPlan);
      go("proposal");
    } catch (e) {
      setApiMsg(e instanceof ApiError ? e.message : "Erreur lors de la sauvegarde.");
    } finally { setSaving(false); }
  };

  /** Étape excited → met à jour activities + excitement, puis envoie les emails */
  const handleFinish = async () => {
    if (!plan) return;
    setSaving(true); setApiMsg("");
    try {
      const updated = await apiDates.update(plan.id, {
        activity_keys: activities,
        excitement,
      });
      setPlan(updated);
      go("end");
    } catch (e) {
      setApiMsg(e instanceof ApiError ? e.message : "Erreur de sauvegarde.");
    } finally { setSaving(false); }
  };

  /** Envoyer l'invitation email aux 2 partenaires */
  const handleSendEmail = async () => {
    if (!plan) return;
    setSending(true); setApiMsg("");
    try {
      const res = await apiDates.sendInvitation(plan.id);
      setApiMsg(`✉️ ${res.detail}`);
      setPlan(p => p ? { ...p, email_sent: true } : p);
    } catch (e) {
      setApiMsg(e instanceof ApiError ? e.message : "Erreur lors de l'envoi.");
    } finally { setSending(false); }
  };

  return (
    <div className="min-h-screen bg-rose-50 flex items-center justify-center p-6 relative">
      {/* Header utilisateur */}
      <div className="fixed top-4 right-4 flex items-center gap-3 z-50">
        <span className="text-rose-300 text-sm font-body">👤 {user?.username}</span>
        <button onClick={logout}
          className="text-xs text-rose-300 hover:text-rose-500 transition-colors font-body">
          Déconnexion
        </button>
      </div>

      {/* HOME */}
      {section === "home" && (
        <div className="flex flex-col items-center gap-6 animate-fade-in text-center max-w-md">
          <div className="text-8xl animate-float select-none">🐱</div>
          <h1 className="font-display text-3xl text-rose-600 italic leading-snug">
            Tu veux bien sortir avec moi pour un rendez-vous ?
          </h1>
          <div className="flex gap-4 flex-wrap justify-center">
            <button className="btn-romantic text-lg px-10 py-4" onClick={handleYes}>Oui 😊</button>
            <button className="btn-romantic text-lg px-10 py-4 !bg-rose-300" onClick={handleNo}>Non 😒</button>
          </div>
        </div>
      )}

      {/* GREAT */}
      {section === "great" && (
        <div className="flex flex-col items-center gap-6 animate-fade-in text-center max-w-md">
          <div className="text-7xl animate-pulse-heart select-none">🎉</div>
          <h1 className="font-display text-3xl text-rose-600 italic">YEAHHH !!! Ne bouge pas !!</h1>
          <button className="btn-romantic text-lg px-10 py-4" onClick={() => go("free-date")}>CLIQUE ICI</button>
        </div>
      )}

      {/* SAD */}
      {section === "sad" && (
        <div className="flex flex-col items-center gap-6 animate-fade-in text-center max-w-md">
          <div className="text-7xl animate-float select-none">😿</div>
          <h1 className="font-display text-3xl text-rose-400 italic">Pourquoi ? 🥺</h1>
        </div>
      )}

      {/* UNDERSTANDING */}
      {section === "understanding" && (
        <div className="flex flex-col items-center gap-6 animate-fade-in text-center max-w-md">
          <div className="text-7xl animate-float select-none">😊</div>
          <h1 className="font-display text-3xl text-rose-500 italic">D'accord, à la prochaine alors 😊</h1>
        </div>
      )}

      {/* FREE DATE */}
      {section === "free-date" && (
        <div className="flex flex-col items-center gap-5 animate-fade-in text-center max-w-sm w-full">
          <div className="text-6xl animate-float select-none">😄</div>
          <h1 className="font-display text-3xl text-rose-600 italic">Quand es-tu libre ?</h1>

          <div className="flex gap-3 w-full flex-wrap">
            <input type="date" value={date} onChange={e => setDate(e.target.value)}
              className={`${inputCls} flex-1 min-w-[140px]`} />
            <input type="time" value={time} onChange={e => setTime(e.target.value)}
              className={`${inputCls} flex-1 min-w-[110px]`} />
          </div>

          <input type="text" placeholder="📍 Lieu du rendez-vous (optionnel)"
            value={location} onChange={e => setLocation(e.target.value)}
            className={`${inputCls} w-full text-left`} />

          {apiMsg && <p className="text-rose-400 text-sm">{apiMsg}</p>}

          <button className="btn-romantic text-lg w-full py-4" onClick={handleSend} disabled={saving}>
            {saving ? "Sauvegarde..." : "CLIQUE ICI 😊 😍"}
          </button>
        </div>
      )}

      {/* PROPOSAL */}
      {section === "proposal" && (
        <div className="flex flex-col items-center gap-8 animate-fade-in w-full max-w-2xl">
          <h1 className="font-display text-3xl text-rose-600 italic text-center">
            Que veux-tu faire lors de notre rendez-vous ?
          </h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
            {ACTIVITIES.map(({ key, label, emoji }) => (
              <label key={key} className="cursor-pointer">
                <input type="checkbox" className="sr-only"
                  checked={activities.includes(key)}
                  onChange={() => toggleActivity(key)} />
                <div className={`
                  flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-300
                  ${activities.includes(key)
                    ? "border-rose-400 bg-rose-100 shadow-[0_0_12px_rgba(255,42,78,0.2)]"
                    : "border-rose-100 bg-white/70 hover:border-rose-200"}
                `}>
                  <span className="text-3xl">{emoji}</span>
                  <h2 className={`font-display text-sm italic transition-colors ${
                    activities.includes(key) ? "text-rose-600" : "text-rose-400"}`}>
                    {label}
                  </h2>
                </div>
              </label>
            ))}
          </div>
          <button className="btn-romantic text-lg px-10 py-4" onClick={() => go("excited")}>Continuer</button>
        </div>
      )}

      {/* EXCITED */}
      {section === "excited" && (
        <div className="flex flex-col items-center gap-6 animate-fade-in text-center max-w-sm w-full">
          <div className="text-7xl animate-pulse-heart select-none">🐱</div>
          <h1 className="font-display text-3xl text-rose-600 italic">Note ton niveau d'excitation</h1>
          <div className="w-full px-4">
            <input type="range" min={0} max={100} value={excitement}
              onChange={e => setExcitement(Number(e.target.value))} className="w-full" />
            <div className="flex justify-between text-rose-300 text-sm mt-1 font-body">
              <span>Calme 😌</span>
              <span className="text-rose-500 font-bold text-base">{excitement}%</span>
              <span>Super excité 🥰</span>
            </div>
          </div>
          {apiMsg && <p className="text-rose-400 text-sm">{apiMsg}</p>}
          <button className="btn-romantic text-lg px-10 py-4" onClick={handleFinish} disabled={saving}>
            {saving ? "Sauvegarde..." : "Continuer 💗"}
          </button>
        </div>
      )}

      {/* END */}
      {section === "end" && plan && (
        <div className="flex flex-col items-center gap-6 animate-fade-in text-center max-w-md">
          <div className="text-8xl animate-float select-none">💗</div>
          <h1 className="font-display text-3xl text-rose-600 italic">C'est parfait ! 💗</h1>

          {/* Récapitulatif */}
          <div className="bg-white/80 rounded-2xl p-6 shadow-sm w-full text-left space-y-3">
            <Row label="📅 Date" value={plan.date} />
            {plan.time && <Row label="🕐 Heure" value={plan.time} />}
            {plan.location && <Row label="📍 Lieu" value={plan.location} />}
            <Row label="💗 Excitation" value={`${plan.excitement}%`} />
            {activities.length > 0 && (
              <Row label="🎯 Activités" value={
                activities.map(a => {
                  const f = ACTIVITIES.find(x => x.key === a);
                  return f ? `${f.emoji} ${f.label}` : a;
                }).join(", ")
              } />
            )}
            <Row label="📧 Partenaires" value={`${user?.email_partner1} & ${user?.email_partner2}`} />
          </div>

          {/* Bouton envoi email */}
          {!plan.email_sent ? (
            <button className="btn-romantic text-lg w-full py-4" onClick={handleSendEmail} disabled={sending}>
              {sending ? "Envoi en cours..." : "✉️ Envoyer l'invitation aux 2 partenaires"}
            </button>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-2xl px-6 py-3 text-green-600 text-sm font-body">
              ✅ Invitation envoyée à {user?.email_partner1} & {user?.email_partner2}
            </div>
          )}

          {apiMsg && (
            <p className={`text-sm font-body text-center ${plan.email_sent ? "text-green-500" : "text-rose-400"}`}>
              {apiMsg}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-xs text-rose-300 font-body uppercase tracking-wider">{label}</span>
      <p className="font-display text-rose-600 text-base">{value}</p>
    </div>
  );
}
