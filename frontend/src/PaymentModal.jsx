// PaymentModal.jsx — Razorpay Pro subscription modal
import { motion } from "framer-motion";

const RZKEY = import.meta.env.VITE_RAZORPAY_KEY_ID;
const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const FEATURES = [
  { free: "1 plan / day", pro: "Unlimited AI plans" },
  { free: "Text plan only", pro: "AI Moodboard (4 cinematic images)" },
  { free: "No PDF export", pro: "Printable PDF download" },
  { free: "No memory scrapbook", pro: "Post-event memory scrapbook" },
  { free: "Basic checklist", pro: "Live collaborative checklist" },
];

export default function PaymentModal({ user, onClose, onSuccess }) {
  const handlePay = () => {
    if (!RZKEY) {
      alert("Payment gateway coming soon! Check back in a few days. 🙏");
      return;
    }
    if (!window.Razorpay) {
      alert("Razorpay failed to load. Please refresh the page.");
      return;
    }
    const options = {
      key: RZKEY,
      amount: 19900,
      currency: "INR",
      name: "AI Surprise Planner",
      description: "Pro — 1 Month Subscription",
      image: "https://surprise-planner-nu.vercel.app/favicon.ico",
      prefill: { email: user?.email || "" },
      theme: { color: "#D4AF37" },
      handler: async (response) => {
        try {
          await fetch(`${API}/api/payment/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...response, user_id: user?.id, email: user?.email }),
          });
          onSuccess?.();
          onClose?.();
        } catch (e) {
          console.error(e);
        }
      },
    };
    new window.Razorpay(options).open();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={e => e.target === e.currentTarget && onClose?.()}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 600, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, backdropFilter: "blur(8px)" }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 16 }}
        style={{ background: "rgba(13,13,26,0.98)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 20, padding: "36px 28px", maxWidth: 460, width: "100%", boxShadow: "0 24px 64px rgba(0,0,0,0.7)" }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>✦</div>
          <div style={{ fontSize: 11, letterSpacing: "0.2em", color: "#D4AF37", textTransform: "uppercase", fontFamily: "DM Sans", marginBottom: 10, opacity: 0.8 }}>Upgrade to Pro</div>
          <div style={{ fontFamily: "Playfair Display, serif", fontSize: 28, fontWeight: 400, color: "#fff", marginBottom: 8 }}>
            The complete experience.
          </div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", fontFamily: "DM Sans", lineHeight: 1.6 }}>
            Everything you need to plan surprises that last a lifetime.
          </div>
        </div>

        {/* Price */}
        <div style={{ textAlign: "center", margin: "24px 0", padding: "20px", background: "rgba(212,175,55,0.07)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 14 }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 6 }}>
            <span style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", fontFamily: "DM Sans" }}>₹</span>
            <span style={{ fontSize: 48, fontWeight: 300, fontFamily: "Playfair Display, serif", color: "#D4AF37" }}>199</span>
            <span style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", fontFamily: "DM Sans" }}>/month</span>
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", fontFamily: "DM Sans", marginTop: 4 }}>Cancel anytime</div>
        </div>

        {/* Feature comparison */}
        <div style={{ marginBottom: 24 }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", fontFamily: "DM Sans", textDecoration: "line-through" }}>✗ {f.free}</div>
              <div style={{ fontSize: 12, color: "#D4AF37", fontFamily: "DM Sans", fontWeight: 500 }}>✓ {f.pro}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={handlePay}
          style={{ width: "100%", padding: "16px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #E8C84A, #D4AF37)", color: "#080808", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "DM Sans", letterSpacing: "0.05em", marginBottom: 12, transition: "all 0.2s" }}
          onMouseEnter={e => { e.target.style.boxShadow = "0 8px 28px rgba(212,175,55,0.3)"; e.target.style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { e.target.style.boxShadow = "none"; e.target.style.transform = "translateY(0)"; }}
        >
          {RZKEY ? "Upgrade Now — ₹199/month" : "Coming Soon"}
        </button>
        <button onClick={onClose} style={{ width: "100%", padding: "12px", background: "none", border: "none", color: "rgba(255,255,255,0.3)", fontSize: 13, cursor: "pointer", fontFamily: "DM Sans" }}>
          Maybe later
        </button>
      </motion.div>
    </motion.div>
  );
}
