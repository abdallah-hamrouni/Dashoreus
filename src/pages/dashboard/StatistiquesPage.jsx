import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getHistoriqueDashboard } from "../../api/historiqueApi";
import { getDashboardSession } from "../../storage/dashboardStorage";
import {
  ActivityChart,
  DeliveryStatus,
} from "../../components/dashboard/DashboardCharts";
import DashboardSkeleton from "../../components/dashboard/DashboardSkeleton";
import EmptyState from "../../components/dashboard/EmptyState";
import MetricCard from "../../components/dashboard/MetricCard";
import ChartTooltip from "../../components/dashboard/ChartTooltip";
import AlertMessage from "../../components/AlertMessage";
import Icon from "../../components/ui/Icon";
import { Stagger, Reveal } from "../../components/ui/Motion";

const MONTHS_FR = [
  "Jan",
  "Fév",
  "Mar",
  "Avr",
  "Mai",
  "Juin",
  "Juil",
  "Août",
  "Sep",
  "Oct",
  "Nov",
  "Déc",
];

export default function StatistiquesPage() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole] = useState(() => getDashboardSession()?.user?.role || null);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    let active = true;
    async function load() {
      const session = getDashboardSession();
      if (!session?.token || !session?.user) {
        if (active) setLoading(false);
        return;
      }
      try {
        const data = await getHistoriqueDashboard(
          session.token,
          session.user.role,
        );
        const mapped = Array.isArray(data)
          ? data.map((item) => {
              const patients = Array.isArray(item.patients)
                ? item.patients
                : [];

              const piluliersFromPatients = patients.reduce(
                (sum, patient) => sum + Number(patient.nbpilulier || 0),
                0,
              );

              return {
                id: item.id,
                residence:
                  item.nom_residence ||
                  item.nomresid ||
                  item.etablissementNom ||
                  "Résidence non définie",
                numcaisse: item.numcaisse || "-",
                statut:
                  item.statut === "SIGNE"
                    ? "Livrée"
                    : item.statut || "En attente",
                date:
                  item.date_action ||
                  item.date_debut_livraison ||
                  item.date_fin_livraison ||
                  null,
                patients: Number(item.nombre_patients || patients.length || 0),
                piluliers: Number(
                  item.nombre_piluliers || piluliersFromPatients || 0,
                ),
              };
            })
          : [];

        if (active) setDeliveries(mapped);
      } catch (err) {
        console.error("Erreur chargement statistiques :", err);
        if (active) {
          setError(err.message || "Impossible de charger les statistiques.");
          setDeliveries([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [retry]);
  const isPharmacien = userRole === "PHARMACIEN";
  const stats = useMemo(() => {
    const total = deliveries.length;
    const livrees = deliveries.filter(
      (item) => item.statut === "Livrée",
    ).length;
    const enAttente = total - livrees;
    const patients = deliveries.reduce(
      (sum, item) => sum + Number(item.patients || 0),
      0,
    );

    const piluliers = deliveries.reduce(
      (sum, item) => sum + Number(item.piluliers || 0),
      0,
    );

    const tauxLivraison = total ? Math.round((livrees / total) * 100) : 0;

    const monthlyMap = deliveries.reduce((acc, item) => {
      const date = parseDate(item.date);

      if (!date) return acc;

      const year = date.getFullYear();
      const month = date.getMonth();
      const key = `${year}-${String(month + 1).padStart(2, "0")}`;

      if (!acc[key]) {
        acc[key] = {
          key,
          label: `${MONTHS_FR[month]} ${year}`,
          livraisons: 0,
          livrees: 0,
          enAttente: 0,
          patients: 0,
          piluliers: 0,
        };
      }

      acc[key].livraisons += 1;
      acc[key].patients += Number(item.patients || 0);
      acc[key].piluliers += Number(item.piluliers || 0);

      if (item.statut === "Livrée") {
        acc[key].livrees += 1;
      } else {
        acc[key].enAttente += 1;
      }

      return acc;
    }, {});

    const monthlyData = Object.values(monthlyMap).sort((a, b) =>
      a.key.localeCompare(b.key),
    );

    const residencesMap = deliveries.reduce((acc, item) => {
      const name = item.residence || "Résidence non définie";

      if (!acc[name]) {
        acc[name] = {
          name,
          livraisons: 0,
          patients: 0,
          piluliers: 0,
        };
      }

      acc[name].livraisons += 1;
      acc[name].patients += Number(item.patients || 0);
      acc[name].piluliers += Number(item.piluliers || 0);

      return acc;
    }, {});

    const topResidences = Object.values(residencesMap)
      .sort((a, b) => b.livraisons - a.livraisons)
      .slice(0, 6);

    const statusData = [
      { name: "Livrées", value: livrees },
      { name: "En attente", value: enAttente },
    ];

    const bestMonth =
      monthlyData.length > 0
        ? monthlyData.reduce((best, current) =>
            current.livraisons > best.livraisons ? current : best,
          )
        : null;

    return {
      total,
      livrees,
      enAttente,
      patients,
      piluliers,
      tauxLivraison,
      monthlyData,
      topResidences,
      statusData,
      bestMonth,
    };
  }, [deliveries]);

  if (loading) return <DashboardSkeleton />;
  if (error)
    return (
      <div className="stack">
        <AlertMessage result={{ type: "error", message: error }} />
        <div>
          <button
            type="button"
            className="button button-secondary"
            onClick={() => {
              setError("");
              setLoading(true);
              setRetry((value) => value + 1);
            }}
          >
            <Icon name="refresh" size={15} />
            Réessayer
          </button>
        </div>
      </div>
    );
  const cards = [
    {
      label: "Livraisons totales",
      value: stats.total,
      icon: "truck",
      detail: "Sur l’ensemble de l’historique",
    },
    {
      label: "Livraisons livrées",
      value: stats.livrees,
      icon: "checkCircle",
      detail: `${stats.tauxLivraison} % de l’historique`,
    },
    {
      label: "Patients",
      value: stats.patients,
      icon: "users",
      detail: "Cumul sur les livraisons",
    },
    {
      label: "Piluliers",
      value: stats.piluliers,
      icon: "pill",
      detail: "Cumul sur les livraisons",
    },
  ];
  return (
    <div className="stack">
      <div className="page-heading">
        <div>
          <span className="eyebrow">Comprendre votre activité</span>
          <h1>Vos statistiques</h1>
          <p>
            Suivez l’évolution de vos livraisons et les indicateurs de votre
            activité.
          </p>
        </div>
        <span className="period-chip">
          <Icon name="calendar" size={14} />
          Tout l’historique
        </span>
      </div>
      <Stagger className="kpi-grid">
        {cards.map((card) => (
          <Reveal key={card.label}>
            <MetricCard {...card} />
          </Reveal>
        ))}
      </Stagger>
      <div className="charts-grid">
        <ActivityChart monthly={stats.monthlyData} large />
        <DeliveryStatus delivered={stats.livrees} total={stats.total} />
      </div>
      <div className={isPharmacien ? "detail-grid" : ""}>
        <section className="surface chart-panel">
          <div className="panel-heading">
            <div>
              <h2>Livraisons par mois</h2>
              <p>Comparaison des livraisons livrées et en attente</p>
            </div>
          </div>
          <div className="chart-legend" style={{ marginTop: 18 }}>
            <span>
              <i />
              Livrées
            </span>
            <span>
              <i className="alt" />
              En attente / en cours
            </span>
          </div>
          {stats.monthlyData.length ? (
            <>
              <div className="chart-frame chart-frame-large">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                  minWidth={0}
                  initialDimension={{ width: 1, height: 270 }}
                >
                  <BarChart
                    data={stats.monthlyData}
                    barGap={4}
                    margin={{ top: 8, right: 0, bottom: 0, left: -25 }}
                    accessibilityLayer
                  >
                    <CartesianGrid
                      stroke="#edf2f5"
                      strokeDasharray="3 4"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 10, fill: "#607682" }}
                      axisLine={false}
                      tickLine={false}
                      minTickGap={20}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fontSize: 10, fill: "#607682" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <Bar
                      dataKey="livrees"
                      name="Livrées"
                      fill="#4A9CAF"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={24}
                      isAnimationActive={!reduced}
                      animationDuration={650}
                    />
                    <Bar
                      dataKey="enAttente"
                      name="En attente / en cours"
                      fill="#cedfe5"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={24}
                      isAnimationActive={!reduced}
                      animationDuration={650}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="sr-only">
                {stats.monthlyData
                  .map(
                    (m) =>
                      `${m.label} : ${m.livrees} livrées, ${m.enAttente} en attente ou en cours`,
                  )
                  .join(". ")}
              </p>
            </>
          ) : (
            <EmptyState
              icon="chart"
              title="Pas encore de données mensuelles"
              text="Les livraisons avec une date renseignée alimenteront ce graphique."
            />
          )}
          {stats.bestMonth && (
            <p className="info-note" style={{ marginTop: 15 }}>
              <Icon name="chart" size={14} />
              Mois le plus actif : {stats.bestMonth.label} ·{" "}
              {stats.bestMonth.livraisons} livraison(s)
            </p>
          )}
        </section>
        {isPharmacien && (
          <section className="surface detail-panel">
            <div className="panel-heading">
              <div>
                <h2>Résidences les plus actives</h2>
                <p>Les 6 premières selon le nombre de livraisons</p>
              </div>
              <span className="icon-tile">
                <Icon name="building" size={18} />
              </span>
            </div>
            {stats.topResidences.length ? (
              <div className="rank-list">
                {stats.topResidences.map((item, index) => (
                  <div key={item.name}>
                    <div className="rank-top">
                      <span className="rank-index">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <strong>{item.name}</strong>
                        <small>
                          {item.patients} patients cumulés · {item.piluliers}{" "}
                          piluliers
                        </small>
                      </div>
                      <span className="count-label">{item.livraisons}</span>
                    </div>
                    <div className="rank-track">
                      <motion.span
                        initial={{ width: 0 }}
                        animate={{
                          width: `${(item.livraisons / Math.max(1, stats.topResidences[0].livraisons)) * 100}%`,
                        }}
                        transition={{
                          duration: reduced ? 0 : 0.7,
                          delay: reduced ? 0 : index * 0.06,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon="building"
                title="Aucune résidence à classer"
                text="Le classement apparaîtra après vos premières livraisons."
              />
            )}
          </section>
        )}
      </div>
    </div>
  );
}
function parseDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}
