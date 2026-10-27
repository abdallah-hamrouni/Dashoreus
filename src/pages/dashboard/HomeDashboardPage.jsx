import DashboardStats from "../../components/dashboard/DashboardStats";
import DashboardCharts from "../../components/dashboard/DashboardCharts";
import DeliveriesTable from "../../components/dashboard/DeliveriesTable";
import EstablishmentTabs from "../../components/dashboard/EstablishmentTabs";
import Icon from "../../components/ui/Icon";

export default function HomeDashboardPage({
  user,
  isPharmacien,
  etablissements = [],
  livraisons = [],
  activeEtablissement = "ALL",
  setActiveEtablissement,
  onGeneratePdf,
  loadingPdfId,
  setActivePage,
}) {
  const filtered =
    activeEtablissement === "ALL"
      ? livraisons
      : livraisons.filter(
          (item) =>
            String(item.etablissementId) === String(activeEtablissement),
        );
  return (
    <div className="stack">
      <div className="page-heading">
        <div>
          <span className="eyebrow">Votre activité en un regard</span>
          <h1>Bonjour{user?.prenom ? `, ${user.prenom}` : ""}.</h1>
          <p>
            Retrouvez l’essentiel de votre activité et le suivi de vos
            établissements.
          </p>
        </div>
        <div className="heading-actions">
          <span className="period-chip">
            <Icon name="calendar" size={14} />
            Tout l’historique
          </span>
        </div>
      </div>
      <DashboardStats
        isPharmacien={isPharmacien}
        etablissementsCount={etablissements.length}
        livraisons={livraisons}
      />
      <DashboardCharts livraisons={livraisons} />
      <DeliveriesTable
        key={activeEtablissement}
        livraisons={filtered}
        onGeneratePdf={onGeneratePdf}
        loadingPdfId={loadingPdfId}
        action={
          <button
            type="button"
            className="text-link"
            onClick={() => setActivePage("LIVRAISONS")}
          >
            Voir les livraisons
            <Icon name="arrow" size={13} />
          </button>
        }
      >
        <EstablishmentTabs
          etablissements={etablissements}
          activeEtablissement={activeEtablissement}
          setActiveEtablissement={setActiveEtablissement}
          livraisons={livraisons}
        />
      </DeliveriesTable>
      <div className="overview-banner">
        <span className="icon-tile">
          <Icon name="file" size={19} />
        </span>
        <div>
          <h2>Des documents prêts à vous accompagner.</h2>
          <p>
            Retrouvez le détail de chaque livraison et téléchargez son bon au
            format PDF.
          </p>
        </div>
        <button
          type="button"
          className="text-link"
          onClick={() => setActivePage("LIVRAISONS")}
          aria-label="Accéder aux documents des livraisons"
        >
          Accéder aux documents
          <Icon name="arrow" size={15} />
        </button>
      </div>
    </div>
  );
}
