interface Props { onNext: () => void; }

export function StepGreat({ onNext }: Props) {
  return (
    <div className="flex flex-col items-center gap-6 animate-fade-in text-center max-w-md">
      <div className="text-7xl animate-pulse-heart select-none">🎉</div>
      <h1 className="font-display text-3xl text-rose-600 italic">YEAHHH !!! Ne bouge pas !!</h1>
      <button className="btn-romantic text-lg px-10 py-4" onClick={onNext}>CLIQUE ICI</button>
    </div>
  );
}
