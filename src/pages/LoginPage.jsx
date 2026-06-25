import { useState } from "react";
import { useNavigate } from "react-router-dom";

import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";
import {
  loginDashboard,
  forgotPasswordDashboard,
} from "../api/dashboardAuthApi";
import { saveDashboardSession } from "../storage/dashboardStorage";

export default function LoginPage({ loading, setLoading, setResult }) {
  const navigate = useNavigate();

  const [mode, setMode] = useState("LOGIN");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setResult({
        type: "error",
        message: "Veuillez saisir votre email et votre mot de passe.",
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const data = await loginDashboard({
        email: email.trim(),
        password,
      });

      saveDashboardSession(data);

      localStorage.setItem(
        "dashboard_result",
        JSON.stringify({
          user: data.user,
          residences: data.residences || [],
          pharmacies: data.pharmacies || [],
        })
      );

      navigate("/dashboard");
    } catch (error) {
      setResult({
        type: "error",
        message: error.message,
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword(e) {
    e.preventDefault();

    if (!email.trim()) {
      setResult({
        type: "error",
        message: "Veuillez saisir votre adresse email.",
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const data = await forgotPasswordDashboard(email.trim());

      setResult({
        type: "success",
        message: data.message,
      });
    } catch (error) {
      setResult({
        type: "error",
        message: error.message,
      });
    } finally {
      setLoading(false);
    }
  }

  const isForgotMode = mode === "FORGOT";

  return (
    <form
      onSubmit={isForgotMode ? handleForgotPassword : handleLogin}
      className="grid gap-5"
    >
      <div className="rounded-[28px] border border-[#7CBCCC]/25 bg-gradient-to-br from-[#7CBCCC]/15 to-white p-5 shadow-[0_16px_45px_rgba(48,48,47,0.07)]">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-[14px] font-extrabold text-[#4A9CAF] shadow-[0_10px_25px_rgba(48,48,47,0.08)]">
            {isForgotMode ? "MDP" : "ID"}
          </div>

          <div>
            <span className="inline-flex rounded-full bg-white/80 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#4A9CAF]">
              {isForgotMode ? "Réinitialisation" : "Accès sécurisé"}
            </span>

            <h2 className="mt-3 text-[28px] font-extrabold leading-tight tracking-[-0.04em] text-[#30302F]">
              {isForgotMode
                ? "Mot de passe oublié"
                : "Connexion dashboard"}
            </h2>

            <p className="mt-2 text-[14.5px] font-medium leading-6 text-[#6F7D80]">
              {isForgotMode
                ? "Saisissez votre email. Vous recevrez un lien pour créer un nouveau mot de passe."
                : "Connectez-vous avec votre compte pharmacien ou résidence validé par l’administrateur."}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        <InputField
          label="Adresse email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@test.com"
          required
        />

        {!isForgotMode && (
          <InputField
            label="Mot de passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            required
          />
        )}
      </div>

      {!isForgotMode && (
        <div className="flex items-center justify-between rounded-2xl bg-[#F5FAFA] px-4 py-3">
          <div className="flex items-center gap-2 text-sm font-medium text-[#6F7D80]">
            <span className="h-2.5 w-2.5 rounded-full bg-[#7CBCCC]" />
            Compte validé requis
          </div>

          <span className="text-xs font-bold uppercase tracking-wide text-[#4A9CAF]">
            OREUS
          </span>
        </div>
      )}

      <PrimaryButton loading={loading}>
        {isForgotMode ? "Envoyer le lien" : "Se connecter"}
      </PrimaryButton>

      <button
        type="button"
        onClick={() => {
          setMode(isForgotMode ? "LOGIN" : "FORGOT");
          setResult(null);
        }}
        className="text-center text-sm font-bold text-[#4A9CAF] transition hover:text-[#30302F]"
      >
        {isForgotMode
          ? "Retour à la connexion"
          : "Mot de passe oublié ?"}
      </button>

      <div className="rounded-2xl border border-dashed border-[#7CBCCC]/35 bg-[#7CBCCC]/10 px-4 py-3 text-center text-sm font-medium leading-6 text-[#6F7D80]">
        {isForgotMode
          ? "Le lien envoyé fonctionne pour les comptes pharmacien et résidence."
          : "Si votre compte vient d’être créé, attendez la validation de l’administrateur avant de vous connecter."}
      </div>
    </form>
  );
}