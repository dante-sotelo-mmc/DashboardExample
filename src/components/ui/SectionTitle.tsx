const NEON = "#00FF9D";

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 700, letterSpacing: "0.15em",
      textTransform: "uppercase", color: "#475569",
      borderLeft: `2px solid ${NEON}`, paddingLeft: 10, marginBottom: 16,
    }}>
      {children}
    </div>
  );
}