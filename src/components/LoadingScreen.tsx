import { useEffect, useState } from "react";

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [percent, setPercent] = useState(4);
  const [phase, setPhase] = useState<'counting' | 'hi' | 'welcome'>('counting');

  useEffect(() => {
    const interval = setInterval(() => {
      setPercent(p => {
        if (p >= 100) { clearInterval(interval); return 100; }
        return p + 1;
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('hi'), 10500);
    const t2 = setTimeout(() => setPhase('welcome'), 12500);
    const t3 = setTimeout(() => onComplete(), 20500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-rose-50 flex items-center justify-center">
      {phase === 'counting' && (
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <p className="text-5xl font-display text-rose-400 font-light tracking-wider">
            {percent}%
          </p>
          <div className="w-96 h-5 bg-white rounded-full p-[3px] shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-rose-400 to-rose-600 rounded-full transition-all duration-100"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="text-rose-300 font-body text-sm tracking-widest uppercase">Preparing something special...</p>
        </div>
      )}

      {phase === 'hi' && (
        <div className="flex items-center justify-center animate-fade-in">
          <h1 className="text-6xl font-display text-rose-500 overflow-hidden whitespace-nowrap typing-text typing-cursor">
            Hii
          </h1>
        </div>
      )}

      {phase === 'welcome' && (
        <div className="flex items-center justify-center animate-fade-in">
          <h1 className="text-6xl font-display text-rose-500 overflow-hidden whitespace-nowrap typing-text typing-cursor">
            Welcome
          </h1>
        </div>
      )}
    </div>
  );
}
