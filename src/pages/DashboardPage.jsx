import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import {
  getHistoriqueDashboard,
  getHistoriquePdfDetails,
} from "../api/historiqueApi";
import {
  clearDashboardSession,
  getDashboardProfile,
  getDashboardSession,
} from "../storage/dashboardStorage";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import DashboardSkeleton from "../components/dashboard/DashboardSkeleton";
import PdfPreviewDialog from "../components/dashboard/PdfPreviewDialog";
import AlertMessage from "../components/AlertMessage";
import Icon from "../components/ui/Icon";
import { PageTransition } from "../components/ui/Motion";
import HomeDashboardPage from "./dashboard/HomeDashboardPage";
import LivraisonsPage from "./dashboard/LivraisonsPage";
import ProfilPage from "./dashboard/ProfilPage";
import ParametresPage from "./dashboard/ParametresPage";

const StatistiquesPage = lazy(() => import("./dashboard/StatistiquesPage"));

export default function DashboardPage({ initialPage = "ACCUEIL" }) {
  const [session, setSession] = useState(getDashboardSession);
  const [historique, setHistorique] = useState([]);
  const [isLoadingHistorique, setIsLoadingHistorique] = useState(true);
  const [activeEtablissement, setActiveEtablissement] = useState("ALL");
  const [loadingPdfId, setLoadingPdfId] = useState(null);
  const [activePage, setActivePage] = useState(initialPage);
  const [historyError, setHistoryError] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [retry, setRetry] = useState(0);
  const [pdfPreview, setPdfPreview] = useState(null);
  const pdfRequest = useRef(0);

  useEffect(() => {
    return () => {
      pdfRequest.current += 1;
    };
  }, []);
  useEffect(() => {
    if (!session.token || !session.user) return;
    let active = true;
    async function load() {
      try {
        const data = await getHistoriqueDashboard(
          session.token,
          session.user.role,
        );
        if (active) setHistorique(Array.isArray(data) ? data : []);
      } catch (error) {
        if (active) {
          setHistoryError(
            error.message || "Impossible de charger l’historique.",
          );
          setHistorique([]);
        }
      } finally {
        if (active) setIsLoadingHistorique(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [session, retry]);
  function logout() {
    pdfRequest.current += 1;
    setPdfPreview(null);
    clearDashboardSession();
    setSession({ token: null, user: null, result: null });
  }
  function reloadHistory() {
    setIsLoadingHistorique(true);
    setHistoryError("");
    setRetry((value) => value + 1);
  }
  async function handleGeneratePdf(livraisonId, returnFocusTo) {
    const requestId = ++pdfRequest.current;
    try {
      const currentSession = getDashboardSession();
      if (!currentSession.token || !currentSession.user)
        throw new Error("Session dashboard introuvable");
      setLoadingPdfId(livraisonId);
      setFeedback(null);
      const data = await getHistoriquePdfDetails(
        livraisonId,
        currentSession.token,
        currentSession.user.role,
      );
      const profile = getDashboardProfile();
      const { generateLivraisonPdf } = await import(
        "../utils/generateLivraisonPdf"
      );
      const { blob, fileName } = await generateLivraisonPdf(data, profile, {
        download: false,
      });
      if (requestId !== pdfRequest.current) return;
      setPdfPreview({
        url: URL.createObjectURL(blob),
        fileName,
        returnFocusTo,
      });
    } catch (error) {
      if (requestId !== pdfRequest.current) return;
      console.error("Erreur génération PDF :", error);
      setFeedback({
        type: "error",
        message: error.message || "Impossible de générer le PDF.",
      });
    } finally {
      if (requestId === pdfRequest.current) setLoadingPdfId(null);
    }
  }
  const dashboardData = useMemo(() => {
    if (!session?.user) {
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
          item.nombre_piluliers || totalPiluliersFromPatients || 0,
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
      }, {}),
    );

    const etablissements = [
      ...etablissementsSession,
      ...etablissementsHistorique.filter(
        (hist) =>
          !etablissementsSession.some(
            (sessionItem) => String(sessionItem.code) === String(hist.code),
          ),
      ),
    ];

    return {
      user,
      isPharmacien,
      etablissements,
      livraisons,
    };
  }, [session, historique]);

  if (!session.token || !session.user) return <Navigate to="/auth" replace />;
  const showHistory = ["ACCUEIL", "LIVRAISONS", "PROFIL"].includes(activePage);
  return (
    <DashboardLayout
      user={dashboardData.user}
      logout={logout}
      activePage={activePage}
      setActivePage={setActivePage}
    >
      <div className="stack">
        <AlertMessage result={feedback} onDismiss={() => setFeedback(null)} />
        {historyError && showHistory && (
          <div className="stack">
            <AlertMessage result={{ type: "error", message: historyError }} />
            <div>
              <button
                type="button"
                className="button button-secondary"
                onClick={reloadHistory}
              >
                <Icon name="refresh" size={15} />
                Réessayer le chargement
              </button>
            </div>
          </div>
        )}
        <AnimatePresence mode="wait" initial={false}>
          <PageTransition
            key={
              isLoadingHistorique && showHistory
                ? "loading"
                : historyError && showHistory
                  ? "error"
                  : activePage
            }
          >
            {isLoadingHistorique && showHistory ? (
              <DashboardSkeleton />
            ) : historyError && showHistory ? null : (
              <>
                {activePage === "ACCUEIL" && (
                  <HomeDashboardPage
                    {...dashboardData}
                    activeEtablissement={activeEtablissement}
                    setActiveEtablissement={setActiveEtablissement}
                    onGeneratePdf={handleGeneratePdf}
                    loadingPdfId={loadingPdfId}
                    setActivePage={setActivePage}
                  />
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
                {activePage === "STATISTIQUES" && (
                  <Suspense fallback={<DashboardSkeleton />}>
                    <StatistiquesPage />
                  </Suspense>
                )}
                {activePage === "PROFIL" && <ProfilPage {...dashboardData} />}
                {activePage === "PARAMETRES" && (
                  <ParametresPage user={dashboardData.user} logout={logout} />
                )}
              </>
            )}
          </PageTransition>
        </AnimatePresence>
      </div>
      <PdfPreviewDialog
        preview={pdfPreview}
        onClose={() => setPdfPreview(null)}
      />
    </DashboardLayout>
  );
}
