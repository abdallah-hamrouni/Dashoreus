import { NavLink } from "react-router-dom";
import logoOreus from "../../assets/oreusblanc.svg";

export default function DashboardSidebar({ user, logout }) {
  return (
    <aside className="hidden min-h-screen flex-col justify-between bg-[#30302F] p-7 text-white lg:flex">
      <div>
        <div className="rounded-[26px] bg-white px-5 py-4 shadow-2xl">
          <img
            src={logoOreus}
            alt="OREUS"
            className="block"
            style={{ width: "155px", height: "auto" }}
          />
        </div>

        <div className="mt-8 rounded-[26px] border border-white/10 bg-white/[0.06] p-5">
          <span className="text-[12px] font-black uppercase tracking-[0.14em] text-[#7CBCCC]">
            Connecté
          </span>

          <h2 className="mt-3 text-xl font-black leading-tight">
            {user?.prenom} {user?.nom}
          </h2>

          <p className="mt-1 break-all text-sm text-white/55">{user?.email}</p>
        </div>

        <nav className="mt-8 grid gap-2">
          <SidebarLink to="/dashboard" end label="Accueil" short="A" />
          <SidebarLink to="/dashboard/livraisons" label="Livraisons" short="L" />
          <SidebarLink
            to="/dashboard/statistiques"
            label="Statistiques"
            short="S"
          />
          <SidebarLink
            to="/dashboard/parametres"
            label="Paramètres"
            short="P"
          />
        </nav>
      </div>

      <button
        onClick={logout}
        className="rounded-2xl border border-red-400/20 bg-red-500/15 px-4 py-3 text-left font-black text-red-100 transition hover:bg-red-500/25"
      >
        Se déconnecter
      </button>
    </aside>
  );
}

function SidebarLink({ to, label, short, end = false }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        [
          "flex items-center gap-3 rounded-2xl px-4 py-3 text-left font-black transition duration-300",
          isActive
            ? "bg-white text-[#30302F]"
            : "text-white/65 hover:bg-white/10 hover:text-white",
        ].join(" ")
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={[
              "grid h-9 w-9 place-items-center rounded-xl text-sm font-black",
              isActive ? "bg-[#7CBCCC]/20" : "bg-white/10",
            ].join(" ")}
          >
            {short}
          </span>

          <span>{label}</span>
        </>
      )}
    </NavLink>
  );
}