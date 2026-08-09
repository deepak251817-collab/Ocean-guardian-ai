import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Sparkles,
  Clock,
  Zap,
  FileDown,
  BellRing,
  PlusCircle,
  ShieldAlert,
  Globe,
  Waves,
  AlertTriangle,
  Map,
  BarChart3,
  LayoutDashboard,
} from "lucide-react";
import { toast } from "../components/ui/Toast";
import { calculateOceanHealth } from "../utils/oceanHealth";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import MobileNav from "../components/layout/MobileNav";
import AIAssistant from "../components/ui/AIAssistant";
import SkeletonMap from "../components/ui/SkeletonMap";
import OceanDetailsDrawer from "../components/drawer/OceanDetailsDrawer";
import OceanHealthTrendChart from "../components/charts/OceanHealthTrendChart";
import CoralReefHealthChart from "../components/charts/CoralReefHealthChart";
import TemperatureComparisonChart from "../components/charts/TemperatureComparisonChart";
import PlasticPollutionTrendChart from "../components/charts/PlasticPollutionTrendChart";
import MarineSpeciesTrendChart from "../components/charts/MarineSpeciesTrendChart";
import TemperatureChart from "../components/charts/TemperatureChart";
import PollutionChart from "../components/charts/PollutionChart";
import PHChart from "../components/charts/PHChart";
import SmartInsightsPanel from "../components/ui/SmartInsightsPanel";
import ActivityTimeline from "../components/ui/ActivityTimeline";
import { mapMarkers } from "../data/mockData";

const OceanGlobe = lazy(() => import("../components/map/OceanGlobe"));

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

const VIEW = {
  SUMMARY: "summary",
  MAP: "ocean-map",
  ANALYTICS: "analytics",
};

function ViewSwitcher({ activeView, onChange }) {
  const tabs = [
    { id: VIEW.SUMMARY, label: "Summary", Icon: LayoutDashboard },
    { id: VIEW.MAP, label: "Ocean Map", Icon: Map },
    { id: VIEW.ANALYTICS, label: "Analytics", Icon: BarChart3 },
  ];

  return (
    <div className="max-w-5xl mx-auto mb-5">
      <div className="glass-light rounded-2xl border border-ocean-800/50 p-1 grid grid-cols-3 gap-1">
        {tabs.map(({ id, label, Icon }) => {
          const isActive = activeView === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className={`rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                isActive
                  ? "bg-ocean-400/20 border border-ocean-300/40 text-ocean-200"
                  : "text-slate-400 hover:text-white hover:bg-ocean-900/40"
              }`}
              aria-pressed={isActive}
            >
              <Icon size={14} />
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function WelcomeHeader({ now, dynamicHealthScore }) {
  const navigate = useNavigate();

  const handleRunDiagnosis = () => {
    toast("AI Diagnosis started across 340 ocean nodes...", "info");
  };

  const handleExportBrief = () => {
    toast("Generating Executive PDF Brief (2.4 MB)...", "success");
  };

  const handleLogObservation = () => {
    toast("Field observation form opened", "info");
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass rounded-3xl p-6 border border-ocean-700/50 relative overflow-hidden shadow-2xl max-w-5xl mx-auto"
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-ocean-400/10 via-teal-400/5 to-transparent blur-3xl rounded-full pointer-events-none" />

      <div className="relative z-10 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-ocean-800/60 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-ocean-400/15 border border-ocean-400/30 text-ocean-300 text-[11px] font-semibold flex items-center gap-1.5">
                <Sparkles size={12} className="text-teal-400 animate-spin-slow" />
                AI Environmental Monitor
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-400 font-medium">{now}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Welcome back, Marine Research Team 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Global Ocean Health is operating at{" "}
              <span className="text-teal-300 font-semibold">{dynamicHealthScore}/100</span> — telemetry stream active from 340 monitoring stations.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-ocean-900/60 border border-ocean-800/80 px-3.5 py-2 rounded-2xl shrink-0 w-fit">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
            <div>
              <p className="text-[11px] font-bold text-white leading-none">Live Telemetry</p>
              <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                <Clock size={10} /> Updated 2 mins ago
              </p>
            </div>
          </div>
        </div>

        <div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Quick Actions</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRunDiagnosis}
              className="flex items-center gap-2.5 px-4 py-3 rounded-2xl glass-light border border-ocean-400/30 hover:border-ocean-300/60 text-slate-200 hover:text-white transition-all text-xs font-semibold text-left cursor-pointer group"
            >
              <div className="p-2 rounded-xl bg-ocean-400/20 text-ocean-300 group-hover:bg-ocean-400/30 transition-colors shrink-0">
                <Zap size={15} />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-white truncate">Run AI Diagnosis</p>
                <p className="text-[10px] text-slate-400 truncate">Scan 340 nodes</p>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleExportBrief}
              className="flex items-center gap-2.5 px-4 py-3 rounded-2xl glass-light border border-teal-400/30 hover:border-teal-300/60 text-slate-200 hover:text-white transition-all text-xs font-semibold text-left cursor-pointer group"
            >
              <div className="p-2 rounded-xl bg-teal-400/20 text-teal-300 group-hover:bg-teal-400/30 transition-colors shrink-0">
                <FileDown size={15} />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-white truncate">Export PDF Brief</p>
                <p className="text-[10px] text-slate-400 truncate">Weekly summary</p>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/alerts")}
              className="flex items-center gap-2.5 px-4 py-3 rounded-2xl glass-light border border-red-400/30 hover:border-red-300/60 text-slate-200 hover:text-white transition-all text-xs font-semibold text-left cursor-pointer group"
            >
              <div className="p-2 rounded-xl bg-red-400/20 text-red-300 group-hover:bg-red-400/30 transition-colors shrink-0">
                <BellRing size={15} />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-white truncate">View Alerts (3)</p>
                <p className="text-[10px] text-slate-400 truncate">Critical events</p>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogObservation}
              className="flex items-center gap-2.5 px-4 py-3 rounded-2xl glass-light border border-purple-400/30 hover:border-purple-300/60 text-slate-200 hover:text-white transition-all text-xs font-semibold text-left cursor-pointer group"
            >
              <div className="p-2 rounded-xl bg-purple-400/20 text-purple-300 group-hover:bg-purple-400/30 transition-colors shrink-0">
                <PlusCircle size={15} />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-white truncate">Log Observation</p>
                <p className="text-[10px] text-slate-400 truncate">Field record</p>
              </div>
            </motion.button>
          </div>
        </div>

        <div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Ocean Summary</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="glass-light rounded-2xl p-4 border border-ocean-800/60 flex items-start justify-between">
              <div>
                <p className="text-[11px] text-slate-400 font-medium">Global Composite Index</p>
                <p className="text-xl font-bold text-teal-300 mt-1">{dynamicHealthScore} / 100</p>
                <p className="text-[10px] text-teal-400 font-medium mt-1">↑ +3.2% from last month</p>
              </div>
              <div className="p-2 rounded-xl bg-teal-400/10 text-teal-400">
                <Waves size={16} />
              </div>
            </div>

            <div className="glass-light rounded-2xl p-4 border border-ocean-800/60 flex items-start justify-between">
              <div>
                <p className="text-[11px] text-slate-400 font-medium">Bleaching Risk Index</p>
                <p className="text-xl font-bold text-red-400 mt-1">Level 3 (High)</p>
                <p className="text-[10px] text-red-400 font-medium mt-1">Great Barrier Reef alert</p>
              </div>
              <div className="p-2 rounded-xl bg-red-400/10 text-red-400">
                <ShieldAlert size={16} />
              </div>
            </div>

            <div className="glass-light rounded-2xl p-4 border border-ocean-800/60 flex items-start justify-between">
              <div>
                <p className="text-[11px] text-slate-400 font-medium">Acidification Level</p>
                <p className="text-xl font-bold text-amber-300 mt-1">pH 8.04</p>
                <p className="text-[10px] text-amber-400 font-medium mt-1">↓ -0.02 below baseline</p>
              </div>
              <div className="p-2 rounded-xl bg-amber-400/10 text-amber-400">
                <AlertTriangle size={16} />
              </div>
            </div>

            <div className="glass-light rounded-2xl p-4 border border-ocean-800/60 flex items-start justify-between">
              <div>
                <p className="text-[11px] text-slate-400 font-medium">Ocean Cleanup Missions</p>
                <p className="text-xl font-bold text-cyan-300 mt-1">12 Active</p>
                <p className="text-[10px] text-cyan-400 font-medium mt-1">14.2 tons removed this week</p>
              </div>
              <div className="p-2 rounded-xl bg-cyan-400/10 text-cyan-400">
                <Globe size={16} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function OceanMapView({ selectedRegion, onSelectRegion }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass rounded-3xl border border-ocean-700/50 overflow-hidden shadow-2xl max-w-6xl mx-auto"
    >
      <div className="px-5 pt-5 pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white">Ocean Digital Twin</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {mapMarkers.length} active stations — click regions to inspect details
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse-slow" />
          <span className="text-xs text-teal-400 font-medium">Live</span>
        </div>
      </div>
      <div style={{ height: 480 }}>
        <Suspense fallback={<SkeletonMap />}>
          <OceanGlobe
            markers={mapMarkers}
            selectedRegion={selectedRegion}
            onSelectRegion={onSelectRegion}
          />
        </Suspense>
      </div>
    </motion.section>
  );
}

function AnalyticsView() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4 max-w-6xl mx-auto"
    >
      <div className="glass rounded-2xl p-5 border border-ocean-700/50">
        <h2 className="text-base font-bold text-white">Ocean Analytics & Smart Insights</h2>
        <p className="text-xs text-slate-400 mt-1">
          Trend charts, comparative analysis, and AI-generated insights for operational decisions.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <OceanHealthTrendChart />
        <CoralReefHealthChart />
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <TemperatureComparisonChart />
        <PlasticPollutionTrendChart />
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <MarineSpeciesTrendChart />
        <TemperatureChart />
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <PollutionChart />
        <PHChart />
      </div>

      <section>
        <ActivityTimeline />
      </section>

      <div className="glass rounded-2xl p-5 border border-ocean-700/50">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={14} className="text-ocean-300" />
          <h3 className="text-sm font-semibold text-white">Smart Insights</h3>
        </div>
        <SmartInsightsPanel />
      </div>
    </motion.section>
  );
}

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [isRegionDrawerOpen, setIsRegionDrawerOpen] = useState(false);

  const now = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const view = useMemo(() => {
    const raw = searchParams.get("view");
    if (raw === VIEW.MAP || raw === VIEW.ANALYTICS || raw === VIEW.SUMMARY) return raw;
    return VIEW.SUMMARY;
  }, [searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 650);
    return () => clearTimeout(timer);
  }, [view]);

  const dynamicHealthScore = calculateOceanHealth();

  const handleViewChange = (nextView) => {
    if (nextView === VIEW.SUMMARY) {
      setSearchParams({});
      return;
    }
    setSearchParams({ view: nextView });
  };

  const handleRegionSelect = (region) => {
    if (!region) {
      setSelectedRegion(null);
      setIsRegionDrawerOpen(false);
      return;
    }

    setSelectedRegion(region);
    setIsRegionDrawerOpen(true);
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.35 }}
      className="min-h-screen bg-ocean-gradient flex flex-col"
    >
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      <Navbar variant="dashboard" />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto pb-24 lg:pb-8" id="main-content" aria-label="Dashboard main content">
          <div className="px-4 sm:px-6 py-8">
            <ViewSwitcher activeView={view} onChange={handleViewChange} />

            {isLoading ? (
              <div className="max-w-6xl mx-auto animate-pulse">
                <div className="glass rounded-3xl p-6 border border-ocean-700/50 space-y-4">
                  <div className="h-6 w-72 bg-ocean-800/50 rounded" />
                  <div className="h-4 w-96 bg-ocean-800/40 rounded" />
                  <div className="h-64 rounded-2xl bg-ocean-800/40" />
                </div>
              </div>
            ) : view === VIEW.MAP ? (
              <OceanMapView selectedRegion={selectedRegion} onSelectRegion={handleRegionSelect} />
            ) : view === VIEW.ANALYTICS ? (
              <AnalyticsView />
            ) : (
              <WelcomeHeader now={now} dynamicHealthScore={dynamicHealthScore} />
            )}
          </div>
        </main>
      </div>

      <MobileNav />
      <AIAssistant />

      <OceanDetailsDrawer
        isOpen={isRegionDrawerOpen && Boolean(selectedRegion)}
        onClose={() => handleRegionSelect(null)}
        data={selectedRegion}
      />
    </motion.div>
  );
}
