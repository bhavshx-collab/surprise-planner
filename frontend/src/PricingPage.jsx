import { useState } from "react";

const PLANS = [
  {
    name: "Free",
    price: "₹0",
    period: "Always free",
    accent: "rgba(255,255,255,0.3)",
    accentBg: "rgba(255,255,255,0.04)",
    border: "rgba(255,255,255,0.08)",
    features: [
      { text: "Unlimited AI surprise plans", available: true },
      { text: "Share plans via public link", available: true },
      { text: "3 saved plans", available: true },
      { text: "Vendor directory access", available: true },
      { text: "Interactive reveal link", available: true },
      { text: "PDF export", available: false },
      { text: "Unlimited saved plans", available: false },
      { text: "Memory Scrapbook", available: false },
      { text: "Priority vendor matching", available: false },
      { text: "Custom reveal pages", available: false },
    ],
    cta: "Get started free",
    ctaStyle: "outline",
  },
  {
    name: "Pro",
    price: "₹299",
    period: "/month",
    accent: "#D4AF37",
    accentBg: "rgba(212,175,55,0.06)",
    border: "rgba(212,175,55,0.3)",
    badge: "Most popular",
    features: [
      { text: "Unlimited AI surprise plans", available: true },
      { text: "Share plans via public link", available: true },
      { text: "Unlimited saved plans", available: true },
      { text: "Vendor directory access", available: true },
      { text: "Interactive reveal link", available: true },
      { text: "PDF export", available: true },
      { text: "Memory Scrapbook", available: true },
      { text: "Priority vendor matching", available: true },
      { text: "Custom reveal pages", available: true },
      { text: "Early access to new features", available: true },
    ],
    cta: "Go Pro with Razorpay →",
    ctaStyle: "fill",
  },
];

const FAQS = [
  { q: "What happens after my free trial?", a: "You stay on the Free plan — there's no trial. The Free plan is permanently free with no time limit. You can upgrade to Pro any time." },
  { q: "Can I cancel my Pro subscription anytime?", a: "Yes. Cancel anytime from your account settings. You'll retain Pro access until the end of the billing period." },
  { q: "Is my payment secure?", a: "Yes. Payments are processed by Razorpay — India's most trusted payment gateway. We never store your card details." },
  { q: "Do I need an account for the free plan?", a: "No! You can generate plans without signing up. An account is only needed to save, revisit, and share plans." },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div onClick={() => setOpen(o => !o)} style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", cursor: "pointer", padding: "20px 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
        <span style={{ fontSize: "15px", fontWeight: "400", color: open ? "#D4AF37" : "rgba(255,255,255,0.8)", fontFamily: "'Inter', sans-serif", transition: "color 0.2s" }}>{q}</span>
        <span style={{ fontSize: "20px", color: "#D4AF37", flexShrink: 0, transform: open ? "rotate(45deg)" : "rotate(0)", transition: "transform 0.3s", lineHeight: 1 }}>+</span>
      </div>
      <div style={{ maxHeight: open ? "150px" : "0", overflow: "hidden", transition: "max-height 0.4s ease" }}>
        <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", lineHeight: "1.8", fontFamily: "'Inter', sans-serif", marginTop: "12px", paddingRight: "32px" }}>{a}</p>
      </div>
    </div>
  );
}

export default function PricingPage({ onBack, onUpgrade }) {
  // billing toggle placeholder for future annual plans
  const billing = "monthly"; // eslint-disable-line no-unused-vars

  const handlePro = () => {
    if (onUpgrade) {
      onUpgrade();
    } else {
      alert("Razorpay integration coming soon! Contact us on WhatsApp to activate Pro manually.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080808", fontFamily: "'Inter', sans-serif", color: "#fff", position: "relative", overflow: "hidden" }}>

      {/* BG orbs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: "1200px", margin: "0 auto", padding: "clamp(40px, 6vh, 80px) clamp(24px, 5vw, 60px) clamp(60px, 8vh, 100px)" }}>

        {/* Back */}
        <button onClick={onBack} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.35)", fontSize: "13px", cursor: "pointer", fontFamily: "'Inter', sans-serif", letterSpacing: "0.05em", marginBottom: "48px", padding: 0, display: "flex", alignItems: "center", gap: "6px", transition: "color 0.2s" }}
          onMouseEnter={e => e.target.style.color = "rgba(255,255,255,0.7)"}
          onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.35)"}
        >← Back</button>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "72px" }}>
          <div style={{ display: "inline-block", fontSize: "10px", letterSpacing: "0.3em", color: "#D4AF37", textTransform: "uppercase", marginBottom: "20px", padding: "6px 16px", border: "1px solid rgba(212,175,55,0.2)", borderRadius: "40px", background: "rgba(212,175,55,0.04)" }}>Pricing</div>
          <h1 style={{ fontFamily: "'Outfit', serif", fontSize: "clamp(40px, 5vw, 72px)", fontWeight: "300", lineHeight: "1.1", marginBottom: "20px" }}>
            Simple, honest<br /><span style={{ color: "#D4AF37", fontStyle: "italic" }}>pricing.</span>
          </h1>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.35)", lineHeight: "1.8", maxWidth: "500px", margin: "0 auto" }}>
            Start free — no credit card, no time limit. Upgrade when you're ready for the full experience.
          </p>
        </div>

        {/* Pricing Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px", background: "rgba(255,255,255,0.06)", maxWidth: "860px", margin: "0 auto 80px" }} className="pricing-grid">
          {PLANS.map((plan) => (
            <div key={plan.name} style={{
              background: plan.ctaStyle === "fill" ? plan.accentBg : "#080808",
              padding: "clamp(32px, 4vw, 52px)", position: "relative",
              border: plan.badge ? `1px solid ${plan.border}` : "none",
            }}>
              {plan.badge && (
                <div style={{ position: "absolute", top: "-1px", left: "50%", transform: "translateX(-50%)", background: "#D4AF37", color: "#080808", fontSize: "10px", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", padding: "5px 16px", fontFamily: "'Inter', sans-serif", whiteSpace: "nowrap" }}>{plan.badge}</div>
              )}

              <div style={{ fontSize: "11px", letterSpacing: "0.2em", color: plan.accent, textTransform: "uppercase", marginBottom: "20px" }}>{plan.name}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "6px" }}>
                <span style={{ fontFamily: "'Outfit', serif", fontSize: "56px", fontWeight: "300", color: plan.accent, lineHeight: 1 }}>{plan.price}</span>
                <span style={{ fontSize: "16px", color: `${plan.accent}60` }}>{plan.period}</span>
              </div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", marginBottom: "36px" }}>{plan.name === "Free" ? "Always free" : "Billed monthly · cancel anytime"}</div>

              <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "28px", marginBottom: "36px" }}>
                {plan.features.map(feat => (
                  <div key={feat.text} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px", opacity: feat.available ? 1 : 0.3 }}>
                    <span style={{ color: feat.available ? (plan.accent === "#D4AF37" ? "#D4AF37" : "#FFFFFF") : "rgba(255,255,255,0.2)", fontSize: "14px", flexShrink: 0 }}>
                      {feat.available ? (plan.ctaStyle === "fill" ? "✦" : "✓") : "✕"}
                    </span>
                    <span style={{ fontSize: "14px", color: feat.available ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.3)" }}>{feat.text}</span>
                  </div>
                ))}
              </div>

              <button onClick={plan.ctaStyle === "fill" ? handlePro : onBack} style={{
                width: "100%", padding: "14px",
                background: plan.ctaStyle === "fill" ? "#D4AF37" : "none",
                border: plan.ctaStyle === "fill" ? "none" : "1px solid rgba(255,255,255,0.15)",
                color: plan.ctaStyle === "fill" ? "#080808" : "rgba(255,255,255,0.5)",
                fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase",
                cursor: "pointer", fontFamily: "'Inter', sans-serif",
                fontWeight: plan.ctaStyle === "fill" ? "700" : "400",
                transition: "all 0.25s",
              }}
                onMouseEnter={e => {
                  if (plan.ctaStyle === "fill") { e.target.style.background = "#E8C84A"; e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 24px rgba(212,175,55,0.3)"; }
                  else { e.target.style.borderColor = "rgba(255,255,255,0.35)"; e.target.style.color = "#fff"; }
                }}
                onMouseLeave={e => {
                  if (plan.ctaStyle === "fill") { e.target.style.background = "#D4AF37"; e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "none"; }
                  else { e.target.style.borderColor = "rgba(255,255,255,0.15)"; e.target.style.color = "rgba(255,255,255,0.5)"; }
                }}
              >{plan.cta}</button>
            </div>
          ))}
        </div>

        {/* Guarantee */}
        <div style={{ textAlign: "center", marginBottom: "80px", padding: "32px", border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.015)", maxWidth: "600px", margin: "0 auto 80px" }}>
          <div style={{ fontSize: "28px", marginBottom: "12px" }}>🔒</div>
          <div style={{ fontSize: "16px", fontWeight: "500", color: "rgba(255,255,255,0.8)", marginBottom: "8px" }}>7-day money-back guarantee</div>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)", lineHeight: "1.7" }}>Not happy with Pro? Contact us within 7 days of purchase for a full refund. No questions asked.</p>
        </div>

        {/* FAQ */}
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Outfit', serif", fontSize: "clamp(28px, 3vw, 40px)", fontWeight: "300", textAlign: "center", marginBottom: "40px" }}>
            Common questions
          </h2>
          {FAQS.map((faq, i) => <FAQItem key={i} {...faq} />)}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        @keyframes orb1 { 0%,100%{transform:translate(0,0) scale(1)} 40%{transform:translate(40px,-60px) scale(1.08)} 70%{transform:translate(-30px,30px) scale(0.95)} }
        @keyframes orb2 { 0%,100%{transform:translate(0,0) scale(1)} 35%{transform:translate(-50px,40px) scale(1.1)} 65%{transform:translate(25px,-25px) scale(0.92)} }
        @media (max-width: 640px) {
          .pricing-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
