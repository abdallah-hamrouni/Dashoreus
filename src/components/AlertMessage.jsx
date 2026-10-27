import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Icon from "./ui/Icon";

export default function AlertMessage({ result, onDismiss }) {
  const reduced = useReducedMotion();
  return (
    <AnimatePresence initial={false}>
      {result && (
        <motion.div
          key={`${result.type}-${result.message}`}
          initial={{ opacity: 0, y: reduced ? 0 : -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.2 }}
          className={`notice ${result.type === "success" ? "notice-success" : "notice-error"}`}
          role={result.type === "success" ? "status" : "alert"}
        >
          <Icon
            name={result.type === "success" ? "checkCircle" : "alert"}
            size={20}
          />
          <p>{result.message}</p>
          {onDismiss && (
            <button
              type="button"
              className="icon-button"
              onClick={onDismiss}
              aria-label="Fermer le message"
            >
              <Icon name="close" size={16} />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
