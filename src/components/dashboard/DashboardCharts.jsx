import { useId, useMemo } from "react";
import { useReducedMotion } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AnimatedNumber } from "../ui/Motion";
import { monthlyMetrics } from "../../utils/dashboardMetrics";
import ChartTooltip from "./ChartTooltip";
import EmptyState from "./EmptyState";

export default function DashboardCharts({ livraisons = [] }) {
  const monthly = useMemo(() => monthlyMetrics(livraisons), [livraisons]);
  const delivered = livraisons.filter(
    (item) => item.statut === "Livrée",
  ).length;
  return (
    <div className="charts-grid">
      <ActivityChart monthly={monthly} />
      <DeliveryStatus delivered={delivered} total={livraisons.length} />
    </div>
  );
}
export function ActivityChart({ monthly, large = false }) {
  const reduced = useReducedMotion();
  const gradient = useId().replace(/:/g, "");
  return (
    <section
      className="surface chart-panel"
      aria-label="Évolution des livraisons"
    >
      <div className="panel-heading">
        <div>
          <h2>Activité des livraisons</h2>
          <p>Votre historique, mois après mois</p>
        </div>
        <span className="chart-legend">
          <span>
            <i />
            Livraisons
          </span>
        </span>
      </div>
      {monthly.length ? (
        <>
          <div className={`chart-frame ${large ? "chart-frame-large" : ""}`}>
            <ResponsiveContainer
              width="100%"
              height="100%"
              minWidth={0}
              initialDimension={{ width: 1, height: large ? 270 : 225 }}
            >
              <AreaChart
                data={monthly}
                margin={{ top: 10, right: 8, bottom: 0, left: -25 }}
                accessibilityLayer
              >
                <defs>
                  <linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7CBCCC" stopOpacity={0.27} />
                    <stop
                      offset="100%"
                      stopColor="#7CBCCC"
                      stopOpacity={0.015}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  stroke="#edf2f5"
                  strokeDasharray="3 4"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10, fill: "#607682" }}
                  tickLine={false}
                  axisLine={false}
                  minTickGap={20}
                  dy={8}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 10, fill: "#607682" }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="livraisons"
                  name="Livraisons"
                  stroke="#4A9CAF"
                  strokeWidth={2.5}
                  fill={`url(#${gradient})`}
                  dot={monthly.length === 1 ? { r: 4, fill: "#4a9caf" } : false}
                  activeDot={{ r: 4, stroke: "white", strokeWidth: 3 }}
                  isAnimationActive={!reduced}
                  animationDuration={700}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="sr-only">
            {monthly
              .map((m) => `${m.label} : ${m.livraisons} livraison(s)`)
              .join(". ")}
          </p>
        </>
      ) : (
        <EmptyState
          icon="chart"
          title="Votre activité commence ici"
          text="Les premières livraisons enregistrées feront apparaître votre courbe d’activité."
        />
      )}
    </section>
  );
}
export function DeliveryStatus({ delivered, total }) {
  const reduced = useReducedMotion();
  const pending = total - delivered;
  const rate = total ? Math.round((delivered / total) * 100) : 0;
  const data = [
    { name: "Livrées", value: delivered },
    { name: "En attente / en cours", value: pending },
  ];
  return (
    <section
      className="surface chart-panel"
      aria-label={`Répartition : ${delivered} livrées et ${pending} en attente ou en cours`}
    >
      <div className="panel-heading">
        <div>
          <h2>Statut des livraisons</h2>
          <p>Répartition de votre historique</p>
        </div>
      </div>
      {total ? (
        <>
          <div className="donut-wrap">
            <ResponsiveContainer
              width="100%"
              height="100%"
              minWidth={0}
              initialDimension={{ width: 1, height: 184 }}
            >
              <PieChart accessibilityLayer>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={61}
                  outerRadius={78}
                  startAngle={90}
                  endAngle={-270}
                  paddingAngle={delivered && pending ? 4 : 0}
                  stroke="none"
                  cornerRadius={5}
                  isAnimationActive={!reduced}
                  animationDuration={700}
                >
                  {data.map((item, index) => (
                    <Cell
                      key={item.name}
                      fill={index === 0 ? "#4A9CAF" : "#e2ecf1"}
                    />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="donut-value">
              <strong>
                <AnimatedNumber value={rate} />
                <small>%</small>
              </strong>
              <span>de livraisons livrées</span>
            </div>
          </div>
          <div className="status-legend">
            <div>
              <span>
                <i />
                Livrées
              </span>
              <strong>{delivered.toLocaleString("fr-FR")}</strong>
            </div>
            <div>
              <span>
                <i className="pending" />
                En attente / en cours
              </span>
              <strong>{pending.toLocaleString("fr-FR")}</strong>
            </div>
          </div>
        </>
      ) : (
        <EmptyState
          icon="truck"
          title="Aucune livraison enregistrée"
          text="Les statuts de vos livraisons seront regroupés ici."
        />
      )}
    </section>
  );
}
