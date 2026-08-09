import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  LayoutDashboard, ArrowRight, Play, Brain, Globe, AlertTriangle,
  Fish, BarChart3, Shield, Quote, ChevronRight, Waves,
  Activity, Droplets, Thermometer, X, CheckCircle2, ChevronLeft,
} from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { landingStats, features, testimonials } from "../data/mockData";

// Icon map for features
const featureIcons = { Brain, Globe, AlertTriangle, Fish, BarChart3, Shield };

const featureColors = {
  teal: { bg: "bg-teal-400/10", icon: "text-teal-400", border: "border-teal-400/20", glow: "from-teal-400/10" },
  blue: { bg: "bg-ocean-300/10", icon: "text-ocean-300", border: "border-ocean-300/20", glow: "from-ocean-300/10" },
  orange: { bg: "bg-amber-400/10", icon: "text-amber-400", border: "border-amber-400/20", glow: "from-amber-400/10" },
  purple: { bg: "bg-purple-400/10", icon: "text-purple-400", border: "border-purple-400/20", glow: "from-purple-400/10" },
  cyan: { bg: "bg-cyan-400/10", icon: "text-cyan-400", border: "border-cyan-400/20", glow: "from-cyan-400/10" },
  green: { bg: "bg-emerald-400/10", icon: "text-emerald-400", border: "border-emerald-400/20", glow: "from-emerald-400/10" },
};

const DEMO_STEPS = [
  {
    title: "Landing Page",
    what: "A quick overview of the platform, live stats, and primary calls to action.",
    why: "It orients new users before they dive into the operational tools.",
  },
  {
    title: "Dashboard",
    what: "The main control room with health scores, charts, alerts, and search.",
    why: "It summarizes the state of the oceans and supports fast decisions.",
  },
  {
    title: "Ocean Map",
    what: "Interactive monitoring stations and regional markers on a live world view.",
    why: "It shows where problems are happening and where to inspect first.",
  },
  {
    title: "Click Marker → Details Drawer",
    what: "Selecting a marker opens a panel with local health, species, and alerts.",
    why: "It gives context without leaving the dashboard.",
  },
  {
    title: "Pollution, Biodiversity, Reports, AI Assistant",
    what: "Specialized pages for risk analysis, species trends, exports, and guidance.",
    why: "Each page answers a different operational question.",
  },
];

const PAGE_GUIDE = [
  {
    title: "Landing Page",
    detail: "What it is: the product overview and entry point. Why it exists: helps users understand the mission before opening the tools.",
  },
  {
    title: "Dashboard",
    detail: "What it is: the live operations hub. Why it exists: it puts the most important ocean metrics in one place.",
  },
  {
    title: "Ocean Map",
    detail: "What it is: the regional sensor view. Why it exists: location matters, and the map reveals where action is needed.",
  },
  {
    title: "Click Marker",
    detail: "What it is: a station or hotspot. Why it exists: it lets you jump from a global view to a local problem.",
  },
  {
    title: "Open Details Drawer",
    detail: "What it is: a focused region panel. Why it exists: it surfaces the exact numbers and alerts for that hotspot.",
  },
  {
    title: "Pollution Page",
    detail: "What it is: contamination analytics. Why it exists: teams need a dedicated view for plastic, chemical, and thermal issues.",
  },
  {
    title: "Biodiversity Page",
    detail: "What it is: species health and trend monitoring. Why it exists: conservation work depends on tracking ecosystems over time.",
  },
  {
    title: "Reports",
    detail: "What it is: downloadable summaries and archives. Why it exists: stakeholders need evidence, not just dashboards.",
  },
  {
    title: "AI Assistant",
    detail: "What it is: a guided help layer. Why it exists: users can ask questions instead of hunting through every chart manually.",
  },
];

const DEMO_TOUR = [
  {
    title: "Landing Page",
    eyebrow: "Step 1 of 9",
    screen: "Intro",
    route: "/",
    focus: "Open the product story and primary actions.",
    what: "This is the entry screen where users understand the platform at a glance.",
    why: "It gives context before opening any tools.",
    preview: ["Hero headline", "Open Dashboard", "Watch Demo", "Live stats"],
  },
  {
    title: "Dashboard",
    eyebrow: "Step 2 of 9",
    screen: "Control room",
    route: "/dashboard",
    focus: "See ocean health, alerts, and quick actions together.",
    what: "This is the main operations hub with scores, charts, alerts, and search.",
    why: "It helps teams make fast decisions from one view.",
    preview: ["Health score", "Alert feed", "Reef table", "Charts"],
  },
  {
    title: "Ocean Map",
    eyebrow: "Step 3 of 9",
    screen: "Regional view",
    route: "/dashboard#map-heading",
    focus: "Show where the monitoring stations live.",
    what: "The ocean globe/map highlights station locations and hotspots.",
    why: "Geography matters when deciding where to inspect first.",
    preview: ["Globe view", "Station markers", "Live focus", "Region labels"],
  },
  {
    title: "Click Marker",
    eyebrow: "Step 4 of 9",
    screen: "Point selection",
    route: "/dashboard",
    focus: "Select a hotspot to focus the dashboard.",
    what: "A click on a marker highlights a region and updates the dashboard focus.",
    why: "It turns a global overview into a local investigation.",
    preview: ["Highlighted marker", "Focused score", "Region badge", "Zoomed point"],
  },
  {
    title: "Details Drawer",
    eyebrow: "Step 5 of 9",
    screen: "Region panel",
    route: "/dashboard",
    focus: "Open the drawer for the selected location.",
    what: "The side panel shows health score, temperature, biodiversity, and alerts.",
    why: "It keeps the full context visible without leaving the dashboard.",
    preview: ["Health score", "Water temp", "Species count", "Recent alerts"],
  },
  {
    title: "Pollution Page",
    eyebrow: "Step 6 of 9",
    screen: "Contamination analytics",
    route: "/pollution",
    focus: "Inspect plastic, chemical, and thermal risks.",
    what: "This page breaks down pollution categories and regional severity.",
    why: "It helps teams identify the source of the problem.",
    preview: ["Severity cards", "Regional chart", "Trend lines", "Hotspots"],
  },
  {
    title: "Biodiversity Page",
    eyebrow: "Step 7 of 9",
    screen: "Species trends",
    route: "/biodiversity",
    focus: "Track species health and conservation status.",
    what: "This page focuses on marine species, threat levels, and recovery trends.",
    why: "It shows whether ecosystems are improving or declining.",
    preview: ["Species cards", "Health trend", "Threat level", "Conservation status"],
  },
  {
    title: "Reports",
    eyebrow: "Step 8 of 9",
    screen: "Evidence & exports",
    route: "/reports",
    focus: "Generate and download summaries for stakeholders.",
    what: "Reports package the data into weekly, monthly, and annual summaries.",
    why: "Decision-makers often need a shareable record, not only a live view.",
    preview: ["Preview", "Generate", "PDF", "CSV"],
  },
  {
    title: "AI Assistant",
    eyebrow: "Step 9 of 9",
    screen: "Guided help",
    route: "/dashboard",
    focus: "Ask questions when you do not know where to look.",
    what: "The assistant answers natural-language questions about the platform.",
    why: "It reduces friction for new users and speeds up exploration.",
    preview: ["Suggested prompts", "Answers", "Chat history", "Quick help"],
  },
];

function AnimatedCounter({ value, suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      {value}{suffix}
    </motion.span>
  );
}

function SectionReveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
}

export default function LandingPage() {
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [demoStep, setDemoStep] = useState(0);

  const activeDemoStep = DEMO_TOUR[demoStep];

  const goToStep = (direction) => {
    setDemoStep((current) => {
      if (direction === "next") {
        return Math.min(current + 1, DEMO_TOUR.length - 1);
      }
      return Math.max(current - 1, 0);
    });
  };

  const openDemo = () => {
    setDemoStep(0);
    setIsDemoOpen(true);
  };

  return (
    <div className="min-h-screen bg-ocean-gradient overflow-x-hidden">
      <Navbar variant="landing" />

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative pt-20 pb-24 px-4 overflow-hidden" aria-labelledby="hero-heading">
        {/* Ambient orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-ocean-300/8 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-32 left-1/4 w-64 h-64 bg-teal-400/6 blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-48 h-48 bg-purple-400/5 blur-[60px] rounded-full pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-light border border-ocean-300/20 text-ocean-300 text-xs font-semibold mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            Live monitoring across 340+ ocean stations
            <ChevronRight size={12} />
          </motion.div>

          {/* Headline */}
          <motion.h1
            id="hero-heading"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tight mb-6"
          >
            Protect our oceans{" "}
            <span className="block text-gradient">with AI intelligence.</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Real-time AI analysis of ocean temperature, pH, biodiversity, and pollution
            across all major ocean basins — empowering conservation at planetary scale.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16"
          >
            <Link to="/dashboard" className="btn-primary text-base py-3.5 px-7">
              <LayoutDashboard size={18} />
              Open Dashboard
              <ArrowRight size={16} />
            </Link>
            <button type="button" onClick={openDemo} className="btn-secondary text-base py-3.5 px-7">
              <Play size={16} />
              Watch Demo
            </button>
          </motion.div>

          {/* Hero visual — mini dashboard preview */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative mx-auto max-w-4xl"
          >
            {/* Glow */}
            <div className="absolute inset-0 bg-ocean-300/10 blur-3xl rounded-3xl" />

            <div className="relative glass rounded-2xl border border-ocean-300/15 overflow-hidden shadow-ocean-lg">
              {/* Fake browser bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-ocean-800/60 bg-ocean-900/50">
                <span className="w-3 h-3 rounded-full bg-red-400/60" />
                <span className="w-3 h-3 rounded-full bg-amber-400/60" />
                <span className="w-3 h-3 rounded-full bg-teal-400/60" />
                <div className="flex-1 mx-4 py-1 px-3 rounded-md bg-ocean-800/50 border border-ocean-800/60 text-[10px] text-slate-500 text-left">
                  app.oceanguardian.ai/dashboard
                </div>
              </div>

              {/* Dashboard preview grid */}
              <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "Health Score", value: "72", color: "teal", icon: Activity },
                  { label: "pH Level", value: "8.04", color: "blue", icon: Droplets },
                  { label: "Temp Anomaly", value: "+1.3°C", color: "orange", icon: Thermometer },
                  { label: "Species", value: "12,847", color: "purple", icon: Fish },
                ].map(({ label, value, color, icon: Icon }) => (
                  <div key={label} className="glass-light rounded-xl p-3 border border-ocean-800/40">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] text-slate-500 font-medium">{label}</span>
                      <Icon size={12} className={`text-${color}-400`} />
                    </div>
                    <p className={`text-lg font-bold text-${color}-300`}>{value}</p>
                  </div>
                ))}
              </div>

              {/* Fake chart area */}
              <div className="mx-4 mb-4 h-36 glass-light rounded-xl border border-ocean-800/40 flex items-end justify-around px-4 pb-3 gap-1 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-ocean-300/5 to-transparent" />
                {[40,55,48,62,70,65,78,72,80,75,88,82].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 0.8, delay: 0.5 + i * 0.04 }}
                    className="flex-1 rounded-t-sm bg-gradient-to-t from-ocean-400/60 to-teal-400/40 min-w-0"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-6 border-t border-ocean-800/40" aria-labelledby="how-it-works-heading">
        <div className="max-w-6xl mx-auto">
          <SectionReveal>
            <div className="text-center mb-16">
              <p className="section-label mb-3">Demo Flow</p>
              <h2 id="how-it-works-heading" className="text-4xl md:text-5xl font-black text-white mb-4">
                How the platform works.
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                This guided walkthrough replaces the old dummy demo button with a real explanation of what each screen means and why it exists.
              </p>
            </div>
          </SectionReveal>

          <div className="grid lg:grid-cols-5 gap-4">
            {DEMO_STEPS.map((step, index) => (
              <SectionReveal key={step.title} delay={index * 0.06}>
                <div className="glass card-hover rounded-2xl p-5 border border-ocean-800/60 h-full">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold text-ocean-300 uppercase tracking-widest">Step {index + 1}</span>
                    <CheckCircle2 size={15} className="text-teal-400" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-3"><span className="text-slate-300 font-semibold">What:</span> {step.what}</p>
                  <p className="text-xs text-slate-400 leading-relaxed"><span className="text-slate-300 font-semibold">Why:</span> {step.why}</p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Data & Research ─────────────────────────────────── */}
      <section id="data" className="py-24 px-6 border-t border-ocean-800/40" aria-labelledby="data-heading">
        <div className="max-w-6xl mx-auto space-y-16">
          <SectionReveal>
            <div className="text-center mb-12">
              <p className="section-label mb-3">Data</p>
              <h2 id="data-heading" className="text-4xl md:text-5xl font-black text-white mb-4">
                What the data represents.
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                The dashboards combine live-like telemetry, historical trends, and explanatory reports so users can understand both the current state and the direction of change.
              </p>
            </div>
          </SectionReveal>

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
            {[
              { title: "Health Score", value: "Composite index", desc: "Combines temperature, pH, biodiversity, and pollution into one decision-ready signal." },
              { title: "Ocean Map", value: "Regional monitoring", desc: "Shows where sensors, hotspots, and alerts are located so teams can act geographically." },
              { title: "Charts", value: "Trend analysis", desc: "Useful for spotting change over time instead of reacting to one data point." },
              { title: "Reports", value: "Evidence pack", desc: "Exports and summaries for scientists, policy teams, and stakeholders." },
            ].map((item, index) => (
              <SectionReveal key={item.title} delay={index * 0.08}>
                <div className="glass-light rounded-2xl p-5 border border-ocean-800/40 h-full">
                  <p className="text-xs font-semibold uppercase tracking-widest text-ocean-300 mb-2">{item.title}</p>
                  <h3 className="text-lg font-bold text-white mb-2">{item.value}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </SectionReveal>
            ))}
          </div>

          <SectionReveal>
            <div className="glass rounded-3xl border border-ocean-300/15 p-8 md:p-10">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="section-label mb-3">Research</p>
                  <h3 className="text-2xl font-black text-white mb-3">Why the platform is structured this way.</h3>
                </div>
                <div className="md:col-span-2 grid sm:grid-cols-2 gap-4">
                  {PAGE_GUIDE.slice(0, 6).map((item) => (
                    <div key={item.title} className="rounded-2xl border border-ocean-800/50 bg-ocean-900/30 p-4">
                      <h4 className="text-sm font-semibold text-white mb-2">{item.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ── Use Cases ────────────────────────────────────────── */}
      <section id="research" className="py-24 px-6 border-t border-ocean-800/40" aria-labelledby="research-heading">
        <div className="max-w-6xl mx-auto">
          <SectionReveal>
            <div className="text-center mb-12">
              <p className="section-label mb-3">Reference Guide</p>
              <h2 id="research-heading" className="text-4xl md:text-5xl font-black text-white mb-4">
                What each page is for.
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                If you are using the app for the first time, this is the short answer to "what should I click and why?"
              </p>
            </div>
          </SectionReveal>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {PAGE_GUIDE.map((item, index) => (
              <SectionReveal key={item.title} delay={index * 0.05}>
                <div className="glass card-hover rounded-2xl p-5 border border-ocean-800/60 h-full">
                  <h3 className="text-base font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.detail}</p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats bar ──────────────────────────────────────────── */}
      <section className="py-12 border-y border-ocean-800/40 glass" aria-label="Platform statistics">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x divide-ocean-800/40">
            {landingStats.map(({ value, label, suffix }, i) => (
              <SectionReveal key={label} delay={i * 0.1}>
                <div className="text-center md:px-8">
                  <p className="text-3xl md:text-4xl font-black text-gradient mb-1">
                    <AnimatedCounter value={value} suffix={suffix} />
                  </p>
                  <p className="text-sm text-slate-400 font-medium">{label}</p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section id="features" className="py-24 px-6" aria-labelledby="features-heading">
        <div className="max-w-6xl mx-auto">
          <SectionReveal>
            <div className="text-center mb-16">
              <p className="section-label mb-3">Platform Capabilities</p>
              <h2 id="features-heading" className="text-4xl md:text-5xl font-black text-white mb-4">
                Everything you need to
                <span className="text-gradient block">understand our oceans.</span>
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto">
                From real-time sensor data to AI predictions, Ocean Guardian AI gives you the tools to
                monitor, analyze, and protect marine ecosystems at scale.
              </p>
            </div>
          </SectionReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, i) => {
              const Icon = featureIcons[feature.icon] || Brain;
              const colors = featureColors[feature.color] || featureColors.teal;
              return (
                <SectionReveal key={feature.title} delay={i * 0.08}>
                  <div className={`glass card-hover rounded-2xl p-6 border ${colors.border} h-full group relative overflow-hidden`}>
                    <div className={`absolute -top-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br ${colors.glow} to-transparent blur-2xl`} />
                    <div className={`inline-flex p-3 rounded-xl ${colors.bg} border ${colors.border} mb-4`}>
                      <Icon className={`w-5 h-5 ${colors.icon}`} />
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
                  </div>
                </SectionReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────── */}
      <section className="py-24 px-6 border-t border-ocean-800/40" aria-labelledby="testimonials-heading">
        <div className="max-w-6xl mx-auto">
          <SectionReveal>
            <div className="text-center mb-16">
              <p className="section-label mb-3">Trusted by Researchers</p>
              <h2 id="testimonials-heading" className="text-3xl md:text-4xl font-black text-white">
                From scientists who use it daily.
              </h2>
            </div>
          </SectionReveal>

          <div className="grid md:grid-cols-3 gap-4">
            {testimonials.map((t, i) => (
              <SectionReveal key={t.name} delay={i * 0.1}>
                <div className="glass card-hover rounded-2xl p-6 border border-ocean-800/60 h-full flex flex-col">
                  <Quote className="w-6 h-6 text-ocean-300/40 mb-4 shrink-0" />
                  <p className="text-sm text-slate-300 leading-relaxed flex-1 mb-6">"{t.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ocean-400 to-teal-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{t.name}</p>
                      <p className="text-xs text-slate-500">{t.role}</p>
                    </div>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA banner ─────────────────────────────────────────── */}
      <section className="py-24 px-6" aria-labelledby="cta-heading">
        <SectionReveal>
          <div className="max-w-3xl mx-auto text-center">
            <div className="relative glass rounded-3xl border border-ocean-300/15 p-12 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-ocean-300/8 via-transparent to-teal-400/8" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-transparent via-ocean-300/60 to-transparent" />
              <div className="relative">
                <div className="inline-flex p-3 rounded-2xl bg-ocean-300/10 border border-ocean-300/20 mb-6">
                  <Waves className="w-6 h-6 text-ocean-300" />
                </div>
                <h2 id="cta-heading" className="text-3xl md:text-4xl font-black text-white mb-4">
                  Start protecting our oceans today.
                </h2>
                <p className="text-slate-400 mb-8 max-w-lg mx-auto">
                  Join hundreds of marine scientists and conservationists using Ocean Guardian AI to make data-driven decisions for ocean health.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link to="/dashboard" className="btn-primary text-base py-3.5 px-8">
                    <LayoutDashboard size={18} />
                    Launch Dashboard
                    <ArrowRight size={16} />
                  </Link>
                  <button type="button" onClick={openDemo} className="btn-secondary text-base py-3.5 px-8">
                    Schedule a Demo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </SectionReveal>
      </section>

      <AnimatePresence>
        {isDemoOpen && (
          <motion.div
            className="fixed inset-0 z-[9998] bg-slate-950/70 backdrop-blur-sm px-4 py-6 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsDemoOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-5xl max-h-[90vh] overflow-y-auto glass rounded-3xl border border-ocean-300/15 shadow-2xl"
            >
              <div className="flex items-start justify-between gap-4 p-6 border-b border-ocean-800/60">
                <div>
                  <p className="section-label mb-2">Guided Demo</p>
                  <h3 className="text-2xl font-black text-white">How the app works</h3>
                  <p className="text-sm text-slate-400 mt-2 max-w-2xl">
                    This replaces the old fake demo button with a clear walkthrough of what each screen represents and why it matters.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDemoOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-ocean-800/60 transition-all"
                  aria-label="Close demo"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 grid lg:grid-cols-[1.1fr_0.9fr] gap-4">
                <div className="rounded-3xl border border-ocean-800/60 bg-ocean-900/30 p-5 md:p-6 space-y-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[11px] uppercase tracking-widest text-ocean-300 font-semibold">{activeDemoStep.eyebrow}</p>
                      <h4 className="text-2xl font-black text-white mt-1">{activeDemoStep.title}</h4>
                    </div>
                    <span className="rounded-full px-3 py-1 text-[11px] font-semibold border border-ocean-300/20 text-ocean-300 bg-ocean-400/10">
                      {activeDemoStep.screen}
                    </span>
                  </div>

                  <div className="rounded-2xl border border-ocean-800/50 bg-ocean-950/40 p-5">
                    <p className="text-sm text-slate-400 mb-2">What you are seeing</p>
                    <p className="text-base text-slate-200 leading-relaxed">{activeDemoStep.what}</p>
                    <p className="text-sm text-slate-400 leading-relaxed mt-4">
                      <span className="text-slate-200 font-semibold">Why it is required:</span> {activeDemoStep.why}
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    {activeDemoStep.preview.map((item) => (
                      <div key={item} className="rounded-2xl border border-ocean-800/50 bg-ocean-950/35 p-4">
                        <p className="text-[11px] uppercase tracking-widest text-slate-500 font-semibold mb-1">Preview</p>
                        <p className="text-sm text-white font-semibold">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-ocean-800/60 bg-ocean-900/25 p-5 md:p-6 space-y-4">
                  <p className="text-[11px] uppercase tracking-widest text-slate-400 font-semibold">Step progress</p>
                  <div className="space-y-3">
                    {DEMO_TOUR.map((item, index) => (
                      <button
                        key={item.title}
                        type="button"
                        onClick={() => setDemoStep(index)}
                        className={`w-full text-left rounded-2xl border px-4 py-3 transition-all ${index === demoStep ? "bg-ocean-400/15 border-ocean-300/40" : "bg-ocean-950/30 border-ocean-800/50 hover:border-ocean-600/60"}`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-white">{item.title}</p>
                            <p className="text-xs text-slate-400 mt-1">{item.focus}</p>
                          </div>
                          <span className="text-[11px] text-slate-500">{index + 1}/{DEMO_TOUR.length}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-ocean-800/60 flex flex-col sm:flex-row gap-3 justify-between sm:items-center">
                <p className="text-sm text-slate-400">
                  Step {demoStep + 1} of {DEMO_TOUR.length}: {activeDemoStep.focus}
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => goToStep("prev")}
                    disabled={demoStep === 0}
                    className="btn-secondary text-sm py-2.5 px-4 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={16} />
                    Back
                  </button>
                  {demoStep < DEMO_TOUR.length - 1 ? (
                    <button type="button" onClick={() => goToStep("next")} className="btn-primary text-sm py-2.5 px-5">
                      Next
                      <ArrowRight size={16} />
                    </button>
                  ) : (
                    <Link to="/dashboard" onClick={() => setIsDemoOpen(false)} className="btn-primary text-sm py-2.5 px-5">
                      <LayoutDashboard size={16} />
                      Open Dashboard
                    </Link>
                  )}
                  <button type="button" onClick={() => setIsDemoOpen(false)} className="btn-secondary text-sm py-2.5 px-5">
                    Close Demo
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
