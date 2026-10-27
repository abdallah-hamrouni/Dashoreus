import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import AuthPage from "./pages/AuthPage";
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
import "./App.css";

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main-content">
        Aller au contenu principal
      </a>
      <Suspense
        fallback={
          <div className="app-loading" role="status">
            <span className="spinner" aria-hidden="true" />
            <p>Chargement de votre espace…</p>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Navigate to="/auth" replace />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route
            path="/statistiques"
            element={
              <DashboardPage key="statistics" initialPage="STATISTIQUES" />
            }
          />
          <Route
            path="/parametres"
            element={<DashboardPage key="settings" initialPage="PARAMETRES" />}
          />
          <Route
            path="/dashboard/livraisons"
            element={
              <DashboardPage key="deliveries" initialPage="LIVRAISONS" />
            }
          />
          <Route
            path="/dashboard/statistiques"
            element={
              <DashboardPage
                key="dashboard-statistics"
                initialPage="STATISTIQUES"
              />
            }
          />
          <Route
            path="/dashboard/profil"
            element={<DashboardPage key="profile" initialPage="PROFIL" />}
          />
          <Route
            path="/dashboard/parametres"
            element={
              <DashboardPage
                key="dashboard-settings"
                initialPage="PARAMETRES"
              />
            }
          />
        </Routes>
      </Suspense>
    </MotionConfig>
  );
}
