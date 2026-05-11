// Toast.jsx — Minimal toast notification (success/error/info)

const COLORS = {
  success: { bg: "rgba(255,255,255,0.15)", border: "rgba(255,255,255,0.35)", text: "#FFFFFF", icon: "✓" },
  error: { bg: "rgba(255,107,107,0.12)", border: "rgba(255,107,107,0.3)", text: "#ff6b6b", icon: "✕" },
  info: { bg: "rgba(255,255,255,0.12)", border: "rgba(255,255,255,0.3)", text: "#9D93F0", icon: "ℹ" },
};

export default function Toast({ message, type = "success", onClose }) {
  const c = COLORS[type] || COLORS.success;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", bottom: "28px", left: "50%", transform: "translateX(-50%)",
        zIndex: 9999, cursor: "pointer",
        display: "flex", alignItems: "center", gap: "10px",
        padding: "12px 20px", borderRadius: "12px",
        background: c.bg, border: `1px solid ${c.border}`,
        backdropFilter: "blur(20px)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        fontFamily: "'Inter', sans-serif",
        maxWidth: "90vw",
        animation: "fadeInUp 0.25s ease-out",
      }}
    >
      <span style={{
        width: "22px", height: "22px", borderRadius: "50%",
        background: c.border, color: "#fff", fontSize: "12px", fontWeight: "700",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>{c.icon}</span>
      <span style={{ fontSize: "13px", color: c.text, fontWeight: "600", lineHeight: 1.4 }}>{message}</span>
    </div>
  );
}
