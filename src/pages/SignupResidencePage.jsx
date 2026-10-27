import { useState } from "react";
import ActivationForm from "../components/ActivationForm";

import { signupResidence } from "../api/dashboardAuthApi";
import { checkActivationEmail } from "../api/activationApi";

export default function SignupResidencePage({
  loading,
  setLoading,
  setResult,
  goLogin,
}) {
  const [emailActivation, setEmailActivation] = useState("");
  const [activationValide, setActivationValide] = useState(false);
  const [residence, setResidence] = useState(null);

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  function updateField(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleCheckEmail(e) {
    e.preventDefault();

    const email = emailActivation.trim();

    if (!email) {
      setResult({
        type: "error",
        message: "Veuillez saisir l'email d'activation.",
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const data = await checkActivationEmail(email, "RESIDENCE");

      setResidence(data.residence);
      setActivationValide(true);

      setForm((prev) => ({
        ...prev,
        email,
      }));

      setResult({
        type: "success",
        message: `Email validé : ${data.residence.nom_residence}`,
        data,
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

  async function handleSignup(e) {
    e.preventDefault();

    if (!activationValide || !residence) {
      setResult({
        type: "error",
        message: "Veuillez d'abord valider l'email d'activation.",
      });
      return;
    }

    if (
      !form.nom.trim() ||
      !form.prenom.trim() ||
      !form.email.trim() ||
      !form.password.trim() ||
      !form.confirmPassword.trim()
    ) {
      setResult({
        type: "error",
        message: "Veuillez remplir tous les champs obligatoires.",
      });
      return;
    }

    if (form.password !== form.confirmPassword) {
      setResult({
        type: "error",
        message: "Les mots de passe ne correspondent pas.",
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const data = await signupResidence({
        nom: form.nom.trim(),
        prenom: form.prenom.trim(),
        telephone: form.telephone.trim(),
        email: form.email.trim(),
        emailActivation: emailActivation.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
      });

      setResult({
        type: "success",
        message:
          "Compte résidence créé avec succès. Il est en attente de validation par l'administrateur.",
        data,
      });

      setEmailActivation("");
      setActivationValide(false);
      setResidence(null);

      setForm({
        nom: "",
        prenom: "",
        telephone: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      goLogin();
    } catch (error) {
      setResult({
        type: "error",
        message: error.message,
      });
    } finally {
      setLoading(false);
    }
  }

  function modifierEmailActivation() {
    setActivationValide(false);
    setResidence(null);
    setResult(null);

    setForm((prev) => ({
      ...prev,
      email: "",
    }));
  }

  return (
    <ActivationForm
      role="RESIDENCE"
      verified={activationValide}
      entity={residence}
      emailActivation={emailActivation}
      setEmailActivation={setEmailActivation}
      form={form}
      updateField={updateField}
      onCheckEmail={handleCheckEmail}
      onSignup={handleSignup}
      onModifyEmail={modifierEmailActivation}
      loading={loading}
    />
  );
}
