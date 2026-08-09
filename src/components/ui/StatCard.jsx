import { motion } from "framer-motion";
import {
  Activity, Droplets, Thermometer, AlertTriangle,
  Fish, Globe, TrendingUp, TrendingDown,
} from "lucide-react";

const iconMap = {
  Activity, Droplets, Thermometer, AlertTriangle, Fish, Globe,
};

const colorMap = {
  teal: {
    icon: "text-teal-400",
    bg: "bg-teal-400/10",
    border: "border-teal-400/20",
    glow: "shadow-teal-400/10",
    badge: "bg-teal-400/10 text-teal-300",
  },
  blue: {
    icon: "text-ocean-300",
    bg: "bg-ocean-300/10",
    border: "border-ocean-300/20",
    glow: "shadow-ocean-300/10",
    badge: "bg-ocean-300/10 text-ocean-200",
  },
  orange: {
    icon: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
    glow: "shadow-amber-400/10",
    badge: "bg-amber-400/10 text-amber-300",
  },
  red: {
    icon: "text-red-400",
    bg: "bg-red-400/10",
    border: "border-red-400/20",
    glow: "shadow-red-400/10",
    badge: "bg-red-400/10 text-red-300",
  },
  purple: {
    icon: "text-purple-400",
    bg: "bg-purple-400/10",
    border: "border-purple-400/20",
    glow: "shadow-purple-400/10",
    badge: "bg-purple-400/10 text-purple-300",
  },
  cyan: {
    icon: "text-cyan-400",
    bg: "bg-cyan-400/10",
    border: "border-cyan-400/20",
    glow: "shadow-cyan-400/10",
    badge: "bg-cyan-400/10 text-cyan-300",
  },
};

export default function StatCard({ card, index = 0 }) {
  const Icon = iconMap[card.icon] || Activity;
  const colors = colorMap[card.color] || colorMap.teal;
  const isUp = card.trend === "up";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.25, delay: index * 0.05, ease: "easeOut" }}
      className={`glass card-hover rounded-2xl p-5 border ${colors.border} relative overflow-hidden`}
    >
      {/* Background glow */}
      <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full ${colors.bg} blur-2xl`} />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className={`p-2.5 rounded-xl ${colors.bg} border ${colors.border}`}>
            <Icon className={`w-5 h-5 ${colors.icon}`} />
          </div>
          <div className={`badge ${colors.badge} border ${colors.border}`}>
            {isUp ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            <span>{card.change}</span>
          </div>
        </div>

        {/* Value */}
        <div className="mb-1">
          <p className="text-2xl font-bold text-white tracking-tight">
            {card.value}
          </p>
        </div>

        {/* Labels */}
        <p className="text-sm font-semibold text-slate-300 mb-0.5">{card.title}</p>
        <p className="text-xs text-slate-500">{card.description}</p>
      </div>
    </motion.div>
  );
}
