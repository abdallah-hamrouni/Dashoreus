export default function Tabs({ activeMode, setActiveMode }) {
  const tabs = [
    {
      id: "LOGIN",
      label: "Connexion",
    },
    {
      id: "SIGNUP_PHARMACIEN",
      label: "Pharmacien",
    },
    {
      id: "SIGNUP_RESIDENCE",
      label: "Résidence",
    },
  ];

  return (
    <div className="mb-7 rounded-2xl bg-[#F3F8F8] p-1.5 grid grid-cols-3 gap-1">
      {tabs.map((tab) => {
        const active = activeMode === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveMode(tab.id)}
            className={[
              "relative rounded-xl px-3 py-3 text-sm font-black transition-all duration-300",
              active
                ? "bg-white text-[#30302F] shadow-[0_10px_25px_rgba(48,48,47,0.10)]"
                : "text-[#6C7A7D] hover:text-[#30302F] hover:bg-white/60",
            ].join(" ")}
          >
            {active && (
              <span className="absolute inset-x-5 -bottom-1 h-1 rounded-full bg-[#7CBCCC]" />
            )}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}