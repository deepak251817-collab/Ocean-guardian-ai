import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";
import { motion } from "framer-motion";

function getHealthColor(score) {
  if (score >= 75) return "#2dd4bf";
  if (score >= 50) return "#fbbf24";
  return "#f87171";
}

function getHealthLabel(score) {
  if (score >= 75) return "Good";
  if (score >= 50) return "Moderate";
  return "Critical";
}

export default function OceanHealthGauge({ score = 72 }) {
  const color = getHealthColor(score);
  const label = getHealthLabel(score);
  const data = [{ value: score, fill: color }];

  return (
    <div className="flex flex-col items-center justify-center py-4">
      <div className="relative">
        <RadialBarChart
          width={220}
          height={220}
          cx={110}
          cy={110}
          innerRadius={75}
          outerRadius={100}
          startAngle={225}
          endAngle={-45}
          data={data}
          barSize={14}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
          <RadialBar
            background={{ fill: "rgba(255,255,255,0.04)" }}
            dataKey="value"
            cornerRadius={7}
          />
        </RadialBarChart>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.p
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="text-4xl font-bold"
            style={{ color }}
          >
            {score}
          </motion.p>
          <p className="text-xs text-slate-400 font-medium">/ 100</p>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-1 text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{
              color,
              background: `${color}18`,
              border: `1px solid ${color}30`,
            }}
          >
            {label}
          </motion.span>
        </div>
      </div>

      {/* Scale labels */}
      <div className="flex items-center justify-between w-[180px] -mt-4">
        <span className="text-xs text-red-400 font-medium">0</span>
        <span className="text-xs text-slate-500 font-medium">50</span>
        <span className="text-xs text-teal-400 font-medium">100</span>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-4 text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
          Critical
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          Moderate
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
          Good
        </span>
      </div>
    </div>
  );
}
