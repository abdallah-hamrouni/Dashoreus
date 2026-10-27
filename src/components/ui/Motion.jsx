import { useEffect, useRef } from "react";
import { animate, motion, useReducedMotion } from "framer-motion";

export function PageTransition({ children, className = "" }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduced ? 0 : 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: reduced ? 0 : -6 }}
      transition={{ duration: reduced ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
export function Stagger({ children, className = "", ...props }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: reduced ? 0 : 0.055 } },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
export function Reveal({ children, className = "", ...props }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: reduced ? 0 : 12 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: reduced ? 0 : 0.35 },
        },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
export function AnimatedNumber({ value, className = "" }) {
  const node = useRef(null);
  const previous = useRef(0);
  const reduced = useReducedMotion();
  const target = Number.isFinite(Number(value)) ? Number(value) : 0;
  useEffect(() => {
    const element = node.current;
    const formatter = new Intl.NumberFormat("fr-FR");
    const controls = animate(previous.current, target, {
      duration: reduced ? 0 : 0.8,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => {
        if (element) element.textContent = formatter.format(Math.round(latest));
      },
    });
    previous.current = target;
    return () => controls.stop();
  }, [target, reduced]);
  return (
    <span className={className}>
      <span className="sr-only">{target.toLocaleString("fr-FR")}</span>
      <span aria-hidden="true" ref={node}>
        {target.toLocaleString("fr-FR")}
      </span>
    </span>
  );
}
