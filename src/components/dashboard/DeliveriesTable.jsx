import EmptyState from "./EmptyState";

export default function DeliveriesTable({ deliveries }) {
  if (deliveries.length === 0) {
    return (
      <EmptyState text="Aucune livraison disponible pour cet établissement." />
    );
  }

  return (
    <section className="rounded-[34px] border border-white bg-white/75 p-6 shadow-[0_25px_80px_rgba(48,48,47,0.10)] backdrop-blur-2xl">
      <div className="mb-5">
        <h2 className="text-2xl font-black tracking-[-0.04em] text-[#30302F]">
          Liste des livraisons
        </h2>
        <p className="mt-1 text-sm font-semibold text-[#6F7D80]">
          Détail des caisses, patients, piluliers et statuts.
        </p>
      </div>

      <div className="overflow-hidden rounded-[24px] border border-[#DDEAEC]">
        <div className="hidden grid-cols-[1.2fr_1fr_0.8fr_0.8fr_0.9fr_0.8fr] bg-[#F5FAFA] px-5 py-4 text-sm font-black text-[#6F7D80] lg:grid">
          <span>Établissement</span>
          <span>Caisse</span>
          <span>Patients</span>
          <span>Piluliers</span>
          <span>Statut</span>
          <span>Date</span>
        </div>

        <div className="divide-y divide-[#DDEAEC]">
          {deliveries.map((item) => (
            <div
              key={item.id}
              className="grid gap-3 bg-white px-5 py-4 text-sm font-semibold text-[#30302F] transition hover:bg-[#F8FBFB] lg:grid-cols-[1.2fr_1fr_0.8fr_0.8fr_0.9fr_0.8fr]"
            >
              <span>{item.establishmentName}</span>
              <span>{item.caisse}</span>
              <span>{item.patients}</span>
              <span>{item.piluliers}</span>
              <span>
                <StatusBadge status={item.status} />
              </span>
              <span>{formatDate(item.date)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Livrée: "bg-green-500/10 text-green-700",
    "En cours": "bg-[#7CBCCC]/20 text-[#30302F]",
    "En attente": "bg-orange-500/10 text-orange-700",
  };

  return (
    <span
      className={[
        "inline-flex rounded-full px-3 py-1 text-xs font-black",
        styles[status] || "bg-gray-100 text-gray-700",
      ].join(" ")}
    >
      {status}
    </span>
  );
}

function formatDate(date) {
  const d = new Date(date);

  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}