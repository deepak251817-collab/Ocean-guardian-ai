// src/components/charts/MarineSpeciesTrendChart.jsx
import { memo, useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Card from "../ui/Card";
import { speciesPopulationData } from "../../data/mockData";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="glass border border-ocean-300/20 rounded-xl px-4 py-3 text-sm shadow-xl">
        <p className="text-ocean-300 font-semibold mb-2">{label}</p>
        {payload.map((p) => (
          <div key={p.dataKey} className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-slate-400">{p.name}:</span>
            <span className="text-white font-medium">{p.value?.toLocaleString()}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const LINES = [
  { key: "whales",   name: "Whales",   color: "#818cf8" },
  { key: "dolphins", name: "Dolphins", color: "#22d3ee" },
  { key: "sharks",   name: "Sharks",   color: "#f87171" },
  { key: "turtles",  name: "Turtles",  color: "#2dd4bf" },
];

const MarineSpeciesTrendChart = memo(function MarineSpeciesTrendChart() {
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 1300); return () => clearTimeout(t); }, []);

  return (
    <Card title="Marine Species Trend" subtitle="Population changes 2018–2024 (estimated count)" delay={0.25}>
      <div className="px-5 pb-5" role="img" aria-label="Line chart showing marine species population trends from 2018 to 2024 for whales, dolphins, sharks, and turtles.">
        {!ready ? (
          <div className="h-[240px] w-full rounded-xl bg-ocean-800/30 animate-pulse" />
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={speciesPopulationData} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="year" tick={{ fill: "rgba(100,116,139,0.8)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(100,116,139,0.8)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} />
              {LINES.map(({ key, name, color }) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  name={name}
                  stroke={color}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, stroke: "#fff", strokeWidth: 2 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
});

export default MarineSpeciesTrendChart;
