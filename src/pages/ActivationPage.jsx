import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import SegmentedControl from "../components/ui/SegmentedControl";
import { PageTransition } from "../components/ui/Motion";
import SignupPharmacienPage from "./SignupPharmacienPage";
import SignupResidencePage from "./SignupResidencePage";
const roles = [
  { id: "PHARMACIEN", label: "Pharmacien", icon: "pill" },
  { id: "RESIDENCE", label: "Résidence", icon: "building" },
];
export default function ActivationPage({
  loading,
  setLoading,
  setResult,
  goLogin,
}) {
  const [activeRole, setActiveRole] = useState("PHARMACIEN");
  function changeRole(role) {
    if (loading || role === activeRole) return;
    setActiveRole(role);
    setResult(null);
  }
  return (
    <div className="activation-flow">
      <div className="form-heading">
        <h2>Quel est votre profil ?</h2>
        <p>
          Votre email d’activation nous permettra de retrouver votre
          établissement.
        </p>
      </div>
      <SegmentedControl
        options={roles}
        value={activeRole}
        onChange={changeRole}
        label="Type de compte à activer"
        disabled={loading}
      />
      <AnimatePresence mode="wait" initial={false}>
        <PageTransition key={activeRole}>
          {activeRole === "PHARMACIEN" ? (
            <SignupPharmacienPage
              loading={loading}
              setLoading={setLoading}
              setResult={setResult}
              goLogin={goLogin}
            />
          ) : (
            <SignupResidencePage
              loading={loading}
              setLoading={setLoading}
              setResult={setResult}
              goLogin={goLogin}
            />
          )}
        </PageTransition>
      </AnimatePresence>
    </div>
  );
}
