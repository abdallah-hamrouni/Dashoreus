export default function PharmacyCard({
  nomPharmacie,
  codePharm,
  onChangeCode,
  onClearCode,
}) {
  if (!nomPharmacie) return null;

  return (
    <div className="animate-[fadeUp_0.45s_ease-out] rounded-[24px] border border-[#7CBCCC]/40 bg-gradient-to-br from-[#7CBCCC]/25 to-white p-4 shadow-[0_14px_35px_rgba(48,48,47,0.08)]">
      <div className="flex items-center gap-4">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-[18px] bg-white font-black text-[#30302F] shadow-[0_10px_24px_rgba(48,48,47,0.08)]">
          ✓
        </div>

        <div className="min-w-0 flex-1">
          <span className="block text-xs font-black uppercase tracking-wide text-[#6F7D80]">
            Pharmacie associée
          </span>
          <strong className="mt-1 block truncate text-[16px] font-black text-[#30302F]">
            {nomPharmacie}
          </strong>
         
        </div>
      </div>

      <div className="mt-4 flex gap-2">
       
      </div>
    </div>
  );
}