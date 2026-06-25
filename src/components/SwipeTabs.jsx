const tabs = [
  {
    id: "LOGIN",
    label: "Connexion",
    short: "C",
  },
  {
    id: "ACTIVATION",
    label: "Activation",
    short: "A",
  },
];

export default function SwipeTabs({ activeMode, setActiveMode }) {
  return (
    <div className="mb-7 rounded-[24px] border border-white bg-[#F1F7F7]/90 p-1.5 shadow-[0_12px_35px_rgba(48,48,47,0.06)]">
      <div className="grid grid-cols-2 gap-1.5">
        {tabs.map((tab) => {
          const active = activeMode === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveMode(tab.id)}
              className={[
                "relative min-h-[58px] overflow-hidden rounded-[18px] px-3 py-2 text-sm font-extrabold transition-colors duration-200",
                active
                  ? "bg-white text-[#30302F] shadow-[0_10px_25px_rgba(48,48,47,0.10)]"
                  : "text-[#6D7B7D] hover:bg-white/60 hover:text-[#30302F]",
              ].join(" ")}
            >
              <span className="relative z-10 flex flex-col items-center justify-center gap-1">
                <span
                  className={[
                    "grid h-6 w-6 place-items-center rounded-full text-[11px] font-black",
                    active
                      ? "bg-[#7CBCCC]/20 text-[#30302F]"
                      : "bg-white/70 text-[#6D7B7D]",
                  ].join(" ")}
                >
                  {tab.short}
                </span>

                <span>{tab.label}</span>
              </span>

              {active && (
                <span className="absolute bottom-1 left-1/2 z-10 h-1 w-10 -translate-x-1/2 rounded-full bg-[#7CBCCC]" />
              )}
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-center text-xs font-semibold text-[#6F7D80]">
        Choisissez une section pour continuer
      </p>
    </div>
  );
}