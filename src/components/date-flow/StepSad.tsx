interface Props { phase: "sad" | "understanding"; }

export function StepSad({ phase }: Props) {
  if (phase === "understanding") return (
    <div className="flex flex-col items-center gap-6 animate-fade-in text-center max-w-md">
      <div className="text-7xl animate-float select-none">😊</div>
      <h1 className="font-display text-3xl text-rose-500 italic">D'accord, à la prochaine alors 😊</h1>
    </div>
  );
  return (
    <div className="flex flex-col items-center gap-6 animate-fade-in text-center max-w-md">
      <div className="text-7xl animate-float select-none">😿</div>
      <h1 className="font-display text-3xl text-rose-400 italic">Pourquoi ? 🥺</h1>
    </div>
  );
}
