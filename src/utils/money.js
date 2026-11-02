/** Compact Indian currency for display only. Database values stay numeric INR. */
export function formatINR(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  const abs = Math.abs(n);
  const number = (divisor) => (n / divisor).toLocaleString("en-IN", {maximumFractionDigits: 2});
  if (abs >= 10000000) return `₹${number(10000000)} Cr`;
  if (abs >= 100000) return `₹${number(100000)} L`;
  return new Intl.NumberFormat("en-IN", {style:"currency",currency:"INR",maximumFractionDigits:0}).format(n);
}
/** Support older activity rows with formatted price strings. */
export function formatActivityAmount(activity) {
  const raw = activity?.price;
  if (activity?.action === "Transaction completed" && Number(activity?.amount) > 0) return formatINR(activity.amount);
  if (raw == null || raw === "") return "—";
  const parsed = Number(String(raw).replace(/[₹,\s]/g,""));
  return Number.isFinite(parsed) ? formatINR(parsed) : String(raw);
}
