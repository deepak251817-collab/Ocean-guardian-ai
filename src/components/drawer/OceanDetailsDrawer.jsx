// src/components/drawer/OceanDetailsDrawer.jsx
import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, MapPin, Activity, Thermometer, AlertTriangle, Fish,
  ShieldCheck, Droplets, Clock, Waves,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

/**
 * Props:
 *  - isOpen: boolean – whether the drawer is visible
 *  - onClose: () => void – callback to close the drawer
 *  - data: object containing marker data
 */
export default function OceanDetailsDrawer({ isOpen, onClose, data }) {
  const drawerRef = useRef(null);
  const backdropRef = useRef(null);
  const { theme } = useTheme();

  // Keyboard Escape listener + Focus Trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      // Focus trap
      if (e.key === "Tab" && drawerRef.current) {
        const focusableElements = drawerRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Initial focus trap
    setTimeout(() => {
      const closeBtn = drawerRef.current?.querySelector("button");
      closeBtn?.focus();
    }, 100);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!data) return null;

  const {
    image,
    label,
    type,
    category,
    status,
    location,
    healthScore,
    temperature,
    pollutionLevel,
    biodiversityIndex,
    speciesCount,
    waterQuality,
    recentAlerts,
    lastUpdated,
  } = data;

  const statusColors = {
    healthy: "text-teal-400 bg-teal-400/10 border-teal-400/30",
    warning: "text-amber-400 bg-amber-400/10 border-amber-400/30",
    critical: "text-red-400 bg-red-400/10 border-red-400/30",
  };

  const statusBadge = statusColors[status] || statusColors.healthy;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop (Tap outside to close) */}
          <motion.div
            ref={backdropRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className={`fixed inset-0 z-50 backdrop-blur-sm ${theme === "light" ? "bg-slate-900/20" : "bg-black/60"}`}
            onClick={(e) => {
              if (e.target === backdropRef.current) onClose();
            }}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <motion.aside
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label={`Ocean Details — ${label || location || "Station"}`}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={{ left: 0, right: 0.8 }}
            onDragEnd={(e, info) => {
              // Swipe right to close on mobile / touch
              if (info.offset.x > 100 || info.velocity.x > 400) {
                onClose();
              }
            }}
            className={`fixed inset-y-0 right-0 w-full max-w-md backdrop-blur-xl z-50 overflow-y-auto flex flex-col shadow-2xl ${theme === "light" ? "bg-white/96 border-l border-cyan-200/70 text-slate-900" : "bg-ocean-950/95 border-l border-ocean-700/50 text-white"}`}
          >
            {/* Mobile swipe handle bar */}
            <div className={`w-12 h-1.5 rounded-full mx-auto mt-3 mb-1 lg:hidden ${theme === "light" ? "bg-slate-300/80" : "bg-slate-600/50"}`} />

            {/* Header */}
            <div className={`px-6 py-4 border-b flex items-center justify-between gap-4 sticky top-0 backdrop-blur-md z-10 ${theme === "light" ? "border-cyan-100 bg-white/95" : "border-ocean-800/60 bg-ocean-950/90"}`}>
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`p-2 rounded-xl border ${theme === "light" ? "bg-cyan-50 border-cyan-200 text-cyan-700" : "bg-ocean-800/60 border-ocean-700/40 text-ocean-300"}`}>
                  <Waves size={18} />
                </div>
                <div className="min-w-0">
                  <h2 className={`text-base font-bold truncate ${theme === "light" ? "text-slate-900" : "text-white"}`}>{label || "Ocean Station"}</h2>
                  <p className={`text-xs truncate ${theme === "light" ? "text-slate-600" : "text-slate-400"}`}>{type || category || "Monitoring Station"}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border capitalize ${statusBadge}`}>
                  ● {status || "healthy"}
                </span>
                <button
                  onClick={onClose}
                  className={`p-2 rounded-xl transition-colors ${theme === "light" ? "text-slate-500 hover:text-slate-900 hover:bg-cyan-50" : "text-slate-400 hover:text-white hover:bg-ocean-800/60"}`}
                  aria-label="Close details drawer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6 flex-1">
              {/* Ocean Image */}
              {image && (
                <div className={`relative h-48 rounded-2xl overflow-hidden border shadow-lg group ${theme === "light" ? "border-cyan-100" : "border-ocean-800/60"}`}>
                  <img
                    src={image}
                    alt={label || "Ocean location view"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 ${theme === "light" ? "bg-gradient-to-t from-white/70 via-transparent to-transparent" : "bg-gradient-to-t from-ocean-950/80 via-transparent to-transparent"}`} />
                  <div className={`absolute bottom-3 left-3 flex items-center gap-1.5 text-xs font-medium backdrop-blur-md px-3 py-1 rounded-full border ${theme === "light" ? "text-slate-900 bg-white/80 border-cyan-100" : "text-white bg-black/40 border-white/10"}`}>
                    <MapPin size={13} className="text-ocean-300" />
                    <span className="truncate">{location || "Monitored Region"}</span>
                  </div>
                </div>
              )}

              {/* Primary Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                {/* Health Score */}
                <div className={`rounded-xl p-3.5 border ${theme === "light" ? "bg-slate-50 border-cyan-100" : "glass-light border-ocean-800/50"}`}>
                  <div className={`flex items-center gap-2 text-xs mb-1 ${theme === "light" ? "text-slate-600" : "text-slate-400"}`}>
                    <Activity size={14} className="text-teal-400" />
                    <span>Health Score</span>
                  </div>
                  <p className={`text-lg font-bold tabular-nums ${theme === "light" ? "text-cyan-700" : "text-teal-300"}`}>{healthScore || "72 / 100"}</p>
                </div>

                {/* Temperature */}
                <div className={`rounded-xl p-3.5 border ${theme === "light" ? "bg-slate-50 border-cyan-100" : "glass-light border-ocean-800/50"}`}>
                  <div className={`flex items-center gap-2 text-xs mb-1 ${theme === "light" ? "text-slate-600" : "text-slate-400"}`}>
                    <Thermometer size={14} className="text-amber-400" />
                    <span>Water Temp</span>
                  </div>
                  <p className={`text-lg font-bold tabular-nums ${theme === "light" ? "text-amber-700" : "text-amber-300"}`}>{temperature || "24.2°C"}</p>
                </div>

                {/* Biodiversity Index */}
                <div className={`rounded-xl p-3.5 border ${theme === "light" ? "bg-slate-50 border-cyan-100" : "glass-light border-ocean-800/50"}`}>
                  <div className={`flex items-center gap-2 text-xs mb-1 ${theme === "light" ? "text-slate-600" : "text-slate-400"}`}>
                    <ShieldCheck size={14} className="text-purple-400" />
                    <span>Biodiversity</span>
                  </div>
                  <p className={`text-lg font-bold tabular-nums ${theme === "light" ? "text-purple-700" : "text-purple-300"}`}>{biodiversityIndex || "71 / 100"}</p>
                </div>

                {/* Species Count */}
                <div className={`rounded-xl p-3.5 border ${theme === "light" ? "bg-slate-50 border-cyan-100" : "glass-light border-ocean-800/50"}`}>
                  <div className={`flex items-center gap-2 text-xs mb-1 ${theme === "light" ? "text-slate-600" : "text-slate-400"}`}>
                    <Fish size={14} className="text-cyan-400" />
                    <span>Species Count</span>
                  </div>
                  <p className={`text-lg font-bold tabular-nums ${theme === "light" ? "text-cyan-700" : "text-cyan-300"}`}>{speciesCount || "1,420 species"}</p>
                </div>
              </div>

              {/* Secondary Details */}
              <div className={`rounded-xl p-4 border space-y-3 ${theme === "light" ? "bg-white border-cyan-100 shadow-sm" : "glass border-ocean-800/60"}`}>
                <h3 className={`text-xs font-semibold uppercase tracking-wider ${theme === "light" ? "text-slate-500" : "text-slate-400"}`}>Environmental Metrics</h3>

                {/* Pollution Level */}
                <div className={`flex items-start gap-3 py-1 border-b ${theme === "light" ? "border-cyan-100" : "border-ocean-800/40"}`}>
                  <AlertTriangle size={15} className="text-red-400 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <span className={`text-xs block ${theme === "light" ? "text-slate-600" : "text-slate-400"}`}>Pollution Level</span>
                    <span className={`text-xs font-semibold ${theme === "light" ? "text-slate-900" : "text-slate-200"}`}>{pollutionLevel || "Moderate (52/100)"}</span>
                  </div>
                </div>

                {/* Water Quality */}
                <div className="flex items-start gap-3 py-1">
                  <Droplets size={15} className="text-ocean-300 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <span className={`text-xs block ${theme === "light" ? "text-slate-600" : "text-slate-400"}`}>Water Quality</span>
                    <span className={`text-xs font-semibold ${theme === "light" ? "text-slate-900" : "text-slate-200"}`}>{waterQuality || "Optimal pH 8.08, Dissolved O₂ 6.8 mg/L"}</span>
                  </div>
                </div>
              </div>

              {/* Recent Alerts */}
              {recentAlerts && recentAlerts.length > 0 && (
                <div className={`rounded-xl p-4 border space-y-2 ${theme === "light" ? "bg-rose-50 border-rose-200" : "glass border-red-400/20 bg-red-400/5"}`}>
                  <div className="flex items-center gap-2 text-red-400 text-xs font-semibold">
                    <AlertTriangle size={14} />
                    <span>Recent Alerts & Anomalies</span>
                  </div>
                  <ul className="space-y-2 pt-1">
                    {recentAlerts.map((alert, i) => (
                      <li key={i} className={`text-xs flex items-start gap-2 p-2 rounded-lg border ${theme === "light" ? "text-slate-800 bg-white border-rose-100" : "text-slate-300 bg-ocean-900/40 border-ocean-800/40"}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1 shrink-0" />
                        <span className="leading-relaxed">{alert}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Footer info */}
              <div className={`flex items-center justify-between text-[11px] pt-2 border-t ${theme === "light" ? "text-slate-500 border-cyan-100" : "text-slate-500 border-ocean-800/60"}`}>
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  Last Updated: {lastUpdated || "Just now"}
                </span>
                <span className="text-ocean-400 font-medium">Station ID: #OG-{data.id || "01"}</span>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
