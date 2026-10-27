export default function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <strong>{label || payload[0]?.name}</strong>
      {payload.map((item, index) => (
        <p key={`${item.dataKey}-${index}`}>
          <span>{item.name}</span>
          <b>{Number(item.value).toLocaleString("fr-FR")}</b>
        </p>
      ))}
    </div>
  );
}
