import { useMemo, useState } from "react";

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

const matchPatient =
  !patientQuery || patientNames.includes(patientQuery);

const matchDate = !dateSignature || signatureDate === dateSignature;

return matchResidence && matchDate && matchPatient;
    });

    result.sort((a, b) => {
      const dateA = getDateTime(a.dateAction);
      const dateB = getDateTime(b.dateAction);

      return sortBy === "DATE_ASC" ? dateA - dateB : dateB - dateA;
    });

    return result;
  }, [livraisons, residenceFilter, dateSignature, sortBy, isPharmacien,patientSearch]);

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
    0
  );

  const totalPiluliers = filtered.reduce(
    (sum, item) => sum + Number(item.piluliers || 0),
    0
  );

  return (
    <div className="space-y-5">
      <section className="rounded-[28px] border border-[#DDEAEC] bg-white p-5 shadow-[0_16px_45px_rgba(48,48,47,0.06)]">
        <div className="grid gap-5 xl:grid-cols-[1.05fr_1.8fr_0.95fr] xl:items-end">
          <div>
            <span className="rounded-full bg-[#7CBCCC]/15 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#4A9CAF]">
              Livraisons
            </span>

            <h1 className="mt-3 text-2xl font-black tracking-[-0.04em] text-[#30302F]">
              Suivi des livraisons
            </h1>

            <p className="mt-1 text-sm font-semibold leading-6 text-[#6F7D80]">
              {filtered.length} livraison(s) affichée(s) sur {livraisons.length}.
            </p>
          </div>

         <div
  className={[
    "grid gap-3",
    isPharmacien
      ? "lg:grid-cols-[1.1fr_1fr_0.8fr_0.9fr]"
      : "lg:grid-cols-[1fr_0.8fr_0.9fr]",
  ].join(" ")}
>
  {isPharmacien && (
    <label className="grid gap-2 text-sm font-black text-[#30302F]">
      Nom résidence
      <select
        value={residenceFilter}
        onChange={(event) => setResidenceFilter(event.target.value)}
        className="rounded-[18px] border border-[#DDEAEC] bg-white px-4 py-3 text-sm font-bold text-[#30302F] outline-none transition focus:border-[#7CBCCC] focus:ring-4 focus:ring-[#7CBCCC]/15"
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

  <label className="grid gap-2 text-sm font-black text-[#30302F]">
    Nom patient
    <input
      type="text"
      value={patientSearch}
      onChange={(event) => setPatientSearch(event.target.value)}
      placeholder="Rechercher un patient..."
      className="rounded-[18px] border border-[#DDEAEC] bg-white px-4 py-3 text-sm font-bold text-[#30302F] outline-none transition placeholder:text-[#9AA8AA] focus:border-[#7CBCCC] focus:ring-4 focus:ring-[#7CBCCC]/15"
    />
  </label>

  <label className="grid gap-2 text-sm font-black text-[#30302F]">
    Date de signature
    <input
      type="date"
      value={dateSignature}
      onChange={(event) => setDateSignature(event.target.value)}
      className="rounded-[18px] border border-[#DDEAEC] bg-white px-4 py-3 text-sm font-bold text-[#30302F] outline-none transition focus:border-[#7CBCCC] focus:ring-4 focus:ring-[#7CBCCC]/15"
    />
  </label>

  <label className="grid gap-2 text-sm font-black text-[#30302F]">
    Trier
    <select
      value={sortBy}
      onChange={(event) => setSortBy(event.target.value)}
      className="rounded-[18px] border border-[#DDEAEC] bg-white px-4 py-3 text-sm font-bold text-[#30302F] outline-none transition focus:border-[#7CBCCC] focus:ring-4 focus:ring-[#7CBCCC]/15"
    >
      <option value="DATE_DESC">Du plus récent au plus ancien</option>
      <option value="DATE_ASC">Du plus ancien au plus récent</option>
    </select>
  </label>
</div>

          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-4 gap-2">
              <DeliveryStat label="Résultats" value={filtered.length} />
              <DeliveryStat label="Livrées" value={livrees} />
              <DeliveryStat label="Patients" value={totalPatients} />
              <DeliveryStat label="Piluliers" value={totalPiluliers} />
            </div>

            <button
              type="button"
              onClick={resetFilters}
              className="w-full rounded-[16px] border border-[#DDEAEC] bg-[#F9FCFD] px-4 py-2.5 text-sm font-black text-[#30302F] transition hover:border-[#7CBCCC] hover:bg-[#7CBCCC]/10"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      </section>

      <LivraisonsTable
        livraisons={filtered}
        onGeneratePdf={onGeneratePdf}
        loadingPdfId={loadingPdfId}
      />
    </div>
  );
}

function DeliveryStat({ label, value }) {
  return (
    <div className="rounded-[16px] border border-[#DDEAEC] bg-[#F9FCFD] px-3 py-2.5">
      <p className="text-[9px] font-black uppercase tracking-[0.12em] text-[#7CBCCC]">
        {label}
      </p>

      <p className="mt-1 text-xl font-black text-[#30302F]">{value}</p>
    </div>
  );
}

function LivraisonsTable({ livraisons, onGeneratePdf, loadingPdfId }) {
  if (livraisons.length === 0) {
    return (
      <div className="rounded-[28px] border border-dashed border-[#7CBCCC]/40 bg-[#7CBCCC]/10 p-8 text-center font-bold text-[#6F7D80]">
        Aucune livraison trouvée avec ces filtres.
      </div>
    );
  }

  const tableGrid =
    "lg:grid-cols-[1.35fr_1.85fr_0.65fr_0.65fr_0.85fr_0.6fr]";

  return (
    <section className="rounded-[34px] border border-white bg-white/75 p-6 shadow-[0_25px_80px_rgba(48,48,47,0.10)] backdrop-blur-2xl">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-[-0.04em] text-[#30302F]">
            Liste des livraisons
          </h2>

          <p className="mt-1 text-sm font-semibold text-[#6F7D80]">
            Détail des livraisons signées et génération du PDF.
          </p>
        </div>

        <span className="w-fit rounded-full bg-[#7CBCCC]/15 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#4A9CAF]">
          {livraisons.length} résultat(s)
        </span>
      </div>

      <div className="overflow-hidden rounded-[24px] border border-[#DDEAEC]">
        <div
          className={[
            "hidden bg-[#F5FAFA] px-5 py-4 text-sm font-black text-[#6F7D80] lg:grid",
            tableGrid,
          ].join(" ")}
        >
          <span className="text-left">Résidence</span>
          <span className="text-left">Caisses</span>
          <span className="text-center">Patients</span>
          <span className="text-center">Piluliers</span>
          <span className="text-center">Signature</span>
          <span className="text-center">PDF</span>
        </div>

        <div className="divide-y divide-[#DDEAEC]">
          {livraisons.map((item) => {
            const isLoadingPdf = loadingPdfId === item.id;

            return (
              <div
                key={`${item.id}-${item.numcaisse}`}
                className={[
                  "grid gap-4 bg-white px-5 py-4 text-sm font-semibold text-[#30302F] transition hover:bg-[#F8FBFB] lg:items-center",
                  tableGrid,
                ].join(" ")}
              >
                <div className="min-w-0">
                  <p className="mb-1 text-xs font-black uppercase tracking-[0.12em] text-[#7CBCCC] lg:hidden">
                    Résidence
                  </p>

                  <p className="truncate font-black leading-5">
                    {item.etablissementNom || "-"}
                  </p>
                </div>

                <div className="min-w-0">
                  <p className="mb-2 text-xs font-black uppercase tracking-[0.12em] text-[#7CBCCC] lg:hidden">
                    Caisses
                  </p>

                  <CaisseBadges value={item.numcaisse} />
                </div>

                <div className="text-left lg:text-center">
                  <p className="mb-1 text-xs font-black uppercase tracking-[0.12em] text-[#7CBCCC] lg:hidden">
                    Patients
                  </p>

                  <span className="inline-flex min-w-[42px] justify-center rounded-xl bg-[#F5FAFA] px-3 py-1.5 text-sm font-black text-[#30302F]">
                    {item.patients || 0}
                  </span>
                </div>

                <div className="text-left lg:text-center">
                  <p className="mb-1 text-xs font-black uppercase tracking-[0.12em] text-[#7CBCCC] lg:hidden">
                    Piluliers
                  </p>

                  <span className="inline-flex min-w-[42px] justify-center rounded-xl bg-[#F5FAFA] px-3 py-1.5 text-sm font-black text-[#30302F]">
                    {item.piluliers || 0}
                  </span>
                </div>

                <div className="text-left lg:text-center">
                  <p className="mb-1 text-xs font-black uppercase tracking-[0.12em] text-[#7CBCCC] lg:hidden">
                    Signature
                  </p>

                  <span className="font-bold text-[#6F7D80]">
                    {formatDate(item.dateAction)}
                  </span>
                </div>

                <div className="text-left lg:text-center">
                  <p className="mb-1 text-xs font-black uppercase tracking-[0.12em] text-[#7CBCCC] lg:hidden">
                    PDF
                  </p>

                  <button
                    type="button"
                    onClick={() => onGeneratePdf(item.id)}
                    disabled={isLoadingPdf}
                    className="inline-flex items-center justify-center rounded-full bg-[#30302F] px-4 py-2 text-xs font-black text-white transition hover:bg-[#4A9CAF] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isLoadingPdf ? "..." : "PDF"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CaisseBadges({ value }) {
  const caisses = String(value || "-")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  if (caisses.length === 0) {
    return <span>-</span>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {caisses.map((caisse, index) => (
        <span
          key={`${caisse}-${index}`}
          className="inline-flex items-center rounded-full border border-[#DDEAEC] bg-[#F5FAFA] px-3 py-1.5 text-xs font-black text-[#30302F]"
        >
          {caisse}
        </span>
      ))}
    </div>
  );
}
function getPatientNames(item) {
  const names = [];

  if (Array.isArray(item.patientsList)) {
    item.patientsList.forEach((patient) => {
      names.push(patient.nompatient || patient.nom_patient || patient.nom || "");
    });
  }

  if (Array.isArray(item.patientsDetails)) {
    item.patientsDetails.forEach((patient) => {
      names.push(patient.nompatient || patient.nom_patient || patient.nom || "");
    });
  }

  if (Array.isArray(item.patientsData)) {
    item.patientsData.forEach((patient) => {
      names.push(patient.nompatient || patient.nom_patient || patient.nom || "");
    });
  }

  if (Array.isArray(item.caisses)) {
    item.caisses.forEach((caisse) => {
      if (Array.isArray(caisse.patients)) {
        caisse.patients.forEach((patient) => {
          names.push(
            patient.nompatient || patient.nom_patient || patient.nom || ""
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

function formatDate(date) {
  if (!date) return "-";

  const d = new Date(date);

  if (Number.isNaN(d.getTime())) return date;

  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}