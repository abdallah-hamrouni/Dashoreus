import { useEffect, useState } from "react";

import {
  getDashboardProfile,
  saveDashboardProfile,
} from "../../storage/dashboardStorage";

export default function ParametresPage({ user, logout }) {
  const [form, setForm] = useState({
    address: "",
    postalCode: "",
    city: "",
  });

  const [profile, setProfile] = useState({
    address: "",
    postalCode: "",
    city: "",
  });

  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    const savedProfile = getDashboardProfile();

    const currentProfile = {
      address: savedProfile.address || "",
      postalCode: savedProfile.postalCode || "",
      city: savedProfile.city || savedProfile.ville || "",
    };

    setProfile(currentProfile);

    setForm({
      address: "",
      postalCode: "",
      city: "",
    });
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSavedMessage("");
  }

  function handleSave(event) {
    event.preventDefault();

    const cleanProfile = {
      address: form.address.trim() || profile.address,
      postalCode: form.postalCode.trim() || profile.postalCode,
      city: form.city.trim() || profile.city,
    };

    saveDashboardProfile(cleanProfile);
    setProfile(cleanProfile);

    setForm({
      address: "",
      postalCode: "",
      city: "",
    });

    setSavedMessage("Coordonnées enregistrées avec succès.");
  }

  function resetCoordinates() {
    const emptyProfile = {
      address: "",
      postalCode: "",
      city: "",
    };

    saveDashboardProfile(emptyProfile);
    setProfile(emptyProfile);
    setForm(emptyProfile);

    setSavedMessage("Coordonnées supprimées.");
  }

  const isPharmacien = user?.role === "PHARMACIEN";

  const structureName = isPharmacien
    ? user?.nompharm || user?.nom_pharmacie || user?.nom || "Ma pharmacie"
    : user?.nom_residence || user?.nomresid || user?.nom || "Ma résidence";

  const fullName = `${user?.prenom || ""} ${user?.nom || ""}`.trim() || "-";

  /**
   * Coordonnées résidence :
   * Elles sont récupérées depuis le compte résidence.
   * Le formulaire n'est pas affiché pour une résidence.
   */
  const residenceAddress =
    user?.adresse ||
    user?.address ||
    user?.adresse_residence ||
    user?.adresseResidence ||
    "";

  const residencePostalCode =
    user?.code_postal ||
    user?.codePostal ||
    user?.postalCode ||
    user?.cp ||
    "";

  const residenceCity =
    user?.ville ||
    user?.city ||
    user?.commune ||
    "";

  /**
   * Coordonnées à afficher :
   * - Pharmacien : coordonnées saisies dans la page paramètres.
   * - Résidence : coordonnées déjà existantes dans le compte.
   */
  const displayAddress = isPharmacien ? profile.address : residenceAddress;
  const displayPostalCode = isPharmacien
    ? profile.postalCode
    : residencePostalCode;
  const displayCity = isPharmacien ? profile.city : residenceCity;

  const fullAddress = [
    displayAddress,
    [displayPostalCode, displayCity].filter(Boolean).join(" "),
  ]
    .filter(Boolean)
    .join(" — ");

  return (
    <div className="space-y-4">
      <header className="rounded-[22px] border border-[#DDEAEC] bg-white px-5 py-4 shadow-[0_12px_30px_rgba(48,48,47,0.05)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <span className="rounded-full bg-[#7CBCCC]/15 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-[#4A9CAF]">
              Paramètres
            </span>

            <h1 className="mt-3 text-2xl font-black tracking-[-0.03em] text-[#30302F]">
              Paramètres du compte
            </h1>

            <p className="mt-1 max-w-2xl text-sm font-semibold leading-5 text-[#6F7D80]">
              {isPharmacien
                ? "Gérez les coordonnées utilisées dans les bons de livraison PDF."
                : "Consultez les informations liées à votre compte résidence."}
            </p>
          </div>

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] bg-[#30302F] text-base text-white shadow-sm">
            ⚙️
          </div>
        </div>
      </header>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.95fr]">
        <article className="rounded-[22px] border border-[#DDEAEC] bg-white p-4 shadow-[0_12px_30px_rgba(48,48,47,0.05)]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#7CBCCC]">
                Profil
              </p>

              <h2 className="mt-1 text-xl font-black text-[#30302F]">
                Informations du compte
              </h2>
            </div>

            <span className="rounded-full bg-[#7CBCCC]/15 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.1em] text-[#4A9CAF]">
              {user?.role || "-"}
            </span>
          </div>

          <div className="mt-4 rounded-[18px] border border-[#DDEAEC] bg-[#F9FCFD] p-4">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#7CBCCC]">
              Établissement
            </p>

            <h3 className="mt-1 text-lg font-black text-[#30302F]">
              {structureName}
            </h3>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <InfoCard label="Nom complet" value={fullName} />
            <InfoCard label="Email" value={user?.email || "-"} />

            <InfoCard
              label="Adresse"
              value={displayAddress || "Adresse non renseignée"}
            />

            <InfoCard
              label="Code postal"
              value={displayPostalCode || "Code postal non renseigné"}
            />

            <InfoCard
              label="Ville"
              value={displayCity || "Ville non renseignée"}
            />
          </div>
        </article>

        {isPharmacien ? (
          <article className="rounded-[22px] border border-[#DDEAEC] bg-white p-4 shadow-[0_12px_30px_rgba(48,48,47,0.05)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#7CBCCC]">
                  PDF
                </p>

                <h2 className="mt-1 text-xl font-black text-[#30302F]">
                  Coordonnées de livraison
                </h2>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-[15px] bg-[#7CBCCC]/15 text-base">
                📄
              </div>
            </div>

            <p className="mt-2 text-sm font-semibold leading-5 text-[#6F7D80]">
              Ces informations seront affichées dans l’en-tête des bons de
              livraison.
            </p>

            <form onSubmit={handleSave} className="mt-4 space-y-3">
              <label className="block text-sm font-black text-[#30302F]">
                Adresse
                <textarea
                  name="address"
                  rows="2"
                  value={form.address}
                  onChange={handleChange}
                  className="mt-1.5 w-full resize-none rounded-[16px] border border-[#DDEAEC] bg-white px-3.5 py-2.5 text-sm font-bold text-[#30302F] outline-none transition focus:border-[#7CBCCC] focus:ring-4 focus:ring-[#7CBCCC]/15"
                  placeholder={profile.address || "Ex : 12 rue de la Paix"}
                />
              </label>

              <div className="grid gap-3 md:grid-cols-2">
                <label className="block text-sm font-black text-[#30302F]">
                  Code postal
                  <input
                    type="text"
                    name="postalCode"
                    value={form.postalCode}
                    onChange={handleChange}
                    className="mt-1.5 w-full rounded-[16px] border border-[#DDEAEC] bg-white px-3.5 py-2.5 text-sm font-bold text-[#30302F] outline-none transition focus:border-[#7CBCCC] focus:ring-4 focus:ring-[#7CBCCC]/15"
                    placeholder={profile.postalCode || "Ex : 31000"}
                  />
                </label>

                <label className="block text-sm font-black text-[#30302F]">
                  Ville
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    className="mt-1.5 w-full rounded-[16px] border border-[#DDEAEC] bg-white px-3.5 py-2.5 text-sm font-bold text-[#30302F] outline-none transition focus:border-[#7CBCCC] focus:ring-4 focus:ring-[#7CBCCC]/15"
                    placeholder={profile.city || "Ex : Toulouse"}
                  />
                </label>
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-[16px] bg-[#30302F] px-4 py-3 text-sm font-black text-white shadow-[0_10px_24px_rgba(48,48,47,0.14)] transition hover:-translate-y-0.5 hover:bg-[#4A9CAF]"
              >
                Enregistrer les coordonnées
                <span>→</span>
              </button>

              {savedMessage ? (
                <div className="rounded-[16px] border border-green-500/20 bg-green-500/10 px-3.5 py-2.5 text-sm font-black text-green-700">
                  {savedMessage}
                </div>
              ) : null}
            </form>

            <div className="mt-4 rounded-[18px] border border-dashed border-[#7CBCCC]/50 bg-[#7CBCCC]/10 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#4A9CAF]">
                  Aperçu PDF
                </p>

                <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-black text-[#4A9CAF] shadow-sm">
                  En-tête
                </span>
              </div>

              <div className="mt-3 rounded-[16px] bg-white p-3 shadow-sm">
                <p className="text-sm font-black text-[#30302F]">
                  {structureName}
                </p>

                <p className="mt-1 text-xs font-semibold text-[#6F7D80]">
                  {fullAddress || "Les coordonnées apparaîtront ici."}
                </p>
              </div>
            </div>
          </article>
        ) : (
          <article className="rounded-[22px] border border-[#DDEAEC] bg-white p-4 shadow-[0_12px_30px_rgba(48,48,47,0.05)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#7CBCCC]">
                  Résidence
                </p>

                <h2 className="mt-1 text-xl font-black text-[#30302F]">
                  Coordonnées déjà enregistrées
                </h2>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-[15px] bg-[#7CBCCC]/15 text-base">
                🏠
              </div>
            </div>

            <p className="mt-2 text-sm font-semibold leading-5 text-[#6F7D80]">
              Les informations de la résidence sont récupérées automatiquement
              depuis le compte. Aucun formulaire de modification n’est nécessaire.
            </p>

            <div className="mt-4 rounded-[18px] border border-[#DDEAEC] bg-[#F9FCFD] p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#7CBCCC]">
                Coordonnées résidence
              </p>

              <p className="mt-2 text-sm font-black text-[#30302F]">
                {structureName}
              </p>

              <p className="mt-1 text-sm font-semibold text-[#6F7D80]">
                {fullAddress ||
                  "Coordonnées non renseignées dans le compte résidence."}
              </p>
            </div>
          </article>
        )}
      </section>

      <section
        className={[
          "grid gap-4",
          isPharmacien ? "lg:grid-cols-[1fr_0.8fr]" : "lg:grid-cols-[0.8fr]",
        ].join(" ")}
      >
        {isPharmacien ? (
          <article className="rounded-[22px] border border-[#DDEAEC] bg-white p-4 shadow-[0_12px_30px_rgba(48,48,47,0.05)]">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#7CBCCC]">
              Coordonnées
            </p>

            <h2 className="mt-1 text-xl font-black text-[#30302F]">
              Réinitialiser
            </h2>

            <p className="mt-1 text-sm font-semibold leading-5 text-[#6F7D80]">
              Supprime l’adresse, le code postal et la ville enregistrés.
            </p>

            <button
              type="button"
              onClick={resetCoordinates}
              className="mt-4 rounded-[16px] border border-[#DDEAEC] bg-[#F9FCFD] px-4 py-2.5 text-sm font-black text-[#30302F] transition hover:border-red-400 hover:bg-red-500/10 hover:text-red-600"
            >
              Supprimer les coordonnées
            </button>
          </article>
        ) : null}

     
      </section>
    </div>
  );
}

function InfoCard({ label, value, large = false }) {
  return (
    <div
      className={[
        "rounded-[16px] border border-[#DDEAEC] bg-[#F9FCFD] p-3 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_10px_24px_rgba(48,48,47,0.05)]",
        large ? "md:col-span-2" : "",
      ].join(" ")}
    >
      <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#7CBCCC]">
        {label}
      </span>

      <p className="mt-1.5 break-words text-sm font-black leading-5 text-[#30302F]">
        {value}
      </p>
    </div>
  );
}