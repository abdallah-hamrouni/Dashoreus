export default function DashboardSkeleton() {
  return (
    <div
      className="dashboard-skeleton"
      role="status"
      aria-label="Chargement du tableau de bord"
      aria-busy="true"
    >
      <span className="sr-only">Chargement des données en cours…</span>
      <div className="kpi-grid">
        {[0, 1, 2, 3].map((i) => (
          <div className="surface skeleton-card" key={i}>
            <span className="skeleton skeleton-icon" />
            <span className="skeleton skeleton-value" />
            <span className="skeleton skeleton-label" />
          </div>
        ))}
      </div>
      <div className="charts-grid">
        <div className="surface skeleton-chart">
          <span className="skeleton skeleton-label" />
          <span className="skeleton skeleton-plot" />
        </div>
        <div className="surface skeleton-chart">
          <span className="skeleton skeleton-label" />
          <span className="skeleton skeleton-ring" />
        </div>
      </div>
      <div className="surface skeleton-table">
        {[0, 1, 2, 3, 4].map((i) => (
          <span className="skeleton skeleton-row" key={i} />
        ))}
      </div>
    </div>
  );
}
