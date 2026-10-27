import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import AuthLayout from "../components/AuthLayout";
import AlertMessage from "../components/AlertMessage";
import SwipeTabs from "../components/SwipeTabs";
import { PageTransition } from "../components/ui/Motion";
import LoginPage from "./LoginPage";
import ActivationPage from "./ActivationPage";

export default function AuthPage() {
  const [activeMode, setActiveMode] = useState("LOGIN");
  const [loginLoading, setLoginLoading] = useState(false);
  const [activationLoading, setActivationLoading] = useState(false);
  const [result, setResult] = useState(null);
  function changeMode(mode) {
    if (mode === activeMode || loginLoading || activationLoading) return;
    setActiveMode(mode);
    setResult(null);
  }
  return (
    <AuthLayout>
      <div className="auth-heading">
        <span className="eyebrow">Bienvenue sur OREUS</span>
        <h1>
          {activeMode === "LOGIN"
            ? "Votre espace, simplement."
            : "Faisons connaissance."}
        </h1>
        <p>
          {activeMode === "LOGIN"
            ? "Connectez-vous pour retrouver vos établissements, vos livraisons et tous vos documents."
            : "Activez votre compte professionnel et rejoignez votre établissement."}
        </p>
      </div>
      <SwipeTabs
        activeMode={activeMode}
        setActiveMode={changeMode}
        disabled={loginLoading || activationLoading}
      />
      <AnimatePresence mode="wait" initial={false}>
        <PageTransition key={activeMode}>
          {activeMode === "LOGIN" ? (
            <LoginPage
              loading={loginLoading}
              setLoading={setLoginLoading}
              setResult={setResult}
            />
          ) : (
            <ActivationPage
              loading={activationLoading}
              setLoading={setActivationLoading}
              setResult={setResult}
              goLogin={() => {
                setActiveMode("LOGIN");
                setLoginLoading(false);
              }}
            />
          )}
        </PageTransition>
      </AnimatePresence>
      <div className="auth-feedback">
        <AlertMessage result={result} onDismiss={() => setResult(null)} />
      </div>
    </AuthLayout>
  );
}
