// src/components/charts/TemperatureComparisonChart.jsx
import { memo, useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Card from "../ui/Card";

const data = [
  { region: "Pacific", current: 26.2, historical: 24.8 },
  { region: "Atlantic", current: 23.9, historical: 22.5 },
  { region: "Indian",   current: 27.4, historical: 25.9 },
  { region: "Arctic",   current: 3.8,  historical: 2.1  },
  { region: "Antarctic",current: 1.4,  historical: 0.9  },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="glass border border-ocean-300/20 rounded-xl px-4 py-3 text-sm shadow-xl">
        <p className="text-ocean-300 font-semibold mb-2">{label} Ocean</p>
        {payload.map((p) => (
          <div key={p.dataKey} className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-slate-400">{p.name}:</span>
            <span className="text-white font-medium">{p.value}°C</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const TemperatureComparisonChart = memo(function TemperatureComparisonChart() {
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 800); return () => clearTimeout(t); }, []);

  return (
    <Card title="Temperature Comparison" subtitle="Current vs. historical average (°C)" delay={0.2}>
      <div className="px-5 pb-5" role="img" aria-label="Grouped bar chart comparing current ocean temperatures versus historical averages across five ocean basins.">
        {!ready ? (
          <div className="h-[240px] w-full rounded-xl bg-ocean-800/30 animate-pulse" />
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="region" tick={{ fill: "rgba(100,116,139,0.8)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(100,116,139,0.8)", fontSize: 11 }} axisLine={false} tickLine={false} unit="°" />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} />
              <Bar dataKey="historical" name="Historical Avg" fill="#06b6d4" fillOpacity={0.4} radius={[4, 4, 0, 0]} />
              <Bar dataKey="current"    name="Current"        fill="#f97316" fillOpacity={0.8} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
});

export default TemperatureComparisonChart;
