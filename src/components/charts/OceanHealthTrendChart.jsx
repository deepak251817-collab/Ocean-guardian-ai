// src/components/charts/OceanHealthTrendChart.jsx
import { memo, useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Card from "../ui/Card";
import { oceanHealthTrend } from "../../data/mockAnalytics";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="glass border border-ocean-300/20 rounded-xl px-4 py-3 text-sm shadow-xl">
        <p className="text-ocean-300 font-semibold mb-1">{label}</p>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-teal-400" />
          <span className="text-slate-400">Health Index:</span>
          <span className="text-white font-medium">{payload[0].value} / 100</span>
        </div>
      </div>
    );
  }
  return null;
};

const OceanHealthTrendChart = memo(function OceanHealthTrendChart() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 700);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Card title="Ocean Health Trend" subtitle="Historical composite index (2023–2024)" delay={0.05}>
      <div className="px-5 pb-5" role="img" aria-label="Line chart showing global ocean health composite index from 2023 to 2024. Higher scores indicate better health.">
        {!ready ? (
          <div className="h-[240px] w-full rounded-xl bg-ocean-800/30 animate-pulse" />
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={oceanHealthTrend} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fill: "rgba(100,116,139,0.8)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[50, 100]} tick={{ fill: "rgba(100,116,139,0.8)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} />
              <Line
                type="monotone"
                dataKey="score"
                name="Health Score"
                stroke="#2dd4bf"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#2dd4bf", stroke: "#fff", strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
});

export default OceanHealthTrendChart;
