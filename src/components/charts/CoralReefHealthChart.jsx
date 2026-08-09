// src/components/charts/CoralReefHealthChart.jsx
import { memo, useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import Card from "../ui/Card";
import { coralReefData } from "../../data/mockData";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    const score = payload[0].value;
    const color = score >= 70 ? "#2dd4bf" : score >= 55 ? "#fbbf24" : "#f87171";
    return (
      <div className="glass border border-ocean-300/20 rounded-xl px-4 py-3 text-sm shadow-xl">
        <p className="text-ocean-300 font-semibold mb-1">{label}</p>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: color }} />
          <span className="text-slate-400">Health:</span>
          <span className="text-white font-medium">{score} / 100</span>
        </div>
      </div>
    );
  }
  return null;
};

const CoralReefHealthChart = memo(function CoralReefHealthChart() {
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 900); return () => clearTimeout(t); }, []);

  return (
    <Card title="Coral Reef Health" subtitle="Health score by reef system" delay={0.1}>
      <div className="px-5 pb-5" role="img" aria-label="Bar chart showing coral reef health scores by reef system. Green bars indicate healthy reefs (70+), yellow moderate (55-69), red critical (below 55).">
        {!ready ? (
          <div className="h-[240px] w-full rounded-xl bg-ocean-800/30 animate-pulse" />
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={coralReefData} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="name" tick={{ fill: "rgba(100,116,139,0.8)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: "rgba(100,116,139,0.8)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="health" name="Health Score" radius={[4, 4, 0, 0]}>
                {coralReefData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={entry.health >= 70 ? "#2dd4bf" : entry.health >= 55 ? "#fbbf24" : "#f87171"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
});

export default CoralReefHealthChart;
