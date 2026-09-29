import { useState, useRef } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useAuth } from "../../context/useAuth";
import { errorMessage } from "../../lib/api";
import { Avatar } from "../Avatar";

const MAX_AVATAR_MB = 5;
const inputCls = "w-full px-4 py-2.5 rounded-xl border border-rose-100 outline-none bg-white/80 text-rose-700 font-body text-sm focus:border-rose-300 focus:shadow-[0_0_0_2px_rgba(255,42,78,0.1)] transition-all";

export function AccountSettings() {
  const { user, updateUser, uploadAvatar } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  const [username,      setUsername]      = useState(user?.username ?? "");
  const [emailPartner1, setEmailPartner1] = useState(user?.email_partner1 ?? "");
  const [emailPartner2, setEmailPartner2] = useState(user?.email_partner2 ?? "");
  const [saving,    setSaving]    = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message,   setMessage]   = useState("");
  const [error,     setError]     = useState("");

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true); setMessage(""); setError("");
    try {
      await updateUser({ username: username.trim(), email_partner1: emailPartner1.trim(), email_partner2: emailPartner2.trim() });
      setMessage("✅ Profil mis à jour !");
    } catch (err) {
      setError(errorMessage(err, "Erreur de sauvegarde."));
    } finally { setSaving(false); }
  };

  const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const file = input.files?.[0];
    input.value = ""; // permet de re-sélectionner le même fichier
    if (!file) return;
    setMessage(""); setError("");
    if (!file.type.startsWith("image/")) { setError("Choisis un fichier image."); return; }
    if (file.size > MAX_AVATAR_MB * 1024 * 1024) { setError(`L'image ne doit pas dépasser ${MAX_AVATAR_MB} Mo.`); return; }

    setUploading(true);
    try {
      await uploadAvatar(file);
      setMessage("✅ Photo mise à jour !");
    } catch (err) {
      setError(errorMessage(err, "Erreur lors de l'envoi de la photo."));
    } finally { setUploading(false); }
  };

  return (
    <form className="space-y-5" onSubmit={handleSave}>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar user={user} size="lg" />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="absolute -bottom-1 -right-1 w-6 h-6 bg-rose-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-rose-600 transition-colors disabled:opacity-60"
            title="Changer la photo"
            aria-label="Changer la photo"
          >
            {uploading ? "…" : "✎"}
          </button>
        </div>
        <div>
          <p className="font-display text-rose-600 font-medium">{user?.username}</p>
          {user?.created_at && (
            <p className="text-rose-300 text-xs font-body">Membre depuis {new Date(user.created_at).toLocaleDateString("fr-FR")}</p>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
      </div>

      <div className="space-y-3">
        <div>
          <label htmlFor="username" className="text-xs text-rose-300 font-body uppercase tracking-wider mb-1 block">Identifiant</label>
          <input id="username" type="text" required maxLength={150} value={username}
            onChange={e => setUsername(e.target.value)} className={inputCls} />
        </div>
        <div className="border-t border-rose-50 pt-3">
          <p className="text-xs text-rose-300 font-body mb-2">📧 Emails des partenaires</p>
          <div className="space-y-2">
            <input type="email" required placeholder="Email partenaire 1" aria-label="Email partenaire 1"
              value={emailPartner1} onChange={e => setEmailPartner1(e.target.value)} className={inputCls} />
            <input type="email" required placeholder="Email partenaire 2" aria-label="Email partenaire 2"
              value={emailPartner2} onChange={e => setEmailPartner2(e.target.value)} className={inputCls} />
          </div>
        </div>
      </div>

      {message && <p className="text-green-500 text-sm font-body">{message}</p>}
      {error   && <p className="text-rose-400 text-sm font-body">{error}</p>}

      <button type="submit" disabled={saving} className="btn-romantic w-full py-3 text-sm disabled:opacity-60">
        {saving ? "Sauvegarde..." : "Enregistrer les modifications"}
      </button>
    </form>
  );
}
