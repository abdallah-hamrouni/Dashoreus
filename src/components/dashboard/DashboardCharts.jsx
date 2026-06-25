import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function DashboardCharts({ deliveries }) {
  const statusData = [
    {
      name: "Livrée",
      value: deliveries.filter((item) => item.status === "Livrée").length,
    },
    {
      name: "En cours",
      value: deliveries.filter((item) => item.status === "En cours").length,
    },
    {
      name: "En attente",
      value: deliveries.filter((item) => item.status === "En attente").length,
    },
  ];

  const byEstablishment = Object.values(
    deliveries.reduce((acc, item) => {
      if (!acc[item.establishmentName]) {
        acc[item.establishmentName] = {
          name: item.establishmentName,
          livraisons: 0,
          patients: 0,
        };
      }

      acc[item.establishmentName].livraisons += 1;
      acc[item.establishmentName].patients += item.patients;

      return acc;
    }, {})
  );

  const colors = ["#7CBCCC", "#30302F", "#B9E3EA"];

  return (
    <section className="mb-8 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-[34px] border border-white bg-white/80 p-6 shadow-[0_22px_70px_rgba(48,48,47,0.09)] backdrop-blur-xl">
        <div className="mb-5">
          <h2 className="text-2xl font-black tracking-[-0.04em] text-[#30302F]">
            Livraisons par établissement
          </h2>
          <p className="mt-1 text-sm font-semibold text-[#6F7D80]">
            Vue globale des livraisons et des patients concernés.
          </p>
        </div>

        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byEstablishment}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: "#6F7D80" }}
                interval={0}
                height={70}
              />
              <YAxis tick={{ fontSize: 12, fill: "#6F7D80" }} />
              <Tooltip />
              <Bar
                dataKey="livraisons"
                radius={[12, 12, 0, 0]}
                fill="#7CBCCC"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-[34px] border border-white bg-white/80 p-6 shadow-[0_22px_70px_rgba(48,48,47,0.09)] backdrop-blur-xl">
        <div className="mb-5">
          <h2 className="text-2xl font-black tracking-[-0.04em] text-[#30302F]">
            Statut des livraisons
          </h2>
          <p className="mt-1 text-sm font-semibold text-[#6F7D80]">
            Répartition des livraisons selon leur état.
          </p>
        </div>

        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                innerRadius={65}
                outerRadius={105}
                paddingAngle={4}
              >
                {statusData.map((entry, index) => (
                  <Cell key={entry.name} fill={colors[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="grid gap-2">
          {statusData.map((item, index) => (
            <div
              key={item.name}
              className="flex items-center justify-between rounded-2xl bg-[#F5FAFA] px-4 py-3"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ background: colors[index] }}
                />
                <span className="text-sm font-black text-[#30302F]">
                  {item.name}
                </span>
              </div>
              <span className="text-sm font-black text-[#6F7D80]">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}