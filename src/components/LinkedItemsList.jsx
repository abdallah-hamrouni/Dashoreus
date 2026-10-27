import Icon from "./ui/Icon";
import { Stagger, Reveal } from "./ui/Motion";
export default function LinkedItemsList({ title, items, type }) {
  if (!items?.length) return null;
  return (
    <section className="linkedSection">
      <h3>{title}</h3>
      <Stagger className="linkedGrid">
        {items.map((item, index) => (
          <Reveal key={item.id || item.code_resid || item.codepharm || index}>
            <div className="linkedCard">
              <span className="icon-tile">
                <Icon
                  name={type === "residence" ? "building" : "pill"}
                  size={18}
                />
              </span>
              {type === "residence" ? (
                <>
                  <strong>{item.nom_residence}</strong>
                  <span>Code résidence : {item.code_resid}</span>
                  <span>Code pharmacie : {item.codepharm}</span>
                </>
              ) : (
                <>
                  <strong>{item.nompharm}</strong>
                  <span>Code pharmacie : {item.codepharm}</span>
                  <span>Résidence : {item.nom_residence}</span>
                </>
              )}
            </div>
          </Reveal>
        ))}
      </Stagger>
    </section>
  );
}
