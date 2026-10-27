import InputField from "./InputField";
import PrimaryButton from "./PrimaryButton";
import PharmacyCard from "./PharmacyCard";
import Icon from "./ui/Icon";
import { PageTransition } from "./ui/Motion";

export default function ActivationForm({
  role,
  verified,
  entity,
  emailActivation,
  setEmailActivation,
  form,
  updateField,
  onCheckEmail,
  onSignup,
  onModifyEmail,
  loading,
}) {
  const pharmacy = role === "PHARMACIEN";
  return (
    <PageTransition
      key={verified ? "details" : "email"}
      className="activation-flow"
    >
      <div
        className="activation-steps"
        aria-label={
          verified
            ? "Étape 2 sur 2 : création du compte"
            : "Étape 1 sur 2 : vérification de l’email"
        }
      >
        <span className="current">
          <b>{verified ? <Icon name="check" size={12} /> : "1"}</b>Vérification
          de l’email
        </span>
        <i />
        <span className={verified ? "current" : ""}>
          <b>2</b>Votre compte
        </span>
      </div>
      {!verified ? (
        <form onSubmit={onCheckEmail} className="auth-form">
          <div className="form-heading">
            <h2>Retrouvons votre {pharmacy ? "pharmacie" : "résidence"}.</h2>
            <p>
              Saisissez l’adresse email d’activation fournie par téléphone. Elle
              permet d’associer votre compte au bon établissement.
            </p>
          </div>
          <InputField
            label="Email d’activation"
            type="email"
            value={emailActivation}
            onChange={(event) => setEmailActivation(event.target.value)}
            placeholder={
              pharmacy ? "contact@pharmacie.fr" : "contact@residence.fr"
            }
            required
            disabled={loading}
          />
          <PrimaryButton loading={loading}>Vérifier mon email</PrimaryButton>
        </form>
      ) : (
        <form onSubmit={onSignup} className="auth-form">
          {pharmacy ? (
            <PharmacyCard
              nomPharmacie={entity?.nompharm}
              codePharm={entity?.codepharm}
              onChangeCode={onModifyEmail}
              disabled={loading}
            />
          ) : (
            <div className="linked-pharmacy">
              <span className="icon-tile">
                <Icon name="building" size={19} />
              </span>
              <div>
                <small>Résidence associée</small>
                <strong>{entity?.nom_residence}</strong>
              </div>
              <button
                type="button"
                className="text-link"
                onClick={onModifyEmail}
                disabled={loading}
              >
                Modifier
              </button>
            </div>
          )}
          <div className="auth-form-fields">
            <div className="twoCols">
              <InputField
                label="Nom"
                name="nom"
                value={form.nom}
                onChange={(event) => updateField("nom", event.target.value)}
                placeholder="Votre nom"
                autoComplete="family-name"
                required
                disabled={loading}
              />
              <InputField
                label="Prénom"
                name="prenom"
                value={form.prenom}
                onChange={(event) => updateField("prenom", event.target.value)}
                placeholder="Votre prénom"
                autoComplete="given-name"
                required
                disabled={loading}
              />
            </div>
            <InputField
              label="Téléphone"
              type="tel"
              name="telephone"
              value={form.telephone}
              onChange={(event) => updateField("telephone", event.target.value)}
              placeholder="Votre numéro de téléphone"
              autoComplete="tel"
              required={pharmacy}
              disabled={loading}
            />
            <InputField
              label="Adresse email"
              type="email"
              name="email"
              value={form.email}
              onChange={() => {}}
              required
              disabled
              hint="Adresse vérifiée et associée à votre établissement."
            />
            <InputField
              label="Mot de passe"
              type="password"
              name="password"
              value={form.password}
              onChange={(event) => updateField("password", event.target.value)}
              placeholder="Créez votre mot de passe"
              autoComplete="new-password"
              required
              disabled={loading}
            />
            <InputField
              label="Confirmer le mot de passe"
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={(event) =>
                updateField("confirmPassword", event.target.value)
              }
              placeholder="Saisissez à nouveau le mot de passe"
              autoComplete="new-password"
              required
              disabled={loading}
            />
          </div>
          <div className="info-note">
            <Icon name="shield" size={15} />
            <p>
              Après création, votre compte sera soumis à la validation de
              l’administrateur.
            </p>
          </div>
          <PrimaryButton loading={loading}>
            {pharmacy
              ? "Créer mon compte pharmacien"
              : "Créer mon compte résidence"}
          </PrimaryButton>
        </form>
      )}
    </PageTransition>
  );
}
