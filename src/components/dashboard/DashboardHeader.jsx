import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Icon from "../ui/Icon";

const labels = {
  ACCUEIL: "Vue d’ensemble",
  LIVRAISONS: "Livraisons",
  STATISTIQUES: "Statistiques",
  PROFIL: "Mon profil",
  PARAMETRES: "Paramètres",
};
export default function DashboardHeader({
  user,
  activePage = "ACCUEIL",
  setActivePage,
  logout,
  onOpenMenu,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const trigger = useRef(null);
  const menuId = useId();
  const reduced = useReducedMotion();
  const fullName =
    `${user?.prenom || ""} ${user?.nom || ""}`.trim() || "Mon compte";
  const initials =
    `${user?.prenom?.[0] || ""}${user?.nom?.[0] || ""}`.toUpperCase() || "U";
  useEffect(() => {
    if (!open) return;
    function outside(event) {
      if (!ref.current?.contains(event.target)) setOpen(false);
    }
    function escape(event) {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    }
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);
  function goTo(page) {
    setOpen(false);
    setActivePage?.(page);
  }
  return (
    <header className="topbar">
      <div className="topbar-start">
        <button
          type="button"
          className="icon-button mobile-menu-button"
          aria-label="Ouvrir la navigation"
          onClick={onOpenMenu}
        >
          <Icon name="menu" />
        </button>
        <div className="breadcrumb">
          <span>Espace professionnel</span>
          <Icon name="chevron" size={12} />
          <strong>{labels[activePage]}</strong>
        </div>
      </div>
      <div className="topbar-actions">
        <span className="topbar-date">
          <Icon name="calendar" size={14} />
          {new Date().toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
            timeZone: "Europe/Paris",
          })}
        </span>
        <div
          ref={ref}
          className="account-menu-wrap"
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget))
              setOpen(false);
          }}
        >
          <button
            type="button"
            ref={trigger}
            className="account-trigger"
            aria-label={`Menu du compte de ${fullName}`}
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen(!open)}
          >
            <span className="avatar" aria-hidden="true">
              {initials}
            </span>
            <span className="account-trigger-text">
              <strong>{fullName}</strong>
              <small>
                {user?.role === "PHARMACIEN" ? "Pharmacien" : "Résidence"}
              </small>
            </span>
            <Icon name="down" size={13} />
          </button>
          <AnimatePresence>
            {open && (
              <motion.div
                id={menuId}
                className="account-menu"
                initial={{ opacity: 0, y: reduced ? 0 : -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduced ? 0 : 0.15 }}
              >
                <div className="account-menu-info">
                  <strong>{fullName}</strong>
                  {user?.email}
                </div>
                <button type="button" onClick={() => goTo("PROFIL")}>
                  <Icon name="user" size={16} />
                  Mon profil
                </button>
                <button type="button" onClick={() => goTo("PARAMETRES")}>
                  <Icon name="settings" size={16} />
                  Paramètres
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    logout();
                  }}
                  className="menu-logout"
                >
                  <Icon name="logout" size={16} />
                  Se déconnecter
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
