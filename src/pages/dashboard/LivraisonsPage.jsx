import { useMemo, useState } from "react";
import DeliveriesTable from "../../components/dashboard/DeliveriesTable";
import InputField from "../../components/InputField";
import Icon from "../../components/ui/Icon";

export default function LivraisonsPage({
  etablissements,
  livraisons,
  onGeneratePdf,
  loadingPdfId,
  user,
}) {
  const isPharmacien = user?.role === "PHARMACIEN";

  const [residenceFilter, setResidenceFilter] = useState("ALL");
  const [dateSignature, setDateSignature] = useState("");
  const [sortBy, setSortBy] = useState("DATE_DESC");
  const [patientSearch, setPatientSearch] = useState("");

  const residenceOptions = useMemo(() => {
    const map = new Map();

    livraisons.forEach((item) => {
      const name = item.etablissementNom || "Résidence non définie";
      map.set(name, name);
    });

    etablissements.forEach((item) => {
      if (item.nom) {
        map.set(item.nom, item.nom);
      }
    });

    return Array.from(map.values()).sort((a, b) => a.localeCompare(b));
  }, [livraisons, etablissements]);

  const filtered = useMemo(() => {
    let result = [...livraisons];

    result = result.filter((item) => {
      const residenceName = item.etablissementNom || "";
      const signatureDate = toInputDate(item.dateAction);

      const matchResidence =
        !isPharmacien ||
        residenceFilter === "ALL" ||
        residenceName === residenceFilter;

      const patientNames = getPatientNames(item).toLowerCase();
      const patientQuery = patientSearch.trim().toLowerCase();

      const matchPatient = !patientQuery || patientNames.includes(patientQuery);

      const matchDate = !dateSignature || signatureDate === dateSignature;

      return matchResidence && matchDate && matchPatient;
    });

    result.sort((a, b) => {
      const dateA = getDateTime(a.dateAction);
      const dateB = getDateTime(b.dateAction);

      return sortBy === "DATE_ASC" ? dateA - dateB : dateB - dateA;
    });

    return result;
  }, [
    livraisons,
    residenceFilter,
    dateSignature,
    sortBy,
    isPharmacien,
    patientSearch,
  ]);

  function resetFilters() {
    if (isPharmacien) {
      setResidenceFilter("ALL");
    }
    setPatientSearch("");
    setDateSignature("");
    setSortBy("DATE_DESC");
  }

  const livrees = filtered.filter((item) => item.statut === "Livrée").length;

  const totalPatients = filtered.reduce(
    (sum, item) => sum + Number(item.patients || 0),
    0,
  );

  const totalPiluliers = filtered.reduce(
    (sum, item) => sum + Number(item.piluliers || 0),
    0,
  );

  const hasFilters =
    residenceFilter !== "ALL" ||
    Boolean(dateSignature) ||
    Boolean(patientSearch.trim()) ||
    sortBy !== "DATE_DESC";
  return (
    <div className="stack">
      <div className="page-heading">
        <div>
          <span className="eyebrow">Traçabilité & documents</span>
          <h1>Vos livraisons</h1>
          <p>
            Retrouvez une livraison, consultez son statut et téléchargez son bon
            PDF.
          </p>
        </div>
        <span className="period-chip">
          <Icon name="truck" size={14} />
          {livraisons.length} livraison(s)
        </span>
      </div>
      <section
        className="surface filter-panel"
        aria-label="Filtres des livraisons"
      >
        <div className="filter-panel-heading">
          <h2>
            <Icon name="filter" size={16} />
            Affiner la recherche
          </h2>
          <button
            type="button"
            className="text-link"
            onClick={resetFilters}
            disabled={!hasFilters}
          >
            <Icon name="refresh" size={12} />
            Réinitialiser
          </button>
        </div>
        <div
          className={`filter-grid ${isPharmacien ? "" : "residence-filters"}`}
        >
          {isPharmacien && (
            <label className="filter-field">
              <span>Résidence</span>
              <select
                value={residenceFilter}
                onChange={(event) => setResidenceFilter(event.target.value)}
              >
                <option value="ALL">Toutes les résidences</option>
                {residenceOptions.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </label>
          )}
          <InputField
            label="Nom du patient"
            type="search"
            icon="search"
            value={patientSearch}
            onChange={(event) => setPatientSearch(event.target.value)}
            placeholder="Rechercher un patient…"
          />
          <label className="filter-field">
            <span>Date de signature</span>
            <input
              type="date"
              value={dateSignature}
              onChange={(event) => setDateSignature(event.target.value)}
            />
          </label>
          <label className="filter-field">
            <span>Ordre d’affichage</span>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
            >
              <option value="DATE_DESC">Les plus récentes d’abord</option>
              <option value="DATE_ASC">Les plus anciennes d’abord</option>
            </select>
          </label>
        </div>
      </section>
      <div className="filter-summary" role="status" aria-live="polite">
        <span>
          <strong>{filtered.length}</strong>résultat(s)
        </span>
        <span>
          <strong>{livrees}</strong>livrée(s)
        </span>
        <span>
          <strong>{totalPatients.toLocaleString("fr-FR")}</strong>patients
          cumulés
        </span>
        <span>
          <strong>{totalPiluliers.toLocaleString("fr-FR")}</strong>piluliers
        </span>
      </div>
      <DeliveriesTable
        key={`${residenceFilter}-${dateSignature}-${sortBy}-${patientSearch}`}
        livraisons={filtered}
        onGeneratePdf={onGeneratePdf}
        loadingPdfId={loadingPdfId}
        title="Liste des livraisons"
        emptyText={
          hasFilters
            ? "Aucune livraison ne correspond à vos critères. Essayez de modifier ou de réinitialiser les filtres."
            : "Vos livraisons apparaîtront ici dès leur enregistrement."
        }
      />
    </div>
  );
}

function getPatientNames(item) {
  const names = [];

  if (Array.isArray(item.patientsList)) {
    item.patientsList.forEach((patient) => {
      names.push(
        patient.nompatient || patient.nom_patient || patient.nom || "",
      );
    });
  }

  if (Array.isArray(item.patientsDetails)) {
    item.patientsDetails.forEach((patient) => {
      names.push(
        patient.nompatient || patient.nom_patient || patient.nom || "",
      );
    });
  }

  if (Array.isArray(item.patientsData)) {
    item.patientsData.forEach((patient) => {
      names.push(
        patient.nompatient || patient.nom_patient || patient.nom || "",
      );
    });
  }

  if (Array.isArray(item.caisses)) {
    item.caisses.forEach((caisse) => {
      if (Array.isArray(caisse.patients)) {
        caisse.patients.forEach((patient) => {
          names.push(
            patient.nompatient || patient.nom_patient || patient.nom || "",
          );
        });
      }
    });
  }

  return names.filter(Boolean).join(" ");
}
function toInputDate(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getDateTime(value) {
  if (!value) return 0;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return 0;

  return date.getTime();
}
