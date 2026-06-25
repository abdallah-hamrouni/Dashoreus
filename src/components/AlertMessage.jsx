export default function AlertMessage({ result }) {
  if (!result) return null;

  const isSuccess = result.type === "success";

  return (
    <div
      className={[
        "mt-5 animate-[fadeUp_0.35s_ease-out] rounded-2xl border p-4 text-sm font-bold",
        isSuccess
          ? "border-green-500/20 bg-green-500/10 text-green-700"
          : "border-red-500/20 bg-red-500/10 text-red-700",
      ].join(" ")}
    >
      <strong>{result.message}</strong>

     
    </div>
  );
}