export default function EmptyState({ text }) {
  return (
    <div className="rounded-[28px] border border-dashed border-[#7CBCCC]/40 bg-[#7CBCCC]/10 p-8 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white text-sm font-black text-[#4A9CAF] shadow-sm">
        —
      </div>

      <p className="mt-4 text-sm font-bold text-[#6F7D80]">{text}</p>
    </div>
  );
}