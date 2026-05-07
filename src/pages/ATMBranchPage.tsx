// src/pages/ATMBranchPage.tsx
import { useEffect, useState } from "react";
import { GlassCard } from "../components/ui/GlassCard";
import { SectionTitle } from "../components/ui/SectionTitle";

const NEON = "#00FF9D";

// ── Tipos ────────────────────────────────────────────────────────────────────
interface ATMCash {
  id: string;
  location: string;
  level: number;
  status: "critical" | "warning" | "optimal";
  eta: string;
}

interface Fault {
  id: string;
  title: string;
  desc: string;
  severity: "error" | "warning" | "ok";
  time: string;
}

interface LogEntry {
  timestamp: string;
  entity: string;
  event: string;
  region: string;
  code: string;
  ok: boolean;
}

// ── Generadores ──────────────────────────────────────────────────────────────
const rand    = (min: number, max: number) => +(min + Math.random() * (max - min)).toFixed(1);
const randInt = (min: number, max: number) => Math.floor(min + Math.random() * (max - min + 1));

const genCash = (): ATMCash[] => {
  const atms = [
    { id: "ATM-7742", location: "DOWNTOWN"     },
    { id: "ATM-9011", location: "AIRPORT"      },
    { id: "ATM-1250", location: "SHOPPING MALL"},
    { id: "ATM-5561", location: "WEST CAMPUS"  },
    { id: "ATM-3302", location: "CENTRAL PLAZA"},
  ];
  return atms.map(a => {
    const level = randInt(2, 97);
    return {
      ...a,
      level,
      status: level < 10 ? "critical" : level < 25 ? "warning" : "optimal",
      eta: level < 10 ? "~2HRS REMAINING"
         : level < 25 ? "REFILL SCHEDULED"
         : `NEXT REFILL: ${randInt(24, 96)}H`,
    };
  });
};

const FAULT_POOL: Omit<Fault, "time">[] = [
  { id: "ATM-881",  title: "Dispenser Jam",          desc: "Tier 3 Technical Support required",  severity: "error"   },
  { id: "BR-224",   title: "Network Latency",         desc: "Sub-optimal connection detected",    severity: "warning" },
  { id: "ATM-112",  title: "Card Reader Failure",     desc: "Physical damage reported",           severity: "error"   },
  { id: "BR-990",   title: "Firmware Update",         desc: "Successful remote deployment",       severity: "ok"      },
  { id: "ATM-443",  title: "Power Fluctuation",       desc: "UPS engaged on secondary circuit",   severity: "warning" },
  { id: "BR-117",   title: "VPN Reconnected",         desc: "Automatic failover completed",       severity: "ok"      },
];

const genFaults = (): Fault[] =>
  FAULT_POOL.map((f, i) => ({
    ...f,
    time: i === 0 ? `${randInt(5,15)}m ago`
        : i === 1 ? `${randInt(30,59)}m ago`
        : i === 2 ? `${randInt(1,2)}h ago`
        : `${randInt(2,5)}h ago`,
  }));

const LOG_EVENTS = [
  { event: "VPN Handshake Re-established",   ok: true  },
  { event: "Cash Bin Disconnected",          ok: false },
  { event: "Biometric Module Authenticated", ok: true  },
  { event: "Card Reader Timeout",            ok: false },
  { event: "Firmware Patch Applied",         ok: true  },
  { event: "Network Route Recalculated",     ok: true  },
];
const REGIONS   = ["NY-TRIBECA","CHI-LOOP","MIA-DADE","LA-DTLA","HOU-MED","SEA-UNI"];
const ENTITIES  = ["BR-EAST-411","ATM-CENTRAL-009","ATM-SOUTH-822","BR-WEST-114","ATM-NORTH-233"];

const genLogs = (): LogEntry[] =>
  Array.from({ length: 6 }, (_, i) => {
    const ev = LOG_EVENTS[i % LOG_EVENTS.length];
    const now = new Date();
    now.setMinutes(now.getMinutes() - i * 2);
    return {
      timestamp: now.toISOString().replace("T"," ").slice(0,19),
      entity:    ENTITIES[randInt(0, ENTITIES.length - 1)],
      event:     ev.event,
      region:    REGIONS[randInt(0, REGIONS.length - 1)],
      code:      ev.ok ? "200_OK" : "503_FAIL",
      ok:        ev.ok,
    };
  });

const genStats = () => ({
  active:  randInt(4700, 4900),
  critical: randInt(30, 60),
  atmUptime: rand(97, 99.9),
  branchConn: rand(99, 99.99),
});

// ── Status helpers ───────────────────────────────────────────────────────────
const CASH_COLOR: Record<string, string> = {
  critical: "#EF4444",
  warning:  "#FFD700",
  optimal:  NEON,
};
const FAULT_COLOR: Record<string, string> = {
  error:   "#EF4444",
  warning: "#FFD700",
  ok:      NEON,
};
const FAULT_ICON: Record<string, string> = {
  error:   "⊗",
  warning: "⚠",
  ok:      "✓",
};

// ── Componente ───────────────────────────────────────────────────────────────
export function ATMBranchPage({ data: _data }: { data: any }) {
  const [stats,  setStats]  = useState(genStats);
  const [cash,   setCash]   = useState(genCash);
  const [faults, setFaults] = useState(genFaults);
  const [logs,   setLogs]   = useState(genLogs);

  useEffect(() => {
    const t = setInterval(() => {
      setStats(genStats());
      setCash(genCash());
      setFaults(genFaults());
      setLogs(genLogs());
    }, 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* ── Header ──────────────────────────────────────────── */}
      <div>
        <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.02em",
          color: "#d4e4fa", textTransform: "uppercase", margin: 0, marginBottom: 6 }}>
          ATM &amp; Branch Connectivity
        </h1>
        <p style={{ fontSize: 11, color: "#475569", textTransform: "uppercase",
          letterSpacing: "0.1em", margin: 0 }}>
          Live Monitoring Node: US-EAST-COMMAND-04
        </p>
      </div>

      {/* ── Fila 1: Mapa + Cash Supply ──────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>

        {/* Network Map */}
        <GlassCard style={{ position: "relative", overflow: "hidden", minHeight: 380 }}>
          {/* Map image */}
          <img
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900&auto=format&fit=crop&q=60"
            alt="Network map"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%",
              objectFit: "cover", opacity: 0.2, filter: "grayscale(40%) hue-rotate(100deg)" }}
          />
          <div style={{ position: "absolute", inset: 0,
            background: "linear-gradient(to top, #051424 20%, transparent 70%)" }} />

          {/* Top overlay */}
          <div style={{ position: "absolute", top: 16, left: 16, zIndex: 10 }}>
            <GlassCard style={{ padding: "10px 16px", marginBottom: 10 }}>
              <div style={{ fontSize: 10, color: NEON, fontWeight: 700,
                letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 2 }}>
                Global Network Map
              </div>
              <div style={{ fontSize: 18, fontWeight: 600, color: "#f1f5f9" }}>
                North America Operations
              </div>
            </GlassCard>
            <div style={{ display: "flex", gap: 8 }}>
              {[
                { color: NEON,      label: `${stats.active.toLocaleString()} ACTIVE`  },
                { color: "#EF4444", label: `${stats.critical} CRITICAL`, pulse: true  },
              ].map(b => (
                <div key={b.label} style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "4px 12px", borderRadius: 6,
                  background: "rgba(26,31,44,0.8)", border: "1px solid rgba(255,255,255,0.1)",
                  fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.7)",
                  fontFamily: "monospace",
                }}>
                  <span style={{
                    width: 8, height: 8, borderRadius: "50%", background: b.color,
                    animation: b.pulse ? "atmpulse 2s infinite" : undefined,
                    boxShadow: `0 0 6px ${b.color}`,
                  }} />
                  {b.label}
                </div>
              ))}
            </div>
          </div>

          {/* Pulsing dots */}
          {[
            { top: "30%", left: "35%", color: NEON      },
            { top: "50%", left: "52%", color: NEON      },
            { top: "65%", left: "25%", color: "#EF4444" },
            { top: "35%", left: "72%", color: NEON      },
            { top: "55%", left: "40%", color: "#FFD700" },
          ].map((dot, i) => (
            <div key={i} style={{
              position: "absolute", top: dot.top, left: dot.left,
              width: 12, height: 12, borderRadius: "50%",
              background: dot.color, filter: "blur(3px)", opacity: 0.8,
              animation: "atmpulse 2s infinite",
              animationDelay: `${i * 0.4}s`,
            }} />
          ))}

          {/* Bottom stats */}
          <div style={{
            position: "absolute", bottom: 16, left: 16,
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12,
          }}>
            {[
              { label: "ATM Uptime",          value: `${stats.atmUptime}%`,   color: NEON      },
              { label: "Branch Connectivity", value: `${stats.branchConn}%`,  color: "#f1f5f9" },
            ].map(s => (
              <div key={s.label} style={{
                padding: "12px 16px", borderRadius: 8,
                background: "rgba(26,31,44,0.85)", backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}>
                <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase",
                  letterSpacing: "0.08em", marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: s.color,
                  fontFamily: "Space Grotesk, sans-serif" }}>{s.value}</div>
                <div style={{ marginTop: 8, height: 4, background: "rgba(255,255,255,0.05)",
                  borderRadius: 99, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: 99,
                    width: s.value, background: s.color,
                    boxShadow: `0 0 8px ${s.color}80`,
                    transition: "width 1s ease",
                  }} />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Cash Supply */}
        <GlassCard style={{ padding: "20px", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
            marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <SectionTitle>Cash Supply</SectionTitle>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1, overflowY: "auto" }}>
            {cash.map(atm => {
              const c = CASH_COLOR[atm.status];
              return (
                <div key={atm.id} style={{
                  padding: "12px 14px", borderRadius: 8,
                  background: atm.status === "critical"
                    ? "rgba(239,68,68,0.07)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${c}30`,
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#f1f5f9",
                      fontFamily: "monospace", marginBottom: 2 }}>{atm.id}</div>
                    <div style={{ fontSize: 10, color: "#475569", textTransform: "uppercase" }}>
                      {atm.location}
                    </div>
                    <div style={{ fontSize: 10, color: c, fontWeight: 700,
                      textTransform: "uppercase", marginTop: 2 }}>
                      {atm.status === "critical" ? "CRITICAL LOW"
                       : atm.status === "warning" ? "WARNING"
                       : "OPTIMAL"}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: c,
                      fontFamily: "Space Grotesk, sans-serif", lineHeight: 1 }}>
                      {atm.level}%
                    </div>
                    <div style={{ fontSize: 9, color: "#475569", fontFamily: "monospace",
                      marginTop: 4, textTransform: "uppercase" }}>{atm.eta}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <button style={{
            marginTop: 16, width: "100%", padding: "10px 0",
            background: NEON, color: "#002110",
            border: "none", borderRadius: 6,
            fontSize: 11, fontWeight: 700, cursor: "pointer",
            letterSpacing: "0.08em", textTransform: "uppercase",
            transition: "filter 0.2s",
          }}
            onMouseOver={e => (e.currentTarget.style.filter = "brightness(1.1)")}
            onMouseOut={e  => (e.currentTarget.style.filter = "brightness(1)")}
          >
            Initiate Emergency Dispatch
          </button>
        </GlassCard>
      </div>

      {/* ── Fila 2: Faults + Logs ───────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16 }}>

        {/* Technical Faults */}
        <GlassCard style={{ padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
            marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <SectionTitle>Technical Faults</SectionTitle>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {faults.map((f, i) => {
              const c = FAULT_COLOR[f.severity];
              return (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 14,
                  padding: "12px 0",
                  borderBottom: i < faults.length - 1
                    ? "1px solid rgba(255,255,255,0.05)" : "none",
                }}>
                  <span style={{ fontSize: 18, color: c, flexShrink: 0 }}>
                    {FAULT_ICON[f.severity]}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#f1f5f9", marginBottom: 2 }}>
                      {f.title}: {f.id}
                    </div>
                    <div style={{ fontSize: 10, color: "#475569" }}>{f.desc}</div>
                  </div>
                  <span style={{ fontSize: 10, color: "#334155",
                    fontFamily: "monospace", flexShrink: 0 }}>{f.time}</span>
                </div>
              );
            })}
          </div>
        </GlassCard>

        {/* Operational Logs */}
        <GlassCard style={{ padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
            marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <SectionTitle>Operational Logs</SectionTitle>
            <div style={{ display: "flex", gap: 16 }}>
              {[{ c: NEON, l: "Success" }, { c: "#EF4444", l: "Fault" }].map(x => (
                <span key={x.l} style={{ display: "flex", alignItems: "center",
                  gap: 5, fontSize: 10, color: "#64748b" }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: x.c }} />
                  {x.l}
                </span>
              ))}
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                  {["Timestamp", "Entity ID", "Event Type", "Region", "Status"].map(h => (
                    <th key={h} style={{ padding: "6px 12px", textAlign: "left",
                      fontSize: 10, fontWeight: 700, color: "#334155",
                      letterSpacing: "0.08em", textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {logs.map((log, i) => (
                  <tr key={i} style={{
                    borderBottom: "1px solid rgba(255,255,255,0.03)",
                    background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)",
                    transition: "background 0.2s",
                  }}>
                    <td style={{ padding: "10px 12px", color: "#475569",
                      fontFamily: "monospace", fontSize: 10 }}>{log.timestamp}</td>
                    <td style={{ padding: "10px 12px", color: "#f1f5f9",
                      fontWeight: 600, fontFamily: "monospace" }}>{log.entity}</td>
                    <td style={{ padding: "10px 12px", color: "#94a3b8" }}>{log.event}</td>
                    <td style={{ padding: "10px 12px", color: "#475569",
                      fontFamily: "monospace" }}>{log.region}</td>
                    <td style={{ padding: "10px 12px" }}>
                      <span style={{
                        color: log.ok ? NEON : "#EF4444",
                        fontWeight: 700, fontFamily: "monospace", fontSize: 11,
                      }}>{log.code}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>

      <style>{`
        @keyframes atmpulse {
          0%, 100% { opacity: 1; transform: scale(1);   }
          50%       { opacity: 0.5; transform: scale(1.3); }
        }
      `}</style>
    </div>
  );
}