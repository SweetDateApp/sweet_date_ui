import { useState } from "react";
import type { ApiUser } from "../lib/api";

interface Props {
  user: ApiUser | null;
  size: "sm" | "lg";
}

const sizes = { sm: "w-8 h-8 text-sm", lg: "w-16 h-16 text-2xl" };

export function Avatar({ user, size }: Props) {
  // Mémorise l'URL en échec : une nouvelle photo réaffiche l'image.
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const src = user?.avatar ?? null;
  const cls = `${sizes[size]} rounded-full border-2 border-rose-200 shrink-0`;

  if (src && src !== failedSrc) {
    return <img src={src} alt={user?.username ?? "avatar"} onError={() => setFailedSrc(src)} className={`${cls} object-cover`} />;
  }
  return (
    <div className={`${cls} bg-rose-100 flex items-center justify-center text-rose-400 font-bold`}>
      {user?.username?.charAt(0).toUpperCase()}
    </div>
  );
}
