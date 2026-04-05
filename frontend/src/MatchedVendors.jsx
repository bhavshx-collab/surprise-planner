// MatchedVendors.jsx — Auto-matched vendors from AI plan
import { motion } from "framer-motion";

export default function MatchedVendors({ vendors, onBrowse }) {
  if (!vendors || vendors.length === 0) return null;

  const openWhatsApp = (v) => {
    const num = (v.whatsapp || v.phone || "").replace(/\D/g, "");
    const msg = encodeURIComponent(`Hi ${v.name}! I found you on AI Surprise Planner and I'd love to book for a special occasion.`);
    window.open(`https://wa.me/${num}?text=${msg}`, "_blank");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      style={{ marginBottom: "14px" }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
        <div style={{ flex: 1, height: "1px", background: "rgba(212,175,55,0.15)" }} />
        <div style={{ fontSize: "11px", fontWeight: "700", color: "var(--gold)", textTransform: "uppercase", letterSpacing: "0.12em", opacity: 0.8, whiteSpace: "nowrap" }}>
          ✦ Matched for your plan
        </div>
        <div style={{ flex: 1, height: "1px", background: "rgba(212,175,55,0.15)" }} />
      </div>

      <motion.div
        style={{ display: "flex", flexDirection: "column", gap: "8px" }}
        initial="hidden" animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        {vendors.map((v, i) => (
          <motion.div
            key={i}
            variants={{ hidden: { opacity: 0, x: -16 }, visible: { opacity: 1, x: 0 } }}
            transition={{ duration: 0.4 }}
            style={{
              background: "var(--glass)",
              border: v.is_featured ? "1px solid rgba(212,175,55,0.3)" : "1px solid var(--glass-border)",
              borderRadius: "12px",
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              backdropFilter: "blur(16px)",
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
                {v.is_featured && <span style={{ fontSize: "9px", fontWeight: "700", color: "var(--gold)", background: "var(--gold-bg)", border: "1px solid rgba(212,175,55,0.3)", padding: "2px 7px", borderRadius: "20px", letterSpacing: "0.08em", textTransform: "uppercase" }}>Featured</span>}
                <span style={{ fontSize: "14px", fontWeight: "500", color: "var(--text-1)" }}>{v.name}</span>
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-3)" }}>
                {v.category}{v.city ? ` · ${v.city}` : ""}{v.min_budget ? ` · from ₹${Number(v.min_budget).toLocaleString("en-IN")}` : ""}
              </div>
            </div>
            {(v.whatsapp || v.phone) && (
              <button
                onClick={() => openWhatsApp(v)}
                style={{
                  padding: "8px 14px", borderRadius: "20px", border: "none",
                  background: "#25D366", color: "#fff", fontSize: "12px",
                  fontWeight: "600", cursor: "pointer", flexShrink: 0, fontFamily: "inherit",
                }}
              >
                WhatsApp
              </button>
            )}
          </motion.div>
        ))}
      </motion.div>

      {onBrowse && (
        <button
          onClick={onBrowse}
          style={{ width: "100%", padding: "10px", marginTop: "8px", borderRadius: "8px", background: "transparent", border: "1px solid var(--glass-border)", color: "var(--text-2)", fontSize: "12px", cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.04em" }}
        >
          See all vendors →
        </button>
      )}
    </motion.div>
  );
}
