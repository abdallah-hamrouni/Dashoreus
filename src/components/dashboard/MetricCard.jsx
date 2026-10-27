import Icon from "../ui/Icon";
import { AnimatedNumber } from "../ui/Motion";

export default function MetricCard({
  label,
  value,
  icon,
  detail,
  featured = false,
}) {
  return (
    <article className={`surface kpi-card ${featured ? "kpi-featured" : ""}`}>
      <div className="kpi-top">
        <h2 className="kpi-label">{label}</h2>
        <span className="icon-tile">
          <Icon name={icon} size={17} />
        </span>
      </div>
      <div className="kpi-value">
        <AnimatedNumber value={value} />
      </div>
      <p className="kpi-footer">
        <Icon name={featured ? "activity" : "info"} size={11} />
        {detail}
      </p>
    </article>
  );
}
