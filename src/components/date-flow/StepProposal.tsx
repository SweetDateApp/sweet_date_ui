import type { DateActivity } from "../../types";
import { ACTIVITY_LIST } from "../../types";

interface Props {
  activities: DateActivity[];
  onToggle: (key: DateActivity) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepProposal({ activities, onToggle, onNext, onBack }: Props) {
  return (
    <div className="flex flex-col items-center gap-8 animate-fade-in w-full max-w-2xl">
      <h1 className="font-display text-3xl text-rose-600 italic text-center">
        Que veux-tu faire lors de notre rendez-vous ?
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
        {ACTIVITY_LIST.map(({ key, label, emoji }) => (
          <label key={key} className="cursor-pointer">
            <input type="checkbox" className="sr-only"
              checked={activities.includes(key)} onChange={() => onToggle(key)} />
            <div className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-300
              ${activities.includes(key)
                ? "border-rose-400 bg-rose-100 shadow-[0_0_12px_rgba(255,42,78,0.2)]"
                : "border-rose-100 bg-white/70 hover:border-rose-200"}`}>
              <span className="text-3xl">{emoji}</span>
              <h2 className={`font-display text-sm italic transition-colors ${activities.includes(key) ? "text-rose-600" : "text-rose-400"}`}>
                {label}
              </h2>
            </div>
          </label>
        ))}
      </div>
      <div className="flex gap-3 w-full">
        <button className="btn-romantic flex-1 !bg-rose-200 text-rose-600 py-3" onClick={onBack}>← Retour</button>
        <button className="btn-romantic flex-1 py-3" onClick={onNext}>Continuer →</button>
      </div>
    </div>
  );
}
