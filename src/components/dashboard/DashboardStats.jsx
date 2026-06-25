export default function DashboardStats({
  isPharmacien,
  establishmentsCount,
  deliveries,
}) {
  const delivered = deliveries.filter((item) => item.status === "Livrée").length;
  const pending = deliveries.filter((item) => item.status !== "Livrée").length;
  const patients = deliveries.reduce((sum, item) => sum + item.patients, 0);

  const stats = [
    {
      label: isPharmacien ? "Résidences liées" : "Pharmacies liées",
      value: establishmentsCount,
      short: isPharmacien ? "R" : "P",
    },
    {
      label: "Livraisons livrées",
      value: delivered,
      short: "L",
    },
    {
      label: "En attente / en cours",
      value: pending,
      short: "E",
    },
    {
      label: "Patients concernés",
      value: patients,
      short: "PT",
    },
  ];

  return (
    <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-[28px] border border-white bg-white/80 p-5 shadow-[0_18px_50px_rgba(48,48,47,0.08)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(48,48,47,0.12)]"
        >
          <div className="flex items-center justify-between">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#7CBCCC]/20 text-sm font-black text-[#30302F]">
              {stat.short}
            </div>

            <span className="h-2.5 w-2.5 rounded-full bg-[#7CBCCC]" />
          </div>

          <strong className="mt-5 block text-3xl font-black tracking-[-0.04em] text-[#30302F]">
            {stat.value}
          </strong>

          <span className="mt-1 block text-sm font-bold text-[#6F7D80]">
            {stat.label}
          </span>
        </div>
      ))}
    </section>
  );
}