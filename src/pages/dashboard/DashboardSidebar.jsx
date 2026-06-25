import logoOreus from "../../assets/oreusblanc.svg";

export default function DashboardSidebar({
  user,
  logout,
  activePage,
  setActivePage,
}) {
  const fullName =
    `${user?.prenom || ""} ${user?.nom || ""}`.trim() || "Utilisateur";

  const email = user?.email || "-";

  const initials = `${user?.prenom?.[0] || ""}${user?.nom?.[0] || ""}`
    .trim()
    .toUpperCase();

  return (
    <aside className="hidden min-h-screen w-[280px] flex-col justify-between bg-[#30302F] px-5 py-5 text-white lg:flex">
      <div>
        <div className="px-2">
          <img
            src={logoOreus}
            alt="OREUS"
            className="block h-auto w-[145px]"
          />

          <p className="mt-2 text-[11px] font-black uppercase tracking-[0.22em] text-white/35">
            Dashboard
          </p>
        </div>

        <div className="mt-7 rounded-[24px] border border-white/10 bg-white/[0.055] p-4 shadow-[0_16px_45px_rgba(0,0,0,0.14)]">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#7CBCCC]/18 text-sm font-black text-[#A9DDE8]">
              {initials || "U"}
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#8ED0DF]">
                Connecté
              </p>

              <h2 className="mt-1 truncate text-base font-black leading-tight text-white">
                {fullName}
              </h2>
            </div>
          </div>

         
        </div>

        <nav className="mt-7 grid gap-2">
          <SidebarButton
            active={activePage === "ACCUEIL"}
            label="Accueil"
            icon="A"
            onClick={() => setActivePage("ACCUEIL")}
          />

          <SidebarButton
            active={activePage === "LIVRAISONS"}
            label="Livraisons"
            icon="L"
            onClick={() => setActivePage("LIVRAISONS")}
          />

          <SidebarButton
            active={activePage === "STATISTIQUES"}
            label="Statistiques"
            icon="S"
            onClick={() => setActivePage("STATISTIQUES")}
          />

          <SidebarButton
            active={activePage === "PARAMETRES"}
            label="Paramètres"
            icon="P"
            onClick={() => setActivePage("PARAMETRES")}
          />
        </nav>
      </div>

      <button
        type="button"
        onClick={logout}
        className="rounded-[18px] border border-red-400/20 bg-red-500/12 px-4 py-3 text-left text-sm font-black text-red-100 transition hover:bg-red-500/20"
      >
        Se déconnecter
      </button>
    </aside>
  );
}

function SidebarButton({ label, icon, active = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "group flex w-full items-center gap-3 rounded-[18px] px-3 py-3 text-left transition duration-300",
        active
          ? "bg-white text-[#30302F] shadow-[0_12px_30px_rgba(0,0,0,0.16)]"
          : "text-white/62 hover:bg-white/[0.08] hover:text-white",
      ].join(" ")}
    >
      <span
        className={[
          "grid h-9 w-9 shrink-0 place-items-center rounded-xl text-sm font-black transition",
          active
            ? "bg-[#7CBCCC]/18 text-[#30302F]"
            : "bg-white/[0.09] text-white/70 group-hover:bg-[#7CBCCC]/18 group-hover:text-[#A9DDE8]",
        ].join(" ")}
      >
        {icon}
      </span>

      <span className="text-[15px] font-black">{label}</span>
    </button>
  );
}