import { Stagger, Reveal } from "../ui/Motion";
import MetricCard from "./MetricCard";

export default function DashboardStats({
  isPharmacien,
  etablissementsCount = 0,
  livraisons = [],
}) {
  const patients = livraisons.reduce(
    (sum, item) => sum + Number(item.patients || 0),
    0,
  );
  const piluliers = livraisons.reduce(
    (sum, item) => sum + Number(item.piluliers || 0),
    0,
  );
  const stats = [
    {
      label: "Livraisons",
      value: livraisons.length,
      icon: "truck",
      detail: "Enregistrées dans votre historique",
      featured: true,
    },
    {
      label: isPharmacien ? "Résidences liées" : "Résidence",
      value: etablissementsCount,
      icon: "building",
      detail: isPharmacien
        ? "Associées à votre pharmacie"
        : "Associée à votre compte",
    },
    {
      label: "Patients",
      value: patients,
      icon: "users",
      detail: "Cumul sur les livraisons",
    },
    {
      label: "Piluliers",
      value: piluliers,
      icon: "pill",
      detail: "Cumul sur les livraisons",
    },
  ];
  return (
    <Stagger className="kpi-grid" aria-label="Indicateurs de votre activité">
      {stats.map((stat) => (
        <Reveal key={stat.label}>
          <MetricCard {...stat} />
        </Reveal>
      ))}
    </Stagger>
  );
}
