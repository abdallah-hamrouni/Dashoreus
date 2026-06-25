export default function EstablishmentTabs({
  establishments,
  activeEstablishment,
  setActiveEstablishment,
  deliveries,
}) {
  function countFor(id) {
    if (id === "ALL") return deliveries.length;

    return deliveries.filter((item) => item.establishmentId === id).length;
  }

  return (
    <section className="mb-6 rounded-[34px] border border-white bg-white/75 p-5 shadow-[0_20px_65px_rgba(48,48,47,0.08)] backdrop-blur-xl">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-[-0.04em] text-[#30302F]">
            Livraisons par établissement
          </h2>
          <p className="mt-1 text-sm font-semibold text-[#6F7D80]">
            Choisissez un établissement pour afficher ses livraisons.
          </p>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2">
        <TabButton
          active={activeEstablishment === "ALL"}
          label="Tous"
          count={countFor("ALL")}
          onClick={() => setActiveEstablishment("ALL")}
        />

        {establishments.map((item) => (
          <TabButton
            key={item.id}
            active={activeEstablishment === item.id}
            label={item.name}
            count={countFor(item.id)}
            onClick={() => setActiveEstablishment(item.id)}
          />
        ))}
      </div>
    </section>
  );
}

function TabButton({ active, label, count, onClick }) {
  return (
    <button
      onClick={onClick}
      className={[
        "min-w-fit rounded-2xl border px-4 py-3 text-left transition duration-300",
        active
          ? "border-[#7CBCCC] bg-[#30302F] text-white shadow-[0_14px_35px_rgba(48,48,47,0.18)]"
          : "border-[#DDEAEC] bg-white text-[#30302F] hover:border-[#7CBCCC]/60",
      ].join(" ")}
    >
      <strong className="block text-sm font-black">{label}</strong>
      <span
        className={[
          "mt-1 block text-xs font-bold",
          active ? "text-white/65" : "text-[#6F7D80]",
        ].join(" ")}
      >
        {count} livraison(s)
      </span>
    </button>
  );
}