// src/App.tsx
import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { InfrastructurePage } from './pages/InfrastructurePage';
import { TransactionsPage }   from './pages/TransactionsPage';
import { SecurityPage }       from './pages/SecurityPage';
import { NodesPage }          from './pages/NodesPage';
import {
  genTelemetry,
  genLatency,
  genTransactions,
  genSecurityEvents,
  genNodes,
} from './data/generators';

const NEON = "#00FF9D";

const NAV = [
  { id: "infra",    label: "Infrastructure", path: "/"             },
  { id: "trans",    label: "Transactions",   path: "/transactions"  },
  { id: "security", label: "Security",       path: "/security"      },
  { id: "nodes",    label: "Node Inventory", path: "/nodes"         },
];

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [tick, setTick] = useState(0);
  const [time, setTime] = useState(new Date());
  const [data, setData] = useState(() => ({
    telemetry:      genTelemetry(),
    latency:        genLatency(),
    transactions:   genTransactions(),
    securityEvents: genSecurityEvents(),
    nodes:          genNodes(),
  }));

  useEffect(() => {
    const clock   = setInterval(() => setTime(new Date()), 1000);
    const refresh = setInterval(() => {
      setData({
        telemetry:      genTelemetry(),
        latency:        genLatency(),
        transactions:   genTransactions(),
        securityEvents: genSecurityEvents(),
        nodes:          genNodes(),
      });
      setTick(t => t + 1);
    }, 4000);
    return () => { clearInterval(clock); clearInterval(refresh); };
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const currentLabel = NAV.find(p => p.path === location.pathname)?.label ?? "Infrastructure";

  return (
    <div style={{
      minHeight: "100vh",
      background: "#051424",
      fontFamily: "'Space Grotesk', 'Inter', sans-serif",
      color: "#e2e8f0",
    }}>

      {/* ── Top Bar ─────────────────────────────────────────── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 28px", height: 58,
        background: "rgba(5, 20, 36, 0.9)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}>

        {/* Logo + Nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <span style={{
            fontSize: 16, fontWeight: 700, letterSpacing: "-0.02em",
            color: NEON, textTransform: "uppercase",
          }}>
            SENTINEL COMMAND
          </span>

          <div style={{ display: "flex", gap: 2 }}>
            {NAV.map(p => (
              <button
                key={p.id}
                onClick={() => navigate(p.path)}
                style={{
                  padding: "6px 16px", borderRadius: 8,
                  border: "none", cursor: "pointer",
                  fontSize: 11, fontWeight: 700,
                  letterSpacing: "0.06em", textTransform: "uppercase",
                  transition: "all 0.2s",
                  background:   isActive(p.path) ? `${NEON}18` : "transparent",
                  color:        isActive(p.path) ? NEON : "#475569",
                  borderBottom: isActive(p.path)
                    ? `2px solid ${NEON}`
                    : "2px solid transparent",
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right: LIVE badge + clock + avatar */}
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "4px 12px", borderRadius: 99,
            background: `${NEON}12`, border: `1px solid ${NEON}30`,
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: "50%",
              background: NEON, boxShadow: `0 0 8px ${NEON}`,
              animation: "pulse 2s infinite",
            }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: NEON, letterSpacing: "0.1em" }}>
              LIVE
            </span>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, color: "#475569", letterSpacing: "0.08em" }}>UTC</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: NEON, fontFamily: "monospace" }}>
              {time.toLocaleTimeString("en-US", { hour12: false })}
            </div>
          </div>

          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: `${NEON}20`, border: `1px solid ${NEON}40`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, color: NEON, fontWeight: 700,
          }}>
            OP
          </div>
        </div>
      </div>

      {/* ── Main Content ─────────────────────────────────────── */}
      <div style={{ padding: "28px 28px 40px" }}>

        {/* Page header */}
        <div style={{
          marginBottom: 24,
          display: "flex", justifyContent: "space-between", alignItems: "flex-start",
        }}>
          <div>
            <h1 style={{
              fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em",
              color: "#f1f5f9", margin: 0, marginBottom: 6,
            }}>
              {currentLabel}
            </h1>
            <p style={{ fontSize: 12, color: "#475569", margin: 0 }}>
              Real-time data · Refreshes every 4s · Cycle #{tick + 1}
            </p>
          </div>

          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 9, color: "#334155", fontWeight: 700, letterSpacing: "0.1em", marginBottom: 2 }}>
                UPTIME
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9" }}>99.998%</div>
            </div>
            <div style={{ width: 1, height: 32, background: "rgba(255,255,255,0.06)" }} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 9, color: "#334155", fontWeight: 700, letterSpacing: "0.1em", marginBottom: 2 }}>
                CLUSTERS
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9" }}>14</div>
            </div>
          </div>
        </div>

        {/* ── Routes ──────────────────────────────────────────── */}
        <Routes>
          <Route path="/"             element={<InfrastructurePage key={tick} data={data} />} />
          <Route path="/transactions" element={<TransactionsPage   key={tick} data={data} />} />
          <Route path="/security"     element={<SecurityPage       key={tick} data={data} />} />
          <Route path="/nodes"        element={<NodesPage          key={tick} data={data} />} />
        </Routes>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&display=swap');
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        * { box-sizing: border-box; }
        button:hover { opacity: 0.85; }
      `}</style>
    </div>
  );
}