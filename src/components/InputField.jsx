export default function InputField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
}) {
  return (
    <div className="grid gap-2">
      <label className="text-[13px] font-black text-[#30302F]">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className="min-h-[54px] w-full rounded-2xl border border-[#DCE8EA] bg-[#F8FBFB] px-4 text-[15px] font-semibold text-[#30302F] outline-none transition-all duration-200 placeholder:text-[#9AA8AB] focus:border-[#7CBCCC] focus:bg-white focus:shadow-[0_0_0_5px_rgba(124,188,204,0.18)] disabled:cursor-not-allowed disabled:bg-[#EDF3F4] disabled:opacity-75"
      />
    </div>
  );
}