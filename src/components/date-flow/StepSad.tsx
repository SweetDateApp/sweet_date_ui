import { useEffect, useState } from "react";

interface Props { onRetry: () => void; }

export function StepSad({ onRetry }: Props) {
  const [understanding, setUnderstanding] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setUnderstanding(true), 8000);
    return () => clearTimeout(t);
  }, []);

  if (understanding) return (
    <div className="flex flex-col items-center gap-6 animate-fade-in text-center max-w-md">
      <div className="text-7xl animate-float select-none">😊</div>
      <h1 className="font-display text-3xl text-rose-500 italic">D'accord, à la prochaine alors 😊</h1>
      <button className="btn-romantic text-base px-8 py-3" onClick={onRetry}>Finalement… 🥺</button>
    </div>
  );
  return (
    <div className="flex flex-col items-center gap-6 animate-fade-in text-center max-w-md">
      <div className="text-7xl animate-float select-none">😿</div>
      <h1 className="font-display text-3xl text-rose-400 italic">Pourquoi ? 🥺</h1>
    </div>
  );
}
