export default function Badge({ children, variant = "default", className = "" }) {
  const variants = {
    default: "bg-slate-700/60 text-slate-300 border-slate-600/40",
    teal: "bg-teal-400/10 text-teal-300 border-teal-400/20",
    blue: "bg-ocean-300/10 text-ocean-200 border-ocean-300/20",
    green: "bg-emerald-400/10 text-emerald-300 border-emerald-400/20",
    orange: "bg-amber-400/10 text-amber-300 border-amber-400/20",
    red: "bg-red-400/10 text-red-300 border-red-400/20",
    purple: "bg-purple-400/10 text-purple-300 border-purple-400/20",
    healthy: "bg-emerald-400/10 text-emerald-300 border-emerald-400/20",
    warning: "bg-amber-400/10 text-amber-300 border-amber-400/20",
    critical: "bg-red-400/10 text-red-300 border-red-400/20",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variants[variant] || variants.default} ${className}`}
    >
      {variant === "healthy" || variant === "warning" || variant === "critical" ? (
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            variant === "healthy" ? "bg-emerald-400" :
            variant === "warning" ? "bg-amber-400" : "bg-red-400"
          }`}
        />
      ) : null}
      {children}
    </span>
  );
}
