import { memo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { temperatureData } from "../../data/mockData";
import Card from "../ui/Card";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass border border-ocean-300/20 rounded-xl px-4 py-3 text-sm shadow-xl">
        <p className="text-ocean-300 font-semibold mb-2">{label}</p>
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

const TemperatureChart = memo(function TemperatureChart() {
  return (
    <Card
      title="Sea Surface Temperature"
      subtitle="Monthly readings vs. 1990 baseline (°C)"
      delay={0.1}
    >
      <div className="px-5 pb-5" role="img" aria-label="Area chart comparing current sea surface temperatures versus the 1990 historical baseline across months.">
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={temperatureData} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
            <defs>
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="baselineGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="month" tick={{ fill: "rgba(100,116,139,0.8)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "rgba(100,116,139,0.8)", fontSize: 11 }} axisLine={false} tickLine={false} domain={[12, 21]} />
            <Tooltip content={<CustomTooltip />} />
            <Legend iconType="circle" iconSize={8} />
            <Area
              type="monotone"
              dataKey="baseline"
              name="1990 Baseline"
              stroke="#06b6d4"
              strokeWidth={2}
              strokeDasharray="5 3"
              fill="url(#baselineGradient)"
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="temp"
              name="Current Temp"
              stroke="#f97316"
              strokeWidth={2.5}
              fill="url(#tempGradient)"
              dot={false}
              activeDot={{ r: 5, fill: "#f97316", stroke: "#fff", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
});

export default TemperatureChart;
