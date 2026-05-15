import { useState, useCallback } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { LoadingScreen } from "./components/LoadingScreen";
import { LoginPage } from "./components/LoginPage";
import { HomePage } from "./components/HomePage";
import { useHeartCursor } from "./hooks/useHeartCursor";

type Phase = "loading" | "login" | "app";

function Inner() {
  const { user, loading } = useAuth();
  const [phase, setPhase] = useState<Phase>("loading");

  useHeartCursor(phase === "app" && !!user);

  const handleLoadComplete = useCallback(() => setPhase("login"), []);
  const handleLogin        = useCallback(() => setPhase("app"),   []);

  // Si l'utilisateur est déjà connecté (token valide), skip login
  if (!loading && user && phase === "login") setPhase("app");

  return (
    <>
      {phase === "loading" && <LoadingScreen onComplete={handleLoadComplete} />}
      {phase === "login"   && <LoginPage onLogin={handleLogin} />}
      {phase === "app"     && <HomePage onYes={() => {}} onNo={() => {}} />}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Inner />
    </AuthProvider>
  );
}
