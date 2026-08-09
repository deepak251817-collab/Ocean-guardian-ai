// src/pages/PollutionPage.jsx
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, X, AlertTriangle, TrendingUp, TrendingDown, Minus,
  Package, FlaskConical, Droplets, Atom, Thermometer, MapPin,
  Lightbulb, Clock, ChevronRight,
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import MobileNav from "../components/layout/MobileNav";
import PageHeader from "../components/layout/PageHeader";
import ErrorState from "../components/ui/ErrorState";
import { useDebounce } from "../utils/useDebounce";
import { pollutionCategories } from "../data/mockPollution";

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -8 },
};

const ICON_MAP = { Package, FlaskConical, Droplets, Atom, Thermometer };
const SEVERITY_MAP = {
  Critical: { bg: "bg-red-400/15 border-red-400/30",    text: "text-red-400",   dot: "bg-red-400"   },
  High:     { bg: "bg-amber-400/15 border-amber-400/30", text: "text-amber-400", dot: "bg-amber-400" },
  Medium:   { bg: "bg-orange-400/15 border-orange-400/30", text: "text-orange-400", dot: "bg-orange-400" },
  Low:      { bg: "bg-teal-400/15 border-teal-400/30",  text: "text-teal-400",  dot: "bg-teal-400"  },
};
const STATUS_COLOR = {
  "Active Incident": "text-red-400",
  "Worsening":       "text-amber-400",
  "Escalating":      "text-orange-400",
  "Stable":          "text-teal-400",
  "Monitoring":      "text-ocean-300",
};
const FILTERS = ["All", "Critical", "High", "Medium", "Low"];

// ── Skeleton ──────────────────────────────────────────────────────────────
function PollutionCardSkeleton() {
  return (
    <div className="glass rounded-2xl p-5 border border-ocean-800/60 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-ocean-800/50" />
        <div className="w-20 h-6 rounded-full bg-ocean-800/50" />
      </div>
      <div className="w-36 h-5 rounded bg-ocean-800/50 mb-2" />
      <div className="w-24 h-3 rounded bg-ocean-800/40 mb-4" />
      <div className="space-y-2">
        <div className="w-full h-3 rounded bg-ocean-800/40" />
        <div className="w-3/4 h-3 rounded bg-ocean-800/40" />
      </div>
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────
function PollutionModal({ item, onClose }) {
  const backdropRef = useRef(null);
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!item) return null;
  const Icon = ICON_MAP[item.icon] || AlertTriangle;
  const sev = SEVERITY_MAP[item.severity] || SEVERITY_MAP.Medium;

  const tabs = [
    { id: "overview",  label: "Overview"  },
    { id: "causes",    label: "Causes"    },
    { id: "actions",   label: "Actions"   },
    { id: "activity",  label: "Activity"  },
  ];

  return (
    <AnimatePresence>
      <motion.div
        ref={backdropRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
        onClick={(e) => { if (e.target === backdropRef.current) onClose(); }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 340, damping: 28 }}
          className="w-full sm:max-w-2xl max-h-[90vh] glass border border-ocean-700/50 rounded-t-3xl sm:rounded-2xl overflow-hidden flex flex-col shadow-2xl"
          role="dialog"
          aria-modal="true"
          aria-label={item.name}
        >
          {/* Header */}
          <div className="flex items-start gap-4 px-6 py-5 border-b border-ocean-700/40 shrink-0">
            <div className="p-3 rounded-2xl bg-ocean-800/60 border border-ocean-700/40">
              <Icon size={22} className={sev.text} />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-bold text-white">{item.name}</h2>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${sev.bg} ${sev.text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${sev.dot}`} />{item.severity}
                </span>
                <span className={`text-xs font-medium ${STATUS_COLOR[item.status] || "text-slate-400"}`}>
                  ● {item.status}
                </span>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-ocean-800/40 transition-all" aria-label="Close modal">
              <X size={18} />
            </button>
          </div>

          {/* Tab nav */}
          <div className="flex gap-1 px-6 pt-4 pb-0 shrink-0 border-b border-ocean-700/30">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-all ${tab === t.id ? "text-ocean-300 border-b-2 border-ocean-300" : "text-slate-500 hover:text-slate-300"}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {tab === "overview" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                <p className="text-sm text-slate-300 leading-relaxed">{item.description}</p>

                {/* Affected oceans */}
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Affected Oceans</p>
                  <div className="flex flex-wrap gap-2">
                    {item.affectedOceans.map((o) => (
                      <span key={o} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg glass-light border border-ocean-700/40 text-xs text-slate-300">
                        <MapPin size={11} className="text-ocean-400" />{o}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Severity trend chart */}
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Severity Trend</p>
                  <div className="glass-light rounded-xl p-3 border border-ocean-700/30">
                    <ResponsiveContainer width="100%" height={120}>
                      <LineChart data={item.recentTrend} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                        <XAxis dataKey="month" tick={{ fill: "rgba(100,116,139,0.8)", fontSize: 10 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: "rgba(100,116,139,0.8)", fontSize: 10 }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: "rgba(7,21,38,0.95)", border: "1px solid rgba(6,182,212,0.2)", borderRadius: 8, fontSize: 12 }} />
                        <Line type="monotone" dataKey="value" stroke={sev.dot === "bg-red-400" ? "#f87171" : sev.dot === "bg-amber-400" ? "#fbbf24" : "#22d3ee"} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </motion.div>
            )}

            {tab === "causes" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                <p className="text-xs text-slate-500 mb-4">Root causes driving {item.name.toLowerCase()} in monitored ocean zones.</p>
                {item.causes.map((cause, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-start gap-3 glass-light rounded-xl p-3 border border-ocean-700/30"
                  >
                    <span className="text-xs font-bold text-ocean-300 mt-0.5 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                    <p className="text-sm text-slate-300">{cause}</p>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {tab === "actions" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                <p className="text-xs text-slate-500 mb-4">AI-recommended interventions based on current data patterns.</p>
                {item.suggestedActions.map((action, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-start gap-3 glass-light rounded-xl p-3 border border-teal-400/20"
                  >
                    <Lightbulb size={14} className="text-teal-400 mt-0.5 shrink-0" />
                    <p className="text-sm text-slate-300">{action}</p>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {tab === "activity" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                <p className="text-xs text-slate-500 mb-4">Latest system events and sensor observations.</p>
                {item.recentActivity.map((act, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3 glass-light rounded-xl p-3 border border-ocean-700/30"
                  >
                    <Clock size={13} className="text-ocean-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm text-slate-200 leading-snug">{act.event}</p>
                      <p className="text-[10px] text-slate-500 mt-1">{act.time}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Pollution Card ────────────────────────────────────────────────────────
function PollutionCard({ item, index, onClick }) {
  const Icon = ICON_MAP[item.icon] || AlertTriangle;
  const sev = SEVERITY_MAP[item.severity] || SEVERITY_MAP.Medium;
  const lastVal = item.recentTrend[item.recentTrend.length - 1]?.value;
  const prevVal = item.recentTrend[item.recentTrend.length - 2]?.value;
  const trending = lastVal > prevVal ? "up" : lastVal < prevVal ? "down" : "flat";

  return (
    <motion.button
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      onClick={onClick}
      className="w-full text-left glass rounded-2xl p-5 border border-ocean-800/60 hover:border-ocean-500/40 card-hover transition-all cursor-pointer group"
      aria-label={`View details for ${item.name}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-2.5 rounded-xl bg-ocean-800/50 border border-ocean-700/40 group-hover:bg-ocean-700/50 transition-colors">
          <Icon size={18} className={sev.text} />
        </div>
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${sev.bg} ${sev.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${sev.dot} animate-pulse`} />
          {item.severity}
        </span>
      </div>

      <h3 className="text-sm font-bold text-white mb-1">{item.name}</h3>
      <p className={`text-xs font-medium mb-3 ${STATUS_COLOR[item.status] || "text-slate-400"}`}>● {item.status}</p>

      {/* Trend sparkline values */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          {trending === "up" ? <TrendingUp size={13} className="text-red-400" /> : trending === "down" ? <TrendingDown size={13} className="text-teal-400" /> : <Minus size={13} />}
          <span>{trending === "up" ? "Rising" : trending === "down" ? "Improving" : "Stable"}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <MapPin size={11} />
          <span>{item.affectedRegions.length} regions</span>
        </div>
      </div>

      {/* Region pills */}
      <div className="flex flex-wrap gap-1 mb-4">
        {item.affectedRegions.slice(0, 2).map((r) => (
          <span key={r} className="text-[10px] px-2 py-0.5 rounded-lg bg-ocean-800/40 border border-ocean-700/30 text-slate-400">{r}</span>
        ))}
        {item.affectedRegions.length > 2 && (
          <span className="text-[10px] px-2 py-0.5 rounded-lg bg-ocean-800/40 border border-ocean-700/30 text-slate-400">+{item.affectedRegions.length - 2}</span>
        )}
      </div>

      <div className="flex items-center gap-1 text-xs text-ocean-300 font-medium group-hover:gap-2 transition-all">
        View Details <ChevronRight size={13} />
      </div>
    </motion.button>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────
export default function PollutionPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 200);
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);

  useEffect(() => { const t = setTimeout(() => setIsLoading(false), 900); return () => clearTimeout(t); }, []);

  const handleRetry = () => {
    setIsError(false);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 800);
  };

  const filtered = pollutionCategories.filter((c) => {
    const matchSearch = !debouncedSearch || c.name.toLowerCase().includes(debouncedSearch.toLowerCase()) || c.severity.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchFilter = filter === "All" || c.severity === filter;
    return matchSearch && matchFilter;
  });

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.35 }} className="min-h-screen bg-ocean-gradient flex flex-col">
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      <Navbar variant="dashboard" />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto pb-24 lg:pb-8" id="main-content">
          {/* Page header */}
          <PageHeader
            title="Pollution Monitoring"
            subtitle="Real-time pollution tracking & risk assessment across 340 ocean monitoring stations"
            breadcrumbs={[{ label: "Pollution Monitoring" }]}
          />

          <div className="px-4 sm:px-6 py-6 space-y-6">
            {/* Search + Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search pollution types…"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-ocean-800/50 border border-ocean-800/60 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-ocean-300/40 transition-all"
                  aria-label="Search pollution"
                />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {FILTERS.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    aria-pressed={filter === f}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${filter === f ? "bg-ocean-400/20 text-ocean-300 border border-ocean-300/40" : "glass-light text-slate-400 hover:text-slate-200 border border-ocean-800/40"}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Cards grid */}
            {isError ? (
              <ErrorState
                title="Pollution Feed Unavailable"
                description="Unable to reach pollution telemetry network."
                onRetry={handleRetry}
              />
            ) : isLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 5 }).map((_, i) => <PollutionCardSkeleton key={i} />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="glass rounded-2xl p-12 border border-ocean-800/60 text-center">
                <AlertTriangle size={32} className="text-slate-600 mx-auto mb-3" />
                <p className="text-sm font-semibold text-white mb-1">No results found</p>
                <p className="text-xs text-slate-500">Try adjusting your search or filter.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((item, i) => (
                  <PollutionCard key={item.id} item={item} index={i} onClick={() => setSelected(item)} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      <MobileNav />

      {/* Modal */}
      <AnimatePresence>
        {selected && <PollutionModal item={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </motion.div>
  );
}
