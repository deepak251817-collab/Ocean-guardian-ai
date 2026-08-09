import { memo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { pollutionData } from "../../data/mockData";
import Card from "../ui/Card";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass border border-ocean-300/20 rounded-xl px-4 py-3 text-sm shadow-xl">
        <p className="text-ocean-300 font-semibold mb-2">{label}</p>
        {payload.map((p) => (
          <div key={p.dataKey} className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full" style={{ background: p.fill }} />
            <span className="text-slate-400 capitalize">{p.name}:</span>
            <span className="text-white font-medium">{p.value} / 100</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const PollutionChart = memo(function PollutionChart() {
  return (
    <Card
      title="Pollution Index by Region"
      subtitle="Plastic · Chemical · Thermal pollution scores (0–100)"
      delay={0.2}
    >
      <div className="px-5 pb-5" role="img" aria-label="Grouped bar chart showing plastic, chemical, and thermal pollution index scores from 0 to 100 across ocean regions.">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart
            data={pollutionData}
            margin={{ top: 8, right: 8, bottom: 0, left: -16 }}
            barCategoryGap="30%"
            barGap={3}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis
              dataKey="region"
              tick={{ fill: "rgba(100,116,139,0.8)", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "rgba(100,116,139,0.8)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend iconType="square" iconSize={8} />
            <Bar dataKey="plastic" name="Plastic" fill="#f87171" radius={[3, 3, 0, 0]} />
            <Bar dataKey="chemical" name="Chemical" fill="#fb923c" radius={[3, 3, 0, 0]} />
            <Bar dataKey="thermal" name="Thermal" fill="#fbbf24" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
});

export default PollutionChart;
