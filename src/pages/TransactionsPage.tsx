import {
  BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import { GlassCard } from "../components/ui/GlassCard";
import { StatCard } from "../components/ui/StatCard";
import { SectionTitle } from "../components/ui/SectionTitle";

const NEON = "#00FF9D";
const tooltipStyle = {
  contentStyle: { background: "#0F172A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 11 },
  itemStyle: { color: NEON },
  labelStyle: { color: "#94a3b8" },
};

export function TransactionsPage({ data }: { data: any }) {
  const { transactions } = data;
  const totalVol  = transactions.reduce((a: number, d: any) => a + d.volume, 0);
  const totalFail = transactions.reduce((a: number, d: any) => a + d.failed, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
        <StatCard title="Total Volume (24h)" value={(totalVol / 1000).toFixed(0)} unit="K TXN" color={NEON} />
        <StatCard title="Failed TXN" value={totalFail} color="#EF4444" sub="Last 24 hours" />
        <StatCard title="Success Rate" value={(((totalVol - totalFail) / totalVol) * 100).toFixed(2)} unit="%" color="#10B981" />
        <StatCard title="Avg Value" value={(transactions.reduce((a: number, d: any) => a + d.value, 0) / transactions.length).toFixed(2)} unit="M USD" color="#F59E0B" />
      </div>

      <GlassCard style={{ padding: "20px 24px" }}>
        <SectionTitle>Transaction Volume — 24h</SectionTitle>
        <div style={{ height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={transactions} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "#475569" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#475569" }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="volume" fill={NEON}      radius={[3,3,0,0]} fillOpacity={0.7} name="Volume" />
              <Bar dataKey="failed" fill="#EF4444"   radius={[3,3,0,0]} fillOpacity={0.8} name="Failed" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      <GlassCard style={{ padding: "20px 24px" }}>
        <SectionTitle>Settlement Value — USD (M)</SectionTitle>
        <div style={{ height: 160 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={transactions} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gval" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#F59E0B" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#F59E0B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "#475569" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#475569" }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} />
              <Area type="monotone" dataKey="value" stroke="#F59E0B" strokeWidth={2} fill="url(#gval)" name="Value (M)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </div>
  );
}