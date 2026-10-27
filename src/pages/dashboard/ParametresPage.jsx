import { useState } from "react";
import {
  getDashboardProfile,
  saveDashboardProfile,
} from "../../storage/dashboardStorage";
import InputField from "../../components/InputField";
import PrimaryButton from "../../components/PrimaryButton";
import AlertMessage from "../../components/AlertMessage";
import Modal from "../../components/ui/Modal";
import Icon from "../../components/ui/Icon";

export default function ParametresPage({ user, logout }) {
  const [form, setForm] = useState({ address: "", postalCode: "", city: "" });
  const [profile, setProfile] = useState(getDashboardProfile);
  const [savedMessage, setSavedMessage] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);
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

  const residenceAddress =
    user?.adresse ||
    user?.address ||
    user?.adresse_residence ||
    user?.adresseResidence ||
    "";

  const residencePostalCode =
    user?.code_postal || user?.codePostal || user?.postalCode || user?.cp || "";

  const residenceCity = user?.ville || user?.city || user?.commune || "";

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

  const info = [
    ["Nom complet", fullName],
    ["Adresse email", user?.email || "—"],
    ["Adresse", displayAddress || "Non renseignée"],
    ["Code postal", displayPostalCode || "Non renseigné"],
    ["Ville", displayCity || "Non renseignée"],
  ];
  return (
    <div className="stack">
      <div className="page-heading">
        <div>
          <span className="eyebrow">Un espace à votre image</span>
          <h1>Paramètres du compte</h1>
          <p>
            Consultez vos informations et personnalisez les coordonnées de vos
            documents.
          </p>
        </div>
        <span className="icon-tile">
          <Icon name="settings" size={19} />
        </span>
      </div>
      <AlertMessage
        result={
          savedMessage ? { type: "success", message: savedMessage } : null
        }
        onDismiss={() => setSavedMessage("")}
      />
      <div className="detail-grid">
        <section className="surface detail-panel">
          <div className="panel-heading">
            <div>
              <h2>Informations du compte</h2>
              <p>Votre établissement et vos coordonnées</p>
            </div>
            <span className="badge">
              {isPharmacien ? "Pharmacien" : "Résidence"}
            </span>
          </div>
          <div className="linked-pharmacy" style={{ marginTop: 22 }}>
            <span className="icon-tile">
              <Icon name={isPharmacien ? "pill" : "building"} size={18} />
            </span>
            <div>
              <small>Votre établissement</small>
              <strong>{structureName}</strong>
            </div>
          </div>
          <dl className="info-grid">
            {info.map(([label, value]) => (
              <div className="info-item" key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </section>
        {isPharmacien ? (
          <section className="surface detail-panel">
            <div className="panel-heading">
              <div>
                <h2>Coordonnées des bons de livraison</h2>
                <p>Ces informations apparaissent dans l’en-tête de vos PDF.</p>
              </div>
              <span className="icon-tile">
                <Icon name="file" size={18} />
              </span>
            </div>
            <form onSubmit={handleSave} className="settings-form">
              <div className="field">
                <label htmlFor="profile-address">Adresse</label>
                <textarea
                  id="profile-address"
                  name="address"
                  rows={2}
                  value={form.address}
                  onChange={handleChange}
                  placeholder={profile.address || "12 rue de la Paix"}
                  autoComplete="street-address"
                />
              </div>
              <div className="twoCols">
                <InputField
                  label="Code postal"
                  name="postalCode"
                  value={form.postalCode}
                  onChange={handleChange}
                  placeholder={profile.postalCode || "31000"}
                  autoComplete="postal-code"
                />
                <InputField
                  label="Ville"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder={profile.city || "Toulouse"}
                  autoComplete="address-level2"
                />
              </div>
              <p
                className="small muted"
                style={{ fontSize: 10, lineHeight: 1.8 }}
              >
                Les champs laissés vides conservent les coordonnées
                enregistrées.
              </p>
              <PrimaryButton icon="save">
                Enregistrer les coordonnées
              </PrimaryButton>
            </form>
            <div className="pdf-preview">
              <div className="pdf-preview-heading">
                <span>APERÇU DU DOCUMENT</span>
                <Icon name="file" size={14} />
              </div>
              <div className="pdf-preview-content">
                <strong>{structureName}</strong>
                <p>
                  {fullAddress ||
                    "Vos coordonnées enregistrées apparaîtront ici."}
                </p>
              </div>
            </div>
          </section>
        ) : (
          <section className="surface detail-panel">
            <div className="panel-heading">
              <div>
                <h2>Les coordonnées de votre résidence</h2>
                <p>Informations associées à votre compte</p>
              </div>
              <span className="icon-tile">
                <Icon name="pin" size={18} />
              </span>
            </div>
            <div className="pdf-preview">
              <div className="pdf-preview-content">
                <strong>{structureName}</strong>
                <p>
                  {fullAddress ||
                    "Coordonnées non renseignées dans le compte résidence."}
                </p>
              </div>
            </div>
            <div className="info-note" style={{ marginTop: 22 }}>
              <Icon name="info" size={15} />
              <p>
                Ces informations sont récupérées depuis votre compte résidence.
              </p>
            </div>
          </section>
        )}
      </div>
      {isPharmacien && (
        <section className="surface danger-zone">
          <div>
            <h2>Réinitialiser les coordonnées</h2>
            <p>
              Supprimez l’adresse, le code postal et la ville enregistrés pour
              vos prochains documents.
            </p>
          </div>
          <button
            type="button"
            className="button button-danger"
            onClick={() => setConfirmReset(true)}
          >
            <Icon name="trash" size={15} />
            Supprimer les coordonnées
          </button>
        </section>
      )}
      {logout && (
        <section className="surface danger-zone">
          <div>
            <h2>Votre session</h2>
            <p>Vous êtes connecté en tant que {user?.email || fullName}.</p>
          </div>
          <button
            type="button"
            className="button button-secondary"
            onClick={logout}
          >
            <Icon name="logout" size={15} />
            Se déconnecter
          </button>
        </section>
      )}
      <Modal
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        title="Supprimer les coordonnées ?"
        icon="trash"
        footer={
          <>
            <button
              type="button"
              className="button button-secondary"
              onClick={() => setConfirmReset(false)}
            >
              Annuler
            </button>
            <button
              type="button"
              className="button button-danger"
              onClick={() => {
                resetCoordinates();
                setConfirmReset(false);
              }}
            >
              Supprimer les coordonnées
            </button>
          </>
        }
      >
        <p>
          L’adresse, le code postal et la ville seront retirés de vos prochains
          bons de livraison. Vous pourrez les renseigner à nouveau.
        </p>
      </Modal>
    </div>
  );
}
