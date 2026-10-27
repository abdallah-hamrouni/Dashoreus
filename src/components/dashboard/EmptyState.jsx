import Icon from "../ui/Icon";
export default function EmptyState({
  text = "Aucune donnée disponible pour le moment.",
  title = "Rien à afficher pour le moment",
  icon = "box",
  action,
}) {
  return (
    <div className="empty-state">
      <span className="empty-illustration">
        <Icon name={icon} size={27} />
      </span>
      <h3>{title}</h3>
      <p>{text}</p>
      {action}
    </div>
  );
}
