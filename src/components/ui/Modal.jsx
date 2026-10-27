import { useEffect, useId, useRef } from "react";
import Icon from "./Icon";

export default function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  icon = "info",
  className = "",
  returnFocusTo,
}) {
  const dialog = useRef(null);
  const titleId = useId();
  useEffect(() => {
    const element = dialog.current;
    if (!open) return;
    const previousFocus = returnFocusTo || document.activeElement;
    element.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      element.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [open, returnFocusTo]);
  return (
    <dialog
      ref={dialog}
      className={`modal ${className}`}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === dialog.current) {
          const r = dialog.current.getBoundingClientRect();
          if (
            event.clientX < r.left ||
            event.clientX > r.right ||
            event.clientY < r.top ||
            event.clientY > r.bottom
          )
            onClose();
        }
      }}
    >
      <div className="modal-heading">
        <span className="icon-tile">
          <Icon name={icon} />
        </span>
        <button
          className="icon-button"
          type="button"
          aria-label="Fermer la fenêtre"
          onClick={onClose}
        >
          <Icon name="close" />
        </button>
      </div>
      <h2 id={titleId}>{title}</h2>
      <div className="modal-body">{children}</div>
      {footer && <div className="modal-footer">{footer}</div>}
    </dialog>
  );
}
