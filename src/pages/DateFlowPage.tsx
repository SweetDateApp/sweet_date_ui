import { useAuth } from "../context/useAuth";
import { useDateFlow } from "../hooks/useDateFlow";
import { StepHome }     from "../components/date-flow/StepHome";
import { StepGreat }    from "../components/date-flow/StepGreat";
import { StepSad }      from "../components/date-flow/StepSad";
import { StepFreeDate } from "../components/date-flow/StepFreeDate";
import { StepProposal } from "../components/date-flow/StepProposal";
import { StepExcited }  from "../components/date-flow/StepExcited";
import { StepEnd }      from "../components/date-flow/StepEnd";

export function DateFlowPage() {
  const { user } = useAuth();
  const { state, go, set, toggleActivity, confirmDate, save, sendInvitation, reset } = useDateFlow();
  const { step } = state;

  return (
    <div className="min-h-screen bg-rose-50 flex items-center justify-center px-6 pt-20 pb-10">
      {step === "home"  && <StepHome onYes={() => go("great")} onNo={() => go("sad")} />}
      {step === "great" && <StepGreat onNext={() => go("free-date")} />}
      {step === "sad"   && <StepSad onRetry={() => go("home")} />}
      {step === "free-date" && (
        <StepFreeDate
          date={state.date} time={state.time} location={state.location}
          onDate={v => set("date", v)} onTime={v => set("time", v)} onLocation={v => set("location", v)}
          onNext={confirmDate} error={state.error}
        />
      )}
      {step === "proposal" && (
        <StepProposal
          activities={state.activities} onToggle={toggleActivity}
          onNext={() => go("excited")} onBack={() => go("free-date")}
        />
      )}
      {step === "excited" && (
        <StepExcited
          excitement={state.excitement} onChange={v => set("excitement", v)}
          onNext={save} onBack={() => go("proposal")}
          saving={state.saving} error={state.error}
        />
      )}
      {step === "end" && state.plan && user && (
        <StepEnd
          plan={state.plan} user={user}
          onSendEmail={sendInvitation} sending={state.sending} message={state.message}
          onRestart={reset}
        />
      )}
    </div>
  );
}
