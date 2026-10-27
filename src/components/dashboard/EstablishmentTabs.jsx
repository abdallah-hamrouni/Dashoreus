export default function EstablishmentTabs({
  etablissements = [],
  activeEtablissement,
  setActiveEtablissement,
  livraisons = [],
}) {
  const options = [
    { id: "ALL", nom: "Tous les établissements" },
    ...etablissements,
  ];
  return (
    <div
      className="establishment-tabs"
      role="group"
      aria-label="Filtrer par établissement"
    >
      {options.map((item) => {
        const id = String(item.id);
        const count =
          id === "ALL"
            ? livraisons.length
            : livraisons.filter(
                (delivery) => String(delivery.etablissementId) === id,
              ).length;
        return (
          <button
            key={id}
            type="button"
            className={`establishment-tab ${String(activeEtablissement) === id ? "active" : ""}`}
            aria-pressed={String(activeEtablissement) === id}
            onClick={() => setActiveEtablissement(item.id)}
            title={item.nom}
          >
            <span>{item.nom}</span>
            <span>{count}</span>
          </button>
        );
      })}
    </div>
  );
}
