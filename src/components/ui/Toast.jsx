// src/components/ui/Toast.jsx
// Event-based toast — no Provider needed. Call toast() anywhere.
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertTriangle, Info, XCircle, X } from "lucide-react";

const ICONS = {
  success: { Icon: CheckCircle, color: "text-teal-400", bg: "bg-teal-400/10 border-teal-400/30" },
  error:   { Icon: XCircle,     color: "text-red-400",  bg: "bg-red-400/10 border-red-400/30" },
  warning: { Icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/30" },
  info:    { Icon: Info,         color: "text-ocean-300", bg: "bg-ocean-400/10 border-ocean-300/30" },
};

// ── Public API ───────────────────────────────────────────────────────────────
export function toast(message, type = "success") {
  window.dispatchEvent(
    new CustomEvent("og:toast", { detail: { id: Date.now(), message, type } })
  );
}

// ── Toaster — mount once inside App ─────────────────────────────────────────
export function Toaster() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handler = (e) => {
      const t = e.detail;
      setToasts((prev) => [...prev, t]);
      setTimeout(
        () => setToasts((prev) => prev.filter((x) => x.id !== t.id)),
        3500
      );
    };
    window.addEventListener("og:toast", handler);
    return () => window.removeEventListener("og:toast", handler);
  }, []);

  const dismiss = (id) => setToasts((prev) => prev.filter((x) => x.id !== id));

  return (
    <div
      className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none"
      aria-live="polite"
      aria-label="Notifications"
    >
      <AnimatePresence>
        {toasts.map((t) => {
          const { Icon, color, bg } = ICONS[t.type] || ICONS.info;
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 60, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl glass border ${bg} shadow-xl min-w-[260px] max-w-xs`}
            >
              <Icon size={16} className={`shrink-0 ${color}`} />
              <p className="text-xs text-slate-200 flex-1 leading-snug">{t.message}</p>
              <button
                onClick={() => dismiss(t.id)}
                className="shrink-0 text-slate-500 hover:text-white transition-colors"
                aria-label="Dismiss"
              >
                <X size={13} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
