const colors: Record<string, string> = {
  healthy: "#00FF9D",
  warning: "#F59E0B",
  critical: "#EF4444",
};

export function Pill({ status }: { status: string }) {
  const c = colors[status] || "#888";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "2px 10px", borderRadius: 99, fontSize: 10, fontWeight: 700,
      letterSpacing: "0.08em", textTransform: "uppercase",
      background: c + "18", color: c, border: `1px solid ${c}40`,
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: "50%", background: c,
        boxShadow: status === "healthy" ? `0 0 6px ${c}` : "none",
      }} />
      {status}
    </span>
  );
}