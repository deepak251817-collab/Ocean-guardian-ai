// src/components/ui/InsightCard.jsx
import React from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";

/**
 * Reusable card displaying a single AI insight.
 * Props:
 *   - icon: string name of a lucide-react icon (e.g., "Lightbulb")
 *   - title: string
 *   - explanation: string
 *   - timestamp: string (formatted date/time)
 *   - confidence: number (percentage)
 */
export default function InsightCard({ icon, title, explanation, timestamp, confidence, index }) {
  const IconComponent = Icons[icon] || Icons["Info"];
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.12, duration: 0.4, ease: "easeOut" },
    }),
  };

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="glass-light rounded-xl p-4 border border-ocean-800/30 backdrop-blur-sm"
    >
      <div className="flex items-center gap-3 mb-2">
        <IconComponent className="w-5 h-5 text-ocean-300" />
        <h3 className="text-sm font-medium text-slate-200">{title}</h3>
      </div>
      <p className="text-xs text-slate-400 mb-2 line-clamp-2">{explanation}</p>
      <div className="flex justify-between text-xs text-slate-500">
        <span>{timestamp}</span>
        <span className="font-medium text-ocean-300">{confidence}% confidence</span>
      </div>
    </motion.div>
  );
}
