// src/components/ui/ErrorState.jsx
import { memo } from "react";
import { AlertOctagon, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

const ErrorState = memo(function ErrorState({
  title = "Failed to load data",
  description = "Something went wrong while connecting to the ocean telemetry feed. Please check your connection and try again.",
  onRetry,
  className = "",
}) {
  const descId = `error-desc-${title.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`glass rounded-2xl p-8 border border-red-500/20 flex flex-col items-center justify-center text-center max-w-md mx-auto my-6 shadow-xl ${className}`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      aria-describedby={descId}
    >
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-4 text-red-400 shadow-glow-sm" aria-hidden="true">
        <AlertOctagon size={32} />
      </div>
      <h3 className="text-base font-bold text-white mb-2">
        {title}
      </h3>
      <p id={descId} className="text-xs text-slate-400 leading-relaxed mb-6 max-w-xs">
        {description}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 transition-all cursor-pointer hover:scale-105 active:scale-95"
          aria-label="Retry loading data"
        >
          <RotateCcw size={14} aria-hidden="true" />
          Retry Connection
        </button>
      )}
    </motion.div>
  );
});

export default ErrorState;
