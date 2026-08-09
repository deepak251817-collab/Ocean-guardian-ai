import { Search } from "lucide-react";

export default function EmptyState({
  icon: Icon = Search,
  title = "No results found",
  description = "We couldn't find anything matching your criteria.",
  actionLabel,
  onAction,
  className = "",
}) {
  return (
    <div className={`glass rounded-2xl p-8 border border-ocean-800/60 flex flex-col items-center justify-center text-center max-w-md mx-auto my-6 ${className}`}>
      <div className="w-14 h-14 rounded-2xl bg-ocean-800/50 border border-ocean-700/50 flex items-center justify-center mb-4 text-ocean-300 shadow-glow-sm">
        <Icon size={28} />
      </div>
      <h3 className="text-base font-semibold text-white dark:text-white light:text-slate-900 mb-1">
        {title}
      </h3>
      <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 leading-relaxed mb-4 max-w-xs">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 text-xs font-medium rounded-xl bg-ocean-500/20 text-ocean-300 hover:bg-ocean-500/30 border border-ocean-400/30 transition-all cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
