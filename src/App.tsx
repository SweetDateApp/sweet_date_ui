import { useState, useCallback } from "react";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/useAuth";
import { LoadingScreen } from "./components/LoadingScreen";
import { LoginPage }     from "./components/LoginPage";
import { Navbar }        from "./components/Navbar";
import { DateFlowPage }  from "./pages/DateFlowPage";
import { ProfilePage }   from "./pages/ProfilePage";
import { useHeartCursor } from "./hooks/useHeartCursor";
import type { AppPage } from "./types";

function Inner() {
  const { user, loading } = useAuth();
  const [introDone,   setIntroDone] = useState(false);
  const [currentPage, setPage]      = useState<AppPage>("date-flow");

  const inApp = introDone && !loading && user !== null;
  useHeartCursor(inApp);

  const handleIntroComplete = useCallback(() => setIntroDone(true), []);

  if (!introDone || loading) return <LoadingScreen onComplete={handleIntroComplete} />;
  if (!user) return <LoginPage />;

  return (
    <>
      <Navbar currentPage={currentPage} onNavigate={setPage} />
      {/* Le parcours reste monté pour ne pas perdre la saisie en allant sur le profil. */}
      <div hidden={currentPage !== "date-flow"}><DateFlowPage /></div>
      {currentPage === "profile" && <ProfilePage />}
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
