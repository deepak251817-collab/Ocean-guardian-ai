import { memo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { speciesPopulationData } from "../../data/mockData";
import Card from "../ui/Card";

const COLORS = {
  whales: "#2dd4bf",
  dolphins: "#06b6d4",
  sharks: "#a78bfa",
  turtles: "#fb923c",
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass border border-ocean-300/20 rounded-xl px-4 py-3 text-sm shadow-xl">
        <p className="text-ocean-300 font-semibold mb-2">{label}</p>
        {payload.map((p) => (
          <div key={p.dataKey} className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-slate-400 capitalize">{p.dataKey}:</span>
            <span className="text-white font-medium">{p.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const SpeciesChart = memo(function SpeciesChart() {
  return (
    <Card
      title="Species Population Trends"
      subtitle="Tracked individuals by species group (2018–2024)"
      delay={0.15}
    >
      <div className="px-5 pb-5" role="img" aria-label="Line chart showing tracked population trends for whales, dolphins, sharks, and turtles from 2018 to 2024.">
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={speciesPopulationData} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="year" tick={{ fill: "rgba(100,116,139,0.8)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "rgba(100,116,139,0.8)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend iconType="circle" iconSize={8} />
            {Object.entries(COLORS).map(([key, color]) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={color}
                strokeWidth={2}
                dot={{ r: 3, fill: color, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: color, stroke: "#fff", strokeWidth: 2 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
});

export default SpeciesChart;
