import { useEffect } from 'react';

export function useHeartCursor(active: boolean) {
  useEffect(() => {
    if (!active) return;

    const handleMove = (e: MouseEvent) => {
      const heart = document.createElement('span');
      heart.className = 'heart-cursor';
      heart.textContent = ['💗', '💕', '💖', '❤️', '🩷'][Math.floor(Math.random() * 5)];
      heart.style.left = `${e.clientX}px`;
      heart.style.top = `${e.clientY}px`;
      document.body.appendChild(heart);
      setTimeout(() => heart.remove(), 2000);
    };

    document.addEventListener('mousemove', handleMove);
    return () => document.removeEventListener('mousemove', handleMove);
  }, [active]);
}
