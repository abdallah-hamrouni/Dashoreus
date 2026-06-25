export default function ProfilPage({
  user,
  isPharmacien,
  etablissements = [],
  livraisons = [],
}) {
  const entityName = isPharmacien
    ? user?.nompharm || user?.nom_pharmacie || user?.nom || "Ma pharmacie"
    : user?.nom_residence || user?.nomresid || user?.nom || "Ma résidence";

  const roleLabel = isPharmacien ? "PHARMACIEN" : "RÉSIDENCE";
  const code = isPharmacien ? user?.codepharm : user?.code_resid;

  const livrees = livraisons.filter((item) => item.statut === "Livrée").length;

  const patients = livraisons.reduce(
    (sum, item) => sum + Number(item.patients || 0),
    0
  );

  const piluliers = livraisons.reduce(
    (sum, item) => sum + Number(item.piluliers || 0),
    0
  );

  const initials = `${user?.prenom?.[0] || ""}${user?.nom?.[0] || ""}`
    .trim()
    .toUpperCase();

  return (
    <section className="animate-[fadeIn_0.45s_ease-out] space-y-6">
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(12px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>

      {/* HEADER PROFIL */}
      <header className="relative overflow-hidden rounded-[30px] border border-[#DDEAEC] bg-white p-6 shadow-[0_18px_55px_rgba(48,48,47,0.07)]">
        <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#7CBCCC]/20 blur-3xl" />
        <div className="absolute -bottom-20 left-10 h-44 w-44 rounded-full bg-[#4A9CAF]/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            <div className="group relative">
              <div className="absolute inset-0 rounded-[28px] bg-[#7CBCCC]/40 blur-xl transition group-hover:bg-[#7CBCCC]/60" />

              <div className="relative flex h-20 w-20 items-center justify-center rounded-[28px] bg-gradient-to-br from-[#30302F] to-[#4A9CAF] text-2xl font-black text-white shadow-[0_16px_35px_rgba(48,48,47,0.18)] transition duration-300 group-hover:-translate-y-1 group-hover:scale-105">
                {initials || "U"}
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#7CBCCC]/15 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#4A9CAF]">
                  Profil utilisateur
                </span>

                <span className="rounded-full bg-[#30302F]/5 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#30302F]">
                  {roleLabel}
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-black tracking-[-0.04em] text-[#30302F]">
                {user?.prenom || "-"} {user?.nom || ""}
              </h1>

              <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-[#6F7D80]">
                Consultez les informations générales du compte connecté et les
                accès autorisés sur le tableau de bord.
              </p>
            </div>
          </div>

          <div className="rounded-[24px] border border-[#DDEAEC] bg-[#F9FCFD] px-5 py-4 transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_35px_rgba(48,48,47,0.08)]">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#7CBCCC]">
              Établissement
            </p>

            <p className="mt-2 max-w-[280px] truncate text-sm font-black text-[#30302F]">
              {entityName}
            </p>
          </div>
        </div>
      </header>

      {/* CONTENU PRINCIPAL */}
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        {/* INFORMATIONS COMPTE */}
        <article className="rounded-[30px] border border-[#DDEAEC] bg-white p-6 shadow-[0_18px_55px_rgba(48,48,47,0.06)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#7CBCCC]">
                Compte
              </p>

              <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-[#30302F]">
                Informations personnelles
              </h2>
            </div>

            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#7CBCCC]/15 text-lg">
              👤
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <ProfileInfo label="Nom" value={user?.nom || "-"} />
            <ProfileInfo label="Prénom" value={user?.prenom || "-"} />
            <ProfileInfo label="Email" value={user?.email || "-"} />
            <ProfileInfo label="Téléphone" value={user?.telephone || "-"} />
            <ProfileInfo label="Rôle" value={roleLabel} />
            <ProfileInfo label="Établissement" value={entityName} large />
          </div>
        </article>

        {/* ACTIVITÉ */}
        <article className="rounded-[30px] border border-[#DDEAEC] bg-white p-6 shadow-[0_18px_55px_rgba(48,48,47,0.06)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#7CBCCC]">
                Activité
              </p>

              <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-[#30302F]">
                Résumé du compte
              </h2>
            </div>

            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#30302F] text-lg text-white">
              📊
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            <ProfileStat
              label={isPharmacien ? "Résidences liées" : "Résidence"}
              value={etablissements.length}
            />

            <ProfileStat label="Livraisons livrées" value={livrees} />
            <ProfileStat label="Patients" value={patients} />
            <ProfileStat label="Piluliers" value={piluliers} />
          </div>
        </article>
      </div>

      {/* ACCÈS AUTORISÉ */}
      <article className="rounded-[30px] border border-[#DDEAEC] bg-white p-6 shadow-[0_18px_55px_rgba(48,48,47,0.06)]">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#7CBCCC]">
              Autorisations
            </p>

            <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-[#30302F]">
              Accès autorisé
            </h2>

            <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-[#6F7D80]">
              {isPharmacien
                ? "Ce compte pharmacien peut consulter toutes les résidences liées à sa pharmacie."
                : "Ce compte résidence peut consulter uniquement les informations liées à sa propre résidence."}
            </p>
          </div>

          <span className="w-fit rounded-full bg-[#7CBCCC]/15 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#4A9CAF]">
            {etablissements.length} accès
          </span>
        </div>

        {etablissements.length > 0 ? (
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {etablissements.map((item, index) => (
              <ResidenceCard key={item.id || index} item={item} index={index} />
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-[24px] border border-dashed border-[#7CBCCC]/50 bg-[#7CBCCC]/10 p-6 text-center">
            <p className="text-sm font-black text-[#30302F]">
              Aucun établissement associé pour le moment.
            </p>

            <p className="mt-1 text-sm font-semibold text-[#6F7D80]">
              Les accès apparaîtront ici après chargement des données.
            </p>
          </div>
        )}
      </article>
    </section>
  );
}

function ProfileInfo({ label, value, large = false }) {
  return (
    <div
      className={[
        "group rounded-[22px] border border-[#DDEAEC] bg-[#F9FCFD] p-4 transition duration-300 hover:-translate-y-1 hover:border-[#7CBCCC]/70 hover:bg-white hover:shadow-[0_14px_35px_rgba(48,48,47,0.07)]",
        large ? "md:col-span-2" : "",
      ].join(" ")}
    >
      <p className="text-xs font-black uppercase tracking-[0.16em] text-[#7CBCCC]">
        {label}
      </p>

      <p className="mt-2 break-words text-sm font-black leading-6 text-[#30302F]">
        {value}
      </p>
    </div>
  );
}

function ProfileStat({ label, value }) {
  return (
    <div className="group flex items-center justify-between rounded-[22px] border border-[#DDEAEC] bg-[#F9FCFD] p-4 transition duration-300 hover:-translate-y-1 hover:border-[#7CBCCC]/70 hover:bg-white hover:shadow-[0_14px_35px_rgba(48,48,47,0.07)]">
      <div>
        <p className="text-sm font-black text-[#30302F]">{label}</p>
        <p className="mt-1 text-xs font-semibold text-[#6F7D80]">
          Donnée calculée depuis l’historique
        </p>
      </div>

      <span className="rounded-2xl bg-[#7CBCCC]/15 px-4 py-2 text-sm font-black text-[#4A9CAF] transition group-hover:bg-[#4A9CAF] group-hover:text-white">
        {value}
      </span>
    </div>
  );
}

function ResidenceCard({ item, index }) {
  return (
    <div
      className="group relative overflow-hidden rounded-[24px] border border-[#DDEAEC] bg-[#F9FCFD] p-5 transition duration-300 hover:-translate-y-1 hover:border-[#7CBCCC]/70 hover:bg-white hover:shadow-[0_16px_40px_rgba(48,48,47,0.08)]"
      style={{
        animation: `fadeIn 0.45s ease-out ${index * 70}ms both`,
      }}
    >
      <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-[#7CBCCC]/20 blur-2xl transition group-hover:bg-[#7CBCCC]/35" />

      <div className="relative z-10">
        <div className="flex items-center justify-between gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#7CBCCC]/15 text-[#4A9CAF]">
            🏠
          </span>

          <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#4A9CAF] shadow-sm">
            Résidence
          </span>
        </div>

        <p className="mt-4 text-base font-black text-[#30302F]">
          {item.nom || "Résidence"}
        </p>

       
      </div>
    </div>
  );
}