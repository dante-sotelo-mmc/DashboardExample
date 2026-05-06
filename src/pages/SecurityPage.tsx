// src/pages/SecurityPage.tsx
import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from "recharts";
import { GlassCard } from "../components/ui/GlassCard";
import { SectionTitle } from "../components/ui/SectionTitle";

const NEON = "#00FF9D";

// ── Tipos ────────────────────────────────────────────────────────────────────
interface LogEntry {
  time: string;
  level: "CRIT" | "WARN" | "INFO";
  message: string;
}

interface ThroughputBar {
  label: string;
  inbound: number;
  outbound: number;
  spike?: boolean;
}

interface IntrusionMetric {
  label: string;
  value: number;
  status: "healthy" | "warning";
}

// ── Generadores locales ──────────────────────────────────────────────────────
const rand = (min: number, max: number) =>
  +(min + Math.random() * (max - min)).toFixed(1);
const randInt = (min: number, max: number) =>
  Math.floor(min + Math.random() * (max - min + 1));

const CRIT_MSGS = [
  "Multiple failed auth attempts on Root-Swift-Gate-04. IP: 194.22.1.8. Vector: Brute-Force.",
  "SQL Injection pattern detected in Transaction Gateway B. Payload intercepted.",
  "Foreign signature detected in Encrypted Storage Node 4. Lockdown engaged.",
  "Unauthorized root access attempt on DB-Cluster-EU-West-02.",
  "DDoS flood detected on Payment API. Rate limiting enforced.",
];
const WARN_MSGS = [
  "Unexpected outbound traffic spike from ATM-Cluster-NY-West. Vol: 450MB/s.",
  "API Latency threshold exceeded: core.payments.auth.",
  "Certificate expiry warning: gateway-tls-prod-03 expires in 6 days.",
  "Botnet probe detected on edge firewall FW-APAC-04.",
  "Anomalous login pattern for service account svc-reporting-01.",
];
const INFO_MSGS = [
  "Firewall rule FW-E3 updated by System.",
  "Heuristic analysis completed for VPC-Internal-01. No issues.",
  "Node Re-balance successful in Cluster Delta.",
  "Routine cert rotation completed on Auth-Service-US-East.",
  "Threat intel feed updated: 4,821 new IOCs loaded.",
];

const pickMsg = (level: "CRIT" | "WARN" | "INFO") => {
  const pool = level === "CRIT" ? CRIT_MSGS : level === "WARN" ? WARN_MSGS : INFO_MSGS;
  return pool[randInt(0, pool.length - 1)];
};

const genLog = (): LogEntry => {
  const now = new Date();
  const time = `[${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}:${String(now.getSeconds()).padStart(2,"0")}]`;
  const levels: ("CRIT" | "WARN" | "INFO")[] = ["CRIT","WARN","INFO","INFO","WARN"];
  const level = levels[randInt(0, levels.length - 1)];
  return { time, level, message: pickMsg(level) };
};

const genThroughput = (): ThroughputBar[] =>
  Array.from({ length: 12 }, (_, i) => ({
    label: i === 11 ? "NOW" : i === 5 ? "T-15" : i === 0 ? "T-30" : "",
    inbound:  rand(20, 90),
    outbound: rand(10, 60),
    spike: i === 4,
  }));

const genIntrusion = (): IntrusionMetric[] => [
  { label: "Cross-Site Scripting (XSS)",  value: rand(98, 100),  status: "healthy" },
  { label: "Credential Stuffing",          value: rand(96, 100),  status: "healthy" },
  { label: "Botnet Propagation",           value: rand(70, 92),   status: "warning" },
  { label: "SQL Injection",                value: rand(99, 100),  status: "healthy" },
  { label: "DDoS Amplification",           value: rand(80, 98),   status: "warning" },
];

const genStats = () => ({
  posture:   randInt(88, 99),
  critical:  randInt(5, 20),
  highRisk:  randInt(30, 80),
  mitigated: randInt(1800, 3200),
  blocked:   randInt(10000, 20000),
  topVector: ["RU-MOS-01 (DDoS)", "CN-SHA-02 (BruteForce)", "IR-THR-04 (SQLi)"][randInt(0,2)],
});

// ── Componente ───────────────────────────────────────────────────────────────
export function SecurityPage({ data: _data }: { data: any }) {
  const [stats,      setStats]      = useState(genStats);
  const [throughput, setThroughput] = useState(genThroughput);
  const [intrusion,  setIntrusion]  = useState(genIntrusion);
  const [logs,       setLogs]       = useState<LogEntry[]>(() =>
    Array.from({ length: 8 }, genLog)
  );

  // Refresco general cada 4s
  useEffect(() => {
    const t = setInterval(() => {
      setStats(genStats());
      setThroughput(genThroughput());
      setIntrusion(genIntrusion());
    }, 4000);
    return () => clearInterval(t);
  }, []);

  // Log nuevo cada 2s
  useEffect(() => {
    const t = setInterval(() => {
      setLogs(prev => [genLog(), ...prev.slice(0, 11)]);
    }, 2000);
    return () => clearInterval(t);
  }, []);

  const postureColor =
    stats.posture >= 90 ? NEON : stats.posture >= 75 ? "#F59E0B" : "#EF4444";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* ── Fila 1: Postura + Contadores ─────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16 }}>

        {/* Security Posture */}
        <GlassCard style={{ padding: "24px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 240 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <span style={{ fontSize: 10, color: NEON, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>
              Security Posture
            </span>
            <span style={{ fontSize: 20 }}>🛡</span>
          </div>

          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontSize: 80, fontWeight: 700, lineHeight: 1, color: postureColor, fontFamily: "Space Grotesk, sans-serif", transition: "color 0.5s" }}>
              {stats.posture}
            </span>
            <span style={{ fontSize: 20, color: "#475569" }}>/ 100</span>
          </div>

          <div>
            <div style={{ width: "100%", height: 6, background: "rgba(255,255,255,0.07)", borderRadius: 99, overflow: "hidden", marginBottom: 10 }}>
              <div style={{
                height: "100%", borderRadius: 99,
                width: `${stats.posture}%`,
                background: postureColor,
                boxShadow: `0 0 10px ${postureColor}`,
                transition: "width 1s ease",
              }} />
            </div>
            <p style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", lineHeight: 1.6 }}>
              Risk Level: <span style={{ color: postureColor }}>
                {stats.posture >= 90 ? "Optimized" : stats.posture >= 75 ? "Moderate" : "Critical"}
              </span>. 4 active mitigation protocols running.
            </p>
          </div>
        </GlassCard>

        {/* Contadores: Critical / High Risk / Mitigated */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>

          {/* Critical */}
          <GlassCard style={{ padding: "24px", borderLeft: "4px solid #EF4444", background: "rgba(239,68,68,0.04)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <span style={{ fontSize: 10, color: "#EF4444", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                Critical Alerts
              </span>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#EF4444",
                boxShadow: "0 0 0 0 rgba(239,68,68,0.7)", animation: "secpulse 2s infinite", display: "block" }} />
            </div>
            <div style={{ fontSize: 48, fontWeight: 700, color: "#EF4444", lineHeight: 1, fontFamily: "Space Grotesk, sans-serif" }}>
              {stats.critical}
            </div>
            <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 11, color: "#F87171", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                ⚠ Immediate Action Required
              </span>
            </div>
          </GlassCard>

          {/* High Risk */}
          <GlassCard style={{ padding: "24px", borderLeft: "4px solid #F59E0B", background: "rgba(245,158,11,0.04)" }}>
            <div style={{ marginBottom: 16 }}>
              <span style={{ fontSize: 10, color: "#F59E0B", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                High Risk
              </span>
            </div>
            <div style={{ fontSize: 48, fontWeight: 700, color: "#F59E0B", lineHeight: 1, fontFamily: "Space Grotesk, sans-serif" }}>
              {stats.highRisk}
            </div>
            <div style={{ marginTop: 16 }}>
              <span style={{ fontSize: 11, color: "#FCD34D", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                ↑ +14% vs Previous Hour
              </span>
            </div>
          </GlassCard>

          {/* Mitigated */}
          <GlassCard style={{ padding: "24px", borderLeft: `4px solid ${NEON}`, background: "rgba(0,255,157,0.04)" }}>
            <div style={{ marginBottom: 16 }}>
              <span style={{ fontSize: 10, color: NEON, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                Mitigated
              </span>
            </div>
            <div style={{ fontSize: 48, fontWeight: 700, color: NEON, lineHeight: 1, fontFamily: "Space Grotesk, sans-serif" }}>
              {(stats.mitigated / 1000).toFixed(1)}K
            </div>
            <div style={{ marginTop: 16 }}>
              <span style={{ fontSize: 11, color: NEON, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                ✓ Auto-Quarantined
              </span>
            </div>
          </GlassCard>

        </div>
      </div>

      {/* ── Fila 2: Mapa + Log ───────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>

        {/* Global Threats Map */}
        <GlassCard style={{ overflow: "hidden", display: "flex", flexDirection: "column", minHeight: 360 }}>
          <div style={{
            padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            background: "rgba(255,255,255,0.03)",
          }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: "#e2e8f0", letterSpacing: "0.12em", textTransform: "uppercase" }}>
              🌐 Global Ingress Threats
            </span>
            <span style={{
              padding: "2px 8px", borderRadius: 4, background: "rgba(239,68,68,0.2)",
              color: "#F87171", fontSize: 9, fontWeight: 700, letterSpacing: "0.08em",
            }}>
              LIVE SOURCE
            </span>
          </div>

          <div style={{ flex: 1, position: "relative", background: "#051424", minHeight: 280 }}>
            <img
              src="https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=900&auto=format&fit=crop&q=60"
              alt="Global threat map"
              style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.25, filter: "grayscale(30%) hue-rotate(120deg)" }}
            />
            {/* Overlay stats */}
            <div style={{ position: "absolute", bottom: 20, left: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { label: "Top Vector",    value: stats.topVector,                       color: "#F87171" },
                { label: "Active Blocks", value: `${stats.blocked.toLocaleString()} /min`, color: NEON     },
              ].map(s => (
                <div key={s.label} style={{
                  padding: "10px 14px", borderRadius: 8,
                  background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}>
                  <div style={{ fontSize: 9, color: "#64748b", textTransform: "uppercase", marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: s.color, fontFamily: "monospace" }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Anomaly Stream / Live Log */}
        <GlassCard style={{ display: "flex", flexDirection: "column", maxHeight: 360 }}>
          <div style={{
            padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.03)",
          }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: "#e2e8f0", letterSpacing: "0.12em", textTransform: "uppercase" }}>
              ≡ Anomaly Stream
            </span>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
            {logs.map((log, i) => {
              const color = log.level === "CRIT" ? "#F87171" : log.level === "WARN" ? "#FCD34D" : "#94a3b8";
              return (
                <div key={i} style={{ display: "flex", gap: 10, fontSize: 11, fontFamily: "monospace",
                  opacity: i === 0 ? 1 : 1 - i * 0.06,
                  color, animation: i === 0 ? "fadeIn 0.4s ease" : undefined,
                }}>
                  <span style={{ color: "#475569", flexShrink: 0 }}>{log.time}</span>
                  <span><span style={{ fontWeight: 700 }}>{log.level}:</span> {log.message}</span>
                </div>
              );
            })}
          </div>

          <div style={{
            padding: "8px 16px", borderTop: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.03)",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: NEON,
              boxShadow: `0 0 6px ${NEON}`, animation: "ping 1s infinite", display: "block" }} />
            <span style={{ fontSize: 10, color: NEON, fontWeight: 700, letterSpacing: "0.1em" }}>
              STREAMING TELEMETRY...
            </span>
          </div>
        </GlassCard>
      </div>

      {/* ── Fila 3: Firewall Throughput + Intrusion Metrics ──── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

        {/* Firewall Throughput */}
        <GlassCard style={{ padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <SectionTitle>⚡ Firewall Edge Throughput</SectionTitle>
            <div style={{ display: "flex", gap: 16 }}>
              {[{ c: NEON, l: "Inbound" }, { c: "#3B82F6", l: "Outbound" }].map(x => (
                <span key={x.l} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: "#64748b" }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: x.c }} />
                  {x.l}
                </span>
              ))}
            </div>
          </div>
          <div style={{ height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={throughput} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barGap={2}>
                <XAxis dataKey="label" tick={{ fontSize: 9, fill: "#475569" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: "#475569" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "#0F172A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 11 }}
                  itemStyle={{ color: NEON }} labelStyle={{ color: "#94a3b8" }}
                />
                <Bar dataKey="inbound" radius={[2,2,0,0]} name="Inbound">
                  {throughput.map((d, i) => (
                    <Cell key={i} fill={d.spike ? "#EF4444" : NEON} fillOpacity={d.spike ? 0.9 : 0.6} />
                  ))}
                </Bar>
                <Bar dataKey="outbound" fill="#3B82F6" radius={[2,2,0,0]} fillOpacity={0.5} name="Outbound" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#334155", fontFamily: "monospace", marginTop: 6 }}>
            <span>T-30 MIN</span><span>T-15 MIN</span><span>CURRENT</span>
          </div>
        </GlassCard>

        {/* Intrusion Prevention Metrics */}
        <GlassCard style={{ padding: "24px" }}>
          <SectionTitle>🚫 Intrusion Prevention Metrics</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 8 }}>
            {intrusion.map(metric => {
              const color = metric.status === "healthy" ? NEON : "#F59E0B";
              return (
                <div key={metric.label}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: "#cbd5e1", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                      {metric.label}
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 700, color, fontFamily: "monospace" }}>
                      {metric.value.toFixed(1)}% Filtered
                    </span>
                  </div>
                  <div style={{ width: "100%", height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 99 }}>
                    <div style={{
                      height: "100%", borderRadius: 99,
                      width: `${metric.value}%`,
                      background: color,
                      boxShadow: `0 0 8px ${color}80`,
                      transition: "width 1s ease",
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>

      </div>

      {/* ── Banner de incidente ───────────────────────────────── */}
      <div style={{
        padding: "10px 20px", borderRadius: 10,
        background: "rgba(255,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)",
        display: "flex", alignItems: "center", gap: 14,
      }}>
        <span style={{ animation: "secpulse 1.5s infinite", fontSize: 18 }}>📢</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#FCA5A5", textTransform: "uppercase", letterSpacing: "0.06em", flex: 1 }}>
          TIER 1 INCIDENT: Potential Exfiltration detected in Core Banking API v2. Forensic snapshot initiated.
        </span>
        <span style={{ fontSize: 10, color: "#F87171", fontFamily: "monospace" }}>Assigned: SecOps-Team-Alpha</span>
        <button style={{
          padding: "4px 14px", borderRadius: 6, border: "1px solid #EF4444",
          background: "rgba(239,68,68,0.15)", color: "#FCA5A5",
          fontSize: 10, fontWeight: 700, cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.06em",
        }}>
          View Case
        </button>
      </div>

      <style>{`
        @keyframes secpulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ping {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%       { transform: scale(1.4); opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}