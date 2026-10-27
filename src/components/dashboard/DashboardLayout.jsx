import { useEffect, useRef, useState } from "react";
import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";
import Icon from "../ui/Icon";

export default function DashboardLayout({
  user,
  logout,
  activePage,
  setActivePage,
  children,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const dialog = useRef(null);
  const main = useRef(null);
  useEffect(() => {
    if (!menuOpen) return;
    const element = dialog.current;
    const previousFocus = document.activeElement;
    const overflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = "hidden";
    function resize() {
      if (window.innerWidth >= 1024) setMenuOpen(false);
    }
    window.addEventListener("resize", resize);
    return () => {
      element.close();
      document.body.style.overflow = overflow;
      previousFocus?.focus();
      window.removeEventListener("resize", resize);
    };
  }, [menuOpen]);
  function navigate(page) {
    setActivePage(page);
    setMenuOpen(false);
  }
  return (
    <div className="dashboard-shell">
      <DashboardSidebar
        user={user}
        logout={logout}
        activePage={activePage}
        setActivePage={navigate}
      />
      <dialog
        ref={dialog}
        className="mobile-sidebar"
        aria-label="Navigation OREUS"
        onCancel={(event) => {
          event.preventDefault();
          setMenuOpen(false);
        }}
        onClick={(event) => {
          if (
            event.target === dialog.current &&
            event.clientX > dialog.current.getBoundingClientRect().right
          )
            setMenuOpen(false);
        }}
      >
        <button
          type="button"
          className="icon-button mobile-sidebar-close"
          aria-label="Fermer la navigation"
          onClick={() => setMenuOpen(false)}
        >
          <Icon name="close" size={18} />
        </button>
        <DashboardSidebar
          user={user}
          logout={logout}
          activePage={activePage}
          setActivePage={navigate}
        />
      </dialog>
      <div className="dashboard-body">
        <DashboardHeader
          user={user}
          logout={logout}
          activePage={activePage}
          setActivePage={navigate}
          onOpenMenu={() => setMenuOpen(true)}
        />
        <main
          id="main-content"
          ref={main}
          tabIndex={-1}
          className="dashboard-content"
        >
          {children}
          <footer className="dashboard-footer">
            <span>
              © {new Date().getFullYear()} OREUS · Espace professionnel
            </span>
            <span>
              <Icon name="shield" size={11} />
              Accès réservé à votre compte
            </span>
          </footer>
        </main>
      </div>
    </div>
  );
}
