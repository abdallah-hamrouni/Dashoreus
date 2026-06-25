import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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


import {
  getHistoriqueDashboard,
  getHistoriquePdfDetails,
} from "../api/historiqueApi";
import logoOreus from "../assets/oreusblanc.svg";

import {
  clearDashboardSession,
  getDashboardProfile,
  getDashboardSession,
} from "../storage/dashboardStorage";

import ParametresPage from "./dashboard/ParametresPage";
import ProfilPage from "./dashboard/ProfilPage";
import StatistiquesPage from "./dashboard/StatistiquesPage";
import LivraisonsPage from "./dashboard/LivraisonsPage";
import DashboardSidebar from "./dashboard/DashboardSidebar";
import { generateLivraisonPdf } from "../utils/generateLivraisonPdf";

export default function DashboardPage() {
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [historique, setHistorique] = useState([]);
  const [isLoadingHistorique, setIsLoadingHistorique] = useState(true);
  const [activeEtablissement, setActiveEtablissement] = useState("ALL");
  const [loadingPdfId, setLoadingPdfId] = useState(null);

  // Page active du sidebar
  const [activePage, setActivePage] = useState("ACCUEIL");

  useEffect(() => {
    async function initDashboard() {
      const currentSession = getDashboardSession();

      if (!currentSession.token || !currentSession.user) {
        navigate("/auth");
        return;
      }

      setSession(currentSession);

      try {
        setIsLoadingHistorique(true);

        const data = await getHistoriqueDashboard(
          currentSession.token,
          currentSession.user.role
        );

        setHistorique(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Erreur historique dashboard :", error);
        setHistorique([]);
      } finally {
        setIsLoadingHistorique(false);
      }
    }

    initDashboard();
  }, [navigate]);

  function logout() {
    clearDashboardSession();
    navigate("/auth");
  }

async function handleGeneratePdf(livraisonId) {
  try {
    const currentSession = getDashboardSession();

    if (!currentSession.token || !currentSession.user) {
      throw new Error("Session dashboard introuvable");
    }

    setLoadingPdfId(livraisonId);

    const data = await getHistoriquePdfDetails(
      livraisonId,
      currentSession.token,
      currentSession.user.role
    );

    const profile = getDashboardProfile();

    await generateLivraisonPdf(data, profile);
  } catch (error) {
    console.error("Erreur génération PDF :", error);
    alert(error.message || "Impossible de générer le PDF.");
  } finally {
    setLoadingPdfId(null);
  }
}

  const dashboardData = useMemo(() => {
    if (!session) {
      return {
        user: null,
        isPharmacien: false,
        etablissements: [],
        livraisons: [],
      };
    }

    const user = session.user;
    const isPharmacien = user.role === "PHARMACIEN";

    const residences = session.result?.residences || [];
    const pharmacies = session.result?.pharmacies || [];

    const etablissementsSession = isPharmacien
      ? residences.map((item) => ({
          id: String(item.code_resid || item.id),
          code: String(item.code_resid || item.id),
          nom: item.nom_residence || item.nom || "Résidence",
          type: "RESIDENCE",
        }))
      : [
          {
            id: String(user.code_resid || ""),
            code: String(user.code_resid || ""),
            nom:
              user.nom_residence ||
              user.nomresid ||
              pharmacies[0]?.nom_residence ||
              user.nom ||
              "Ma résidence",
            type: "RESIDENCE",
          },
        ];

    const livraisons = historique.map((item) => {
      const patients = Array.isArray(item.patients) ? item.patients : [];

      const totalPiluliersFromPatients = patients.reduce((sum, patient) => {
        return sum + Number(patient.nbpilulier || 0);
      }, 0);

      return {
        id: item.id,
        etablissementId: String(item.code_resid || ""),
        etablissementNom: item.nom_residence || "Établissement",
        numcaisse: item.numcaisse || "-",
        statut:
          item.statut === "SIGNE" ? "Livrée" : item.statut || "En attente",
        dateAction: item.date_action,
        dateDebut: item.date_debut_livraison,
        dateFin: item.date_fin_livraison,
        nomSignataire: item.nom_signataire || "-",
        commentaireGlobal: item.commentaire_global || "",
        patients: Number(item.nombre_patients || patients.length || 0),
        piluliers: Number(
          item.nombre_piluliers || totalPiluliersFromPatients || 0
        ),
        totalCaisses: Number(item.total_caisses || 0),
        caissesScannees: Number(item.caisses_scannes || 0),
        caissesLivreesGlobales: Number(item.caisses_livrees_globales || 0),
        caissesRestantesGlobales: Number(item.caisses_restantes_globales || 0),
        patientsList: patients,
      };
    });

    const etablissementsHistorique = Object.values(
      livraisons.reduce((acc, livraison) => {
        if (!livraison.etablissementId) return acc;

        if (!acc[livraison.etablissementId]) {
          acc[livraison.etablissementId] = {
            id: livraison.etablissementId,
            code: livraison.etablissementId,
            nom: livraison.etablissementNom,
            type: "RESIDENCE",
          };
        }

        return acc;
      }, {})
    );

    const etablissements = [
      ...etablissementsSession,
      ...etablissementsHistorique.filter(
        (hist) =>
          !etablissementsSession.some(
            (sessionItem) => String(sessionItem.code) === String(hist.code)
          )
      ),
    ];

    return {
      user,
      isPharmacien,
      etablissements,
      livraisons,
    };
  }, [session, historique]);

  const livraisonsFiltrees = useMemo(() => {
    if (activeEtablissement === "ALL") return dashboardData.livraisons;

    return dashboardData.livraisons.filter(
      (livraison) =>
        String(livraison.etablissementId) === String(activeEtablissement)
    );
  }, [activeEtablissement, dashboardData.livraisons]);

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5FAFA]">
        <div className="flex items-center gap-3 rounded-3xl border border-white bg-white/80 px-6 py-4 shadow-xl backdrop-blur-xl">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#7CBCCC]/40 border-t-[#30302F]" />
          <span className="font-black text-[#30302F]">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout
      user={dashboardData.user}
      logout={logout}
      activePage={activePage}
      setActivePage={setActivePage}
    >
<DashboardHeader
  user={dashboardData.user}
  isPharmacien={dashboardData.isPharmacien}
  setActivePage={setActivePage}
  logout={logout}
/>

      {isLoadingHistorique ? (
        <LoadingCard />
      ) : (
        <>
          {activePage === "ACCUEIL" && (
            <>
              <DashboardStats
                isPharmacien={dashboardData.isPharmacien}
                etablissementsCount={dashboardData.etablissements.length}
                livraisons={dashboardData.livraisons}
              />


              <EtablissementTabs
                etablissements={dashboardData.etablissements}
                activeEtablissement={activeEtablissement}
                setActiveEtablissement={setActiveEtablissement}
                livraisons={dashboardData.livraisons}
              />

              <LivraisonsTable
                livraisons={livraisonsFiltrees}
                onGeneratePdf={handleGeneratePdf}
                loadingPdfId={loadingPdfId}
              />
            </>
          )}

          {activePage === "LIVRAISONS" && (
 <LivraisonsPage
  etablissements={dashboardData.etablissements}
  livraisons={dashboardData.livraisons}
  onGeneratePdf={handleGeneratePdf}
  loadingPdfId={loadingPdfId}
  user={dashboardData.user}
/>
)}
          {activePage === "STATISTIQUES" && <StatistiquesPage />}
{activePage === "PROFIL" && (
  <ProfilPage
    user={dashboardData.user}
    isPharmacien={dashboardData.isPharmacien}
    etablissements={dashboardData.etablissements}
    livraisons={dashboardData.livraisons}
  />
)}
          {activePage === "PARAMETRES" && (
            <ParametresPage user={dashboardData.user} logout={logout} />
          )}
        </>
      )}
    </DashboardLayout>
  );
}

function DashboardLayout({
  user,
  logout,
  activePage,
  setActivePage,
  children,
}) {
  return (
    <div className="dashboard-water-bg text-[#30302F]">
      <div className="water-top-animation" />
      <div className="water-middle-animation" />
      <div className="water-floating-particles" />

      <div className="dashboard-water-content grid min-h-screen lg:grid-cols-[300px_1fr]">
        <DashboardSidebar
          user={user}
          logout={logout}
          activePage={activePage}
          setActivePage={setActivePage}
        />

        <main className="p-5 sm:p-7 lg:p-10">
          <MobileTopBar
            logout={logout}
            activePage={activePage}
            setActivePage={setActivePage}
          />

          {children}
        </main>
      </div>
    </div>
  );
}





function MobileTopBar({ logout, activePage, setActivePage }) {
  return (
    <div className="mb-6 rounded-[26px] border border-white bg-white/80 p-4 shadow-[0_18px_45px_rgba(48,48,47,0.08)] backdrop-blur-xl lg:hidden">
      <div className="flex items-center justify-between">
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

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        <MobileNavButton
          active={activePage === "ACCUEIL"}
          label="Accueil"
          onClick={() => setActivePage("ACCUEIL")}
        />

        <MobileNavButton
          active={activePage === "LIVRAISONS"}
          label="Livraisons"
          onClick={() => setActivePage("LIVRAISONS")}
        />

        <MobileNavButton
          active={activePage === "STATISTIQUES"}
          label="Stats"
          onClick={() => setActivePage("STATISTIQUES")}
        />

        <MobileNavButton
          active={activePage === "PARAMETRES"}
          label="Paramètres"
          onClick={() => setActivePage("PARAMETRES")}
        />
      </div>
    </div>
  );
}

function MobileNavButton({ active, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "min-w-fit rounded-2xl px-4 py-2 text-sm font-black transition",
        active
          ? "bg-[#30302F] text-white"
          : "bg-[#F5FAFA] text-[#6F7D80]",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

function DashboardHeader({ user, isPharmacien, setActivePage, logout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const entityName = isPharmacien
    ? user.nompharm || user.nom_pharmacie || user.nom || "Ma pharmacie"
    : user.nom_residence || user.nomresid || user.nom || "Ma résidence";

  const roleLabel = isPharmacien ? "Pharmacien" : "Résidence";

  function goToProfile() {
    setActivePage("PROFIL");
    setIsMenuOpen(false);
  }

  function goToResidences() {
    setActivePage("ACCUEIL");
    setIsMenuOpen(false);
  }

  function handleLogout() {
    setIsMenuOpen(false);
    logout();
  }

  return (
    <header className="mb-6 rounded-[28px] border border-[#DDEAEC] bg-white px-6 py-5 shadow-[0_18px_45px_rgba(48,48,47,0.06)]">
      <div className="flex items-start justify-between gap-5">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-[#7CBCCC]/15 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#4A9CAF]">
              {isPharmacien ? "Pharmacie connectée" : "Résidence connectée"}
            </span>

            
          </div>

          <h1 className="mt-4 text-3xl font-black tracking-[-0.04em] text-[#30302F]">
            {entityName}
          </h1>

          <p className="mt-2 text-sm font-semibold text-[#6F7D80]">
            Bonjour {user?.prenom || ""}, bienvenue sur votre tableau de bord.
          </p>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setIsMenuOpen((previous) => !previous)}
            className="group flex h-12 w-12 items-center justify-center rounded-2xl border border-[#DDEAEC] bg-[#F9FCFD] text-[#30302F] shadow-sm transition hover:border-[#7CBCCC] hover:bg-[#7CBCCC]/10"
            title="Menu profil"
          >
            <span className="text-xl font-black transition group-hover:scale-110">
              ☰
            </span>
          </button>

          {isMenuOpen ? (
            <div className="absolute right-0 top-14 z-50 w-64 overflow-hidden rounded-[24px] border border-[#DDEAEC] bg-white shadow-[0_22px_70px_rgba(48,48,47,0.14)]">
              <div className="border-b border-[#DDEAEC] bg-[#F9FCFD] px-5 py-4">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#7CBCCC]">
                  Menu rapide
                </p>

                <p className="mt-1 truncate text-sm font-black text-[#30302F]">
                  {user?.prenom} {user?.nom}
                </p>
              </div>

              <div className="p-2">
                <button
                  type="button"
                  onClick={goToProfile}
                  className="flex w-full items-center gap-3 rounded-[18px] px-4 py-3 text-left text-sm font-black text-[#30302F] transition hover:bg-[#7CBCCC]/10"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#7CBCCC]/15 text-[#4A9CAF]">
                    👤
                  </span>
                  <span>Profil</span>
                </button>

                <button
                  type="button"
                  onClick={goToResidences}
                  className="flex w-full items-center gap-3 rounded-[18px] px-4 py-3 text-left text-sm font-black text-[#30302F] transition hover:bg-[#7CBCCC]/10"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#7CBCCC]/15 text-[#4A9CAF]">
                    🏠
                  </span>
                  <span>
                    {isPharmacien ? "Mes résidences" : "Ma résidence"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-1 flex w-full items-center gap-3 rounded-[18px] px-4 py-3 text-left text-sm font-black text-red-600 transition hover:bg-red-500/10"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-red-500/10 text-red-600">
                    ⏻
                  </span>
                  <span>Se déconnecter</span>
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

function PageTitle({ title, subtitle }) {
  return (
    <section className="mb-6 rounded-[30px] border border-white bg-white/80 p-6 shadow-[0_20px_65px_rgba(48,48,47,0.08)] backdrop-blur-xl">
      <h2 className="text-3xl font-black tracking-[-0.04em] text-[#30302F]">
        {title}
      </h2>

      <p className="mt-2 text-sm font-semibold text-[#6F7D80]">{subtitle}</p>
    </section>
  );
}

function DashboardStats({ isPharmacien, etablissementsCount, livraisons }) {
  const livrees = livraisons.filter((item) => item.statut === "Livrée").length;
  const enAttente = livraisons.filter((item) => item.statut !== "Livrée").length;
  const patients = livraisons.reduce((sum, item) => sum + item.patients, 0);
  const piluliers = livraisons.reduce((sum, item) => sum + item.piluliers, 0);

  const stats = [
    {
      label: isPharmacien ? "Résidences" : "Résidence",
      value: etablissementsCount,
    },
    {
      label: "Patients",
      value: patients,
    },
    {
      label: "Piluliers",
      value: piluliers,
    },
   
  ];

  return (
    <section className="mx-auto mb-6 grid max-w-4xl justify-center gap-4 sm:grid-cols-2 xl:grid-cols-3">
  {stats.map((stat) => (
    <article
      key={stat.label}
      className="w-full rounded-[22px] border border-[#DDEAEC] bg-white p-5 shadow-[0_12px_35px_rgba(48,48,47,0.05)]"
    >
      <p className="text-xs font-black uppercase tracking-[0.14em] text-[#7CBCCC]">
        {stat.label}
      </p>

      <p className="mt-3 text-3xl font-black text-[#30302F]">
        {stat.value}
      </p>
    </article>
  ))}
</section>
  );
}

function DashboardCharts({ livraisons }) {
  if (!livraisons || livraisons.length === 0) {
    return (
      <section className="mb-8 rounded-[34px] border border-white bg-white/80 p-8 text-center shadow-[0_22px_70px_rgba(48,48,47,0.09)] backdrop-blur-xl">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#7CBCCC]/20 text-sm font-black text-[#30302F]">
          —
        </div>

        <h2 className="mt-4 text-2xl font-black tracking-[-0.04em] text-[#30302F]">
          Aucun graphique disponible
        </h2>

        <p className="mt-2 text-sm font-semibold text-[#6F7D80]">
          Les graphiques seront affichés dès que des livraisons seront trouvées.
        </p>
      </section>
    );
  }

  const statusData = [
    {
      name: "Livrée",
      value: livraisons.filter((item) => item.statut === "Livrée").length,
    },
    {
      name: "En attente",
      value: livraisons.filter((item) => item.statut !== "Livrée").length,
    },
  ];

  const byEtablissement = Object.values(
    livraisons.reduce((acc, item) => {
      if (!acc[item.etablissementNom]) {
        acc[item.etablissementNom] = {
          name: item.etablissementNom,
          livraisons: 0,
          patients: 0,
          piluliers: 0,
        };
      }

      acc[item.etablissementNom].livraisons += 1;
      acc[item.etablissementNom].patients += item.patients;
      acc[item.etablissementNom].piluliers += item.piluliers;

      return acc;
    }, {})
  );

  const colors = ["#7CBCCC", "#30302F", "#B9E3EA"];

  return (
    <section className="mb-8 grid min-w-0 gap-5 xl:grid-cols-[1.2fr_0.8fr]">
      <div className="min-w-0 rounded-[34px] border border-white bg-white/80 p-6 shadow-[0_22px_70px_rgba(48,48,47,0.09)] backdrop-blur-xl">
        <div className="mb-5">
          <h2 className="text-2xl font-black tracking-[-0.04em] text-[#30302F]">
            Livraisons par établissement
          </h2>
          <p className="mt-1 text-sm font-semibold text-[#6F7D80]">
            Nombre de livraisons enregistrées par résidence.
          </p>
        </div>

        <div className="h-[320px] min-w-0">
          <ResponsiveContainer width="100%" height="100%" minWidth={250}>
            <BarChart data={byEtablissement}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: "#6F7D80" }}
                interval={0}
                height={80}
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

      <div className="min-w-0 rounded-[34px] border border-white bg-white/80 p-6 shadow-[0_22px_70px_rgba(48,48,47,0.09)] backdrop-blur-xl">
        <div className="mb-5">
          <h2 className="text-2xl font-black tracking-[-0.04em] text-[#30302F]">
            Statut des livraisons
          </h2>
          <p className="mt-1 text-sm font-semibold text-[#6F7D80]">
            Répartition selon l’état de signature.
          </p>
        </div>

        <div className="h-[250px] min-w-0">
          <ResponsiveContainer width="100%" height="100%" minWidth={250}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={95}
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

function EtablissementTabs({
  etablissements,
  activeEtablissement,
  setActiveEtablissement,
  livraisons,
}) {
  function countFor(id) {
    if (id === "ALL") return livraisons.length;

    return livraisons.filter(
      (item) => String(item.etablissementId) === String(id)
    ).length;
  }

  return (
    <section className="mb-6 rounded-[34px] border border-white bg-white/75 p-5 shadow-[0_20px_65px_rgba(48,48,47,0.08)] backdrop-blur-xl">
      <div className="mb-5">
        <h2 className="text-2xl font-black tracking-[-0.04em] text-[#30302F]">
          Livraisons par établissement
        </h2>

        <p className="mt-1 text-sm font-semibold text-[#6F7D80]">
          Sélectionnez une résidence pour afficher ses livraisons.
        </p>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2">
        <TabButton
          active={activeEtablissement === "ALL"}
          label="Tous"
          count={countFor("ALL")}
          onClick={() => setActiveEtablissement("ALL")}
        />

        {etablissements.map((item) => (
          <TabButton
            key={item.id}
            active={String(activeEtablissement) === String(item.id)}
            label={item.nom}
            count={countFor(item.id)}
            onClick={() => setActiveEtablissement(item.id)}
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

function LivraisonsTable({ livraisons, onGeneratePdf, loadingPdfId }) {
  if (livraisons.length === 0) {
    return (
      <div className="rounded-[24px] border border-dashed border-[#7CBCCC]/40 bg-[#7CBCCC]/10 p-8 text-center font-bold text-[#6F7D80]">
        Aucune livraison disponible.
      </div>
    );
  }

  const tableGrid =
    "lg:grid-cols-[1.45fr_2fr_0.65fr_0.65fr_0.75fr_0.85fr_0.55fr]";

  return (
    <section className="rounded-[28px] border border-[#DDEAEC] bg-white p-5 shadow-[0_18px_50px_rgba(48,48,47,0.07)]">
      <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-[-0.04em] text-[#30302F]">
            Liste des livraisons
          </h2>

          <p className="mt-1 text-sm font-semibold text-[#6F7D80]">
            Détail des livraisons signées et génération du PDF de livraison.
          </p>
        </div>

        <span className="w-fit rounded-full bg-[#7CBCCC]/15 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#4A9CAF]">
          {livraisons.length} livraison(s)
        </span>
      </div>

      <div className="overflow-hidden rounded-[24px] border border-[#DDEAEC]">
        <div
          className={[
            "hidden bg-[#F5FAFA] px-5 py-4 text-sm font-black text-[#6F7D80] lg:grid",
            tableGrid,
          ].join(" ")}
        >
          <span className="text-left">Résidence</span>
          <span className="text-left">Caisses</span>
          <span className="text-center">Patients</span>
          <span className="text-center">Piluliers</span>
          <span className="text-center">Signature</span>
          <span className="text-center">PDF</span>
        </div>

        <div className="divide-y divide-[#DDEAEC]">
          {livraisons.map((item) => {
            const isLoadingPdf = loadingPdfId === item.id;

            return (
              <div
                key={`${item.id}-${item.numcaisse}`}
                className={[
                  "grid gap-4 bg-white px-5 py-4 text-sm font-semibold text-[#30302F] transition hover:bg-[#F8FBFB] lg:items-center",
                  tableGrid,
                ].join(" ")}
              >
                <div className="min-w-0">
                  <p className="mb-1 text-xs font-black uppercase tracking-[0.12em] text-[#7CBCCC] lg:hidden">
                    Résidence
                  </p>

                  <p className="truncate font-black leading-5">
                    {item.etablissementNom}
                  </p>
                </div>

                <div className="min-w-0">
                  <p className="mb-2 text-xs font-black uppercase tracking-[0.12em] text-[#7CBCCC] lg:hidden">
                    Caisses
                  </p>

                  <CaisseBadges value={item.numcaisse} />
                </div>

                <div className="text-left lg:text-center">
                  <p className="mb-1 text-xs font-black uppercase tracking-[0.12em] text-[#7CBCCC] lg:hidden">
                    Patients
                  </p>

                  <span className="inline-flex min-w-[38px] justify-center rounded-xl bg-[#F5FAFA] px-3 py-1.5 text-sm font-black text-[#30302F]">
                    {item.patients}
                  </span>
                </div>

                <div className="text-left lg:text-center">
                  <p className="mb-1 text-xs font-black uppercase tracking-[0.12em] text-[#7CBCCC] lg:hidden">
                    Piluliers
                  </p>

                  <span className="inline-flex min-w-[38px] justify-center rounded-xl bg-[#F5FAFA] px-3 py-1.5 text-sm font-black text-[#30302F]">
                    {item.piluliers}
                  </span>
                </div>

            

                <div className="text-left lg:text-center">
                  <p className="mb-1 text-xs font-black uppercase tracking-[0.12em] text-[#7CBCCC] lg:hidden">
                    Signature
                  </p>

                  <span className="font-bold text-[#6F7D80]">
                    {formatDate(item.dateAction)}
                  </span>
                </div>

                <div className="text-left lg:text-center">
                  <p className="mb-1 text-xs font-black uppercase tracking-[0.12em] text-[#7CBCCC] lg:hidden">
                    PDF
                  </p>

                  <button
                    type="button"
                    onClick={() => onGeneratePdf(item.id)}
                    disabled={isLoadingPdf}
                    className="inline-flex items-center justify-center rounded-full bg-[#30302F] px-4 py-2 text-xs font-black text-white transition hover:bg-[#4A9CAF] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isLoadingPdf ? "..." : "PDF"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
function CaisseBadges({ value }) {
  const caisses = String(value || "-")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  if (caisses.length === 0) {
    return <span>-</span>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {caisses.map((caisse, index) => (
        <span
          key={`${caisse}-${index}`}
          className="inline-flex items-center rounded-full border border-[#DDEAEC] bg-[#F5FAFA] px-3 py-1.5 text-xs font-black text-[#30302F]"
        >
          {caisse}
        </span>
      ))}
    </div>
  );
}
function StatusBadge({ status }) {
  const styles = {
    Livrée: "bg-green-500/10 text-green-700",
    "En cours": "bg-[#7CBCCC]/20 text-[#30302F]",
    "En attente": "bg-orange-500/10 text-orange-700",
  };

  return (
    <span
      className={[
        "inline-flex rounded-full px-3 py-1 text-xs font-black",
        styles[status] || "bg-gray-100 text-gray-700",
      ].join(" ")}
    >
      {status}
    </span>
  );
}



function LoadingCard() {
  return (
    <div className="mb-8 rounded-[28px] border border-white bg-white/80 p-6 text-center font-black text-[#6F7D80] shadow-[0_18px_50px_rgba(48,48,47,0.08)]">
      Chargement de l’historique des livraisons...
    </div>
  );
}

function formatDate(date) {
  if (!date) return "-";

  const d = new Date(date);

  if (Number.isNaN(d.getTime())) return date;

  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}