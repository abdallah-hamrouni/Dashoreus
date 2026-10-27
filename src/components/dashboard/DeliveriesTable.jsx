import { useState } from "react";
import Icon from "../ui/Icon";
import { formatDeliveryDate } from "../../utils/dashboardMetrics";
import EmptyState from "./EmptyState";

export default function DeliveriesTable({
  livraisons = [],
  onGeneratePdf,
  loadingPdfId,
  title = "Historique des livraisons",
  action,
  children,
  emptyText = "Les livraisons de cet établissement apparaîtront ici.",
}) {
  const [requestedPage, setRequestedPage] = useState(1);
  const pageSize = 8;
  const totalPages = Math.max(1, Math.ceil(livraisons.length / pageSize));
  const page = Math.min(requestedPage, totalPages);
  const offset = (page - 1) * pageSize;
  const visible = livraisons.slice(offset, offset + pageSize);
  return (
    <section className="surface table-panel">
      <div className="table-heading">
        <div>
          <div className="table-heading-title">
            <h2>{title}</h2>
            <span className="count-label">{livraisons.length}</span>
          </div>
          <p>Caisses, patients et documents de livraison.</p>
        </div>
        {action}
      </div>
      {children}
      {livraisons.length ? (
        <>
          <div
            className="table-scroll"
            tabIndex={0}
            role="region"
            aria-label="Tableau des livraisons, défilement horizontal disponible"
          >
            <table className="deliveries-table">
              <caption className="sr-only">
                {title} — {livraisons.length} livraison(s)
              </caption>
              <thead>
                <tr>
                  <th scope="col">Résidence</th>
                  <th scope="col">Caisses</th>
                  <th scope="col" className="table-numeric">
                    Patients
                  </th>
                  <th scope="col" className="table-numeric">
                    Piluliers
                  </th>
                  <th scope="col">Statut</th>
                  <th scope="col">Signature</th>
                  {onGeneratePdf && <th scope="col">Document</th>}
                </tr>
              </thead>
              <tbody>
                {visible.map((item) => (
                  <tr key={`${item.id}-${item.numcaisse}`}>
                    <td>
                      <div className="table-residence">
                        <span className="icon-tile">
                          <Icon name="building" size={14} />
                        </span>
                        <strong>{item.etablissementNom || "—"}</strong>
                      </div>
                    </td>
                    <td>
                      <CaisseBadges value={item.numcaisse} />
                    </td>
                    <td className="table-numeric">
                      {Number(item.patients || 0).toLocaleString("fr-FR")}
                    </td>
                    <td className="table-numeric">
                      {Number(item.piluliers || 0).toLocaleString("fr-FR")}
                    </td>
                    <td>
                      <span
                        className={`badge ${item.statut === "Livrée" ? "badge-success" : "badge-pending"}`}
                      >
                        <span className="status-dot" />
                        {item.statut || "En attente"}
                      </span>
                    </td>
                    <td className="table-date">
                      {formatDeliveryDate(item.dateAction)}
                    </td>
                    {onGeneratePdf && (
                      <td>
                        <button
                          type="button"
                          className="pdf-button"
                          onClick={(event) =>
                            onGeneratePdf(item.id, event.currentTarget)
                          }
                          disabled={loadingPdfId === item.id}
                          aria-busy={loadingPdfId === item.id}
                          aria-label={`Voir le PDF de ${item.etablissementNom || "la résidence"}, signature du ${formatDeliveryDate(item.dateAction)}`}
                        >
                          {loadingPdfId === item.id ? (
                            <span className="spinner" />
                          ) : (
                            <Icon name="eye" size={13} />
                          )}
                          <span>
                            {loadingPdfId === item.id ? "Création…" : "PDF"}
                          </span>
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="table-bottom">
            <span aria-live="polite">
              {offset + 1}–{Math.min(offset + pageSize, livraisons.length)} sur{" "}
              {livraisons.length} livraison(s)
            </span>
            <div className="pagination">
              <button
                type="button"
                className="icon-button"
                aria-label="Page précédente"
                disabled={page === 1}
                onClick={() => setRequestedPage(page - 1)}
              >
                <Icon
                  name="chevron"
                  size={13}
                  style={{ transform: "rotate(180deg)" }}
                />
              </button>
              <span>
                {page} / {totalPages}
              </span>
              <button
                type="button"
                className="icon-button"
                aria-label="Page suivante"
                disabled={page === totalPages}
                onClick={() => setRequestedPage(page + 1)}
              >
                <Icon name="chevron" size={13} />
              </button>
            </div>
          </div>
        </>
      ) : (
        <EmptyState
          title="Aucune livraison à afficher"
          text={emptyText}
          icon="truck"
        />
      )}
    </section>
  );
}
function CaisseBadges({ value }) {
  const caisses = String(value || "—")
    .split(",")
    .map((caisse) => caisse.trim())
    .filter(Boolean);
  return (
    <div className="caisse-badges">
      {caisses.map((caisse, index) => (
        <span key={`${caisse}-${index}`}>{caisse}</span>
      ))}
    </div>
  );
}
