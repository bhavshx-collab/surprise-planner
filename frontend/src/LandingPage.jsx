import { useEffect, useState } from "react";
import RatingsWidget from "./RatingsWidget";

export default function LandingPage({ onPlan, onVendor }) {
  const [visible, setVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  


  useEffect(() => {
    setTimeout(() => setVisible(true), 80);
    const handleMouse = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  return (
    <div style={{
      width: "100vw", minHeight: "100vh",
      background: "#080808",
      color: "#fff",
      fontFamily: "'Cormorant Garamond', Georgia, serif",
      overflowX: "hidden",
      position: "relative",
    }}>

      {/* Mouse-following glow */}
      <div style={{
        position: "fixed",
        left: mousePos.x - 300, top: mousePos.y - 300,
        width: "600px", height: "600px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(139,90,200,0.06) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0,
        transition: "left 0.8s ease, top 0.8s ease",
      }} />

      {/* Background orbs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{
          position: "absolute", width: "800px", height: "800px",
          borderRadius: "50%", top: "-300px", left: "-200px",
          background: "radial-gradient(circle, rgba(139,90,200,0.12) 0%, transparent 65%)",
          animation: "orb1 10s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", width: "600px", height: "600px",
          borderRadius: "50%", bottom: "-200px", right: "-100px",
          background: "radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 65%)",
          animation: "orb2 14s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", width: "400px", height: "400px",
          borderRadius: "50%", top: "50%", right: "20%",
          background: "radial-gradient(circle, rgba(212,175,55,0.05) 0%, transparent 65%)",
          animation: "orb3 8s ease-in-out infinite",
        }} />
      </div>

      {/* Grain */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1, opacity: 0.04,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "180px",
      }} />

      {/* Gold top line */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, height: "1px", zIndex: 100,
        background: "linear-gradient(90deg, transparent 0%, #D4AF37 30%, #D4AF37 70%, transparent 100%)",
        opacity: visible ? 0.6 : 0, transition: "opacity 1.5s ease 0.3s",
      }} />

      {/* NAV */}
      <nav style={{
        position: "relative", zIndex: 10,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "32px 80px",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(-16px)",
        transition: "all 0.9s ease 0.2s",
      }}>
        <div style={{
          fontSize: "15px", letterSpacing: "0.2em",
          color: "#D4AF37", fontWeight: "400", textTransform: "uppercase",
          fontFamily: "'DM Sans', sans-serif",
        }}>
          AI Surprise Planner
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "48px" }}>
          {["How it works", "For Business", "Find Vendors"].map((item, i) => (
            <span
              key={item}
              onClick={item === "For Business" ? onVendor : undefined}
              style={{
                fontSize: "12px", letterSpacing: "0.12em",
                color: "rgba(255,255,255,0.4)", cursor: "pointer",
                textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif",
                transition: "color 0.2s",
              }}
              onMouseEnter={e => e.target.style.color = "rgba(255,255,255,0.8)"}
              onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.4)"}
            >
              {item}
            </span>
          ))}
          <button
            onClick={onPlan}
            style={{
              padding: "10px 28px",
              background: "transparent",
              border: "1px solid rgba(212,175,55,0.6)",
              color: "#D4AF37",
              fontSize: "11px", letterSpacing: "0.15em",
              textTransform: "uppercase",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: "500", cursor: "pointer",
              transition: "all 0.25s ease",
            }}
            onMouseEnter={e => { e.target.style.background = "#D4AF37"; e.target.style.color = "#080808"; }}
            onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.color = "#D4AF37"; }}
          >
            Plan a surprise
          </button>
        </div>
      </nav>

      {/* HERO — full width split layout */}
      <div style={{
        position: "relative", zIndex: 10,
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "0",
        minHeight: "88vh",
        alignItems: "center",
        padding: "0 80px",
        maxWidth: "1400px",
        margin: "0 auto",
      }}>

        {/* Left — headline */}
        <div style={{
          paddingRight: "80px",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateX(0)" : "translateX(-40px)",
          transition: "all 1.1s ease 0.5s",
        }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "14px",
            marginBottom: "48px",
          }}>
            <div style={{ width: "48px", height: "1px", background: "#D4AF37", opacity: 0.6 }} />
            <span style={{
              fontSize: "10px", letterSpacing: "0.3em",
              color: "#D4AF37", textTransform: "uppercase",
              fontFamily: "'DM Sans', sans-serif", opacity: 0.8,
            }}>
              AI-powered surprise planning
            </span>
          </div>

          <h1 style={{
            fontSize: "clamp(56px, 5.5vw, 88px)",
            fontWeight: "300", lineHeight: "1.0",
            letterSpacing: "-0.02em",
            marginBottom: "40px",
          }}>
            <span style={{ display: "block", color: "#fff" }}>Craft</span>
            <span style={{ display: "block", color: "#fff" }}>surprises</span>
            <span style={{
              display: "block", color: "#D4AF37",
              fontStyle: "italic", fontWeight: "300",
            }}>
              they'll never
            </span>
            <span style={{
              display: "block", color: "#D4AF37",
              fontStyle: "italic", fontWeight: "300",
            }}>
              forget.
            </span>
          </h1>

          <p style={{
            fontSize: "16px", color: "rgba(255,255,255,0.38)",
            lineHeight: "1.9", maxWidth: "420px",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: "300", marginBottom: "56px",
          }}>
            Tell us about them — their interests, your relationship, the occasion. Our AI crafts a deeply personal surprise plan in seconds.
          </p>

          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <button
              onClick={onPlan}
              style={{
                padding: "16px 48px",
                background: "#D4AF37", border: "none",
                color: "#080808", fontSize: "12px",
                letterSpacing: "0.18em", textTransform: "uppercase",
                fontFamily: "'DM Sans', sans-serif", fontWeight: "600",
                cursor: "pointer", transition: "all 0.3s ease",
              }}
              onMouseEnter={e => { e.target.style.background = "#e8c84a"; e.target.style.transform = "translateY(-3px)"; e.target.style.boxShadow = "0 12px 32px rgba(212,175,55,0.25)"; }}
              onMouseLeave={e => { e.target.style.background = "#D4AF37"; e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "none"; }}
            >
              Start free — no login
            </button>
            <span style={{
              fontSize: "12px", color: "rgba(255,255,255,0.25)",
              fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.05em",
            }}>
              or
            </span>
            <span
              onClick={onVendor}
              style={{
                fontSize: "12px", color: "rgba(255,255,255,0.4)",
                fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
                letterSpacing: "0.08em", textDecoration: "underline",
                textUnderlineOffset: "4px", transition: "color 0.2s",
              }}
              onMouseEnter={e => e.target.style.color = "rgba(255,255,255,0.8)"}
              onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.4)"}
            >
              List my business →
            </span>
          </div>

          {/* Stats */}
          <div style={{
            display: "flex", gap: "48px", marginTop: "72px",
            paddingTop: "48px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}>
            
            {[["500+", "Surprises planned"], ["50+", "Vendors listed"],[<RatingsWidget />]].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontSize: "32px", fontWeight: "300", color: "#D4AF37", letterSpacing: "0.05em" }}>{n}</div>
                <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)", letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", marginTop: "6px" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — two cards */}
        <div style={{
          paddingLeft: "80px",
          display: "flex", flexDirection: "column", gap: "16px",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateX(0)" : "translateX(40px)",
          transition: "all 1.1s ease 0.8s",
        }}>

          {/* Plan card */}
          <div
            onClick={onPlan}
            onMouseEnter={() => setHoveredCard("plan")}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              border: hoveredCard === "plan" ? "1px solid rgba(212,175,55,0.5)" : "1px solid rgba(255,255,255,0.07)",
              padding: "40px 44px",
              cursor: "pointer",
              transition: "all 0.35s ease",
              background: hoveredCard === "plan" ? "rgba(212,175,55,0.04)" : "rgba(255,255,255,0.015)",
              position: "relative",
            }}
          >
            <div style={{
              position: "absolute", top: 0, right: 0,
              width: "32px", height: "32px",
              borderTop: "1px solid #D4AF37", borderRight: "1px solid #D4AF37",
              opacity: hoveredCard === "plan" ? 0.8 : 0.2,
              transition: "opacity 0.3s",
            }} />
            <div style={{ fontSize: "11px", letterSpacing: "0.2em", color: "#D4AF37", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", marginBottom: "20px", opacity: 0.7 }}>
              For individuals
            </div>
            <div style={{ fontSize: "28px", fontWeight: "300", color: "#fff", marginBottom: "14px", letterSpacing: "0.02em" }}>
              Plan a surprise
            </div>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.35)", lineHeight: "1.8", fontFamily: "'DM Sans', sans-serif", marginBottom: "28px" }}>
              No account needed. Tell us about the person, we generate a personalised plan with timeline, budget, and emotional message.
            </p>
            <div style={{
              display: "flex", alignItems: "center", gap: "10px",
              fontSize: "11px", letterSpacing: "0.15em",
              color: hoveredCard === "plan" ? "#D4AF37" : "rgba(255,255,255,0.3)",
              textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif",
              transition: "color 0.3s",
            }}>
              Start free
              <span style={{ transform: hoveredCard === "plan" ? "translateX(8px)" : "translateX(0)", transition: "transform 0.3s", display: "inline-block" }}>→</span>
            </div>
          </div>

          {/* Vendor card */}
          <div
            onClick={onVendor}
            onMouseEnter={() => setHoveredCard("vendor")}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              border: hoveredCard === "vendor" ? "1px solid rgba(139,90,200,0.5)" : "1px solid rgba(255,255,255,0.07)",
              padding: "40px 44px",
              cursor: "pointer",
              transition: "all 0.35s ease",
              background: hoveredCard === "vendor" ? "rgba(139,90,200,0.04)" : "rgba(255,255,255,0.015)",
              position: "relative",
            }}
          >
            <div style={{
              position: "absolute", top: 0, right: 0,
              width: "32px", height: "32px",
              borderTop: "1px solid #9b6bd4", borderRight: "1px solid #9b6bd4",
              opacity: hoveredCard === "vendor" ? 0.8 : 0.2,
              transition: "opacity 0.3s",
            }} />
            <div style={{ fontSize: "11px", letterSpacing: "0.2em", color: "#9b6bd4", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", marginBottom: "20px", opacity: 0.8 }}>
              For businesses
            </div>
            <div style={{ fontSize: "28px", fontWeight: "300", color: "#fff", marginBottom: "14px", letterSpacing: "0.02em" }}>
              List my business
            </div>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.35)", lineHeight: "1.8", fontFamily: "'DM Sans', sans-serif", marginBottom: "28px" }}>
              Reach people actively planning surprises in your city — cafes, florists, hotels, photographers. Free to list.
            </p>
            <div style={{
              display: "flex", alignItems: "center", gap: "10px",
              fontSize: "11px", letterSpacing: "0.15em",
              color: hoveredCard === "vendor" ? "#9b6bd4" : "rgba(255,255,255,0.3)",
              textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif",
              transition: "color 0.3s",
            }}>
              Get listed free
              <span style={{ transform: hoveredCard === "vendor" ? "translateX(8px)" : "translateX(0)", transition: "transform 0.3s", display: "inline-block" }}>→</span>
            </div>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div style={{
        position: "relative", zIndex: 10,
        maxWidth: "1400px", margin: "0 auto",
        padding: "100px 80px",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        opacity: visible ? 1 : 0,
        transition: "opacity 1s ease 1.4s",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "64px" }}>
          <h2 style={{ fontSize: "48px", fontWeight: "300", letterSpacing: "0.02em", lineHeight: "1.1" }}>
            Three steps to<br />
            <span style={{ color: "#D4AF37", fontStyle: "italic" }}>something unforgettable</span>
          </h2>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.3)", maxWidth: "260px", lineHeight: "1.8", fontFamily: "'DM Sans', sans-serif", textAlign: "right" }}>
            From the idea in your head to a moment they'll talk about for years.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1px", background: "rgba(255,255,255,0.06)" }}>
          {[
            { n: "01", t: "Describe them", d: "Share their interests, your relationship, the occasion, your budget. The more personal the details, the more magical the plan." },
            { n: "02", t: "AI plans it", d: "Personalised surprise idea, emotional message, full timeline with before/during/after steps, and a smart budget breakdown." },
            { n: "03", t: "Make it happen", d: "Execute yourself using the plan, or connect with verified local vendors in your city who handle everything for you." },
          ].map((s, i) => (
            <div key={i} style={{
              padding: "52px 48px",
              background: "#080808",
              transition: "background 0.3s",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "#0f0f0f"}
              onMouseLeave={e => e.currentTarget.style.background = "#080808"}
            >
              <div style={{ fontSize: "11px", letterSpacing: "0.25em", color: "#D4AF37", marginBottom: "28px", fontFamily: "'DM Sans', sans-serif", opacity: 0.7 }}>{s.n}</div>
              <div style={{ fontSize: "24px", fontWeight: "300", color: "#fff", marginBottom: "18px", letterSpacing: "0.02em" }}>{s.t}</div>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.32)", lineHeight: "1.9", fontFamily: "'DM Sans', sans-serif" }}>{s.d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FINAL CTA BAND */}
      <div style={{
        position: "relative", zIndex: 10,
        background: "#D4AF37",
        padding: "72px 80px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        opacity: visible ? 1 : 0,
        transition: "opacity 1s ease 1.6s",
      }}>
        <div>
          <div style={{ fontSize: "40px", fontWeight: "300", color: "#080808", letterSpacing: "0.01em", lineHeight: "1.1" }}>
            Someone special<br />deserves this.
          </div>
          <div style={{ fontSize: "14px", color: "rgba(8,8,8,0.5)", marginTop: "12px", fontFamily: "'DM Sans', sans-serif" }}>
            Free to use. No account needed. Start in 30 seconds.
          </div>
        </div>
        <button
          onClick={onPlan}
          style={{
            padding: "18px 56px",
            background: "#080808", border: "none",
            color: "#D4AF37", fontSize: "12px",
            letterSpacing: "0.18em", textTransform: "uppercase",
            fontFamily: "'DM Sans', sans-serif", fontWeight: "600",
            cursor: "pointer", flexShrink: 0,
            transition: "all 0.25s ease",
          }}
          onMouseEnter={e => { e.target.style.background = "#1a1a1a"; e.target.style.transform = "translateY(-2px)"; }}
          onMouseLeave={e => { e.target.style.background = "#080808"; e.target.style.transform = "translateY(0)"; }}
        >
          Plan a surprise →
        </button>
      </div>

      {/* FOOTER */}
      <div style={{
        position: "relative", zIndex: 10,
        padding: "32px 80px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}>
        <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.15)", letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>
          AI Surprise Planner
        </span>
        <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.12)", fontFamily: "'DM Sans', sans-serif" }}>
          Made with love in India ✦
        </span>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes orb1 { 0%,100%{transform:translate(0,0) scale(1)} 40%{transform:translate(40px,-60px) scale(1.08)} 70%{transform:translate(-30px,30px) scale(0.94)} }
        @keyframes orb2 { 0%,100%{transform:translate(0,0) scale(1)} 35%{transform:translate(-50px,40px) scale(1.1)} 65%{transform:translate(25px,-25px) scale(0.9)} }
        @keyframes orb3 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(0,-40px) scale(1.15)} }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}