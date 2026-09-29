import { todayIso } from "../../lib/format";

interface Props {
  date: string; time: string; location: string;
  onDate: (v: string) => void; onTime: (v: string) => void; onLocation: (v: string) => void;
  onNext: () => void; error: string;
}

const inputCls = "px-4 py-3 rounded-2xl border-none outline-none bg-white/80 text-rose-700 shadow-sm font-body text-base focus:shadow-[0_0_0_2px_rgba(255,42,78,0.2)] transition-all";

export function StepFreeDate({ date, time, location, onDate, onTime, onLocation, onNext, error }: Props) {
  return (
    <form
      className="flex flex-col items-center gap-5 animate-fade-in text-center max-w-sm w-full"
      onSubmit={e => { e.preventDefault(); onNext(); }}
    >
      <div className="text-6xl animate-float select-none">😄</div>
      <h1 className="font-display text-3xl text-rose-600 italic">Quand es-tu libre ?</h1>
      <div className="flex gap-3 w-full flex-wrap">
        <input type="date" value={date} min={todayIso()} required aria-label="Date"
          onChange={e => onDate(e.target.value)} className={`${inputCls} flex-1 min-w-[140px]`} />
        <input type="time" value={time} aria-label="Heure"
          onChange={e => onTime(e.target.value)} className={`${inputCls} flex-1 min-w-[110px]`} />
      </div>
      <input type="text" placeholder="📍 Lieu du rendez-vous (optionnel)" maxLength={255}
        value={location} onChange={e => onLocation(e.target.value)}
        className={`${inputCls} w-full text-left`} />
      {error && <p className="text-rose-400 text-sm">{error}</p>}
      <button type="submit" className="btn-romantic text-lg w-full py-4">CLIQUE ICI 😊 😍</button>
    </form>
  );
}
