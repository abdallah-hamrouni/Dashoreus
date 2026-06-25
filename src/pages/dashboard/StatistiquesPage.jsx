import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { getHistoriqueDashboard } from "../../api/historiqueApi";
import { getDashboardSession } from "../../storage/dashboardStorage";

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
const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    async function load() {
  const session = getDashboardSession();

  setUserRole(session?.user?.role || null);

  if (!session?.token || !session?.user) {
    setDeliveries([]);
    setLoading(false);
    return;
  }

  try {
    const data = await getHistoriqueDashboard(
      session.token,
      session.user.role
    );

        const mapped = Array.isArray(data)
          ? data.map((item) => {
              const patients = Array.isArray(item.patients)
                ? item.patients
                : [];

              const piluliersFromPatients = patients.reduce(
                (sum, patient) => sum + Number(patient.nbpilulier || 0),
                0
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
                patients: Number(
                  item.nombre_patients || patients.length || 0
                ),
                piluliers: Number(
                  item.nombre_piluliers || piluliersFromPatients || 0
                ),
              };
            })
          : [];

        setDeliveries(mapped);
      } catch (error) {
        console.error("Erreur chargement statistiques :", error);
        setDeliveries([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);
   const isPharmacien = userRole === "PHARMACIEN";

  const stats = useMemo(() => {
    const total = deliveries.length;
    const livrees = deliveries.filter((item) => item.statut === "Livrée").length;
    const enAttente = total - livrees;
    const patients = deliveries.reduce(
      (sum, item) => sum + Number(item.patients || 0),
      0
    );

    const piluliers = deliveries.reduce(
      (sum, item) => sum + Number(item.piluliers || 0),
      0
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
      a.key.localeCompare(b.key)
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
            current.livraisons > best.livraisons ? current : best
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

  if (loading) {
    return (
      <div className="rounded-[28px] border border-white bg-white p-6 shadow-[0_18px_45px_rgba(48,48,47,0.06)]">
        <p className="text-sm font-black text-[#6F7D80]">
          Chargement des statistiques...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="rounded-[28px] border border-[#DDEAEC] bg-white p-6 shadow-[0_18px_45px_rgba(48,48,47,0.06)]">
        <span className="rounded-full bg-[#7CBCCC]/15 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#4A9CAF]">
          Analyse
        </span>

        <h1 className="mt-4 text-3xl font-black tracking-[-0.04em] text-[#30302F]">
          Statistiques des livraisons
        </h1>

        <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-[#6F7D80]">
          Suivi de l’évolution des livraisons dans le temps, répartition par
          statut et analyse des résidences les plus actives.
        </p>
      </header>

      <section className="mx-auto grid max-w-5xl justify-center gap-4 md:grid-cols-2 xl:grid-cols-4">
  <StatCard label="Livraisons totales" value={stats.total} />
  <StatCard label="Livrées" value={stats.livrees} />
  <StatCard label="Patients" value={stats.patients} />
  <StatCard label="Piluliers" value={stats.piluliers} />
</section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <article className="rounded-[30px] border border-[#DDEAEC] bg-white p-6 shadow-[0_18px_45px_rgba(48,48,47,0.06)]">
          <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-black text-[#30302F]">
                Évolution des livraisons par mois
              </h2>

              <p className="mt-1 text-sm font-semibold text-[#6F7D80]">
                Cette courbe montre l’évolution réelle du nombre de livraisons
                enregistrées dans le temps.
              </p>
            </div>

            {stats.bestMonth ? (
              <span className="w-fit rounded-full bg-[#7CBCCC]/15 px-4 py-2 text-xs font-black text-[#4A9CAF]">
                Meilleur mois : {stats.bestMonth.label}
              </span>
            ) : null}
          </div>

          {stats.monthlyData.length === 0 ? (
            <EmptyState message="Aucune donnée mensuelle disponible." />
          ) : (
            <div className="h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 12, fill: "#6F7D80" }}
                  />
                  <YAxis tick={{ fontSize: 12, fill: "#6F7D80" }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="livraisons"
                    name="Livraisons"
                    stroke="#4A9CAF"
                    strokeWidth={4}
                    dot={{ r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </article>

        
      </section>

     <section
  className={[
    "grid gap-6",
    isPharmacien ? "xl:grid-cols-[1fr_1fr]" : "xl:grid-cols-1",
  ].join(" ")}
>
  <article className="rounded-[30px] border border-[#DDEAEC] bg-white p-6 shadow-[0_18px_45px_rgba(48,48,47,0.06)]">
    <h2 className="text-2xl font-black text-[#30302F]">
      Livrées par mois
    </h2>

    <p className="mt-1 text-sm font-semibold text-[#6F7D80]">
      Comparaison mensuelle entre les livraisons terminées et celles en
      attente ou en cours.
    </p>

    {stats.monthlyData.length === 0 ? (
      <EmptyState message="Aucune donnée disponible pour ce graphique." />
    ) : (
      <div className="mt-5 h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={stats.monthlyData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 12, fill: "#6F7D80" }}
            />
            <YAxis tick={{ fontSize: 12, fill: "#6F7D80" }} />
            <Tooltip />
            <Bar
              dataKey="livrees"
              name="Livrées"
              fill="#7CBCCC"
              radius={[10, 10, 0, 0]}
            />
            <Bar
              dataKey="enAttente"
              name="En attente"
              fill="#30302F"
              radius={[10, 10, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    )}
  </article>

  {isPharmacien && (
    <article className="rounded-[30px] border border-[#DDEAEC] bg-white p-6 shadow-[0_18px_45px_rgba(48,48,47,0.06)]">
      <h2 className="text-2xl font-black text-[#30302F]">
        Résidences les plus actives
      </h2>

      <p className="mt-1 text-sm font-semibold text-[#6F7D80]">
        Classement des résidences selon le nombre de livraisons.
      </p>

      {stats.topResidences.length === 0 ? (
        <EmptyState message="Aucune résidence trouvée." />
      ) : (
        <div className="mt-5 space-y-3">
          {stats.topResidences.map((item, index) => (
            <ResidenceRank
              key={item.name}
              index={index}
              name={item.name}
              livraisons={item.livraisons}
              patients={item.patients}
              piluliers={item.piluliers}
              max={stats.topResidences[0]?.livraisons || 1}
            />
          ))}
        </div>
      )}
    </article>
  )}
</section>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <article className="rounded-[24px] border border-[#DDEAEC] bg-white p-5 shadow-[0_14px_35px_rgba(48,48,47,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(48,48,47,0.08)]">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-[#7CBCCC]">
        {label}
      </p>

      <strong className="mt-3 block text-3xl font-black text-[#30302F]">
        {value}
      </strong>
    </article>
  );
}

function ResidenceRank({ index, name, livraisons, patients, piluliers, max }) {
  const percent = Math.round((livraisons / Math.max(1, max)) * 100);

  return (
    <div className="rounded-[22px] border border-[#DDEAEC] bg-[#F9FCFD] p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-black text-[#30302F]">
            #{index + 1} {name}
          </p>

          <p className="mt-1 text-xs font-semibold text-[#6F7D80]">
            {livraisons} livraison(s) • {patients} patient(s) • {piluliers} pilulier(s)
          </p>
        </div>

        <span className="rounded-full bg-[#7CBCCC]/15 px-3 py-1 text-xs font-black text-[#4A9CAF]">
          {livraisons}
        </span>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#DDEAEC]">
        <div
          className="h-full rounded-full bg-[#7CBCCC] transition-all duration-700"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function LegendItem({ color, label, value }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-[#F9FCFD] px-4 py-3">
      <div className="flex items-center gap-2">
        <span
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span className="text-sm font-black text-[#30302F]">{label}</span>
      </div>

      <span className="text-sm font-black text-[#6F7D80]">{value}</span>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="mt-5 rounded-[24px] border border-dashed border-[#7CBCCC]/40 bg-[#7CBCCC]/10 p-8 text-center">
      <p className="text-sm font-black text-[#30302F]">{message}</p>
    </div>
  );
}

function parseDate(value) {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}