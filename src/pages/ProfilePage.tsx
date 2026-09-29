import { useState } from "react";
import { DatesList }       from "../components/profile/DatesList";
import { AccountSettings } from "../components/profile/AccountSettings";
import { ActivityChart }   from "../components/profile/ActivityChart";

type Tab = "dates" | "settings" | "stats";

export function ProfilePage() {
  const [tab, setTab] = useState<Tab>("dates");

  return (
    <div className="min-h-screen bg-rose-50 pt-14">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="font-display text-2xl text-rose-600 italic mb-6">Mon Profil</h1>

        {/* Tabs */}
        <div className="flex bg-white/70 rounded-2xl p-1 gap-1 mb-6 shadow-sm">
          {([
            { id: "dates",    label: "🗓️ Mes dates"   },
            { id: "stats",    label: "📊 Statistiques" },
            { id: "settings", label: "⚙️ Paramètres"   },
          ] as { id: Tab; label: string }[]).map(({ id, label }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex-1 py-2 rounded-xl text-sm font-body font-medium transition-all ${
                tab === id ? "bg-rose-500 text-white shadow-sm" : "text-rose-300 hover:text-rose-500"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white/70 rounded-2xl p-6 shadow-sm">
          {tab === "dates"    && (
            <>
              <h2 className="font-display text-lg text-rose-500 italic mb-4">Mes rendez-vous planifiés</h2>
              <DatesList />
            </>
          )}
          {tab === "stats"    && (
            <>
              <h2 className="font-display text-lg text-rose-500 italic mb-4">Activité la plus fréquente</h2>
              <ActivityChart />
            </>
          )}
          {tab === "settings" && (
            <>
              <h2 className="font-display text-lg text-rose-500 italic mb-4">Paramètres du compte</h2>
              <AccountSettings />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
