// src/components/ui/ActivityTimeline.jsx
import { memo } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle, Thermometer, Fish, Droplets, ShieldCheck,
  Package, Activity, Clock,
} from "lucide-react";
import Card from "./Card";

// Static data — defined outside component to avoid re-allocation on every render
const timelineEvents = [
  {
    id: 1,
    icon: AlertTriangle,
    title: "Critical Bleaching Alert — Great Barrier Reef",
    timestamp: "12 mins ago",
    description: "Heat stress index reached Level 3. Water surface temperature spike of +2.4°C recorded at station #02.",
    severity: "critical",
  },
  {
    id: 2,
    icon: Droplets,
    title: "pH Drop Below Baseline — North Atlantic",
    timestamp: "45 mins ago",
    description: "Surface ocean pH dropped to 7.94. Acidification warning dispatched to regional shellfish hatcheries.",
    severity: "warning",
  },
  {
    id: 3,
    icon: Package,
    title: "Micro-plastic Surge — Pacific Gyre",
    timestamp: "2 hours ago",
    description: "Drone sensors detected +18% increase in micro-particle concentration near North Pacific coordinates.",
    severity: "warning",
  },
  {
    id: 4,
    icon: Fish,
    title: "Humpback Migration Tracked — Hawaii",
    timestamp: "3 hours ago",
    description: "Acoustic array #A4 confirmed pass of 14 blue whales on expected southern migration corridor.",
    severity: "healthy",
  },
  {
    id: 5,
    icon: ShieldCheck,
    title: "Marine Sanctuary Patrol Completed — Maldives",
    timestamp: "5 hours ago",
    description: "Zero unauthorized fishing vessels detected within protected sector 4B. Biodiversity index stable at 92/100.",
    severity: "healthy",
  },
  {
    id: 6,
    icon: Thermometer,
    title: "Thermal Upwelling Event — Peru Current",
    timestamp: "7 hours ago",
    description: "Deep cold water surge (+3.1°C cooler) temporarily relieved local reef thermal stress.",
    severity: "healthy",
  },
  {
    id: 7,
    icon: Activity,
    title: "Station Calibration Completed — Arctic Buoy A7",
    timestamp: "10 hours ago",
    description: "Telemetry sensors auto-recalibrated. Salinity and oxygenation stream restored to 100% precision.",
    severity: "healthy",
  },
];

const severityMap = {
  critical: {
    color: "text-red-400",
    bg: "bg-red-400/10",
    border: "border-red-400/30",
    lineDot: "bg-red-400 ring-red-400/30",
    badge: "bg-red-400/15 border-red-400/30 text-red-400",
  },
  warning: {
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/30",
    lineDot: "bg-amber-400 ring-amber-400/30",
    badge: "bg-amber-400/15 border-amber-400/30 text-amber-400",
  },
  healthy: {
    color: "text-teal-400",
    bg: "bg-teal-400/10",
    border: "border-teal-400/30",
    lineDot: "bg-teal-400 ring-teal-400/30",
    badge: "bg-teal-400/15 border-teal-400/30 text-teal-400",
  },
};

// Memoized individual event row — prevents re-render of unchanged events
const TimelineEvent = memo(function TimelineEvent({ evt, index }) {
  const Icon = evt.icon;
  const style = severityMap[evt.severity] || severityMap.healthy;

  return (
    <motion.article
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="relative group"
      aria-label={`${evt.severity} event: ${evt.title}`}
    >
      {/* Timeline node dot */}
      <div className={`absolute -left-6 top-1.5 w-3.5 h-3.5 rounded-full ${style.lineDot} ring-4 transition-transform group-hover:scale-125`} aria-hidden="true" />

      {/* Event Card */}
      <div className={`glass-light ${style.bg} border ${style.border} rounded-xl p-3.5 transition-all group-hover:border-ocean-600/40`}>
        <div className="flex items-start justify-between gap-3 mb-1">
          <div className="flex items-center gap-2">
            <Icon size={15} className={style.color} aria-hidden="true" />
            <h4 className="text-xs font-bold text-white leading-snug">{evt.title}</h4>
          </div>
          <span className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize ${style.badge}`}>
            {evt.severity}
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mb-2 pl-5">{evt.description}</p>

        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 pl-5">
          <Clock size={11} aria-hidden="true" />
          <time>{evt.timestamp}</time>
        </div>
      </div>
    </motion.article>
  );
});

// Main component memoized — data is static so it never needs to re-render
const ActivityTimeline = memo(function ActivityTimeline() {
  return (
    <Card
      title="Live Activity Timeline"
      subtitle="Chronological stream of ocean events & AI detections"
      action={
        <div className="flex items-center gap-1.5 text-xs text-slate-400" aria-live="polite" aria-atomic="true">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" aria-hidden="true" />
          <span>Real-time</span>
        </div>
      }
    >
      <div
        className="px-5 pb-5 pt-1 max-h-[380px] overflow-y-auto pr-2 space-y-0 scrollbar-thin"
        role="feed"
        aria-label="Live activity timeline feed"
      >
        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-ocean-800/60">
          {timelineEvents.map((evt, index) => (
            <TimelineEvent key={evt.id} evt={evt} index={index} />
          ))}
        </div>
      </div>
    </Card>
  );
});

export default ActivityTimeline;
