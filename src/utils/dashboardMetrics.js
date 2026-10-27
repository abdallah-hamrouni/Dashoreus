export function monthlyMetrics(deliveries) {
  const groups = new Map();
  for (const item of deliveries) {
    const value =
      item.date || item.dateAction || item.dateDebut || item.dateFin;
    if (!value) continue;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) continue;
    const year = date.getFullYear();
    const month = date.getMonth();
    const key = `${year}-${String(month + 1).padStart(2, "0")}`;
    if (!groups.has(key))
      groups.set(key, {
        key,
        label: date.toLocaleDateString("fr-FR", {
          month: "short",
          year: "2-digit",
        }),
        livraisons: 0,
        livrees: 0,
        enAttente: 0,
        patients: 0,
        piluliers: 0,
      });
    const group = groups.get(key);
    group.livraisons += 1;
    group[item.statut === "Livrée" ? "livrees" : "enAttente"] += 1;
    group.patients += Number(item.patients || 0);
    group.piluliers += Number(item.piluliers || 0);
  }
  return Array.from(groups.values()).sort((a, b) => a.key.localeCompare(b.key));
}
export function formatDeliveryDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? String(value)
    : date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
}
