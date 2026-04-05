// RequestQuoteModal.jsx — Send quote requests to matched vendors
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function RequestQuoteModal({ vendors, plan, onClose }) {
  const [selected, setSelected] = useState(vendors.map((_, i) => i));
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggle = (i) => setSelected(s => s.includes(i) ? s.filter(x => x !== i) : [...s, i]);

  const handleSend = async () => {
    if (!name.trim() || !email.trim()) { setError("Please enter your name and email."); return; }
    if (selected.length === 0) { setError("Please select at least one vendor."); return; }
    setLoading(true); setError("");
    const chosenVendors = selected.map(i => vendors[i]);
    try {
      await fetch(`${API}/api/quote/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan_id: plan?.plan_id,
          user_name: name, user_email: email,
          vendors: chosenVendors.map(v => ({ name: v.name, email: v.email, category: v.category })),
          plan_summary: `${plan?.idea || ""} — Budget: ₹${plan?.form?.budget || ""}`,
        }),
      });
      setSent(true);
    } catch {
      setError("Failed to send. Please try again.");
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={e => e.target === e.currentTarget && onClose?.()}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.78)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, backdropFilter: "blur(8px)" }}
    >
      <motion.div
        initial={{ scale: 0.92, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.92, y: 20, opacity: 0 }}
        transition={{ type: "spring", damping: 18 }}
        style={{ background: "rgba(13,13,26,0.98)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 20, padding: "32px 28px", maxWidth: 440, width: "100%", boxShadow: "0 24px 64px rgba(0,0,0,0.7)" }}
      >
        {!sent ? (
          <>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, letterSpacing: "0.15em", color: "var(--gold, #D4AF37)", textTransform: "uppercase", fontFamily: "DM Sans", marginBottom: 8, opacity: 0.8 }}>Request quotes</div>
              <div style={{ fontFamily: "Playfair Display, serif", fontSize: 22, fontWeight: 400, color: "#fff", marginBottom: 6 }}>Contact matched vendors</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", fontFamily: "DM Sans", lineHeight: 1.6 }}>We'll send your plan details to the selected vendors. They'll reach out to you directly.</div>
            </div>

            {/* Vendor checklist */}
            <div style={{ marginBottom: 20 }}>
              {vendors.map((v, i) => (
                <label key={i} onClick={() => toggle(i)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 10, cursor: "pointer", marginBottom: 8, border: `1px solid ${selected.includes(i) ? "rgba(212,175,55,0.3)" : "rgba(255,255,255,0.07)"}`, background: selected.includes(i) ? "rgba(212,175,55,0.06)" : "rgba(255,255,255,0.02)", transition: "all 0.2s" }}>
                  <input type="checkbox" checked={selected.includes(i)} onChange={() => {}} style={{ accentColor: "#D4AF37" }} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "#fff", fontFamily: "DM Sans" }}>{v.name}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", fontFamily: "DM Sans" }}>{v.category}{v.city ? ` · ${v.city}` : ""}</div>
                  </div>
                </label>
              ))}
            </div>

            {/* Contact form */}
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.09)", background: "rgba(255,255,255,0.03)", color: "#fff", fontFamily: "DM Sans", fontSize: 14, outline: "none", marginBottom: 10 }} />
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email" type="email" style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.09)", background: "rgba(255,255,255,0.03)", color: "#fff", fontFamily: "DM Sans", fontSize: 14, outline: "none", marginBottom: 16 }} />

            {error && <div style={{ color: "#ff6b6b", fontSize: 13, marginBottom: 12, fontFamily: "DM Sans" }}>{error}</div>}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 10 }}>
              <button onClick={onClose} style={{ padding: "12px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.09)", background: "none", color: "rgba(255,255,255,0.4)", fontSize: 13, cursor: "pointer", fontFamily: "DM Sans" }}>Cancel</button>
              <button onClick={handleSend} disabled={loading} style={{ padding: "12px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #E8C84A, #D4AF37)", color: "#080808", fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "DM Sans", opacity: loading ? 0.6 : 1 }}>
                {loading ? "Sending..." : `Send to ${selected.length} vendor${selected.length !== 1 ? "s" : ""}`}
              </button>
            </div>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <div style={{ fontFamily: "Playfair Display, serif", fontSize: 22, color: "#fff", marginBottom: 10 }}>Quotes requested!</div>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", fontFamily: "DM Sans", lineHeight: 1.7, marginBottom: 24 }}>Vendors have been notified with your plan details. Expect a response within 24 hours.</div>
            <button onClick={onClose} style={{ padding: "12px 28px", borderRadius: 10, border: "1px solid rgba(212,175,55,0.3)", background: "rgba(212,175,55,0.08)", color: "#D4AF37", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "DM Sans" }}>Done</button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
