import { useState } from "react";
import { DatesList }       from "../components/profile/DatesList";
import { AccountSettings } from "../components/profile/AccountSettings";
import { ActivityChart }   from "../components/profile/ActivityChart";
import { useDatePlans }    from "../hooks/useDatePlans";

type Tab = "dates" | "settings" | "stats";

const TABS: { id: Tab; label: string; title: string }[] = [
  { id: "dates",    label: "🗓️ Mes dates",    title: "Mes rendez-vous planifiés" },
  { id: "stats",    label: "📊 Statistiques", title: "Activité la plus fréquente" },
  { id: "settings", label: "⚙️ Paramètres",   title: "Paramètres du compte" },
];

export function ProfilePage() {
  const [tab, setTab] = useState<Tab>("dates");
  const datePlans = useDatePlans();
  const current = TABS.find(t => t.id === tab)!;

  return (
    <div className="min-h-screen bg-rose-50 pt-14">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="font-display text-2xl text-rose-600 italic mb-6">Mon Profil</h1>

        <div role="tablist" className="flex bg-white/70 rounded-2xl p-1 gap-1 mb-6 shadow-sm">
          {TABS.map(({ id, label }) => (
            <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)}
              className={`flex-1 py-2 rounded-xl text-sm font-body font-medium transition-all ${
                tab === id ? "bg-rose-500 text-white shadow-sm" : "text-rose-300 hover:text-rose-500"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="bg-white/70 rounded-2xl p-6 shadow-sm">
          <h2 className="font-display text-lg text-rose-500 italic mb-4">{current.title}</h2>
          {tab === "dates"    && <DatesList {...datePlans} />}
          {tab === "stats"    && <ActivityChart plans={datePlans.plans} loading={datePlans.loading} error={datePlans.error} />}
          {tab === "settings" && <AccountSettings />}
        </div>
      </div>
    </div>
  );
}
