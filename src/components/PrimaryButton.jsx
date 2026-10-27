import { motion, useReducedMotion } from "framer-motion";
import Icon from "./ui/Icon";

export default function PrimaryButton({
  children,
  loading = false,
  disabled = false,
  type = "submit",
  className = "",
  icon = "arrow",
  ...props
}) {
  const reduced = useReducedMotion();
  return (
    <motion.button
      {...props}
      type={type}
      disabled={loading || disabled}
      aria-busy={loading}
      className={`button button-primary button-full ${className}`}
      whileHover={reduced || loading || disabled ? undefined : { y: -1 }}
      whileTap={reduced || loading || disabled ? undefined : { scale: 0.985 }}
      transition={{ type: "spring", stiffness: 450, damping: 28 }}
    >
      {loading ? (
        <>
          <span className="spinner" aria-hidden="true" />
          <span>Veuillez patienter…</span>
        </>
      ) : (
        <>
          <span>{children}</span>
          {icon && <Icon name={icon} size={18} />}
        </>
      )}
    </motion.button>
  );
}
