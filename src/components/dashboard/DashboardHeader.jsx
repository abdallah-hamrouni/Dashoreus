export default function DashboardHeader({
  user,
  isPharmacien,
  establishmentsCount,
}) {
  const entityName = isPharmacien
    ? user.nompharm || user.nom_pharmacie || user.nom || "Ma pharmacie"
    : user.nom_residence || user.nomresid || user.nom || "Ma résidence";

  return (
    <header className="dashboardHero mb-8 overflow-hidden rounded-[34px] border border-white/80 bg-gradient-to-br from-white via-[#eef9fb] to-[#f8fbff] p-6 shadow-[0_30px_90px_rgba(48,48,47,0.14)] backdrop-blur-2xl sm:p-8">
      <div className="dashboardHeroGlow" aria-hidden="true" />
      <div className="dashboardHeroGlowAlt" aria-hidden="true" />
      <div className="dashboardHeroGrid">
        <div className="dashboardHeroContent">
          <div className="dashboardHeroTop">
            <div>
              


              <p className="dashboardHeroCopy">
                Bonjour {user.prenom}, vous êtes connecté en tant que <strong>{isPharmacien ? "Pharmacien" : "Résidence"}</strong>.
              </p>
            </div>

            <div className="dashboardHeroUserCard">
              <span className="dashboardHeroUserLabel">Compte actif</span>
              <strong>{user.email}</strong>
              <span>{establishmentsCount} liaison(s)</span>
            </div>
          </div>

          <div className="dashboardHeroQuick">
            <div className="dashboardHeroChip">
              <span>Type</span>
              <strong>{isPharmacien ? "Pharmacie" : "Résidence"}</strong>
            </div>
            <div className="dashboardHeroChip">
              <span>Liaisons actives</span>
              <strong>{establishmentsCount}</strong>
            </div>
          </div>
        </div>

        <div className="dashboardHeroCard">
          <div className="dashboardHeroCardHeader">
            <span>Vue globale</span>
            <strong>{establishmentsCount} liaison(s)</strong>
          </div>

          <div className="dashboardHeroChart" aria-hidden="true">
            <div className="dashboardHeroChartGrid">
              <span className="dashboardHeroChartBar" style={{ "--h": "32%" }} />
              <span className="dashboardHeroChartBar" style={{ "--h": "64%" }} />
              <span className="dashboardHeroChartBar" style={{ "--h": "48%" }} />
              <span className="dashboardHeroChartBar" style={{ "--h": "72%" }} />
              <span className="dashboardHeroChartBar" style={{ "--h": "58%" }} />
              <span className="dashboardHeroChartBar" style={{ "--h": "84%" }} />
            </div>
            <div className="dashboardHeroChartLine" />
            <div className="dashboardHeroChartDot" style={{ left: "14%" }} />
            <div className="dashboardHeroChartDot" style={{ left: "42%" }} />
            <div className="dashboardHeroChartDot" style={{ left: "68%" }} />
          </div>

          <p className="dashboardHeroCardNote">
            Données illustratives inspirées du style OREUS, avec un rendu moderne et animé.
          </p>
        </div>
      </div>
    </header>
  );
}
