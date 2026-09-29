import type { ApiDatePlan, ApiUser } from "../../lib/api";
import { ACTIVITY_LIST } from "../../types";

interface Props {
  plan: ApiDatePlan;
  user: ApiUser;
  onSendEmail: () => void;
  sending: boolean;
  message: string;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-xs text-rose-300 font-body uppercase tracking-wider">{label}</span>
      <p className="font-display text-rose-600 text-base">{value}</p>
    </div>
  );
}

export function StepEnd({ plan, user, onSendEmail, sending, message }: Props) {
  const actLabels = plan.activities.map(a => {
    const found = ACTIVITY_LIST.find(x => x.key === a.activity);
    return found ? `${found.emoji} ${found.label}` : a.activity;
  }).join(", ");

  return (
    <div className="flex flex-col items-center gap-6 animate-fade-in text-center max-w-md w-full">
      <div className="text-8xl animate-float select-none">💗</div>
      <h1 className="font-display text-3xl text-rose-600 italic">C'est parfait ! 💗</h1>
      <div className="bg-white/80 rounded-2xl p-6 shadow-sm w-full text-left space-y-3">
        <Row label="📅 Date" value={plan.date} />
        {plan.time    && <Row label="🕐 Heure"     value={plan.time} />}
        {plan.location && <Row label="📍 Lieu"      value={plan.location} />}
        <Row label="💗 Excitation" value={`${plan.excitement}%`} />
        {actLabels && <Row label="🎯 Activités" value={actLabels} />}
        <Row label="📧 Partenaires" value={`${user.email_partner1} & ${user.email_partner2}`} />
      </div>
      {!plan.email_sent ? (
        <button className="btn-romantic text-lg w-full py-4" onClick={onSendEmail} disabled={sending}>
          {sending ? "Envoi en cours..." : "✉️ Envoyer l'invitation aux 2 partenaires"}
        </button>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-2xl px-6 py-3 text-green-600 text-sm font-body">
          ✅ Invitation envoyée à {user.email_partner1} & {user.email_partner2}
        </div>
      )}
      {message && (
        <p className={`text-sm font-body text-center ${plan.email_sent ? "text-green-500" : "text-rose-400"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
