export default function PrimaryButton({ children, loading, disabled = false }) {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      className="group relative min-h-[56px] w-full overflow-hidden rounded-[18px] bg-gradient-to-br from-[#30302F] to-[#1F2323] font-black text-white shadow-[0_18px_35px_rgba(48,48,47,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_45px_rgba(48,48,47,0.28)] disabled:cursor-not-allowed disabled:opacity-70"
    >
      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#7CBCCC]/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

      <span className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <span className="absolute left-6 top-1/2 h-20 w-20 -translate-y-1/2 rounded-full bg-[#7CBCCC]/20 blur-2xl" />
        <span className="absolute right-6 top-1/2 h-20 w-20 -translate-y-1/2 rounded-full bg-white/10 blur-2xl" />
      </span>

      <span className="relative z-10 flex items-center justify-center">
        {loading ? (
          <span className="h-6 w-6 animate-spin rounded-full border-[3px] border-white/30 border-t-white" />
        ) : (
          children
        )}
      </span>
    </button>
  );
}