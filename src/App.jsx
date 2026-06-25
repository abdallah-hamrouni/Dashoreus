import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import HomeDashboardPage from "./pages/dashboard/HomeDashboardPage";
import StatistiquesPage from "./pages/dashboard/StatistiquesPage";
import ParametresPage from "./pages/dashboard/ParametresPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth" replace />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route index element={<HomeDashboardPage />} />
          <Route path="statistiques" element={<StatistiquesPage />} />
          <Route path="parametres" element={<ParametresPage />} />
    </Routes>
  );
}