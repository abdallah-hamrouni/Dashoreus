import { motion, useReducedMotion } from "framer-motion";
import logoWhite from "../assets/oreusblanc.svg";
import logoOreus from "../assets/oreus_cl.svg";
import Icon from "./ui/Icon";

export default function AuthLayout({ children }) {
  const reduced = useReducedMotion();
  return (
    <div className="auth-layout">
      <aside className="auth-brand" aria-label="Bienvenue sur OREUS">
        <div className="auth-logo">
          <img src={logoWhite} alt="OREUS" />
          <span>
            LE LIEN AU CŒUR
            <br />
            DU PARCOURS DE SOIN
          </span>
        </div>
        <div className="auth-brand-content">
          <p className="brand-kicker">
            <span className="status-dot" />
            Votre espace professionnel
          </p>
          <h2>
            Le soin nous relie.
            <br />
            <span>
              OREUS vous
              <br />
              simplifie la vie.
            </span>
          </h2>
          <p className="auth-brand-copy">
            Un lien privilégié entre pharmacies et résidences. Suivez vos
            livraisons et retrouvez vos documents, en toute simplicité.
          </p>
          <div className="brand-orbit" aria-hidden="true">
            <span className="orbit-ring" />
            <span className="orbit-ring" />
            <motion.span
              className="orbit-core"
              initial={reduced ? false : { opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.65, delay: 0.15 }}
            >
              <Icon name="activity" size={32} />
            </motion.span>
            <motion.span
              className="orbit-node orbit-pharmacy"
              initial={reduced ? false : { opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              <Icon name="pill" size={18} />
              Votre pharmacie
            </motion.span>
            <motion.span
              className="orbit-node orbit-residence"
              initial={reduced ? false : { opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Icon name="building" size={18} />
              Vos résidences
            </motion.span>
          </div>
        </div>
        <div className="brand-footer">
          <div className="brand-footer-line">
            <Icon name="shield" size={16} />
            Un accès personnel, réservé aux comptes validés.
          </div>
          <p>La proximité au quotidien. La confiance à chaque étape.</p>
        </div>
      </aside>
      <main className="auth-main" id="main-content" tabIndex={-1}>
        <div className="auth-topbar">
          <img src={logoOreus} className="auth-mobile-logo" alt="OREUS" />
          <span>
            <Icon name="lock" size={12} />
            Espace à accès contrôlé
          </span>
        </div>
        <div className="auth-content">{children}</div>
        <footer className="auth-footer">
          <span>© {new Date().getFullYear()} OREUS</span>
          <span>Pharmacies & résidences</span>
        </footer>
      </main>
    </div>
  );
}
