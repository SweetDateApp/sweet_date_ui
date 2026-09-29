import { useState } from "react";
import type { DateActivity, DateStep } from "../types";
import { apiDates, ApiError, type ApiDatePlan } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { StepHome }     from "../components/date-flow/StepHome";
import { StepGreat }    from "../components/date-flow/StepGreat";
import { StepSad }      from "../components/date-flow/StepSad";
import { StepFreeDate } from "../components/date-flow/StepFreeDate";
import { StepProposal } from "../components/date-flow/StepProposal";
import { StepExcited }  from "../components/date-flow/StepExcited";
import { StepEnd }      from "../components/date-flow/StepEnd";

export function DateFlowPage() {
  const { user } = useAuth();

  const [step,       setStep]       = useState<DateStep>("home");
  const [sadPhase,   setSadPhase]   = useState<"sad" | "understanding">("sad");

  // Form state
  const [date,       setDate]       = useState("");
  const [time,       setTime]       = useState("");
  const [location,   setLocation]   = useState("");
  const [activities, setActivities] = useState<DateActivity[]>([]);
  const [excitement, setExcitement] = useState(0);

  // API state
  const [plan,    setPlan]    = useState<ApiDatePlan | null>(null);
  const [saving,  setSaving]  = useState(false);
  const [sending, setSending] = useState(false);
  const [error,   setError]   = useState("");
  const [message, setMessage] = useState("");

  const go = (s: DateStep, delay = 300) => setTimeout(() => setStep(s), delay);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleYes = () => { go("great"); };

  const handleNo = () => {
    setSadPhase("sad");
    setStep("sad");
    setTimeout(() => setSadPhase("understanding"), 8000);
  };

  const handleFreeDate = async () => {
    if (!date) { setError("Veuillez choisir une date."); return; }
    setSaving(true); setError("");
    try {
      const newPlan = await apiDates.create({
        date, time: time || undefined, location: location || undefined,
        excitement: 0, activity_keys: [],
      });
      setPlan(newPlan);
      go("proposal");
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Erreur lors de la sauvegarde.");
    } finally { setSaving(false); }
  };

  const handleFinish = async () => {
    if (!plan) return;
    setSaving(true); setError("");
    try {
      const updated = await apiDates.update(plan.id, { activity_keys: activities, excitement });
      setPlan(updated);
      go("end");
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Erreur de sauvegarde.");
    } finally { setSaving(false); }
  };

  const handleSendEmail = async () => {
    if (!plan) return;
    setSending(true); setMessage("");
    try {
      const res = await apiDates.sendInvitation(plan.id);
      setMessage(`✉️ ${res.detail}`);
      setPlan(p => p ? { ...p, email_sent: true } : p);
    } catch (e) {
      setMessage(e instanceof ApiError ? e.message : "Erreur lors de l'envoi.");
    } finally { setSending(false); }
  };

  const toggleActivity = (key: DateActivity) =>
    setActivities(prev => prev.includes(key) ? prev.filter(a => a !== key) : [...prev, key]);

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-rose-50 flex items-center justify-center p-6">
      {step === "home"          && <StepHome onYes={handleYes} onNo={handleNo} />}
      {step === "great"         && <StepGreat onNext={() => go("free-date")} />}
      {(step === "sad")         && <StepSad phase={sadPhase} />}
      {step === "free-date"     && (
        <StepFreeDate
          date={date} time={time} location={location}
          onDate={setDate} onTime={setTime} onLocation={setLocation}
          onNext={handleFreeDate} saving={saving} error={error}
        />
      )}
      {step === "proposal"      && (
        <StepProposal
          activities={activities} onToggle={toggleActivity}
          onNext={() => go("excited")} onBack={() => go("free-date")}
        />
      )}
      {step === "excited"       && (
        <StepExcited
          excitement={excitement} onChange={setExcitement}
          onNext={handleFinish} onBack={() => go("proposal")}
          saving={saving} error={error}
        />
      )}
      {step === "end" && plan && user && (
        <StepEnd
          plan={plan} user={user}
          onSendEmail={handleSendEmail} sending={sending} message={message}
        />
      )}
    </div>
  );
}
