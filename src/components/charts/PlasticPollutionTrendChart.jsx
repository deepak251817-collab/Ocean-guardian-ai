// src/components/charts/PlasticPollutionTrendChart.jsx
import { memo, useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Card from "../ui/Card";

const trendData = [
  { month: "Jan", tons: 48, baseline: 40 },
  { month: "Feb", tons: 45, baseline: 40 },
  { month: "Mar", tons: 43, baseline: 40 },
  { month: "Apr", tons: 47, baseline: 40 },
  { month: "May", tons: 51, baseline: 40 },
  { month: "Jun", tons: 55, baseline: 40 },
  { month: "Jul", tons: 59, baseline: 40 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="glass border border-ocean-300/20 rounded-xl px-4 py-3 text-sm shadow-xl">
        <p className="text-ocean-300 font-semibold mb-2">{label}</p>
        {payload.map((p) => (
          <div key={p.dataKey} className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-slate-400">{p.name}:</span>
            <span className="text-white font-medium">{p.value}k tons</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const PlasticPollutionTrendChart = memo(function PlasticPollutionTrendChart() {
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 1100); return () => clearTimeout(t); }, []);

  return (
    <Card title="Plastic Pollution Trend" subtitle="Monthly accumulation (thousand tons)" delay={0.15}>
      <div className="px-5 pb-5" role="img" aria-label="Area chart showing monthly plastic pollution accumulation in thousands of tons compared to the 2021 baseline level.">
        {!ready ? (
          <div className="h-[240px] w-full rounded-xl bg-ocean-800/30 animate-pulse" />
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={trendData} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
              <defs>
                <linearGradient id="plasticGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f87171" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="baselineGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: "rgba(100,116,139,0.8)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(100,116,139,0.8)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} />
              <Area type="monotone" dataKey="baseline" name="2021 Baseline" stroke="#06b6d4" strokeWidth={2} strokeDasharray="5 3" fill="url(#baselineGrad2)" dot={false} />
              <Area type="monotone" dataKey="tons" name="Current" stroke="#f87171" strokeWidth={2.5} fill="url(#plasticGrad)" dot={false} activeDot={{ r: 5, fill: "#f87171", stroke: "#fff", strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
});

export default PlasticPollutionTrendChart;
