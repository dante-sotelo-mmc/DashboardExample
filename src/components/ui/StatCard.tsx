import { LineChart, Line, ResponsiveContainer } from "recharts";
import { GlassCard } from "./GlassCard";

const NEON = "#00FF9D";

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  sub?: string;
  color?: string;
  spark?: { v: number }[];
}

function MiniSpark({ data, color = NEON }: { data: { v: number }[]; color?: string }) {
  return (
    <ResponsiveContainer width="100%" height={32}>
      <LineChart data={data} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
        <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} dot={false} isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function StatCard({ title, value, unit, sub, color = NEON, spark }: StatCardProps) {
  return (
    <GlassCard style={{ padding: "18px 20px" }}>
      <div style={{ fontSize: 10, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
        {title}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
        <span style={{ fontSize: 28, fontWeight: 700, color, lineHeight: 1 }}>{value}</span>
        {unit && <span style={{ fontSize: 13, color: "#64748b" }}>{unit}</span>}
      </div>
      {sub && <div style={{ fontSize: 11, color: "#475569" }}>{sub}</div>}
      {spark && <div style={{ marginTop: 8 }}><MiniSpark data={spark} color={color} /></div>}
    </GlassCard>
  );
}