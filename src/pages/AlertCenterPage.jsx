// src/pages/AlertCenterPage.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, AlertTriangle, Info, CheckCircle2,
  Clock, MapPin, Wifi, Check, X, ShieldAlert,
} from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import MobileNav from "../components/layout/MobileNav";
import PageHeader from "../components/layout/PageHeader";
import ErrorState from "../components/ui/ErrorState";
import { alertsMockData } from "../data/mockAlerts";
import { toast } from "../components/ui/Toast";
import { useDebounce } from "../utils/useDebounce";

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -8 },
};

const SEVERITY_CONFIG = {
  critical: {
    Icon: ShieldAlert,
    label: "Critical",
    bg: "bg-red-400/10",
    border: "border-red-400/30",
    text: "text-red-400",
    dot: "bg-red-400",
    badge: "bg-red-400/15 border-red-400/30 text-red-400",
  },
  warning: {
    Icon: AlertTriangle,
    label: "Warning",
    bg: "bg-amber-400/10",
    border: "border-amber-400/30",
    text: "text-amber-400",
    dot: "bg-amber-400",
    badge: "bg-amber-400/15 border-amber-400/30 text-amber-400",
  },
  info: {
    Icon: Info,
    label: "Info",
    bg: "bg-teal-400/10",
    border: "border-teal-400/30",
    text: "text-teal-400",
    dot: "bg-teal-400",
    badge: "bg-teal-400/15 border-teal-400/30 text-teal-400",
  },
};

const FILTERS = ["All", "Critical", "Warning", "Info"];

function AlertSkeleton() {
  return (
    <div className="glass rounded-xl p-4 border border-ocean-800/60 animate-pulse flex gap-3">
      <div className="w-9 h-9 rounded-lg bg-ocean-800/50 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="w-48 h-4 rounded bg-ocean-800/50" />
        <div className="w-64 h-3 rounded bg-ocean-800/40" />
        <div className="flex gap-3">
          <div className="w-24 h-3 rounded bg-ocean-800/40" />
          <div className="w-20 h-3 rounded bg-ocean-800/40" />
        </div>
      </div>
      <div className="w-16 h-5 rounded-full bg-ocean-800/40 shrink-0" />
    </div>
  );
}

function AlertCard({ alert, _index, onResolve, onDismiss }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = SEVERITY_CONFIG[alert.severity] || SEVERITY_CONFIG.info;
  const { Icon } = cfg;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100, transition: { duration: 0.2 } }}
      className={`glass ${cfg.bg} border ${cfg.border} rounded-xl overflow-hidden shadow transition-shadow hover:shadow-lg`}
    >
      <div className="p-4 flex flex-col md:flex-row md:items-start gap-4">
        {/* Toggle Details button wrapper */}
        <div className="flex-1 flex items-start gap-3 min-w-0">
          {/* Icon */}
          <div className={`p-2 rounded-lg ${cfg.bg} border ${cfg.border} shrink-0 mt-0.5`}>
            <Icon size={16} className={cfg.text} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="text-sm font-semibold text-white truncate">{alert.title}</h3>
              <span className={`shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${cfg.badge}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${alert.severity === "critical" ? "animate-pulse" : ""}`} />
                {cfg.label}
              </span>
            </div>
            
            <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-2">{alert.description}</p>
            
            <div className="flex items-center gap-3 text-[10px] text-slate-500">
              <span className="flex items-center gap-1"><MapPin size={10} />{alert.location}</span>
              <span className="flex items-center gap-1"><Clock size={10} />{alert.time}</span>
              {alert.resolved && (
                <span className="text-teal-400 font-semibold flex items-center gap-0.5"><CheckCircle2 size={10} /> Resolved</span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex items-center gap-2 shrink-0 md:self-center">
          <button
            onClick={() => setExpanded(!expanded)}
            className="px-2.5 py-1.5 rounded-lg bg-ocean-800/40 hover:bg-ocean-800/60 border border-ocean-700/40 text-slate-300 hover:text-white transition-all text-xs font-semibold cursor-pointer"
            aria-expanded={expanded}
          >
            {expanded ? "Hide Details" : "View Details"}
          </button>
          
          {!alert.resolved && (
            <button
              onClick={() => onResolve(alert.id)}
              className="p-1.5 rounded-lg bg-teal-400/10 hover:bg-teal-400/20 border border-teal-400/20 text-teal-400 hover:text-teal-300 transition-all cursor-pointer"
              title="Mark as Resolved"
              aria-label="Resolve alert"
            >
              <Check size={14} />
            </button>
          )}

          <button
            onClick={() => onDismiss(alert.id)}
            className="p-1.5 rounded-lg bg-red-400/10 hover:bg-red-400/20 border border-red-400/20 text-red-400 hover:text-red-300 transition-all cursor-pointer"
            title="Dismiss Alert"
            aria-label="Dismiss alert"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Expanded details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className={`px-4 pb-4 pt-0 border-t ${cfg.border} mt-0`}>
              <div className="glass-light rounded-xl p-3.5 mt-3 space-y-2 text-xs">
                <p className="text-slate-300 leading-relaxed">{alert.description}</p>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="bg-ocean-800/30 rounded-lg p-2 border border-ocean-700/30">
                    <p className="text-[10px] text-slate-500 mb-0.5">Location Basin</p>
                    <p className="text-xs text-slate-200 font-medium">{alert.location}</p>
                  </div>
                  <div className="bg-ocean-800/30 rounded-lg p-2 border border-ocean-700/30">
                    <p className="text-[10px] text-slate-500 mb-0.5">Alert Level</p>
                    <p className={`text-xs font-semibold capitalize ${cfg.text}`}>{alert.severity}</p>
                  </div>
                  <div className="bg-ocean-800/30 rounded-lg p-2 border border-ocean-700/30 col-span-2">
                    <p className="text-[10px] text-slate-500 mb-0.5">Acoustic Sensor Telemetry Timestamp</p>
                    <p className="text-xs text-slate-200 font-medium">{alert.time}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function AlertCenterPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 200);
  const [filter, setFilter] = useState("All");
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    setAlerts(alertsMockData);
    const t = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const handleRetry = () => {
    setIsError(false);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 800);
  };

  const handleResolve = (id) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, resolved: true } : a))
    );
    toast("Alert resolved successfully", "success");
  };

  const handleDismiss = (id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    toast("Alert dismissed", "info");
  };

  const filtered = alerts.filter((a) => {
    const matchSearch = !debouncedSearch || a.title.toLowerCase().includes(debouncedSearch.toLowerCase()) || a.location.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchFilter = filter === "All" || a.severity === filter.toLowerCase();
    return matchSearch && matchFilter;
  });

  const counts = {
    critical: alerts.filter((a) => a.severity === "critical" && !a.resolved).length,
    warning:  alerts.filter((a) => a.severity === "warning" && !a.resolved).length,
    info:     alerts.filter((a) => a.severity === "info" && !a.resolved).length,
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.35 }} className="min-h-screen bg-ocean-gradient flex flex-col">
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      <Navbar variant="dashboard" />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto pb-24 lg:pb-8" id="main-content">
          <PageHeader
            title="Alert Center"
            subtitle="AI-detected ocean anomalies, pH drops, bleaching alerts & thermal risks"
            breadcrumbs={[{ label: "Alert Center" }]}
          />

          <div className="px-4 sm:px-6 py-6 space-y-6">
            {/* Summary stat row */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { key: "critical", color: "text-red-400", bg: "bg-red-400/10 border-red-400/20", label: "Critical" },
                { key: "warning",  color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20", label: "Warning" },
                { key: "info",     color: "text-teal-400",  bg: "bg-teal-400/10 border-teal-400/20",  label: "Info" },
              ].map(({ key, color, bg, label }) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className={`glass ${bg} border rounded-xl p-4 text-center`}
                >
                  <p className={`text-2xl font-black ${color} mb-1`}>{counts[key]}</p>
                  <p className="text-xs text-slate-400">{label}</p>
                </motion.div>
              ))}
            </div>

            {/* Search + Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search alerts by title or location…"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-ocean-800/50 border border-ocean-800/60 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-ocean-300/40 transition-all"
                  aria-label="Search alerts"
                />
              </div>
              <div className="flex gap-2">
                {FILTERS.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    aria-pressed={filter === f}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${filter === f ? "bg-ocean-400/20 text-ocean-300 border border-ocean-300/40" : "glass-light text-slate-400 hover:text-slate-200 border border-ocean-800/40"}`}
                  >
                    {f}
                    {f !== "All" && (
                      <span className="ml-1.5 text-[10px] opacity-60">({counts[f.toLowerCase()] || 0})</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Results label */}
            {!isLoading && (
              <p className="text-xs text-slate-500">
                Showing <span className="font-semibold text-slate-300">{filtered.length}</span> of {alerts.length} alerts — newest first
              </p>
            )}

            {/* Alert list */}
            {isError ? (
              <ErrorState
                title="Alert Stream Disconnected"
                description="Unable to synchronize live alert stream."
                onRetry={handleRetry}
              />
            ) : isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => <AlertSkeleton key={i} />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="glass rounded-2xl p-12 border border-ocean-800/60 text-center">
                <Wifi size={32} className="text-slate-600 mx-auto mb-3" />
                <p className="text-sm font-semibold text-white mb-1">No alerts found</p>
                <p className="text-xs text-slate-500">All clear for the selected filters.</p>
                <button onClick={() => { setSearch(""); setFilter("All"); }} className="mt-4 px-4 py-2 text-xs rounded-xl bg-ocean-500/20 text-ocean-300 border border-ocean-400/30">
                  Reset filters
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {filtered.map((alert, i) => (
                    <AlertCard
                      key={alert.id}
                      alert={alert}
                      index={i}
                      onResolve={handleResolve}
                      onDismiss={handleDismiss}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </main>
      </div>

      <MobileNav />
    </motion.div>
  );
}
