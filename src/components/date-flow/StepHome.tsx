interface Props { onYes: () => void; onNo: () => void; }

export function StepHome({ onYes, onNo }: Props) {
  return (
    <div className="flex flex-col items-center gap-6 animate-fade-in text-center max-w-md">
      <div className="text-8xl animate-float select-none">🐱</div>
      <h1 className="font-display text-3xl text-rose-600 italic leading-snug">
        Tu veux bien sortir avec moi pour un rendez-vous ?
      </h1>
      <div className="flex gap-4 flex-wrap justify-center">
        <button className="btn-romantic text-lg px-10 py-4" onClick={onYes}>Oui 😊</button>
        <button className="btn-romantic text-lg px-10 py-4 !bg-rose-300" onClick={onNo}>Non 😒</button>
      </div>
    </div>
  );
}
