import { useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { ApiError } from "../../lib/api";

const BASE_URL = import.meta.env.VITE_API_URL?.replace("/api", "") ?? "http://localhost:8000";

const inputCls = "w-full px-4 py-2.5 rounded-xl border border-rose-100 outline-none bg-white/80 text-rose-700 font-body text-sm focus:border-rose-300 focus:shadow-[0_0_0_2px_rgba(255,42,78,0.1)] transition-all";

export function AccountSettings() {
  const { user, updateUser, uploadAvatar } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  const [username,       setUsername]       = useState(user?.username ?? "");
  const [emailPartner1,  setEmailPartner1]  = useState(user?.email_partner1 ?? "");
  const [emailPartner2,  setEmailPartner2]  = useState(user?.email_partner2 ?? "");
  const [saving,  setSaving]  = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error,   setError]   = useState("");

  const avatarSrc = user?.avatar
    ? (user.avatar.startsWith("http") ? user.avatar : `${BASE_URL}${user.avatar}`)
    : null;

  const handleSave = async () => {
    setSaving(true); setMessage(""); setError("");
    try {
      await updateUser({ username, email_partner1: emailPartner1, email_partner2: emailPartner2 });
      setMessage("✅ Profil mis à jour !");
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Erreur de sauvegarde.");
    } finally { setSaving(false); }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setMessage(""); setError("");
    try {
      await uploadAvatar(file);
      setMessage("✅ Photo mise à jour !");
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Erreur upload.");
    } finally { setUploading(false); }
  };

  return (
    <div className="space-y-5">
      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="relative">
          {avatarSrc ? (
            <img src={avatarSrc} alt="avatar"
              className="w-16 h-16 rounded-full object-cover border-2 border-rose-200" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-rose-100 border-2 border-rose-200 flex items-center justify-center text-rose-400 text-2xl font-bold">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
          )}
          <button
            onClick={() => fileRef.current?.click()}
            className="absolute -bottom-1 -right-1 w-6 h-6 bg-rose-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-rose-600 transition-colors"
            title="Changer la photo"
          >
            {uploading ? "…" : "✎"}
          </button>
        </div>
        <div>
          <p className="font-display text-rose-600 font-medium">{user?.username}</p>
          <p className="text-rose-300 text-xs font-body">Membre depuis {new Date(user?.created_at ?? "").toLocaleDateString("fr-FR")}</p>
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
      </div>

      {/* Champs */}
      <div className="space-y-3">
        <div>
          <label className="text-xs text-rose-300 font-body uppercase tracking-wider mb-1 block">Identifiant</label>
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} className={inputCls} />
        </div>
        <div className="border-t border-rose-50 pt-3">
          <p className="text-xs text-rose-300 font-body mb-2">📧 Emails des partenaires</p>
          <div className="space-y-2">
            <input type="email" placeholder="Email partenaire 1"
              value={emailPartner1} onChange={e => setEmailPartner1(e.target.value)} className={inputCls} />
            <input type="email" placeholder="Email partenaire 2"
              value={emailPartner2} onChange={e => setEmailPartner2(e.target.value)} className={inputCls} />
          </div>
        </div>
      </div>

      {message && <p className="text-green-500 text-sm font-body">{message}</p>}
      {error   && <p className="text-rose-400 text-sm font-body">{error}</p>}

      <button onClick={handleSave} disabled={saving}
        className="btn-romantic w-full py-3 text-sm disabled:opacity-60">
        {saving ? "Sauvegarde..." : "Enregistrer les modifications"}
      </button>
    </div>
  );
}
