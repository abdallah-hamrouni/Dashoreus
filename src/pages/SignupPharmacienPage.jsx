import { useState } from "react";
import { motion } from "framer-motion";

import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";
import PharmacyCard from "../components/PharmacyCard";

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

  if (!activationValide) {
    return (
      <form onSubmit={handleCheckEmail} className="grid gap-5">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="rounded-[28px] border border-[#7CBCCC]/25 bg-gradient-to-br from-[#7CBCCC]/15 to-white p-5 shadow-[0_16px_45px_rgba(48,48,47,0.07)]"
        >
          <div className="flex items-start gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-xl shadow-[0_10px_25px_rgba(48,48,47,0.08)]">
              💊
            </div>

            <div>
              <span className="inline-flex rounded-full bg-white/80 px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-[#4A9CAF]">
                Activation pharmacien
              </span>

              <h2 className="mt-3 text-[28px] font-black leading-tight tracking-[-0.06em] text-[#30302F]">
                Vérification de l’email
              </h2>

              <p className="mt-2 text-[14.5px] leading-6 text-[#6F7D80]">
                Saisissez l’adresse email d’activation fournie par téléphone.
                Cette adresse permettra d’associer votre compte à la bonne
                pharmacie.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.35 }}
          className="grid gap-4"
        >
          <InputField
            label="Email d'activation"
            type="email"
            value={emailActivation}
            onChange={(e) => setEmailActivation(e.target.value)}
            placeholder="pharmacie@email.com"
            required
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14, duration: 0.35 }}
          className="flex items-center justify-between rounded-2xl bg-[#F5FAFA] px-4 py-3"
        >
          <div className="flex items-center gap-2 text-sm font-bold text-[#6F7D80]">
            <span className="h-2.5 w-2.5 rounded-full bg-[#7CBCCC]" />
            Association pharmacie
          </div>

          <span className="text-xs font-black uppercase tracking-wide text-[#4A9CAF]">
            Étape 1/2
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.35 }}
        >
          <PrimaryButton loading={loading}>Continuer</PrimaryButton>
        </motion.div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSignup} className="grid gap-5">
      <div className="grid gap-5 xl:grid-cols-[330px_minmax(0,1fr)] xl:items-start">
        {/* Colonne gauche */}
        <motion.div
          initial={{ opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
          className="grid gap-4 lg:sticky lg:top-4"
        >
          <div className="rounded-[28px] border border-[#7CBCCC]/25 bg-gradient-to-br from-[#7CBCCC]/15 via-white to-white p-5 shadow-[0_16px_45px_rgba(48,48,47,0.07)]">
            <div className="flex items-start gap-4">
             

              <div>
                <span className="inline-flex rounded-full bg-white/80 px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-[#4A9CAF]">
                  Inscription
                </span>

                <h2 className="mt-3 text-[24px] font-black leading-tight tracking-[-0.06em] text-[#30302F]">
                  Compte pharmacien
                </h2>

                <p className="mt-2 text-[14px] leading-6 text-[#6F7D80]">
                  Complétez vos informations. Le compte sera validé par
                  l’administrateur avant connexion.
                </p>
              </div>
            </div>
          </div>

          <PharmacyCard
            nomPharmacie={pharmacie?.nompharm}
            codePharm={pharmacie?.codepharm}
            onChangeCode={modifierEmailActivation}
            onClearCode={modifierEmailActivation}
          />

          <div className="rounded-[24px] border border-white bg-white/80 p-4 shadow-[0_14px_35px_rgba(48,48,47,0.06)]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-[0.14em] text-[#6F7D80]">
                Progression
              </span>
              <span className="text-xs font-black text-[#4A9CAF]">Étape 2/2</span>
            </div>

            <div className="mt-4 grid gap-3">
              <StepRow active label="Email d’activation validé" />
              <StepRow active label="Pharmacie associée" />
              <StepRow active label="Création du compte" />
            </div>
          </div>
        </motion.div>

        {/* Colonne droite */}
        <motion.div
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
          className="rounded-[30px] border border-white bg-white/85 p-5 shadow-[0_20px_55px_rgba(48,48,47,0.08)] backdrop-blur-xl sm:p-6"
        >
          <div className="grid gap-4">
            <div className="twoCols">
              <InputField
                label="Nom"
                value={form.nom}
                onChange={(e) => updateField("nom", e.target.value)}
                placeholder="Nom"
                required
              />

              <InputField
                label="Prénom"
                value={form.prenom}
                onChange={(e) => updateField("prenom", e.target.value)}
                placeholder="Prénom"
                required
              />
            </div>

            <InputField
              label="Téléphone"
              value={form.telephone}
              onChange={(e) => updateField("telephone", e.target.value)}
              placeholder="Téléphone"
              required
            />

            <InputField
              label="Email"
              type="email"
              value={form.email}
              onChange={() => {}}
              placeholder="email@test.com"
              required
              disabled
            />

            <div className="twoCols">
              <InputField
                label="Mot de passe"
                type="password"
                value={form.password}
                onChange={(e) => updateField("password", e.target.value)}
                placeholder="Mot de passe"
                required
              />

              <InputField
                label="Confirmation"
                type="password"
                value={form.confirmPassword}
                onChange={(e) => updateField("confirmPassword", e.target.value)}
                placeholder="Confirmer"
                required
              />
            </div>

            <div className="rounded-2xl border border-dashed border-[#7CBCCC]/35 bg-[#7CBCCC]/10 px-4 py-3 text-center text-sm font-semibold leading-6 text-[#6F7D80]">
              Après la création, votre compte sera en attente de validation par
              l’administrateur.
            </div>

            <PrimaryButton loading={loading}>Créer le compte</PrimaryButton>
          </div>
        </motion.div>
      </div>
    </form>
  );
}

function StepRow({ label, active = false }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={[
          "grid h-8 w-8 place-items-center rounded-full text-sm font-black",
          active
            ? "bg-[#7CBCCC]/20 text-[#30302F]"
            : "bg-[#F1F5F5] text-[#9AA8AB]",
        ].join(" ")}
      >
        ✓
      </div>
      <span className="text-sm font-semibold text-[#6F7D80]">{label}</span>
    </div>
  );
}