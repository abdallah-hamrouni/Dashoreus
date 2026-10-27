import { useId } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Icon from "./Icon";

export default function SegmentedControl({
  options,
  value,
  onChange,
  label,
  disabled = false,
  className = "",
}) {
  const groupId = useId();
  const reduced = useReducedMotion();
  return (
    <div
      className={`segmented-control ${className}`}
      role="group"
      aria-label={label}
    >
      {options.map((option) => (
        <button
          type="button"
          key={option.id}
          disabled={disabled}
          className={`segment ${value === option.id ? "is-active" : ""}`}
          aria-pressed={value === option.id}
          onClick={() => onChange(option.id)}
        >
          {value === option.id && (
            <motion.span
              className="segment-highlight"
              layoutId={groupId}
              transition={
                reduced
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 450, damping: 35 }
              }
            />
          )}
          <span className="segment-content">
            {option.icon && <Icon name={option.icon} size={17} />}
            <span>{option.label}</span>
          </span>
        </button>
      ))}
    </div>
  );
}
