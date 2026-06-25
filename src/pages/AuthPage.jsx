import { useState } from "react";

import AuthLayout from "../components/AuthLayout";
import AlertMessage from "../components/AlertMessage";
import SwipeTabs from "../components/SwipeTabs";

import LoginPage from "./LoginPage";
import ActivationPage from "./ActivationPage";

const pages = {
  LOGIN: {
    title: "Connexion sécurisée",
    subtitle: "Accédez à votre espace OREUS avec votre compte validé.",
    badge: "Accès dashboard",
    letter: "C",
  },
  ACTIVATION: {
    title: "Activation de compte",
    subtitle:
      "Choisissez votre profil puis activez votre compte avec votre email.",
    badge: "Nouveau compte",
    letter: "A",
  },
};

export default function AuthPage() {
  const [activeMode, setActiveMode] = useState("LOGIN");

  const [loginLoading, setLoginLoading] = useState(false);
  const [activationLoading, setActivationLoading] = useState(false);

  const [result, setResult] = useState(null);

  function changeMode(mode) {
    if (mode === activeMode) return;

    setActiveMode(mode);
    setResult(null);

    setLoginLoading(false);
    setActivationLoading(false);
  }

  const current = pages[activeMode];

  return (
    <AuthLayout>
      <div className="mb-7">
        <div className="relative overflow-hidden rounded-[28px] border border-[#7CBCCC]/25 bg-gradient-to-br from-[#7CBCCC]/15 via-white to-white p-5 shadow-[0_18px_50px_rgba(48,48,47,0.08)]">
          <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#7CBCCC]/25 blur-2xl" />

          <div className="relative flex items-start gap-4">
            <div className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-2xl bg-white text-[18px] font-black text-[#4A9CAF] shadow-[0_12px_28px_rgba(48,48,47,0.10)]">
              {current.letter}
            </div>

            <div>
              <span className="inline-flex rounded-full bg-white/80 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#4A9CAF]">
                {current.badge}
              </span>

              <h1 className="mt-3 text-[30px] font-extrabold leading-tight tracking-[-0.04em] text-[#30302F]">
                {current.title}
              </h1>

              <p className="mt-2 text-[14.5px] font-medium leading-6 text-[#6F7D80]">
                {current.subtitle}
              </p>
            </div>
          </div>
        </div>
      </div>

      <SwipeTabs activeMode={activeMode} setActiveMode={changeMode} />

      <div className="relative overflow-visible">
        {activeMode === "LOGIN" && (
          <LoginPage
            loading={loginLoading}
            setLoading={setLoginLoading}
            setResult={setResult}
          />
        )}

        {activeMode === "ACTIVATION" && (
          <ActivationPage
            key="activation-page"
            loading={activationLoading}
            setLoading={setActivationLoading}
            setResult={setResult}
            goLogin={() => changeMode("LOGIN")}
          />
        )}
      </div>

      <AlertMessage result={result} />
    </AuthLayout>
  );
}