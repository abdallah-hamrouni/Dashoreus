import { useId, useState } from "react";
import Icon from "./ui/Icon";

export default function InputField({
  label,
  type = "text",
  required = false,
  disabled = false,
  error,
  hint,
  id,
  autoComplete,
  icon,
  ...props
}) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";
  const fieldIcon =
    icon ||
    (type === "email"
      ? "mail"
      : isPassword
        ? "lock"
        : type === "tel"
          ? "phone"
          : null);
  return (
    <div className={`field ${error ? "field-error" : ""}`}>
      <label htmlFor={inputId}>
        {label}
        {required && (
          <span className="field-required" aria-hidden="true">
            {" "}
            *
          </span>
        )}
      </label>
      <div
        className={`input-wrap ${fieldIcon ? "has-icon" : ""} ${isPassword ? "has-action" : ""}`}
      >
        {fieldIcon && (
          <Icon name={fieldIcon} className="input-icon" size={18} />
        )}
        <input
          {...props}
          id={inputId}
          type={isPassword && visible ? "text" : type}
          required={required}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? `${inputId}-hint` : undefined}
          autoComplete={
            autoComplete || (type === "email" ? "email" : undefined)
          }
        />
        {isPassword && (
          <button
            className="password-toggle"
            type="button"
            aria-label={
              visible ? "Masquer le mot de passe" : "Afficher le mot de passe"
            }
            aria-pressed={visible}
            onClick={() => setVisible(!visible)}
            disabled={disabled}
          >
            <Icon name={visible ? "eyeOff" : "eye"} size={18} />
          </button>
        )}
      </div>
      {(error || hint) && (
        <p
          id={`${inputId}-hint`}
          className={error ? "field-message error-text" : "field-message"}
        >
          {error || hint}
        </p>
      )}
    </div>
  );
}
