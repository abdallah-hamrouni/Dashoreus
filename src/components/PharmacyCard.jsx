import Icon from "./ui/Icon";
export default function PharmacyCard({
  nomPharmacie,
  codePharm,
  onChangeCode,
  onClearCode,
  disabled = false,
}) {
  if (!nomPharmacie) return null;
  return (
    <div className="linked-pharmacy">
      <span className="icon-tile">
        <Icon name="pill" size={19} />
      </span>
      <div>
        <small>Pharmacie associée</small>
        <strong>{nomPharmacie}</strong>
        {codePharm && (
          <span className="sr-only">Code pharmacie : {codePharm}</span>
        )}
      </div>
      {onChangeCode && (
        <button
          type="button"
          className="text-link"
          onClick={onChangeCode}
          disabled={disabled}
        >
          Modifier
        </button>
      )}
      {onClearCode && (
        <button
          type="button"
          className="icon-button"
          onClick={onClearCode}
          aria-label="Retirer la pharmacie associée"
          disabled={disabled}
        >
          <Icon name="close" size={15} />
        </button>
      )}
    </div>
  );
}
