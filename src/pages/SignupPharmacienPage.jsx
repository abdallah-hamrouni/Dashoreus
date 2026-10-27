import { useState } from "react";
import ActivationForm from "../components/ActivationForm";

import { checkActivationEmail } from "../api/activationApi";
import { signupPharmacien } from "../api/authApi";

export default function SignupPharmacienPage({
  loading,
  setLoading,
  setResult,
  goLogin,
}) {
  const [emailActivation, setEmailActivation] = useState("");
  const [activationValide, setActivationValide] = useState(false);
  const [pharmacie, setPharmacie] = useState(null);

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
      const data = await checkActivationEmail(email, "PHARMACIEN");

      setPharmacie(data.pharmacie);
      setActivationValide(true);

      setForm((prev) => ({
        ...prev,
        email,
      }));

      setResult({
        type: "success",
        message: `Email validé : ${data.pharmacie.nompharm}`,
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

    if (!activationValide || !pharmacie) {
      setResult({
        type: "error",
        message: "Veuillez d'abord valider l'email d'activation.",
      });
      return;
    }

    if (
      !form.nom.trim() ||
      !form.prenom.trim() ||
      !form.telephone.trim() ||
      !form.email.trim() ||
      !form.password.trim() ||
      !form.confirmPassword.trim()
    ) {
      setResult({
        type: "error",
        message: "Veuillez remplir tous les champs.",
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
      const data = await signupPharmacien({
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
          "Compte pharmacien créé avec succès. Il est en attente de validation par l'administrateur.",
        data,
      });

      setEmailActivation("");
      setActivationValide(false);
      setPharmacie(null);

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
    setPharmacie(null);
    setResult(null);

    setForm((prev) => ({
      ...prev,
      email: "",
    }));
  }

  return (
    <ActivationForm
      role="PHARMACIEN"
      verified={activationValide}
      entity={pharmacie}
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
