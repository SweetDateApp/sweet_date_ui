import { useCallback, useReducer } from "react";
import { apiDates, errorMessage, type ApiDatePlan } from "../lib/api";
import { todayIso } from "../lib/format";
import type { DateActivity, DateStep } from "../types";

export interface DateFlowState {
  step:       DateStep;
  date:       string;
  time:       string;
  location:   string;
  activities: DateActivity[];
  excitement: number;
  plan:       ApiDatePlan | null;
  saving:     boolean;
  sending:    boolean;
  error:      string;
  message:    string;
}

type Field = "date" | "time" | "location" | "excitement";

type Action =
  | { type: "go"; step: DateStep }
  | { type: "set"; field: Field; value: string | number }
  | { type: "toggleActivity"; key: DateActivity }
  | { type: "error"; error: string }
  | { type: "saveStart" }
  | { type: "saveDone"; plan: ApiDatePlan }
  | { type: "saveFailed"; error: string }
  | { type: "sendStart" }
  | { type: "sendDone"; plan: ApiDatePlan; message: string }
  | { type: "sendFailed"; message: string }
  | { type: "reset" };

const initialState: DateFlowState = {
  step: "home", date: "", time: "", location: "", activities: [], excitement: 0,
  plan: null, saving: false, sending: false, error: "", message: "",
};

function reducer(state: DateFlowState, action: Action): DateFlowState {
  switch (action.type) {
    case "go":             return { ...state, step: action.step, error: "" };
    case "set":            return { ...state, [action.field]: action.value, error: "" };
    case "toggleActivity": return {
      ...state,
      activities: state.activities.includes(action.key)
        ? state.activities.filter(a => a !== action.key)
        : [...state.activities, action.key],
    };
    case "error":      return { ...state, error: action.error };
    case "saveStart":  return { ...state, saving: true, error: "" };
    case "saveDone":   return { ...state, saving: false, plan: action.plan, step: "end" };
    case "saveFailed": return { ...state, saving: false, error: action.error };
    case "sendStart":  return { ...state, sending: true, message: "" };
    case "sendDone":   return { ...state, sending: false, plan: action.plan, message: action.message };
    case "sendFailed": return { ...state, sending: false, message: action.message };
    case "reset":      return initialState;
  }
}

export function useDateFlow() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const go  = useCallback((step: DateStep) => dispatch({ type: "go", step }), []);
  const set = useCallback((field: Field, value: string | number) => dispatch({ type: "set", field, value }), []);
  const toggleActivity = useCallback((key: DateActivity) => dispatch({ type: "toggleActivity", key }), []);
  const reset = useCallback(() => dispatch({ type: "reset" }), []);

  const confirmDate = () => {
    if (!state.date) return dispatch({ type: "error", error: "Choisis une date 📅" });
    if (state.date < todayIso()) return dispatch({ type: "error", error: "Cette date est déjà passée." });
    go("proposal");
  };

  // Le plan n'est enregistré qu'une fois toutes les étapes remplies : pas de plan incomplet ni de doublon.
  const save = async () => {
    if (state.saving) return;
    dispatch({ type: "saveStart" });
    try {
      const plan = await apiDates.create({
        date:          state.date,
        time:          state.time || null,
        location:      state.location.trim(),
        excitement:    state.excitement,
        activity_keys: state.activities,
      });
      dispatch({ type: "saveDone", plan });
    } catch (e) {
      dispatch({ type: "saveFailed", error: errorMessage(e, "Erreur lors de la sauvegarde.") });
    }
  };

  const sendInvitation = async () => {
    if (!state.plan || state.sending) return;
    dispatch({ type: "sendStart" });
    try {
      const res = await apiDates.sendInvitation(state.plan.id);
      dispatch({ type: "sendDone", plan: res.plan, message: `✉️ ${res.detail}` });
    } catch (e) {
      dispatch({ type: "sendFailed", message: errorMessage(e, "Erreur lors de l'envoi.") });
    }
  };

  return { state, go, set, toggleActivity, confirmDate, save, sendInvitation, reset };
}
