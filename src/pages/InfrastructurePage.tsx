// src/pages/InfrastructurePage.tsx
import { useEffect, useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import { GlassCard } from "../components/ui/GlassCard";
import { SectionTitle } from "../components/ui/SectionTitle";

const NEON = "#00FF9D";

// ── Tipos ────────────────────────────────────────────────────────────────────
interface TelemetryPoint { time: string; cpu: number; memory: number; }
interface LatencyItem    { region: string; value: number; status: "healthy" | "warning"; }
interface HealthItem     { name: string; desc: string; status: "healthy" | "warning" | "error"; }

// ── Generadores locales ──────────────────────────────────────────────────────
const rand    = (min: number, max: number) => +(min + Math.random() * (max - min)).toFixed(1);
const randInt = (min: number, max: number) => Math.floor(min + Math.random() * (max - min + 1));

const genTelemetry = (): TelemetryPoint[] =>
  Array.from({ length: 8 }, (_, i) => ({
    time:   `${i * 5}m`,
    cpu:    rand(35, 88),
    memory: rand(28, 72),
  }));

const genLatency = (): LatencyItem[] => [
  { region: "AMER-EAST",    value: rand(8,  25),  status: "healthy" },
  { region: "EMEA-CENTRAL", value: rand(18, 45),  status: "healthy" },
  { region: "APAC-NORTH",   value: rand(90, 200), status: "warning" },
  { region: "LATAM-SOUTH",  value: rand(40, 90),  status: "healthy" },
];

const genStats = () => ({
  nodes:      randInt(1180, 1280),
  nodesPct:   randInt(75, 95),
  dbLatency:  rand(72, 130),
  throughput: rand(36, 55),
  throughputPct: randInt(80, 99),
  cloudUsage: rand(58, 78),
  aws:        randInt(60, 82),
  azure:      randInt(50, 72),
  temp:       rand(17, 21),
  power:      rand(3.8, 4.8),
});

const HEALTH_ITEMS: HealthItem[] = [
  { name: "Core Banking",    desc: "Primary SQL Cluster",     status: "healthy" },
  { name: "SWIFT Gateways",  desc: "ISO 20022 Verified",      status: "healthy" },
  { name: "Mobile API Mesh", desc: "High Load (88%)",         status: "warning" },
  { name: "Auth Engine",     desc: "VISA/MC Connected",       status: "healthy" },
  { name: "Fraud Detection", desc: "AI Scoring Latency 4ms",  status: "healthy" },
  { name: "Cold Storage",    desc: "Replication Delayed",     status: "error"   },
  { name: "PSD2/OB API",     desc: "Third-Party Stable",      status: "healthy" },
  { name: "z/OS Mainframe",  desc: "CICS Region Active",      status: "healthy" },
];

const STATUS_COLOR: Record<string, string> = {
  healthy: NEON, warning: "#F59E0B", error: "#EF4444",
};

const tooltipStyle = {
  contentStyle: { background: "#0F172A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 11 },
  itemStyle: { color: NEON }, labelStyle: { color: "#94a3b8" },
};

// ── Componente ───────────────────────────────────────────────────────────────
export function InfrastructurePage({ data: _data }: { data: any }) {
  const [stats,     setStats]     = useState(genStats);
  const [telemetry, setTelemetry] = useState(genTelemetry);
  const [latency,   setLatency]   = useState(genLatency);
  const [time,      setTime]      = useState(new Date());

  useEffect(() => {
    const clock   = setInterval(() => setTime(new Date()), 1000);
    const refresh = setInterval(() => {
      setStats(genStats());
      setTelemetry(genTelemetry());
      setLatency(genLatency());
    }, 4000);
    return () => { clearInterval(clock); clearInterval(refresh); };
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* ── Hero Header ─────────────────────────────────────── */}
      <section style={{ display: "grid", gridTemplateColumns: "3fr 1fr", gap: 24, alignItems: "center" }}>
        <div>
          <h1 style={{
            fontSize: 32, fontWeight: 700, letterSpacing: "-0.02em",
            color: "#d4e4fa", textTransform: "uppercase", margin: 0, marginBottom: 8,
          }}>
            Core Infrastructure Overview
          </h1>
          <p style={{ fontSize: 14, color: "#64748b", margin: 0, lineHeight: 1.6 }}>
            Real-time telemetry from global data centers. Current status:{" "}
            <span style={{ color: NEON, fontWeight: 700 }}>OPERATIONAL</span>.
            All redundancy protocols active across 14 clusters.
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 20 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, color: "#475569", letterSpacing: "0.1em", textTransform: "uppercase" }}>System Time</div>
            <div style={{ fontSize: 18, color: NEON, fontWeight: 700, fontFamily: "monospace" }}>
              {time.toLocaleTimeString("en-US", { hour12: false })} UTC
            </div>
          </div>
          <div style={{ width: 1, height: 40, background: "rgba(255,255,255,0.1)" }} />
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, color: "#475569", letterSpacing: "0.1em", textTransform: "uppercase" }}>Uptime</div>
            <div style={{ fontSize: 18, color: "#f1f5f9", fontWeight: 700, fontFamily: "monospace" }}>99.998%</div>
          </div>
        </div>
      </section>

      {/* ── Key Metrics ─────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>

        {/* Active Nodes */}
        <GlassCard style={{ padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <span style={{ fontSize: 22, color: NEON }}>◈</span>
            <span style={{ fontSize: 10, color: NEON, fontWeight: 700, letterSpacing: "0.1em",
              background: `${NEON}18`, padding: "2px 8px", borderRadius: 4 }}>STABLE</span>
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#f1f5f9", fontFamily: "Space Grotesk, sans-serif", marginBottom: 4 }}>
            {stats.nodes.toLocaleString()}
          </div>
          <div style={{ fontSize: 10, color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Active Server Nodes
          </div>
          <div style={{ marginTop: 16, height: 4, background: "rgba(255,255,255,0.05)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${stats.nodesPct}%`, background: NEON,
              boxShadow: `0 0 8px ${NEON}`, transition: "width 1s ease" }} />
          </div>
        </GlassCard>

        {/* DB Latency */}
        <GlassCard style={{ padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <span style={{ fontSize: 22, color: "#60A5FA" }}>⬡</span>
            <span style={{ fontSize: 10, color: "#60A5FA", fontWeight: 700, letterSpacing: "0.1em",
              background: "rgba(96,165,250,0.1)", padding: "2px 8px", borderRadius: 4 }}>SYNCING</span>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
            <span style={{ fontSize: 24, fontWeight: 700, color: "#f1f5f9", fontFamily: "Space Grotesk, sans-serif" }}>
              {stats.dbLatency}
            </span>
            <span style={{ fontSize: 13, color: "#475569" }}>ms</span>
          </div>
          <div style={{ fontSize: 10, color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            DB Cluster Latency
          </div>
          {/* Mini sparkline */}
          <div style={{ marginTop: 16, display: "flex", gap: 3, alignItems: "flex-end", height: 24 }}>
            {[40,60,30,80,50,90].map((h, i) => (
              <div key={i} style={{ flex: 1, height: `${h}%`, background: "rgba(96,165,250,0.5)", borderRadius: 2 }} />
            ))}
          </div>
        </GlassCard>

        {/* Throughput */}
        <GlassCard style={{ padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <span style={{ fontSize: 22, color: "#F59E0B" }}>◎</span>
            <span style={{ fontSize: 10, color: "#F59E0B", fontWeight: 700, letterSpacing: "0.1em",
              background: "rgba(245,158,11,0.1)", padding: "2px 8px", borderRadius: 4 }}>PEAK LOAD</span>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
            <span style={{ fontSize: 24, fontWeight: 700, color: "#f1f5f9", fontFamily: "Space Grotesk, sans-serif" }}>
              {stats.throughput}
            </span>
            <span style={{ fontSize: 13, color: "#475569" }}>TB/s</span>
          </div>
          <div style={{ fontSize: 10, color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Global Data Throughput
          </div>
          <div style={{ marginTop: 16, height: 4, background: "rgba(255,255,255,0.05)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${stats.throughputPct}%`, background: "#F59E0B",
              boxShadow: "0 0 8px rgba(245,158,11,0.5)", transition: "width 1s ease" }} />
          </div>
        </GlassCard>

        {/* Cloud Usage */}
        <GlassCard style={{ padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <span style={{ fontSize: 22, color: NEON }}>☁</span>
            <span style={{ fontSize: 10, color: NEON, fontWeight: 700, letterSpacing: "0.1em",
              background: `${NEON}18`, padding: "2px 8px", borderRadius: 4 }}>OPTIMIZED</span>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
            <span style={{ fontSize: 24, fontWeight: 700, color: "#f1f5f9", fontFamily: "Space Grotesk, sans-serif" }}>
              {stats.cloudUsage}
            </span>
            <span style={{ fontSize: 13, color: "#475569" }}>%</span>
          </div>
          <div style={{ fontSize: 10, color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Cloud Resource Usage
          </div>
          <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", fontSize: 10, color: "#475569" }}>
            <span>AWS: {stats.aws}%</span>
            <span>AZURE: {stats.azure}%</span>
          </div>
        </GlassCard>

      </div>

      {/* ── Telemetry + Latency ──────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>

        {/* Cluster Telemetry Chart */}
        <GlassCard style={{ padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: 600, color: "#f1f5f9", marginBottom: 4 }}>Cluster Telemetry</div>
              <div style={{ fontSize: 10, color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Live CPU and Memory utilization
              </div>
            </div>
            <div style={{ display: "flex", gap: 16 }}>
              {[{ c: NEON, l: "CPU" }, { c: "#3B82F6", l: "Memory" }].map(x => (
                <span key={x.l} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: "#94a3b8" }}>
                  <span style={{ width: 12, height: 12, borderRadius: 2, background: x.c, display: "inline-block" }} />
                  {x.l}
                </span>
              ))}
            </div>
          </div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={telemetry} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="infra-gcpu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor={NEON}    stopOpacity={0.3} />
                    <stop offset="100%" stopColor={NEON}    stopOpacity={0}   />
                  </linearGradient>
                  <linearGradient id="infra-gmem" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#3B82F6" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity={0}    />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time"   tick={{ fontSize: 10, fill: "#475569" }} axisLine={false} tickLine={false} />
                <YAxis                  tick={{ fontSize: 10, fill: "#475569" }} axisLine={false} tickLine={false} />
                <Tooltip {...tooltipStyle} />
                <Area type="monotone" dataKey="cpu"    stroke={NEON}    strokeWidth={2} fill="url(#infra-gcpu)" dot={false} name="CPU %"  />
                <Area type="monotone" dataKey="memory" stroke="#3B82F6" strokeWidth={2} fill="url(#infra-gmem)" dot={false} name="MEM %"  />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Regional Latency */}
        <GlassCard style={{ padding: "24px", display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 20, fontWeight: 600, color: "#f1f5f9", marginBottom: 24 }}>Regional Latency</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20, flex: 1 }}>
            {latency.map(l => (
              <div key={l.region} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 10, color: "#475569", width: 88, flexShrink: 0, fontWeight: 600 }}>
                  {l.region}
                </span>
                <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: 99,
                    width: `${Math.min(l.value / 2.5, 100)}%`,
                    background: STATUS_COLOR[l.status],
                    boxShadow: l.status === "healthy" ? `0 0 8px ${STATUS_COLOR[l.status]}60` : "none",
                    transition: "width 1s ease",
                  }} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: STATUS_COLOR[l.status], width: 48, textAlign: "right" }}>
                  {l.value}ms
                </span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <button style={{
              width: "100%", padding: "8px 0", background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6,
              fontSize: 10, fontWeight: 700, color: "#94a3b8",
              cursor: "pointer", letterSpacing: "0.1em", textTransform: "uppercase",
            }}>
              VIEW FULL MAP
            </button>
          </div>
        </GlassCard>
      </div>

      {/* ── System Health Grid ───────────────────────────────── */}
      <div>
        <SectionTitle>System Health Grid</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          {HEALTH_ITEMS.map(item => {
            const c = STATUS_COLOR[item.status];
            return (
              <GlassCard key={item.name} style={{
                padding: "16px", display: "flex", alignItems: "center", gap: 14,
                cursor: "pointer", transition: "border-color 0.2s",
                border: item.status === "error"
                  ? "1px solid rgba(239,68,68,0.25)"
                  : "1px solid rgba(255,255,255,0.09)",
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                  background: `${c}18`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{
                    width: 10, height: 10, borderRadius: "50%", background: c,
                    boxShadow: item.status === "healthy" ? `0 0 8px ${c}` :
                               item.status === "error"   ? `0 0 12px ${c}` : "none",
                    animation: item.status === "healthy" ? "healthpulse 2s infinite" : "none",
                    display: "block",
                  }} />
                </div>
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9", marginBottom: 2,
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: 10, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {item.desc}
                  </div>
                </div>
                <span style={{ fontSize: 16, color: item.status === "error" ? "#EF4444" : "#475569", flexShrink: 0 }}>
                  {item.status === "error" ? "⚠" : "›"}
                </span>
              </GlassCard>
            );
          })}
        </div>
      </div>

      {/* ── Data Center Banner ───────────────────────────────── */}
      <div style={{
        position: "relative", overflow: "hidden", borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.08)", height: 240,
        background: "#0a1628",
      }}>
        <img
          src="https://images.unsplash.com/photo-1558494949-ef010cbdcc4b?w=1200&auto=format&fit=crop&q=60"
          alt="Data Center Zurich"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover", opacity: 0.25, filter: "grayscale(20%)" }}
        />
        {/* Gradients */}
        <div style={{ position: "absolute", inset: 0,
          background: "linear-gradient(to top, #051424 30%, rgba(5,20,36,0.4) 70%, transparent)" }} />
        <div style={{ position: "absolute", inset: 0,
          background: "linear-gradient(to right, rgba(5,20,36,0.7) 0%, transparent 60%)" }} />

        {/* Content */}
        <div style={{ position: "absolute", bottom: 24, left: 24 }}>
          <h4 style={{ fontSize: 20, fontWeight: 600, color: "#f1f5f9",
            textTransform: "uppercase", letterSpacing: "0.05em", margin: 0, marginBottom: 12 }}>
            Physical Data Center 01 — Zurich
          </h4>
          <div style={{ display: "flex", gap: 12 }}>
            {[
              { icon: "🌡", label: `Temp: ${stats.temp}°C`   },
              { icon: "⚡", label: `Power: ${stats.power}MW` },
            ].map(s => (
              <div key={s.label} style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "6px 14px", borderRadius: 6,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}>
                <span>{s.icon}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#cbd5e1",
                  textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <button style={{
          position: "absolute", top: 24, right: 24,
          padding: "8px 20px", borderRadius: 6,
          border: `1px solid ${NEON}40`, background: `${NEON}12`,
          color: NEON, fontSize: 10, fontWeight: 700,
          cursor: "pointer", letterSpacing: "0.1em", textTransform: "uppercase",
          backdropFilter: "blur(8px)",
        }}>
          Manage Physical Nodes
        </button>

        {/* Scanline overlay */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.15,
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)",
        }} />
      </div>

      <style>{`
        @keyframes healthpulse {
          0%   { box-shadow: 0 0 0 0 rgba(0,255,157,0.5); }
          70%  { box-shadow: 0 0 0 8px rgba(0,255,157,0); }
          100% { box-shadow: 0 0 0 0 rgba(0,255,157,0); }
        }
      `}</style>
    </div>
  );
}