import type { ReactNode } from "react";
import type { AppPage } from "../types";
import { useAuth } from "../context/useAuth";
import { Avatar } from "./Avatar";

interface Props {
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
}

export function Navbar({ currentPage, onNavigate }: Props) {
  const { user, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-rose-100 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-2">
        <button
          onClick={() => onNavigate("date-flow")}
          className="font-display text-xl text-rose-500 italic hover:text-rose-600 transition-colors whitespace-nowrap"
        >
          💗 <span className="hidden sm:inline">Sweet Date</span>
        </button>

        <div className="flex items-center gap-1">
          <NavBtn active={currentPage === "date-flow"} onClick={() => onNavigate("date-flow")}>
            🗓️ <span className="hidden sm:inline">Nouveau date</span>
          </NavBtn>
          <NavBtn active={currentPage === "profile"} onClick={() => onNavigate("profile")}>
            👤 <span className="hidden sm:inline">Profil</span>
          </NavBtn>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate("profile")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Avatar user={user} size="sm" />
            <span className="text-rose-500 text-sm font-body font-medium hidden sm:block">{user?.username}</span>
          </button>
          <button
            onClick={logout}
            className="text-xs text-rose-300 hover:text-rose-500 transition-colors font-body px-2 py-1 rounded-lg hover:bg-rose-50"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </nav>
  );
}

function NavBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`px-3 py-1.5 rounded-xl text-sm font-body font-medium transition-all ${
        active ? "bg-rose-100 text-rose-600" : "text-rose-300 hover:text-rose-500 hover:bg-rose-50"
      }`}
    >
      {children}
    </button>
  );
}
