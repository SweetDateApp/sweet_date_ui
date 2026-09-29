import { useState, useCallback } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { LoadingScreen } from "./components/LoadingScreen";
import { LoginPage }     from "./components/LoginPage";
import { Navbar }        from "./components/Navbar";
import { DateFlowPage }  from "./pages/DateFlowPage";
import { ProfilePage }   from "./pages/ProfilePage";
import { useHeartCursor } from "./hooks/useHeartCursor";
import type { AppPage } from "./types";

type Phase = "loading" | "login" | "app";

function Inner() {
  const { user, loading } = useAuth();
  const [phase,       setPhase]   = useState<Phase>("loading");
  const [currentPage, setPage]    = useState<AppPage>("date-flow");

  useHeartCursor(phase === "app" && !!user);

  const handleLoadComplete = useCallback(() => setPhase("login"), []);
  const handleLogin        = useCallback(() => setPhase("app"),   []);

  if (!loading && user && phase === "login") setPhase("app");

  return (
    <>
      {phase === "loading" && <LoadingScreen onComplete={handleLoadComplete} />}
      {phase === "login"   && <LoginPage onLogin={handleLogin} />}
      {phase === "app"     && (
        <>
          <Navbar currentPage={currentPage} onNavigate={setPage} />
          {currentPage === "date-flow" && <DateFlowPage />}
          {currentPage === "profile"   && <ProfilePage />}
        </>
      )}
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
