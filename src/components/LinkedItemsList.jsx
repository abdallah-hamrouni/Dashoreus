export default function LinkedItemsList({ title, items, type }) {
  if (!items || items.length === 0) return null;

  return (
    <section className="linkedSection">
      <h3>{title}</h3>

      <div className="linkedGrid">
        {items.map((item) => (
          <div
            key={item.id || item.code_resid || item.codepharm}
            className="linkedCard"
          >
            {type === "residence" ? (
              <>
                <strong>{item.nom_residence}</strong>
                <span>Code résidence : {item.code_resid}</span>
                <span>Code pharmacie : {item.codepharm}</span>
              </>
            ) : (
              <>
                <strong>{item.nompharm}</strong>
                <span>Code pharmacie : {item.codepharm}</span>
                <span>Résidence : {item.nom_residence}</span>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}