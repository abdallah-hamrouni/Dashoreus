import { AnimatedNumber, Stagger, Reveal } from "../../components/ui/Motion";
import Icon from "../../components/ui/Icon";
import EmptyState from "../../components/dashboard/EmptyState";

export default function ProfilPage({
  user,
  isPharmacien,
  etablissements = [],
  livraisons = [],
}) {
  const entityName = isPharmacien
    ? user?.nompharm || user?.nom_pharmacie || user?.nom || "Ma pharmacie"
    : user?.nom_residence || user?.nomresid || user?.nom || "Ma résidence";
  const roleLabel = isPharmacien ? "Pharmacien" : "Résidence";
  const livrees = livraisons.filter((item) => item.statut === "Livrée").length;
  const patients = livraisons.reduce(
    (sum, item) => sum + Number(item.patients || 0),
    0,
  );
  const piluliers = livraisons.reduce(
    (sum, item) => sum + Number(item.piluliers || 0),
    0,
  );
  const initials =
    `${user?.prenom?.[0] || ""}${user?.nom?.[0] || ""}`.toUpperCase() || "U";
  const infos = [
    ["Nom", user?.nom || "—"],
    ["Prénom", user?.prenom || "—"],
    ["Adresse email", user?.email || "—"],
    ["Téléphone", user?.telephone || "—"],
    ["Rôle", roleLabel],
    ["Établissement", entityName],
  ];
  const activity = [
    [isPharmacien ? "Résidences liées" : "Résidence", etablissements.length],
    ["Livraisons livrées", livrees],
    ["Patients cumulés", patients],
    ["Piluliers", piluliers],
  ];
  return (
    <div className="stack">
      <section className="surface profile-hero">
        <span className="avatar" aria-hidden="true">
          {initials}
        </span>
        <div>
          <span className="eyebrow">Votre profil professionnel</span>
          <h1>
            {user?.prenom || "Utilisateur"} {user?.nom || ""}
          </h1>
          <p>{entityName}</p>
        </div>
        <span className="badge">
          <Icon name="shield" size={12} />
          {roleLabel}
        </span>
      </section>
      <div className="detail-grid">
        <section className="surface detail-panel">
          <div className="panel-heading">
            <div>
              <h2>Informations personnelles</h2>
              <p>Les informations de votre compte OREUS</p>
            </div>
            <span className="icon-tile">
              <Icon name="user" size={18} />
            </span>
          </div>
          <dl className="info-grid">
            {infos.map(([label, value]) => (
              <div className="info-item" key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </section>
        <section className="surface detail-panel">
          <div className="panel-heading">
            <div>
              <h2>Votre activité</h2>
              <p>Calculée à partir de l’historique des livraisons</p>
            </div>
            <span className="icon-tile">
              <Icon name="chart" size={18} />
            </span>
          </div>
          <div className="activity-list">
            {activity.map(([label, value]) => (
              <div className="activity-row" key={label}>
                <span>{label}</span>
                <strong>
                  <AnimatedNumber value={value} />
                </strong>
              </div>
            ))}
          </div>
        </section>
      </div>
      <section className="surface detail-panel">
        <div className="panel-heading">
          <div>
            <h2>Vos établissements accessibles</h2>
            <p>
              {isPharmacien
                ? "Consultez toutes les résidences liées à votre pharmacie."
                : "Votre accès est limité aux informations de votre résidence."}
            </p>
          </div>
          <span className="count-label">{etablissements.length} accès</span>
        </div>
        {etablissements.length ? (
          <Stagger className="residence-grid">
            {etablissements.map((item, index) => (
              <Reveal key={item.id || index}>
                <div className="residence-card">
                  <span className="icon-tile">
                    <Icon name="building" size={18} />
                  </span>
                  <div>
                    <strong>{item.nom || "Résidence"}</strong>
                    <small>Résidence associée</small>
                  </div>
                </div>
              </Reveal>
            ))}
          </Stagger>
        ) : (
          <EmptyState
            icon="building"
            title="Aucun établissement associé"
            text="Vos établissements accessibles seront affichés ici."
          />
        )}
      </section>
    </div>
  );
}
