import { useState } from "react";
import { useAuth, type RegisterData } from "../context/AuthContext";
import { ApiError } from "../lib/api";
import loginGif from "../assets/login.gif";

interface LoginPageProps { onLogin: () => void; }

type Mode = "login" | "register";

const inputCls = `
  w-full px-5 py-3 rounded-2xl border-none outline-none
  bg-white/70 backdrop-blur text-rose-700 placeholder-rose-200
  shadow-sm focus:shadow-[0_0_0_2px_rgba(255,42,78,0.2)]
  transition-all text-center font-body text-base
`;

export function LoginPage({ onLogin }: LoginPageProps) {
  const { login, register } = useAuth();
  const [mode, setMode]     = useState<Mode>("login");
  const [error, setError]   = useState("");
  const [busy, setBusy]     = useState(false);

  // Login fields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Register fields
  const [reg, setReg] = useState<RegisterData>({
    username: "", password: "", password_confirm: "",
    email_partner1: "", email_partner2: "",
  });

  const handleLogin = async () => {
    if (!username || !password) { setError("Tous les champs sont requis."); return; }
    setBusy(true); setError("");
    try {
      await login(username, password);
      onLogin();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Erreur de connexion.");
    } finally { setBusy(false); }
  };

  const handleRegister = async () => {
    const { username, password, password_confirm, email_partner1, email_partner2 } = reg;
    if (!username || !password || !email_partner1 || !email_partner2) {
      setError("Tous les champs sont requis."); return;
    }
    if (password !== password_confirm) { setError("Les mots de passe ne correspondent pas."); return; }
    setBusy(true); setError("");
    try {
      await register(reg);
      onLogin();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Erreur lors de la création du compte.");
    } finally { setBusy(false); }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") mode === "login" ? handleLogin() : handleRegister();
  };

  return (
    <div className="fixed inset-0 bg-rose-50 flex items-center justify-center overflow-y-auto py-8">
      <div className="flex flex-col items-center gap-4 w-full max-w-sm px-6 animate-slide-up">
        <div className="animate-float text-7xl mb-1 select-none">
          <img src={loginGif} alt="love loading" />
        </div>
        <h1 className="font-display text-3xl text-rose-600 text-center italic">Sweet Date</h1>

        {/* Toggle login / register */}
        <div className="flex w-full bg-rose-100 rounded-2xl p-1 gap-1">
          {(["login", "register"] as Mode[]).map(m => (
            <button key={m}
              onClick={() => { setMode(m); setError(""); }}
              className={`flex-1 py-2 rounded-xl text-sm font-body font-semibold transition-all ${
                mode === m ? "bg-white text-rose-600 shadow-sm" : "text-rose-300 hover:text-rose-400"
              }`}
            >
              {m === "login" ? "Connexion" : "Créer un compte"}
            </button>
          ))}
        </div>

        {/* ── LOGIN ── */}
        {mode === "login" && (
          <div className="w-full flex flex-col gap-3">
            <input className={inputCls} type="text" placeholder="Identifiant"
              value={username} onChange={e => setUsername(e.target.value)} onKeyDown={handleKey} />
            <input className={inputCls} type="password" placeholder="Mot de passe"
              value={password} onChange={e => setPassword(e.target.value)} onKeyDown={handleKey} />
          </div>
        )}

        {/* ── REGISTER ── */}
        {mode === "register" && (
          <div className="w-full flex flex-col gap-3">
            <input className={inputCls} type="text" placeholder="Identifiant"
              value={reg.username} onKeyDown={handleKey}
              onChange={e => setReg(r => ({ ...r, username: e.target.value }))} />
            <input className={inputCls} type="password" placeholder="Mot de passe (min. 8 caractères)"
              value={reg.password} onKeyDown={handleKey}
              onChange={e => setReg(r => ({ ...r, password: e.target.value }))} />
            <input className={inputCls} type="password" placeholder="Confirmer le mot de passe"
              value={reg.password_confirm} onKeyDown={handleKey}
              onChange={e => setReg(r => ({ ...r, password_confirm: e.target.value }))} />

            <div className="border-t border-rose-100 pt-3">
              <p className="text-rose-300 text-xs text-center font-body mb-2">
                📧 Emails des 2 partenaires (pour recevoir l'invitation romantique)
              </p>
              <div className="flex flex-col gap-2">
                <input className={inputCls} type="email" placeholder="Email partenaire 1 (vous)"
                  value={reg.email_partner1} onKeyDown={handleKey}
                  onChange={e => setReg(r => ({ ...r, email_partner1: e.target.value }))} />
                <input className={inputCls} type="email" placeholder="Email partenaire 2 (lui 💕)"
                  value={reg.email_partner2} onKeyDown={handleKey}
                  onChange={e => setReg(r => ({ ...r, email_partner2: e.target.value }))} />
              </div>
            </div>
          </div>
        )}

        <button
          onClick={mode === "login" ? handleLogin : handleRegister}
          disabled={busy}
          className="btn-romantic w-full text-lg mt-1 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {busy ? "..." : mode === "login" ? "Entrer 💗" : "Créer notre compte 💕"}
        </button>

        {error && (
          <p className="text-sm font-body text-center text-rose-500 animate-fade-in">{error}</p>
        )}
      </div>
    </div>
  );
}
