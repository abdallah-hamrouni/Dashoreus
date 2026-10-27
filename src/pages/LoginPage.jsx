import { useState } from "react";
import { useNavigate } from "react-router-dom";

import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";
import Icon from "../components/ui/Icon";
import { PageTransition } from "../components/ui/Motion";
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
        }),
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
    <PageTransition key={mode}>
      <form
        onSubmit={isForgotMode ? handleForgotPassword : handleLogin}
        className="auth-form"
      >
        {isForgotMode && (
          <div className="form-heading">
            <h2>Mot de passe oublié ?</h2>
            <p>
              Saisissez votre adresse email pour recevoir un lien de
              réinitialisation.
            </p>
          </div>
        )}
        <div className="auth-form-fields">
          <InputField
            label="Adresse email professionnelle"
            type="email"
            name="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="prenom@pharmacie.fr"
            required
            disabled={loading}
            autoComplete="email"
          />
          {!isForgotMode && (
            <InputField
              label="Mot de passe"
              type="password"
              name="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Saisissez votre mot de passe"
              required
              disabled={loading}
              autoComplete="current-password"
            />
          )}
        </div>
        <div className="login-options">
          <span>
            <Icon name="shield" size={12} />
            Compte validé requis
          </span>
          <button
            type="button"
            className="text-link"
            disabled={loading}
            onClick={() => {
              setMode(isForgotMode ? "LOGIN" : "FORGOT");
              setResult(null);
            }}
          >
            {isForgotMode ? "Retour à la connexion" : "Mot de passe oublié ?"}
          </button>
        </div>
        <PrimaryButton loading={loading}>
          {isForgotMode
            ? "Envoyer le lien de réinitialisation"
            : "Se connecter à mon espace"}
        </PrimaryButton>
        <div className="info-note">
          <Icon name="info" size={15} />
          <p>
            {isForgotMode
              ? "Le lien de réinitialisation fonctionne pour les comptes pharmacien et résidence."
              : "Votre compte vient d’être créé ? Il sera accessible après validation par l’administrateur."}
          </p>
        </div>
      </form>
    </PageTransition>
  );
}
