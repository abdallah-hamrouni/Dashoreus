import { useState } from "react";

import SignupPharmacienPage from "./SignupPharmacienPage";
import SignupResidencePage from "./SignupResidencePage";

export default function ActivationPage({
  loading,
  setLoading,
  setResult,
  goLogin,
}) {
  const [activeRole, setActiveRole] = useState("PHARMACIEN");

  function changeRole(role) {
    setActiveRole(role);
    setResult(null);
    setLoading(false);
  }

  return (
    <div className="grid gap-5">
      <div className="rounded-[28px] border border-[#7CBCCC]/25 bg-gradient-to-br from-[#7CBCCC]/10 via-white to-white p-5 shadow-[0_16px_45px_rgba(48,48,47,0.07)]">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-[18px] font-black text-[#4A9CAF] shadow-[0_10px_25px_rgba(48,48,47,0.08)]">
            A
          </div>

          <div>
            <span className="inline-flex rounded-full bg-white/80 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#4A9CAF]">
              Activation
            </span>

            <h2 className="mt-3 text-[26px] font-extrabold leading-tight tracking-[-0.04em] text-[#30302F]">
              Choisir le type de compte
            </h2>

            <p className="mt-2 text-[14.5px] font-medium leading-6 text-[#6F7D80]">
              Sélectionnez le profil à activer : pharmacien ou résidence.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 rounded-[24px] border border-white bg-[#F5FAFA] p-2 shadow-[0_12px_35px_rgba(48,48,47,0.06)]">
        <button
          type="button"
          onClick={() => changeRole("PHARMACIEN")}
          className={[
            "rounded-[18px] px-4 py-4 text-center transition duration-300",
            activeRole === "PHARMACIEN"
              ? "bg-white text-[#30302F] shadow-[0_12px_30px_rgba(48,48,47,0.10)]"
              : "text-[#6F7D80] hover:bg-white/60",
          ].join(" ")}
        >
          <span className="block text-sm font-extrabold">Pharmacien</span>
          <span className="mt-1 block text-xs font-semibold">
            Activation compte pharmacie
          </span>
        </button>

        <button
          type="button"
          onClick={() => changeRole("RESIDENCE")}
          className={[
            "rounded-[18px] px-4 py-4 text-center transition duration-300",
            activeRole === "RESIDENCE"
              ? "bg-white text-[#30302F] shadow-[0_12px_30px_rgba(48,48,47,0.10)]"
              : "text-[#6F7D80] hover:bg-white/60",
          ].join(" ")}
        >
          <span className="block text-sm font-extrabold">Résidence</span>
          <span className="mt-1 block text-xs font-semibold">
            Activation compte résidence
          </span>
        </button>
      </div>

      {activeRole === "PHARMACIEN" && (
        <SignupPharmacienPage
          loading={loading}
          setLoading={setLoading}
          setResult={setResult}
          goLogin={goLogin}
        />
      )}

      {activeRole === "RESIDENCE" && (
        <SignupResidencePage
          loading={loading}
          setLoading={setLoading}
          setResult={setResult}
          goLogin={goLogin}
        />
      )}
    </div>
  );
}