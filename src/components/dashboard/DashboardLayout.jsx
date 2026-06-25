import logoOreus from "../../assets/oreusblanc.svg";
import DashboardSidebar from "./DashboardSidebar";

export default function DashboardLayout({ user, logout, children }) {
  return (
    <div className="min-h-screen bg-[#F5FAFA] text-[#30302F]">
      <div className="fixed -left-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-[#7CBCCC]/25 blur-3xl" />
      <div className="fixed -right-40 top-1/3 h-[32rem] w-[32rem] rounded-full bg-[#7CBCCC]/20 blur-3xl" />

      <div className="relative z-10 grid min-h-screen lg:grid-cols-[300px_1fr]">
        <DashboardSidebar user={user} logout={logout} />

        <main className="p-5 sm:p-7 lg:p-10">
          <div className="mb-6 flex items-center justify-between rounded-[26px] border border-white bg-white/80 p-4 shadow-[0_18px_45px_rgba(48,48,47,0.08)] backdrop-blur-xl lg:hidden">
            <img
              src={logoOreus}
              alt="OREUS"
              className="block"
              style={{ width: "120px", height: "auto" }}
            />

            <button
              onClick={logout}
              className="rounded-2xl bg-[#30302F] px-4 py-2 text-sm font-black text-white"
            >
              Déconnexion
            </button>
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}