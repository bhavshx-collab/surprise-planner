import { useEffect, useState, useRef } from "react";

const FEATURES = [
  { icon: "✨", title: "AI-Crafted Plans", desc: "Tell us about the person. Get a deeply personal surprise idea, emotional message, and full execution timeline — in seconds.", accent: "#D4AF37", size: "large" },
  { icon: "📅", title: "Before · During · After", desc: "A complete 3-phase timeline so nothing is left to chance.", accent: "#FFFFFF", size: "small" },
  { icon: "💸", title: "Smart Budget Breakdown", desc: "Every rupee allocated intelligently based on your budget.", accent: "#FFFFFF", size: "small" },
  { icon: "🏪", title: "Local Vendor Matches", desc: "Florists, cafes, photographers — handpicked for your city and surprise type.", accent: "#D4AF37", size: "small" },
  { icon: "🎁", title: "Interactive Reveal Link", desc: "Create a beautiful animated reveal page to share with your special person.", accent: "#FFFFFF", size: "small" },
  { icon: "📸", title: "Memory Scrapbook", desc: "After the event, save photos and notes to relive the magic forever.", accent: "#E85D75", size: "large" },
];

const TESTIMONIALS = [
  { name: "Priya S.", city: "Mumbai", avatar: "P", quote: "I planned my boyfriend's birthday in 10 minutes. The AI gave me an idea I never would've thought of — a sunrise hike with a personalised letter. He cried 😭", stars: 5 },
  { name: "Rahul M.", city: "Bangalore", avatar: "R", quote: "Listed my café on the vendor directory and got 3 enquiries in the first week. The platform actually understands what event planners need.", stars: 5 },
  { name: "Aisha K.", city: "Delhi", avatar: "A", quote: "The reveal link feature blew my mind. I sent my sister a link and she said it felt like opening a gift before even arriving at the party.", stars: 5 },
  { name: "Vikrant T.", city: "Pune", avatar: "V", quote: "Used it for our 5th anniversary. The budget breakdown helped me stay under ₹8000 while still making it feel like a ₹50,000 evening.", stars: 5 },
];

const FAQS = [
  { q: "Is it really free to use?", a: "Yes! Generating plans is completely free. No credit card, no account needed to start. Pro features like PDF export and unlimited saves are available for ₹299/month." },
  { q: "How does the AI personalise the plan?", a: "You tell us the occasion, your relationship, their interests, your city, and your budget. Our AI combines this with knowledge of local events, cultural context, and thousands of surprise ideas to generate something genuinely personal." },
  { q: "Can I edit the plan after it's generated?", a: "Yes — use the 'Tweak this plan' box at the bottom of your result to give instructions like 'Make it more budget-friendly' or 'Add a candlelight dinner element'." },
  { q: "How does the vendor directory work?", a: "Local businesses (cafes, florists, photographers, hotels) list their services for free. When you generate a plan, relevant vendors from your city are matched and shown alongside your plan." },
  { q: "What is a Reveal Link?", a: "After generating a plan, you can create a special animated link to share with the recipient. They see a beautiful surprise-reveal experience — not the planning details. Perfect to send the night before the event." },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      onClick={() => setOpen(o => !o)}
      style={{
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        cursor: "pointer",
        padding: "24px 0",
        transition: "all 0.2s",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
        <span style={{ fontSize: "16px", fontWeight: "400", color: open ? "#D4AF37" : "rgba(255,255,255,0.85)", fontFamily: "'Inter', sans-serif", transition: "color 0.2s", lineHeight: 1.4 }}>{q}</span>
        <span style={{ fontSize: "20px", color: "#D4AF37", flexShrink: 0, transform: open ? "rotate(45deg)" : "rotate(0deg)", transition: "transform 0.3s ease", lineHeight: 1 }}>+</span>
      </div>
      <div style={{
        maxHeight: open ? "200px" : "0",
        overflow: "hidden",
        transition: "max-height 0.4s ease",
      }}>
        <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.45)", lineHeight: "1.85", fontFamily: "'Inter', sans-serif", marginTop: "14px", paddingRight: "32px" }}>{a}</p>
      </div>
    </div>
  );
}

export default function LandingPage({ onPlan, onVendor, onPricing, onAuth, onPrivacy, onTerms, onAbout }) {
  const [visible, setVisible] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    setTimeout(() => setVisible(true), 80);
    const handleMouse = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouse);
    intervalRef.current = setInterval(() => setActiveTestimonial(t => (t + 1) % TESTIMONIALS.length), 4000);
    return () => {
      window.removeEventListener("mousemove", handleMouse);
      clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div style={{ width: "100vw", minHeight: "100vh", background: "#080808", color: "#fff", fontFamily: "'Inter', sans-serif", overflowX: "hidden", position: "relative" }}>

      {/* BG Image and Overlay */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "110vh", backgroundImage: "url('/hero-bg.png')", backgroundSize: "cover", backgroundPosition: "center", zIndex: 0 }} />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "110vh", background: "linear-gradient(to bottom, rgba(5,5,5,0.3) 0%, rgba(5,5,5,0.8) 60%, #050505 100%)", zIndex: 0 }} />

      {/* Noise grain */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1, opacity: 0.04, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: "180px" }} />

      {/* Gold top line */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: "1px", zIndex: 100, background: "linear-gradient(90deg, transparent 0%, #D4AF37 30%, #D4AF37 70%, transparent 100%)", opacity: visible ? 0.55 : 0, transition: "opacity 1.5s ease 0.3s" }} />

      {/* NAV */}
      <nav style={{ position: "sticky", top: 0, zIndex: 90, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px clamp(24px, 5vw, 80px)", background: "rgba(5,5,5,0.6)", backdropFilter: "blur(24px)", borderBottom: "1px solid rgba(255,255,255,0.05)", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(-20px)", transition: "all 0.8s ease 0.2s" }}>
        <div style={{ letterSpacing: "0.18em", color: "#D4AF37", fontWeight: "400", textTransform: "uppercase", fontFamily: "'Outfit', serif", fontSize: "18px" }}>
          ✦ AI Surprise Planner
        </div>

        {/* Desktop nav */}
        <div className="navbar-right" style={{ display: "flex", alignItems: "center", gap: "40px" }}>
          {[["How it works", null], ["Pricing", onPricing], ["For Business", onVendor]].map(([label, handler]) => (
            <span key={label} onClick={handler} style={{ fontSize: "12px", letterSpacing: "0.1em", color: "rgba(255,255,255,0.38)", cursor: "pointer", textTransform: "uppercase", transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color = "rgba(255,255,255,0.8)"}
              onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.38)"}
            >{label}</span>
          ))}
          <button onClick={onAuth} style={{ padding: "9px 22px", background: "transparent", border: "1px solid rgba(212,175,55,0.5)", color: "#D4AF37", fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "'Inter', sans-serif", fontWeight: "500", cursor: "pointer", transition: "all 0.25s" }}
            onMouseEnter={e => { e.target.style.background = "#D4AF37"; e.target.style.color = "#080808"; }}
            onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.color = "#D4AF37"; }}
          >Sign in</button>
          <button onClick={onPlan} style={{ padding: "9px 22px", background: "#D4AF37", border: "none", color: "#080808", fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "'Inter', sans-serif", fontWeight: "700", cursor: "pointer", transition: "all 0.25s" }}
            onMouseEnter={e => { e.target.style.background = "#E8C84A"; e.target.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.target.style.background = "#D4AF37"; e.target.style.transform = "translateY(0)"; }}
          >Plan free →</button>
        </div>

        {/* Hamburger */}
        <button className="navbar-hamburger" onClick={() => setMenuOpen(m => !m)}>
          {menuOpen ? "✕" : "☰"}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(8,8,8,0.98)", zIndex: 85, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "32px" }}>
          <button onClick={() => setMenuOpen(false)} style={{ position: "absolute", top: "24px", right: "24px", background: "none", border: "none", color: "#D4AF37", fontSize: "24px", cursor: "pointer" }}>✕</button>
          {[["Plan a Surprise", onPlan], ["Pricing", onPricing], ["For Business", onVendor], ["Sign In", onAuth]].map(([label, handler]) => (
            <button key={label} onClick={() => { handler?.(); setMenuOpen(false); }} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.85)", fontSize: "24px", fontFamily: "'Outfit', serif", cursor: "pointer", letterSpacing: "0.05em" }}>{label}</button>
          ))}
        </div>
      )}

      {/* ── HERO ── */}
      <section style={{ position: "relative", zIndex: 10, maxWidth: "1400px", margin: "0 auto", padding: "clamp(60px, 10vh, 120px) clamp(24px, 5vw, 80px) clamp(60px, 8vh, 100px)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center", opacity: visible ? 1 : 0, transition: "opacity 1s ease 0.4s" }} className="lp-hero-grid">

        {/* Left */}
        <div style={{ transform: visible ? "translateX(0)" : "translateX(-40px)", transition: "transform 1.2s ease 0.5s" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", marginBottom: "40px", padding: "6px 16px", border: "1px solid rgba(212,175,55,0.2)", borderRadius: "40px", background: "rgba(212,175,55,0.05)" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#D4AF37", animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: "11px", letterSpacing: "0.22em", color: "#D4AF37", textTransform: "uppercase", fontFamily: "'Inter', sans-serif" }}>AI-powered · Free to start</span>
          </div>

          <h1 style={{ fontFamily: "'Outfit', Georgia, serif", fontSize: "clamp(52px, 5.5vw, 90px)", fontWeight: "300", lineHeight: "1.0", letterSpacing: "-0.02em", marginBottom: "36px", textShadow: "0 4px 24px rgba(0,0,0,0.6)" }}>
            <span style={{ display: "block", color: "#fff" }}>Craft</span>
            <span style={{ display: "block", color: "#fff" }}>surprises</span>
            <span style={{ display: "block", color: "#D4AF37", fontStyle: "italic" }}>they'll never</span>
            <span style={{ display: "block", color: "#D4AF37", fontStyle: "italic" }}>forget.</span>
          </h1>

          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.7)", lineHeight: "1.9", maxWidth: "440px", fontWeight: "400", marginBottom: "48px", textShadow: "0 2px 12px rgba(0,0,0,0.8)" }}>
            Tell us about the person — their interests, your relationship, the occasion. Our AI crafts a deeply personal surprise plan with timeline, budget, and heartfelt message in seconds.
          </p>

          <div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
            <button onClick={onPlan} style={{ padding: "16px 48px", background: "#D4AF37", border: "none", color: "#080808", fontSize: "12px", letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: "'Inter', sans-serif", fontWeight: "700", cursor: "pointer", transition: "all 0.3s ease" }}
              onMouseEnter={e => { e.target.style.background = "#E8C84A"; e.target.style.transform = "translateY(-3px)"; e.target.style.boxShadow = "0 12px 32px rgba(212,175,55,0.28)"; }}
              onMouseLeave={e => { e.target.style.background = "#D4AF37"; e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "none"; }}
            >
              Start free — no login
            </button>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.22)", fontFamily: "'Inter', sans-serif" }}>or</span>
            <span onClick={onVendor} style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", cursor: "pointer", letterSpacing: "0.08em", textDecoration: "underline", textUnderlineOffset: "4px", transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color = "rgba(255,255,255,0.8)"}
              onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.4)"}
            >List my business →</span>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: "clamp(24px, 4vw, 56px)", marginTop: "64px", paddingTop: "40px", borderTop: "1px solid rgba(255,255,255,0.06)", flexWrap: "wrap" }}>
            {[["500+", "Surprises planned"], ["50+", "Vendors listed"], ["4.9★", "Average rating"], ["🇮🇳", "Made in India"]].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: "300", color: "#D4AF37", letterSpacing: "0.05em", fontFamily: "'Outfit', serif" }}>{n}</div>
                <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)", letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "'Inter', sans-serif", marginTop: "6px" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — hero cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", transform: visible ? "translateX(0)" : "translateX(40px)", transition: "transform 1.2s ease 0.8s" }} className="lp-hero-cards">
          {/* Plan card */}
          <div onClick={onPlan} style={{ border: "1px solid rgba(212,175,55,0.18)", padding: "clamp(28px, 3vw, 44px)", cursor: "pointer", transition: "all 0.35s ease", background: "rgba(212,175,55,0.025)", position: "relative", overflow: "hidden" }}
            onMouseEnter={e => { e.currentTarget.style.border = "1px solid rgba(212,175,55,0.5)"; e.currentTarget.style.background = "rgba(212,175,55,0.045)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
            onMouseLeave={e => { e.currentTarget.style.border = "1px solid rgba(212,175,55,0.18)"; e.currentTarget.style.background = "rgba(212,175,55,0.025)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <div style={{ position: "absolute", top: 0, right: 0, width: "40px", height: "40px", borderTop: "1px solid #D4AF37", borderRight: "1px solid #D4AF37", opacity: 0.3 }} />
            <div style={{ fontSize: "28px", marginBottom: "16px" }}>✨</div>
            <div style={{ fontSize: "11px", letterSpacing: "0.2em", color: "#D4AF37", textTransform: "uppercase", fontFamily: "'Inter', sans-serif", marginBottom: "14px", opacity: 0.75 }}>For individuals</div>
            <div style={{ fontSize: "clamp(20px, 2.5vw, 28px)", fontWeight: "300", color: "#fff", marginBottom: "12px", letterSpacing: "0.02em", fontFamily: "'Outfit', serif" }}>Plan a surprise</div>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.35)", lineHeight: "1.8", fontFamily: "'Inter', sans-serif", marginBottom: "24px" }}>
              No account needed. Personalised plan, timeline, budget, and heartfelt message in seconds.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "11px", letterSpacing: "0.15em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>
              Start free <span style={{ transition: "transform 0.3s" }}>→</span>
            </div>
          </div>

          {/* Vendor card */}
          <div onClick={onVendor} style={{ border: "1px solid rgba(255,255,255,0.18)", padding: "clamp(28px, 3vw, 44px)", cursor: "pointer", transition: "all 0.35s ease", background: "rgba(255,255,255,0.02)", position: "relative", overflow: "hidden" }}
            onMouseEnter={e => { e.currentTarget.style.border = "1px solid rgba(255,255,255,0.45)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
            onMouseLeave={e => { e.currentTarget.style.border = "1px solid rgba(255,255,255,0.18)"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <div style={{ position: "absolute", top: 0, right: 0, width: "40px", height: "40px", borderTop: "1px solid #FFFFFF", borderRight: "1px solid #FFFFFF", opacity: 0.3 }} />
            <div style={{ fontSize: "28px", marginBottom: "16px" }}>🏪</div>
            <div style={{ fontSize: "11px", letterSpacing: "0.2em", color: "#9b6bd4", textTransform: "uppercase", fontFamily: "'Inter', sans-serif", marginBottom: "14px" }}>For businesses</div>
            <div style={{ fontSize: "clamp(20px, 2.5vw, 28px)", fontWeight: "300", color: "#fff", marginBottom: "12px", fontFamily: "'Outfit', serif" }}>List my business</div>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.35)", lineHeight: "1.8", fontFamily: "'Inter', sans-serif", marginBottom: "24px" }}>
              Reach people actively planning surprises in your city. Florists, cafes, photographers — free to list.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "11px", letterSpacing: "0.15em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>
              Get listed free <span>→</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <div style={{ position: "relative", zIndex: 10, borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "20px clamp(24px, 5vw, 80px)", background: "rgba(255,255,255,0.015)", backdropFilter: "blur(12px)" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", gap: "clamp(24px, 5vw, 64px)", flexWrap: "wrap" }}>
          {["🎉 500+ surprises planned", "🏪 50+ verified vendors", "⚡ Plans in under 30 seconds", "🔒 No credit card ever needed", "🇮🇳 Built in India"].map(item => (
            <span key={item} style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em", fontFamily: "'Inter', sans-serif", whiteSpace: "nowrap" }}>{item}</span>
          ))}
        </div>
      </div>

      {/* ── FEATURES BENTO GRID ── */}
      <section style={{ position: "relative", zIndex: 10, maxWidth: "1400px", margin: "0 auto", padding: "clamp(60px, 8vh, 120px) clamp(24px, 5vw, 80px)" }}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <div style={{ display: "inline-block", fontSize: "10px", letterSpacing: "0.3em", color: "#D4AF37", textTransform: "uppercase", marginBottom: "20px", opacity: 0.7 }}>What you get</div>
          <h2 style={{ fontFamily: "'Outfit', serif", fontSize: "clamp(36px, 4vw, 64px)", fontWeight: "300", lineHeight: "1.1", letterSpacing: "0.01em" }}>
            Everything you need to plan<br /><span style={{ color: "#D4AF37", fontStyle: "italic" }}>something extraordinary</span>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridTemplateRows: "auto auto", gap: "2px", background: "rgba(255,255,255,0.05)" }} className="lp-bento-grid">
          {FEATURES.map((f, i) => (
            <div key={i} style={{
              background: "#080808", padding: "clamp(28px, 3vw, 44px)",
              gridColumn: (i === 0 || i === 5) ? "span 1" : "span 1",
              transition: "background 0.3s, transform 0.3s",
              cursor: "default",
              position: "relative", overflow: "hidden",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "#0d0d0d"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#080808"; }}
            >
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: `linear-gradient(90deg, transparent, ${f.accent}40, transparent)`, opacity: 0 }} className="feature-line" />
              <div style={{ fontSize: "36px", marginBottom: "20px" }}>{f.icon}</div>
              <div style={{ fontSize: "16px", fontWeight: "500", color: "#fff", marginBottom: "12px", letterSpacing: "0.01em" }}>{f.title}</div>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.35)", lineHeight: "1.8", fontFamily: "'Inter', sans-serif" }}>{f.desc}</p>
              <div style={{ position: "absolute", bottom: "20px", right: "20px", width: "32px", height: "32px", borderRadius: "50%", background: `${f.accent}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>{f.icon}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ position: "relative", zIndex: 10, maxWidth: "1400px", margin: "0 auto", padding: "clamp(60px, 8vh, 100px) clamp(24px, 5vw, 80px)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "72px", flexWrap: "wrap", gap: "24px" }}>
          <h2 style={{ fontFamily: "'Outfit', serif", fontSize: "clamp(36px, 4vw, 56px)", fontWeight: "300", lineHeight: "1.1" }}>
            Three steps to<br /><span style={{ color: "#D4AF37", fontStyle: "italic" }}>something unforgettable</span>
          </h2>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.28)", maxWidth: "280px", lineHeight: "1.85", textAlign: "right" }}>
            From that spark of an idea to a moment they'll talk about for years.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "2px", background: "rgba(255,255,255,0.05)" }} className="lp-steps-grid">
          {[
            { n: "01", icon: "💬", title: "Describe them", desc: "Share their interests, your relationship, the occasion, your city, and your budget. The more personal, the more magical the result." },
            { n: "02", icon: "🤖", title: "AI plans it all", desc: "Get a personalised surprise idea, emotional message, full before/during/after timeline, smart budget breakdown, and matched local vendors." },
            { n: "03", icon: "🎯", title: "Make it happen", desc: "Execute it yourself using the plan — or connect with verified local vendors in your city who handle everything for you." },
          ].map((s, i) => (
            <div key={i} style={{ padding: "clamp(32px, 4vw, 56px) clamp(24px, 3vw, 48px)", background: "#080808", transition: "background 0.3s", position: "relative" }}
              onMouseEnter={e => e.currentTarget.style.background = "#0d0d0d"}
              onMouseLeave={e => e.currentTarget.style.background = "#080808"}
            >
              <div style={{ fontSize: "11px", letterSpacing: "0.28em", color: "#D4AF37", marginBottom: "24px", fontFamily: "'Inter', sans-serif", opacity: 0.65 }}>{s.n}</div>
              <div style={{ fontSize: "36px", marginBottom: "20px" }}>{s.icon}</div>
              <div style={{ fontSize: "clamp(18px, 2vw, 24px)", fontWeight: "300", color: "#fff", marginBottom: "16px", letterSpacing: "0.02em", fontFamily: "'Outfit', serif" }}>{s.title}</div>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.32)", lineHeight: "1.9", fontFamily: "'Inter', sans-serif" }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ position: "relative", zIndex: 10, padding: "clamp(60px, 8vh, 100px) clamp(24px, 5vw, 80px)", borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.012)" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <div style={{ fontSize: "10px", letterSpacing: "0.3em", color: "#D4AF37", textTransform: "uppercase", marginBottom: "16px", opacity: 0.7 }}>What people say</div>
            <h2 style={{ fontFamily: "'Outfit', serif", fontSize: "clamp(32px, 3.5vw, 52px)", fontWeight: "300", lineHeight: "1.1" }}>
              Real moments, <span style={{ color: "#D4AF37", fontStyle: "italic" }}>real magic</span>
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "2px", background: "rgba(255,255,255,0.05)" }} className="lp-testimonials-grid">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} style={{ background: i === activeTestimonial ? "rgba(212,175,55,0.04)" : "#080808", padding: "clamp(28px, 3vw, 44px)", transition: "background 0.5s ease", cursor: "default", border: i === activeTestimonial ? "none" : "none" }}
                onMouseEnter={() => { clearInterval(intervalRef.current); setActiveTestimonial(i); }}
              >
                <div style={{ display: "flex", gap: "4px", marginBottom: "20px" }}>
                  {Array(t.stars).fill(0).map((_, si) => <span key={si} style={{ color: "#D4AF37", fontSize: "14px" }}>★</span>)}
                </div>
                <p style={{ fontSize: "clamp(14px, 1.6vw, 16px)", color: "rgba(255,255,255,0.65)", lineHeight: "1.9", fontFamily: "'Outfit', serif", fontStyle: "italic", fontWeight: "300", marginBottom: "28px", letterSpacing: "0.01em" }}>
                  "{t.quote}"
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg, #D4AF37, #FFFFFF)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "700", color: "#080808", flexShrink: 0 }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: "600", color: "rgba(255,255,255,0.8)" }}>{t.name}</div>
                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.28)", letterSpacing: "0.08em" }}>{t.city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING TEASER ── */}
      <section style={{ position: "relative", zIndex: 10, maxWidth: "1400px", margin: "0 auto", padding: "clamp(60px, 8vh, 120px) clamp(24px, 5vw, 80px)" }}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <div style={{ fontSize: "10px", letterSpacing: "0.3em", color: "#D4AF37", textTransform: "uppercase", marginBottom: "16px", opacity: 0.7 }}>Pricing</div>
          <h2 style={{ fontFamily: "'Outfit', serif", fontSize: "clamp(32px, 4vw, 56px)", fontWeight: "300", lineHeight: "1.1", marginBottom: "16px" }}>
            Start free. <span style={{ color: "#D4AF37", fontStyle: "italic" }}>Upgrade when ready.</span>
          </h2>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.35)", lineHeight: "1.8", maxWidth: "480px", margin: "0 auto" }}>No credit card needed. Generate unlimited plans for free. Go Pro for the full experience.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px", background: "rgba(255,255,255,0.05)", maxWidth: "900px", margin: "0 auto" }} className="lp-pricing-grid">
          {/* Free */}
          <div style={{ background: "#080808", padding: "clamp(32px, 4vw, 52px)" }}>
            <div style={{ fontSize: "11px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: "16px" }}>Free</div>
            <div style={{ fontFamily: "'Outfit', serif", fontSize: "48px", fontWeight: "300", color: "#fff", marginBottom: "8px" }}>₹0</div>
            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)", marginBottom: "36px" }}>Always free</div>
            {["Unlimited AI plans", "Share plans via link", "3 saved plans", "Vendor directory access", "Reveal link"].map(feat => (
              <div key={feat} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                <span style={{ color: "#FFFFFF", fontSize: "14px" }}>✓</span>
                <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)" }}>{feat}</span>
              </div>
            ))}
            <button onClick={onPlan} style={{ width: "100%", marginTop: "36px", padding: "14px", border: "1px solid rgba(255,255,255,0.12)", background: "none", color: "rgba(255,255,255,0.55)", fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer", fontFamily: "'Inter', sans-serif", transition: "all 0.2s" }}
              onMouseEnter={e => { e.target.style.borderColor = "rgba(255,255,255,0.3)"; e.target.style.color = "#fff"; }}
              onMouseLeave={e => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; e.target.style.color = "rgba(255,255,255,0.55)"; }}
            >Get started free</button>
          </div>

          {/* Pro */}
          <div style={{ background: "rgba(212,175,55,0.04)", padding: "clamp(32px, 4vw, 52px)", position: "relative", border: "1px solid rgba(212,175,55,0.22)" }}>
            <div style={{ position: "absolute", top: "-1px", left: "50%", transform: "translateX(-50%)", background: "#D4AF37", color: "#080808", fontSize: "10px", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", padding: "5px 16px", fontFamily: "'Inter', sans-serif" }}>Most popular</div>
            <div style={{ fontSize: "11px", letterSpacing: "0.2em", color: "#D4AF37", textTransform: "uppercase", marginBottom: "16px" }}>Pro</div>
            <div style={{ fontFamily: "'Outfit', serif", fontSize: "48px", fontWeight: "300", color: "#D4AF37", marginBottom: "8px" }}>₹299<span style={{ fontSize: "20px", color: "rgba(212,175,55,0.5)" }}>/mo</span></div>
            <div style={{ fontSize: "12px", color: "rgba(212,175,55,0.4)", marginBottom: "36px" }}>Everything in Free, plus</div>
            {["PDF plan export", "Unlimited saved plans", "Priority vendor matching", "Memory Scrapbook", "Custom reveal pages", "Early access to new features"].map(feat => (
              <div key={feat} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                <span style={{ color: "#D4AF37", fontSize: "14px" }}>✦</span>
                <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.65)" }}>{feat}</span>
              </div>
            ))}
            <button onClick={onPricing} style={{ width: "100%", marginTop: "36px", padding: "14px", border: "none", background: "#D4AF37", color: "#080808", fontSize: "12px", letterSpacing: "0.14em", textTransform: "uppercase", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontWeight: "700", transition: "all 0.25s" }}
              onMouseEnter={e => { e.target.style.background = "#E8C84A"; e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 24px rgba(212,175,55,0.3)"; }}
              onMouseLeave={e => { e.target.style.background = "#D4AF37"; e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "none"; }}
            >Go Pro with Razorpay →</button>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ position: "relative", zIndex: 10, maxWidth: "900px", margin: "0 auto", padding: "clamp(40px, 6vh, 80px) clamp(24px, 5vw, 80px)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <div style={{ fontSize: "10px", letterSpacing: "0.3em", color: "#D4AF37", textTransform: "uppercase", marginBottom: "16px", opacity: 0.7 }}>FAQ</div>
          <h2 style={{ fontFamily: "'Outfit', serif", fontSize: "clamp(32px, 3.5vw, 48px)", fontWeight: "300" }}>Questions? <span style={{ color: "#D4AF37", fontStyle: "italic" }}>We've got answers.</span></h2>
        </div>
        {FAQS.map((faq, i) => <FAQItem key={i} {...faq} />)}
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ position: "relative", zIndex: 10, background: "#D4AF37", padding: "clamp(56px, 8vh, 88px) clamp(24px, 5vw, 80px)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "32px" }}>
        <div>
          <div style={{ fontFamily: "'Outfit', serif", fontSize: "clamp(32px, 4vw, 52px)", fontWeight: "300", color: "#080808", lineHeight: "1.1", marginBottom: "12px" }}>
            Someone special<br />deserves this.
          </div>
          <div style={{ fontSize: "14px", color: "rgba(8,8,8,0.5)", fontFamily: "'Inter', sans-serif" }}>Free to use. No account. Start in 30 seconds.</div>
        </div>
        <button onClick={onPlan} style={{ padding: "18px 56px", background: "#080808", border: "none", color: "#D4AF37", fontSize: "12px", letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: "'Inter', sans-serif", fontWeight: "700", cursor: "pointer", flexShrink: 0, transition: "all 0.25s" }}
          onMouseEnter={e => { e.target.style.background = "#1a1a1a"; e.target.style.transform = "translateY(-2px)"; }}
          onMouseLeave={e => { e.target.style.background = "#080808"; e.target.style.transform = "translateY(0)"; }}
        >Plan a surprise now →</button>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ position: "relative", zIndex: 10, padding: "clamp(40px, 5vh, 64px) clamp(24px, 5vw, 80px) clamp(28px, 3vh, 40px)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "48px", marginBottom: "56px" }} className="lp-footer-grid">
            <div>
              <div style={{ fontFamily: "'Outfit', serif", fontSize: "20px", color: "#D4AF37", marginBottom: "16px", letterSpacing: "0.05em" }}>✦ AI Surprise Planner</div>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.28)", lineHeight: "1.85", maxWidth: "260px" }}>The AI-powered platform for planning deeply personal surprises. Built with love in India.</p>
            </div>
            {[
              { title: "Product", links: [["Plan a Surprise", onPlan], ["Vendor Directory", onVendor], ["Pricing", onPricing], ["Inspiration Gallery", onPlan]] },
              { title: "Business", links: [["List Your Business", onVendor], ["Vendor Sign Up", onVendor], ["About Us", onAbout], ["Pro Features", onPricing]] },
              { title: "Company", links: [["About", onAbout], ["Privacy Policy", onPrivacy], ["Terms of Service", onTerms], ["Contact", onAbout]] },
            ].map(col => (
              <div key={col.title}>
                <div style={{ fontSize: "10px", letterSpacing: "0.25em", color: "#D4AF37", textTransform: "uppercase", marginBottom: "20px", opacity: 0.7 }}>{col.title}</div>
                {col.links.map(([label, handler]) => (
                  <div key={label} onClick={handler} style={{ fontSize: "13px", color: "rgba(255,255,255,0.28)", marginBottom: "12px", cursor: handler ? "pointer" : "default", transition: "color 0.2s" }}
                    onMouseEnter={e => { if (handler) e.target.style.color = "rgba(255,255,255,0.7)"; }}
                    onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.28)"}
                  >{label}</div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "28px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.15)", letterSpacing: "0.14em", textTransform: "uppercase" }}>© 2026 AI Surprise Planner</span>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.14)" }}>Made with ❤️ in India ✦</span>
          </div>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        @keyframes orb1 { 0%,100%{transform:translate(0,0) scale(1)} 40%{transform:translate(40px,-60px) scale(1.08)} 70%{transform:translate(-30px,30px) scale(0.94)} }
        @keyframes orb2 { 0%,100%{transform:translate(0,0) scale(1)} 35%{transform:translate(-50px,40px) scale(1.1)} 65%{transform:translate(25px,-25px) scale(0.9)} }
        @keyframes orb3 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(0,-40px) scale(1.15)} }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.8)} }
        * { box-sizing: border-box; }
        @media (max-width: 900px) {
          .lp-hero-grid { grid-template-columns: 1fr !important; }
          .lp-hero-cards { display: none !important; }
          .lp-bento-grid { grid-template-columns: 1fr 1fr !important; }
          .lp-steps-grid { grid-template-columns: 1fr !important; }
          .lp-testimonials-grid { grid-template-columns: 1fr !important; }
          .lp-pricing-grid { grid-template-columns: 1fr !important; }
          .lp-footer-grid { grid-template-columns: 1fr 1fr !important; }
          .lp-nav-desktop { display: none !important; }
          .lp-hamburger { display: block !important; }
        }
        @media (max-width: 600px) {
          .lp-bento-grid { grid-template-columns: 1fr !important; }
          .lp-footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}