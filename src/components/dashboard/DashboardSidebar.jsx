import { useId } from "react";
import { motion, useReducedMotion } from "framer-motion";
import logoOreus from "../../assets/oreusblanc.svg";
import Icon from "../ui/Icon";

const primary = [
  { id: "ACCUEIL", label: "Vue d’ensemble", icon: "grid" },
  { id: "LIVRAISONS", label: "Livraisons", icon: "truck" },
  { id: "STATISTIQUES", label: "Statistiques", icon: "chart" },
];
const secondary = [
  { id: "PROFIL", label: "Mon profil", icon: "user" },
  { id: "PARAMETRES", label: "Paramètres", icon: "settings" },
];
export default function DashboardSidebar({
  user,
  logout,
  activePage = "ACCUEIL",
  setActivePage,
}) {
  const layoutId = useId();
  const reduced = useReducedMotion();
  const isPharmacien = user?.role === "PHARMACIEN";
  const name = isPharmacien
    ? user?.nompharm || user?.nom_pharmacie || user?.nom || "Ma pharmacie"
    : user?.nom_residence || user?.nomresid || user?.nom || "Ma résidence";
  const fullName =
    `${user?.prenom || ""} ${user?.nom || ""}`.trim() || "Utilisateur";
  const initials =
    `${user?.prenom?.[0] || ""}${user?.nom?.[0] || ""}`.toUpperCase() || "U";
  function renderItem(item) {
    const active = activePage === item.id;
    return (
      <button
        className={`nav-item ${active ? "active" : ""}`}
        key={item.id}
        onClick={() => setActivePage?.(item.id)}
        aria-current={active ? "page" : undefined}
      >
        {active && (
          <motion.span
            className="nav-highlight"
            layoutId={layoutId}
            transition={
              reduced
                ? { duration: 0 }
                : { type: "spring", stiffness: 450, damping: 38 }
            }
          />
        )}
        <Icon name={item.icon} size={18} />
        <span>{item.label}</span>
      </button>
    );
  }
  return (
    <aside className="sidebar">
      <a
        href="/dashboard"
        className="sidebar-brand"
        aria-label="OREUS — Tableau de bord"
      >
        <img src={logoOreus} alt="OREUS" />
        <span>ESPACE PROFESSIONNEL</span>
      </a>
      <div className="workspace-card">
        <span className="workspace-icon">
          <Icon name={isPharmacien ? "pill" : "building"} size={17} />
        </span>
        <div>
          <strong title={name}>{name}</strong>
          <small>
            {isPharmacien ? "Espace pharmacie" : "Espace résidence"}
          </small>
        </div>
        <Icon name="shield" size={13} />
      </div>
      <p className="sidebar-label">Espace de travail</p>
      <nav className="sidebar-nav" aria-label="Navigation principale">
        {primary.map(renderItem)}
      </nav>
      <div className="sidebar-divider" />
      <p className="sidebar-label">Votre compte</p>
      <nav className="sidebar-nav" aria-label="Compte et préférences">
        {secondary.map(renderItem)}
      </nav>
      <div className="sidebar-bottom">
        <div className="sidebar-note">
          <Icon name="activity" size={20} />
          <strong>Au service du parcours de soin.</strong>
          <p>
            Vos établissements et vos livraisons, réunis dans un même espace.
          </p>
        </div>
        <div className="sidebar-user">
          <span className="avatar" aria-hidden="true">
            {initials}
          </span>
          <div>
            <strong title={fullName}>{fullName}</strong>
            <small>{isPharmacien ? "Pharmacien" : "Résidence"}</small>
          </div>
          <button
            type="button"
            onClick={logout}
            className="icon-button"
            aria-label="Se déconnecter"
            title="Se déconnecter"
          >
            <Icon name="logout" size={17} />
          </button>
        </div>
      </div>
    </aside>
  );
}
