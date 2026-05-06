export function GlassCard({ children, style = {} }: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div style={{
      background: "rgba(26, 31, 44, 0.65)",
      backdropFilter: "blur(12px)",
      border: "1px solid rgba(255,255,255,0.09)",
      borderTop: "1px solid rgba(255,255,255,0.18)",
      borderRadius: 12,
      ...style,
    }}>
      {children}
    </div>
  );
}