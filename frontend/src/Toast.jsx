// Toast.jsx — Minimal toast notification (success/error/info)
import { motion } from "framer-motion";

const COLORS = {
  success: { bg: "rgba(29,179,117,0.15)", border: "rgba(29,179,117,0.35)", text: "#1DB375", icon: "✓" },
  error: { bg: "rgba(255,107,107,0.12)", border: "rgba(255,107,107,0.3)", text: "#ff6b6b", icon: "✕" },
  info: { bg: "rgba(123,110,232,0.12)", border: "rgba(123,110,232,0.3)", text: "#9D93F0", icon: "ℹ" },
};

export default function Toast({ message, type = "success", onClose }) {
  const c = COLORS[type] || COLORS.success;
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      onClick={onClose}
      style={{
        position: "fixed", bottom: "28px", left: "50%", transform: "translateX(-50%)",
        zIndex: 9999, cursor: "pointer",
        display: "flex", alignItems: "center", gap: "10px",
        padding: "12px 20px", borderRadius: "12px",
        background: c.bg, border: `1px solid ${c.border}`,
        backdropFilter: "blur(20px)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        fontFamily: "'DM Sans', sans-serif",
        maxWidth: "90vw",
      }}
    >
      <span style={{
        width: "22px", height: "22px", borderRadius: "50%",
        background: c.border, color: "#fff", fontSize: "12px", fontWeight: "700",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>{c.icon}</span>
      <span style={{ fontSize: "13px", color: c.text, fontWeight: "600", lineHeight: 1.4 }}>{message}</span>
    </motion.div>
  );
}
