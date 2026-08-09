// src/pages/ReportsPage.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye, Download, RefreshCw, FileBarChart2, Loader2, Search,
  Clock, CheckCircle2, History, FileSpreadsheet,
} from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import MobileNav from "../components/layout/MobileNav";
import PageHeader from "../components/layout/PageHeader";
import ErrorState from "../components/ui/ErrorState";
import { reportsData } from "../data/reportsData";
import { toast } from "../components/ui/Toast";

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -8 },
};

const TABS = ["Weekly", "Monthly", "Annual"];

const reportHistory = [
  { id: 1, event: "Weekly Summary compiled", time: "10 mins ago", type: "success" },
  { id: 2, event: "Q2 Coral Reef Assessment generated", time: "2 hours ago", type: "success" },
  { id: 3, event: "Monthly Pollution Index compilation failed", time: "1 day ago", type: "error" },
  { id: 4, event: "Annual Ocean Census 2025 archived", time: "3 days ago", type: "info" },
];

function toSafeFileName(input) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function triggerDownload(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Revoke on next tick to ensure the browser has consumed the URL.
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

function buildCsvContent(report) {
  const rows = [
    ["Field", "Value"],
    ["Title", report.title],
    ["Subtitle", report.subtitle],
    ["Type", report.type],
    ["Pages", String(report.pages)],
    ["Size", report.size],
    ["Summary", report.summary],
    ["Generated At", new Date().toISOString()],
  ];

  return rows
    .map((cols) =>
      cols
        .map((value) => `"${String(value).replace(/"/g, '""')}"`)
        .join(",")
    )
    .join("\n");
}

function buildPdfFallbackText(report) {
  return [
    "Ocean Guardian AI - Report Export",
    "",
    `Title: ${report.title}`,
    `Subtitle: ${report.subtitle}`,
    `Type: ${report.type}`,
    `Pages: ${report.pages}`,
    `Size: ${report.size}`,
    "",
    "Summary:",
    report.summary,
    "",
    `Generated At: ${new Date().toUTCString()}`,
  ].join("\n");
}

function ReportCardSkeleton() {
  return (
    <div className="glass rounded-2xl overflow-hidden border border-ocean-800/60 animate-pulse">
      <div className="h-28 bg-ocean-800/40" />
      <div className="p-5 space-y-3">
        <div className="w-48 h-4 rounded bg-ocean-800/50" />
        <div className="w-32 h-3 rounded bg-ocean-800/40" />
        <div className="w-full h-2 rounded-full bg-ocean-800/40" />
        <div className="grid grid-cols-2 gap-2">
          <div className="h-8 rounded-lg bg-ocean-800/40" />
          <div className="h-8 rounded-lg bg-ocean-800/40" />
        </div>
      </div>
    </div>
  );
}

function ReportCard({ report, index: _index }) {
  const [loadingAction, setLoadingAction] = useState(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [status, setStatus] = useState("Completed"); // Completed, Generating, Draft
  const [generatedTime, setGeneratedTime] = useState(
    `Jul 24, ${18 - ((_index + 1) * 2)}:30 UTC`
  );

  const runAction = async (action, _label) => {
    if (loadingAction) return;
    setLoadingAction(action);
    setDownloadProgress(0);

    if (action === "pdf" || action === "csv") {
      // Simulate download progress
      setStatus("Downloading");
      for (let p = 0; p <= 100; p += 10) {
        setDownloadProgress(p);
        await new Promise((res) => setTimeout(res, 120));
      }

      const baseName = toSafeFileName(report.title) || "ocean-report";

      if (action === "csv") {
        const csv = buildCsvContent(report);
        const csvBlob = new Blob([csv], { type: "text/csv;charset=utf-8" });
        triggerDownload(csvBlob, `${baseName}.csv`);
      } else {
        const pdfLikeText = buildPdfFallbackText(report);
        const pdfBlob = new Blob([pdfLikeText], { type: "application/pdf" });
        triggerDownload(pdfBlob, `${baseName}.pdf`);
      }

      setStatus("Completed");
      toast(`Downloaded ${action.toUpperCase()}: ${report.title} (${report.size})`, "success");
    } else if (action === "generate") {
      setStatus("Generating");
      await new Promise((res) => setTimeout(res, 2000));
      setStatus("Completed");
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setGeneratedTime(`Today, ${now} UTC`);
      toast(`Regenerated Report: ${report.title}`, "success");
    } else {
      await new Promise((res) => setTimeout(res, 1000));
      toast(`Preview Opened: ${report.title}`, "info");
    }
    
    setLoadingAction(null);
  };

  const statusColors = {
    Completed: "text-teal-400 bg-teal-400/10 border-teal-400/20",
    Generating: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    Downloading: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
    Draft: "text-slate-400 bg-slate-400/10 border-slate-400/20",
  };

  const actions = [
    { id: "preview",  label: "Preview",  Icon: Eye,       color: "text-ocean-300 bg-ocean-800/50 hover:bg-ocean-700/60 border-ocean-700/40" },
    { id: "generate", label: "Generate", Icon: RefreshCw, color: "text-teal-400 bg-teal-400/10 hover:bg-teal-400/20 border-teal-400/20" },
    { id: "pdf",      label: "PDF",      Icon: Download,  color: "text-amber-400 bg-amber-400/10 hover:bg-amber-400/20 border-amber-400/20" },
    { id: "csv",      label: "CSV",      Icon: FileSpreadsheet, color: "text-purple-400 bg-purple-400/10 hover:bg-purple-400/20 border-purple-400/20" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      transition={{ duration: 0.4, delay: _index * 0.05 }}
      className="glass rounded-2xl overflow-hidden border border-ocean-800/60 hover:border-ocean-600/40 transition-all flex flex-col justify-between"
    >
      <div>
        {/* Gradient thumbnail */}
        <div className={`relative h-28 bg-gradient-to-br ${report.gradient} flex items-center justify-center overflow-hidden shrink-0`}>
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.3)_0%,_transparent_70%)]" />
          <FileBarChart2 size={40} className="text-white/60" />
          <div className="absolute top-3 right-3 text-[10px] font-semibold bg-black/30 text-white rounded-full px-2 py-0.5">
            {report.pages} pages
          </div>
          {/* Status Badge */}
          <div className={`absolute top-3 left-3 text-[10px] font-semibold rounded-full px-2 py-0.5 border ${statusColors[status] || statusColors.Completed}`}>
            {status}
          </div>
          <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-ocean-900/80 to-transparent" />
        </div>

        <div className="p-5 space-y-3">
          {/* Title */}
          <div>
            <h3 className="text-sm font-bold text-white leading-snug">{report.title}</h3>
            <p className="text-xs text-ocean-300/80 mt-0.5">{report.subtitle}</p>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-500">
            <span className="flex items-center gap-1"><Clock size={11} /> {generatedTime}</span>
            <span>{report.size}</span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{report.summary}</p>
        </div>
      </div>

      <div className="px-5 pb-5 space-y-3">
        {/* Progress indicator (Download/Generation) */}
        {loadingAction && (
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-slate-400">
              <span className="capitalize">{loadingAction === "generate" ? "Compiling Report..." : "Downloading..."}</span>
              <span>{loadingAction === "generate" ? "Processing..." : `${downloadProgress}%`}</span>
            </div>
            <div className="w-full h-1 bg-ocean-800/80 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-400 transition-all duration-100"
                style={{ width: loadingAction === "generate" ? "70%" : `${downloadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-2">
          {actions.map(({ id, label, Icon }) => {
            const isLoading = loadingAction === id;
            return (
              <button
                key={id}
                onClick={() => runAction(id, label)}
                disabled={loadingAction !== null}
                className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${actions.find(a => a.id === id).color}`}
                aria-label={`${label} for ${report.title}`}
              >
                {isLoading ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Icon size={12} />
                )}
                {isLoading ? "Processing…" : label}
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

export default function ReportsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [activeTab, setActiveTab] = useState("Weekly");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => { const t = setTimeout(() => setIsLoading(false), 900); return () => clearTimeout(t); }, []);

  const handleRetry = () => {
    setIsError(false);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 800);
  };

  const displayed = reportsData.filter((r) => {
    const matchesTab = r.type === activeTab.toLowerCase();
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      r.title.toLowerCase().includes(query) ||
      r.subtitle.toLowerCase().includes(query) ||
      r.summary.toLowerCase().includes(query) ||
      r.size.toLowerCase().includes(query);

    return matchesTab && matchesSearch;
  });

  const hasSearch = searchQuery.trim().length > 0;

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
            title="Reports & Documentation"
            subtitle="Download, preview, and generate policy & scientific ocean health reports"
            breadcrumbs={[{ label: "Reports" }]}
          />

          <div className="px-4 sm:px-6 py-6 grid lg:grid-cols-3 gap-6">
            {/* Left/Middle: Reports catalog */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex gap-2 glass-light border border-ocean-800/40 rounded-xl p-1 w-fit">
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${activeTab === tab ? "bg-ocean-500/20 text-ocean-300 border border-ocean-400/30" : "text-slate-500 hover:text-slate-300"}`}
                    aria-pressed={activeTab === tab}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="glass-light border border-ocean-800/40 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="relative flex-1">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search reports by title, subtitle, summary, or size"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-ocean-900/50 border border-ocean-800/60 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-ocean-400/40 transition-all"
                    aria-label="Search reports"
                  />
                </div>
                {hasSearch && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="shrink-0 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 border border-ocean-800/60 hover:border-ocean-600/50 hover:text-white transition-all"
                  >
                    Clear search
                  </button>
                )}
              </div>

              {!isLoading && (
                <p className="text-xs text-slate-500">
                  Showing <span className="font-semibold text-slate-300">{displayed.length}</span> {activeTab.toLowerCase()} reports available
                </p>
              )}

              {isError ? (
                <ErrorState
                  title="Report Generation System Offline"
                  description="Unable to compile report archives."
                  onRetry={handleRetry}
                />
              ) : isLoading ? (
                <div className="grid sm:grid-cols-2 gap-5">
                  {Array.from({ length: 4 }).map((_, i) => <ReportCardSkeleton key={i} />)}
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  {displayed.length > 0 ? (
                    <motion.div
                      key={`${activeTab}-${searchQuery}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                      className="grid sm:grid-cols-2 gap-5"
                    >
                      {displayed.map((r, i) => (
                        <ReportCard key={r.id} report={r} index={i} />
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="no-results"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className="glass rounded-2xl border border-ocean-800/60 p-8 text-center"
                    >
                      <FileBarChart2 size={32} className="mx-auto text-ocean-300/70 mb-3" />
                      <h3 className="text-base font-semibold text-white mb-2">No reports match this search</h3>
                      <p className="text-sm text-slate-400 max-w-md mx-auto">
                        Try a different keyword or clear the search to view all {activeTab.toLowerCase()} reports.
                      </p>
                      {hasSearch && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery("")}
                          className="mt-4 px-4 py-2 rounded-xl bg-ocean-500/20 text-ocean-200 border border-ocean-400/30 text-sm font-semibold hover:bg-ocean-500/30 transition-all"
                        >
                          Clear search
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>

            {/* Right: History Timeline & System status */}
            <div className="space-y-6">
              {/* History Timeline Card */}
              <div className="glass rounded-2xl p-5 border border-ocean-800/60 space-y-4">
                <div className="flex items-center gap-2">
                  <History size={16} className="text-ocean-300" />
                  <h3 className="text-sm font-semibold text-white">Generation History</h3>
                </div>
                <div className="relative pl-4 space-y-4 before:absolute before:left-1.5 before:top-1.5 before:bottom-1.5 before:w-0.5 before:bg-ocean-800/60">
                  {reportHistory.map((item) => (
                    <div key={item.id} className="relative text-xs">
                      <div className={`absolute -left-4.5 top-1.5 w-2 h-2 rounded-full ${item.type === "error" ? "bg-red-400" : item.type === "info" ? "bg-ocean-400" : "bg-teal-400"}`} />
                      <p className="font-medium text-slate-200">{item.event}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{item.time}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Summary */}
              <div className="glass rounded-2xl p-5 border border-ocean-800/60 space-y-3">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Report System Status</h3>
                <div className="flex items-center justify-between text-xs py-1.5 border-b border-ocean-800/40">
                  <span className="text-slate-400">PDF Rendering Engine</span>
                  <span className="text-teal-400 font-semibold flex items-center gap-1"><CheckCircle2 size={12} /> Operational</span>
                </div>
                <div className="flex items-center justify-between text-xs py-1.5 border-b border-ocean-800/40">
                  <span className="text-slate-400">CSV Export Core</span>
                  <span className="text-teal-400 font-semibold flex items-center gap-1"><CheckCircle2 size={12} /> Operational</span>
                </div>
                <div className="flex items-center justify-between text-xs py-1.5">
                  <span className="text-slate-400">Archival Backup</span>
                  <span className="text-teal-400 font-semibold flex items-center gap-1"><CheckCircle2 size={12} /> 100% Synced</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <MobileNav />
    </motion.div>
  );
}
