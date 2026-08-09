// src/components/ui/SmartInsightsPanel.jsx
import React from "react";
import { motion } from "framer-motion";
import InsightCard from "./InsightCard";
import { insightsMockData } from "../../data/insightsMockData";

/**
 * Panel displaying a list of insight cards with staggered entrance animation.
 */
export default function SmartInsightsPanel() {
  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  return (
    <section className="my-6">
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {insightsMockData.map((insight, idx) => (
          <InsightCard
            key={insight.id}
            index={idx}
            icon={insight.icon}
            title={insight.title}
            explanation={insight.explanation}
            timestamp={insight.timestamp}
            confidence={insight.confidence}
          />
        ))}
      </motion.div>
    </section>
  );
}
