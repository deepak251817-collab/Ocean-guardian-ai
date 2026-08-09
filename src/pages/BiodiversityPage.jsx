// src/pages/BiodiversityPage.jsx
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, X, TrendingUp, TrendingDown, Minus, Shield,
  MapPin, AlertTriangle, Heart, ChevronRight,
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import MobileNav from "../components/layout/MobileNav";
import PageHeader from "../components/layout/PageHeader";
import ErrorState from "../components/ui/ErrorState";
import { useDebounce } from "../utils/useDebounce";
import { speciesData } from "../data/biodiversityData";

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -8 },
};

const THREAT_STYLES = {
  "Endangered":              { bg: "bg-red-400/15 border-red-400/30",    text: "text-red-400"    },
  "Critically Threatened":   { bg: "bg-red-500/20 border-red-500/40",    text: "text-red-300"    },
  "Vulnerable":              { bg: "bg-amber-400/15 border-amber-400/30", text: "text-amber-400"  },
  "Least Concern":           { bg: "bg-teal-400/15 border-teal-400/30",   text: "text-teal-400"   },
};

const FILTER_OPTIONS = ["All", "Declining", "Stable", "Recovering"];

// ── Skeleton ────────────────────────────────────────────────────────────────
function SpeciesCardSkeleton() {
  return (
    <div className="glass rounded-2xl overflow-hidden border border-ocean-800/60 animate-pulse">
      <div className="h-40 bg-ocean-800/40" />
      <div className="p-4 space-y-3">
        <div className="w-32 h-5 rounded bg-ocean-800/50" />
        <div className="w-24 h-3 rounded bg-ocean-800/40" />
        <div className="flex gap-2">
          <div className="w-20 h-5 rounded-full bg-ocean-800/40" />
          <div className="w-20 h-5 rounded-full bg-ocean-800/40" />
        </div>
        <div className="w-full h-2 rounded-full bg-ocean-800/40" />
      </div>
    </div>
  );
}

// ── Health Score Bar ─────────────────────────────────────────────────────────
function HealthBar({ score }) {
  const color = score >= 70 ? "#2dd4bf" : score >= 50 ? "#fbbf24" : "#f87171";
  return (
    <div>
      <div className="flex justify-between text-[10px] text-slate-500 mb-1">
        <span>Health Score</span>
        <span className="font-medium" style={{ color }}>{score}/100</span>
      </div>
      <div className="w-full h-1.5 bg-ocean-800/50 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
    </div>
  );
}

// ── Species Modal ────────────────────────────────────────────────────────────
function SpeciesModal({ species, onClose }) {
  const backdropRef = useRef(null);
  const [tab, setTab] = useState("info");

  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  if (!species) return null;
  const threat = THREAT_STYLES[species.threatLevel] || THREAT_STYLES.Vulnerable;

  const tabs = [
    { id: "info",     label: "Species Info"  },
    { id: "threats",  label: "Threats"       },
    { id: "history",  label: "Population"    },
    { id: "actions",  label: "Conservation"  },
  ];

  return (
    <motion.div
      ref={backdropRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => { if (e.target === backdropRef.current) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ type: "spring", stiffness: 340, damping: 28 }}
        className="w-full sm:max-w-2xl max-h-[90vh] glass border border-ocean-700/50 rounded-t-3xl sm:rounded-2xl overflow-hidden flex flex-col shadow-2xl"
        role="dialog"
        aria-modal="true"
      >
        {/* Hero banner */}
        <div className={`relative h-36 bg-gradient-to-br ${species.gradient} flex items-center justify-center shrink-0`}>
          <span className="text-7xl select-none" role="img" aria-label={species.name}>{species.emoji}</span>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-black/30 text-white hover:bg-black/50 transition-all"
            aria-label="Close"
          >
            <X size={18} />
          </button>
          <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-ocean-900/90 to-transparent" />
        </div>

        {/* Title */}
        <div className="px-6 pt-4 pb-0 shrink-0">
          <div className="flex items-start justify-between gap-3 mb-1">
            <h2 className="text-lg font-bold text-white">{species.name}</h2>
            <span className={`shrink-0 mt-0.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${threat.bg} ${threat.text}`}>
              {species.threatLevel}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span>Pop: {species.population}</span>
            <span>·</span>
            <span className={`font-semibold ${species.trend === "recovering" ? "text-teal-400" : species.trend === "declining" ? "text-red-400" : "text-slate-300"}`}>
              {species.trend === "recovering" ? <TrendingUp size={12} className="inline mr-1" /> : species.trend === "declining" ? <TrendingDown size={12} className="inline mr-1" /> : <Minus size={12} className="inline mr-1" />}
              {species.trendPct}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1"><Shield size={11} /> {species.conservationStatus}</span>
          </div>
        </div>

        {/* Tab nav */}
        <div className="flex gap-1 px-6 pt-4 border-b border-ocean-700/30 shrink-0">
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
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {tab === "info" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <p className="text-sm text-slate-300 leading-relaxed">{species.description}</p>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Habitat</p>
                <div className="glass-light rounded-xl p-3 border border-ocean-700/30 text-sm text-slate-300 flex items-start gap-2">
                  <MapPin size={14} className="text-ocean-400 mt-0.5 shrink-0" />{species.habitat}
                </div>
              </div>
              <HealthBar score={species.healthScore} />
            </motion.div>
          )}

          {tab === "threats" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
              <p className="text-xs text-slate-500 mb-2">Key threats driving population changes.</p>
              {species.threats.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-start gap-3 glass-light rounded-xl p-3 border border-red-400/15"
                >
                  <AlertTriangle size={13} className="text-red-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-slate-300">{t}</p>
                </motion.div>
              ))}
            </motion.div>
          )}

          {tab === "history" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <p className="text-xs text-slate-500">Estimated population over time.</p>
              <div className="glass-light rounded-xl p-3 border border-ocean-700/30">
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={species.populationHistory} margin={{ top: 4, right: 4, bottom: 0, left: -8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="year" tick={{ fill: "rgba(100,116,139,0.8)", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "rgba(100,116,139,0.8)", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: "rgba(7,21,38,0.95)", border: "1px solid rgba(6,182,212,0.2)", borderRadius: 8, fontSize: 11 }} />
                    <Line type="monotone" dataKey="count" name="Population" stroke="#22d3ee" strokeWidth={2.5} dot={{ r: 3, fill: "#22d3ee" }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          {tab === "actions" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
              <p className="text-xs text-slate-500 mb-2">Active conservation measures and programmes.</p>
              {species.conservationActions.map((a, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-start gap-3 glass-light rounded-xl p-3 border border-teal-400/20"
                >
                  <Heart size={13} className="text-teal-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-slate-300">{a}</p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Species Card ─────────────────────────────────────────────────────────────
function SpeciesCard({ species, index, onClick }) {
  const threat = THREAT_STYLES[species.threatLevel] || THREAT_STYLES.Vulnerable;
  const TrendIcon = species.trend === "recovering" ? TrendingUp : species.trend === "declining" ? TrendingDown : Minus;
  const trendColor = species.trend === "recovering" ? "text-teal-400" : species.trend === "declining" ? "text-red-400" : "text-slate-400";

  return (
    <motion.button
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.09 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={onClick}
      className="w-full text-left glass rounded-2xl overflow-hidden border border-ocean-800/60 hover:border-ocean-500/40 transition-all group"
      aria-label={`View details for ${species.name}`}
    >
      {/* Image / gradient header */}
      <div className={`relative h-40 bg-gradient-to-br ${species.gradient} flex items-center justify-center overflow-hidden`}>
        <span className="text-6xl select-none group-hover:scale-110 transition-transform duration-300" role="img" aria-label={species.name}>
          {species.emoji}
        </span>
        {/* Overlay health bar */}
        <div className="absolute bottom-0 inset-x-0 px-4 pb-3 pt-8 bg-gradient-to-t from-black/60 to-transparent">
          <div className="flex items-center justify-between text-[10px] text-white/80 mb-1">
            <span>Health</span>
            <span className="font-semibold">{species.healthScore}/100</span>
          </div>
          <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${species.healthScore}%`,
                background: species.healthScore >= 70 ? "#2dd4bf" : species.healthScore >= 50 ? "#fbbf24" : "#f87171",
              }}
            />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-1">
          <h3 className="text-sm font-bold text-white">{species.name}</h3>
          <span className={`text-xs font-semibold ${trendColor} flex items-center gap-0.5`}>
            <TrendIcon size={11} />{species.trendPct}
          </span>
        </div>
        <p className="text-xs text-slate-500 mb-3">Pop: {species.population}</p>

        <div className="flex items-center flex-wrap gap-1.5">
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${threat.bg} ${threat.text}`}>
            {species.threatLevel}
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-ocean-800/40 border border-ocean-700/30 text-slate-400 flex items-center gap-1">
            <Shield size={9} />{species.conservationStatus}
          </span>
        </div>

        <div className="flex items-center gap-1 text-xs text-ocean-300 font-medium mt-3 group-hover:gap-2 transition-all">
          View Details <ChevronRight size={13} />
        </div>
      </div>
    </motion.button>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function BiodiversityPage() {
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

  const filtered = speciesData.filter((s) => {
    const matchSearch = !debouncedSearch || s.name.toLowerCase().includes(debouncedSearch.toLowerCase()) || s.threatLevel.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchFilter = filter === "All" || s.trend === filter.toLowerCase();
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
          {/* Header */}
          <PageHeader
            title="Biodiversity Monitoring"
            subtitle="Tracking 12,847+ marine species & population dynamics across all major ocean zones"
            breadcrumbs={[{ label: "Biodiversity Monitoring" }]}
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
                  placeholder="Search species…"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-ocean-800/50 border border-ocean-800/60 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-ocean-300/40 transition-all"
                  aria-label="Search species"
                />
              </div>
              <div className="flex items-center gap-2">
                {FILTER_OPTIONS.map((f) => (
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

            {/* Grid */}
            {isError ? (
              <ErrorState
                title="Species Tracking Feed Error"
                description="Failed to retrieve bio-sonar telemetry data."
                onRetry={handleRetry}
              />
            ) : isLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 5 }).map((_, i) => <SpeciesCardSkeleton key={i} />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="glass rounded-2xl p-12 border border-ocean-800/60 text-center">
                <Search size={32} className="text-slate-600 mx-auto mb-3" />
                <p className="text-sm font-semibold text-white mb-1">No species found</p>
                <p className="text-xs text-slate-500">Try adjusting your search or filter.</p>
                <button onClick={() => { setSearch(""); setFilter("All"); }} className="mt-4 px-4 py-2 text-xs rounded-xl bg-ocean-500/20 text-ocean-300 border border-ocean-400/30 hover:bg-ocean-500/30 transition-all">
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((s, i) => (
                  <SpeciesCard key={s.id} species={s} index={i} onClick={() => setSelected(s)} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      <MobileNav />

      <AnimatePresence>
        {selected && <SpeciesModal species={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </motion.div>
  );
}
