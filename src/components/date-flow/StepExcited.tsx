interface Props {
  excitement: number;
  onChange: (v: number) => void;
  onNext: () => void;
  onBack: () => void;
  saving: boolean;
  error: string;
}

export function StepExcited({ excitement, onChange, onNext, onBack, saving, error }: Props) {
  return (
    <div className="flex flex-col items-center gap-6 animate-fade-in text-center max-w-sm w-full">
      <div className="text-7xl animate-pulse-heart select-none">🐱</div>
      <h1 className="font-display text-3xl text-rose-600 italic">Note ton niveau d'excitation</h1>
      <div className="w-full px-4">
        <input type="range" min={0} max={100} value={excitement}
          onChange={e => onChange(Number(e.target.value))} className="w-full" />
        <div className="flex justify-between text-rose-300 text-sm mt-1 font-body">
          <span>Calme 😌</span>
          <span className="text-rose-500 font-bold text-base">{excitement}%</span>
          <span>Super excité 🥰</span>
        </div>
      </div>
      {error && <p className="text-rose-400 text-sm">{error}</p>}
      <div className="flex gap-3 w-full">
        <button className="btn-romantic flex-1 !bg-rose-200 text-rose-600 py-3" onClick={onBack}>← Retour</button>
        <button className="btn-romantic flex-1 py-3" onClick={onNext} disabled={saving}>
          {saving ? "Sauvegarde..." : "Continuer 💗"}
        </button>
      </div>
    </div>
  );
}
