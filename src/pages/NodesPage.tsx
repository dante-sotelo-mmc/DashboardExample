import { GlassCard } from "../components/ui/GlassCard";
import { StatCard } from "../components/ui/StatCard";
import { SectionTitle } from "../components/ui/SectionTitle";
import { Pill } from "../components/ui/Pill";

const NEON = "#00FF9D";

export function NodesPage({ data }: { data: any }) {
  const { nodes } = data;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
        <StatCard title="Total Nodes" value={nodes.length}                                     color={NEON}      />
        <StatCard title="Healthy"     value={nodes.filter((n: any) => n.status === "healthy").length} color="#10B981" />
        <StatCard title="Warning"     value={nodes.filter((n: any) => n.status === "warning").length} color="#F59E0B" />
        <StatCard title="Critical"    value={nodes.filter((n: any) => n.status === "critical").length} color="#EF4444" />
      </div>

      <GlassCard style={{ padding: "20px 24px" }}>
        <SectionTitle>Node Inventory</SectionTitle>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {["Node ID", "Region", "CPU %", "MEM %", "Disk %", "Status", "Uptime"].map(h => (
                  <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: 10, fontWeight: 700, color: "#475569", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {nodes.map((n: any, i: number) => (
                <tr key={n.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)" }}>
                  <td style={{ padding: "10px 12px", color: NEON, fontWeight: 600, fontFamily: "monospace" }}>{n.id}</td>
                  <td style={{ padding: "10px 12px", color: "#94a3b8", fontSize: 11 }}>{n.region}</td>
                  {[n.cpu, n.mem, n.disk].map((v: number, j: number) => (
                    <td key={j} style={{ padding: "10px 12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 48, height: 4, background: "rgba(255,255,255,0.05)", borderRadius: 99 }}>
                          <div style={{ height: "100%", borderRadius: 99, width: `${v}%`,
                            background: v > 80 ? "#EF4444" : v > 60 ? "#F59E0B" : NEON }} />
                        </div>
                        <span style={{ color: v > 80 ? "#EF4444" : v > 60 ? "#F59E0B" : "#94a3b8", fontSize: 11 }}>{v}%</span>
                      </div>
                    </td>
                  ))}
                  <td style={{ padding: "10px 12px" }}><Pill status={n.status} /></td>
                  <td style={{ padding: "10px 12px", color: "#475569", fontSize: 11, fontFamily: "monospace" }}>{n.uptime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}