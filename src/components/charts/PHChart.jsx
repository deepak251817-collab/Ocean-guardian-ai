import { memo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { phLevelData } from "../../data/mockData";
import Card from "../ui/Card";

const CustomTooltip = memo(function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const ph = payload.find((p) => p.dataKey === "ph");
    const isAcidic = ph && ph.value < 8.1;
    return (
      <div className="glass border border-ocean-300/20 rounded-xl px-4 py-3 text-sm shadow-xl" role="tooltip">
        <p className="text-ocean-300 font-semibold mb-2">{label}</p>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-ocean-300" aria-hidden="true" />
          <span className="text-slate-400">pH:</span>
          <span className={`font-medium ${isAcidic ? "text-amber-300" : "text-teal-300"}`}>
            {ph?.value}
          </span>
        </div>
        <p className={`text-xs mt-1 ${isAcidic ? "text-amber-400" : "text-teal-400"}`}>
          {isAcidic ? "⚠ Below safe threshold (8.1)" : "✓ Within safe range"}
        </p>
      </div>
    );
  }
  return null;
});

const PHChart = memo(function PHChart() {
  return (
    <Card
      title="Ocean pH Levels"
      subtitle="Surface acidity trend — safe threshold: 8.1"
      delay={0.25}
    >
      <div
        className="px-5 pb-5"
        role="img"
        aria-label="Line chart showing ocean pH levels over time. Safe threshold is 8.1. Values below 8.1 indicate acidification."
      >
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={phLevelData} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="month" tick={{ fill: "rgba(100,116,139,0.8)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis
              tick={{ fill: "rgba(100,116,139,0.8)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              domain={[7.95, 8.15]}
              tickCount={5}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              y={8.1}
              stroke="#2dd4bf"
              strokeDasharray="6 3"
              strokeWidth={1.5}
              label={{
                value: "Safe: 8.1",
                position: "right",
                fill: "#2dd4bf",
                fontSize: 10,
                fontWeight: 600,
              }}
            />
            <Line
              type="monotone"
              dataKey="ph"
              name="pH Level"
              stroke="#06b6d4"
              strokeWidth={2.5}
              dot={{ r: 3, fill: "#06b6d4", strokeWidth: 0 }}
              activeDot={{ r: 5, fill: "#06b6d4", stroke: "#fff", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
});

export default PHChart;
