// RevealPage.jsx — Cinematic scratch-card surprise reveal for recipients
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function RevealPage({ planId }) {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState("teaser"); // teaser → scratching → revealed
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    fetch(`${API}/api/surprise/plan/${planId}`)
      .then(r => r.json())
      .then(d => { setPlan(d); setLoading(false); })
      .catch(() => setLoading(false));
    const h = e => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, [planId]);

  const copyLink = () => navigator.clipboard.writeText(window.location.href);
  const shareWA = () => window.open(`https://wa.me/?text=${encodeURIComponent(`Someone planned something special for you 🎁 Open your surprise: ${window.location.href}`)}`);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#07070f", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 48, height: 48, border: "2px solid rgba(212,175,55,0.2)", borderTopColor: "#D4AF37", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 16px" }} />
        <div style={{ color: "rgba(255,255,255,0.4)", fontFamily: "DM Sans", fontSize: 14 }}>Opening your surprise...</div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!plan) return (
    <div style={{ minHeight: "100vh", background: "#07070f", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "DM Sans" }}>
      Surprise not found 🎁
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#07070f", color: "#fff", fontFamily: "'Cormorant Garamond', Georgia, serif", overflowX: "hidden", position: "relative" }}>

      {/* Mouse glow */}
      <div style={{ position: "fixed", left: mousePos.x - 300, top: mousePos.y - 300, width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(212,175,55,0.05) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0, transition: "left 0.8s ease, top 0.8s ease" }} />

      {/* Ambient orbs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", width: 700, height: 700, borderRadius: "50%", top: "-200px", left: "-150px", background: "radial-gradient(circle, rgba(123,110,232,0.08) 0%, transparent 65%)", animation: "orb1 18s ease-in-out infinite" }} />
        <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", bottom: "-100px", right: "-100px", background: "radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 65%)", animation: "orb2 14s ease-in-out infinite" }} />
      </div>

      {/* Gold top line */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent 0%, #D4AF37 40%, #D4AF37 60%, transparent 100%)", opacity: 0.4, zIndex: 100 }} />

      <div style={{ position: "relative", zIndex: 10, maxWidth: 640, margin: "0 auto", padding: "60px 24px 80px" }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 11, letterSpacing: "0.25em", color: "#D4AF37", textTransform: "uppercase", fontFamily: "DM Sans", marginBottom: 20, opacity: 0.8 }}>
            ✦ Someone planned something for you ✦
          </div>
          <h1 style={{ fontSize: "clamp(40px, 7vw, 64px)", fontWeight: 300, lineHeight: 1.1, letterSpacing: "-0.01em" }}>
            You have a <br />
            <span style={{ color: "#D4AF37", fontStyle: "italic" }}>surprise waiting.</span>
          </h1>
        </motion.div>

        {/* Reveal card */}
        <AnimatePresence mode="wait">
          {phase === "teaser" && (
            <motion.div key="teaser" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.5 }}>
              <div
                onClick={() => setPhase("revealed")}
                style={{
                  border: "1px solid rgba(212,175,55,0.3)", borderRadius: 20,
                  padding: "56px 40px", textAlign: "center", cursor: "pointer",
                  background: "linear-gradient(135deg, rgba(212,175,55,0.05) 0%, rgba(123,110,232,0.04) 100%)",
                  backdropFilter: "blur(24px)", position: "relative", overflow: "hidden",
                  transition: "all 0.3s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(212,175,55,0.6)"; e.currentTarget.style.background = "linear-gradient(135deg, rgba(212,175,55,0.09) 0%, rgba(123,110,232,0.07) 100%)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(212,175,55,0.3)"; e.currentTarget.style.background = "linear-gradient(135deg, rgba(212,175,55,0.05) 0%, rgba(123,110,232,0.04) 100%)"; }}
              >
                {/* Corner accents */}
                <div style={{ position: "absolute", top: 0, left: 0, width: 32, height: 32, borderTop: "1px solid #D4AF37", borderLeft: "1px solid #D4AF37", opacity: 0.6 }} />
                <div style={{ position: "absolute", bottom: 0, right: 0, width: 32, height: 32, borderBottom: "1px solid #D4AF37", borderRight: "1px solid #D4AF37", opacity: 0.6 }} />

                <div style={{ fontSize: 56, marginBottom: 20 }}>🎁</div>
                <div style={{ fontSize: 28, fontWeight: 300, marginBottom: 16 }}>A surprise awaits you.</div>
                <div style={{ fontSize: 15, color: "rgba(255,255,255,0.38)", fontFamily: "DM Sans", lineHeight: 1.8, marginBottom: 32 }}>
                  Someone who cares about you has planned something special.<br />Tap to reveal the surprise.
                </div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 10, fontSize: 13, letterSpacing: "0.15em", color: "#D4AF37", textTransform: "uppercase", fontFamily: "DM Sans" }}>
                  Tap to reveal
                  <motion.span animate={{ x: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.4 }}>→</motion.span>
                </div>
              </div>
            </motion.div>
          )}

          {phase === "revealed" && (
            <motion.div key="revealed" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              {/* Reveal badge */}
              <div style={{ textAlign: "center", marginBottom: 32 }}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 12, delay: 0.2 }} style={{ display: "inline-block", fontSize: 48, marginBottom: 12 }}>🎉</motion.div>
                <div style={{ fontSize: 12, letterSpacing: "0.2em", color: "#D4AF37", textTransform: "uppercase", fontFamily: "DM Sans", opacity: 0.8 }}>Your surprise is...</div>
              </div>

              {/* Main plan idea */}
              <div style={{ border: "1px solid rgba(212,175,55,0.25)", borderRadius: 20, padding: "40px 32px", marginBottom: 16, background: "rgba(212,175,55,0.04)", backdropFilter: "blur(24px)" }}>
                <div style={{ fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 300, lineHeight: 1.3, marginBottom: 24, fontStyle: "italic" }}>
                  "{plan.idea}"
                </div>
                {plan.message && (
                  <div style={{ fontSize: 16, color: "rgba(255,255,255,0.55)", lineHeight: 1.9, fontFamily: "DM Sans", fontWeight: 300, borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 24, fontStyle: "normal" }}>
                    {plan.message}
                  </div>
                )}
              </div>

              {/* Timeline preview */}
              {plan.timeline?.before?.length > 0 && (
                <div style={{ border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "24px 28px", marginBottom: 16, background: "rgba(255,255,255,0.02)", backdropFilter: "blur(16px)" }}>
                  <div style={{ fontSize: 11, letterSpacing: "0.15em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", fontFamily: "DM Sans", marginBottom: 16 }}>What to expect</div>
                  {[...(plan.timeline?.before || []).slice(0, 2), ...(plan.timeline?.during || []).slice(0, 2)].map((s, i) => (
                    <div key={i} style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", fontFamily: "DM Sans", padding: "6px 0 6px 14px", borderLeft: "1.5px solid rgba(212,175,55,0.2)", marginBottom: 4, lineHeight: 1.6 }}>
                      {s.replace(/^[-•]\s*/, "")}
                    </div>
                  ))}
                </div>
              )}

              {/* Action buttons */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 24 }}>
                <button onClick={copyLink} style={{ padding: "14px 20px", borderRadius: 10, border: "1px solid rgba(212,175,55,0.35)", background: "rgba(212,175,55,0.08)", color: "#D4AF37", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "DM Sans", letterSpacing: "0.04em", transition: "all 0.2s" }}>
                  🔗 Copy Link
                </button>
                <button onClick={shareWA} style={{ padding: "14px 20px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #25D366, #1aa84f)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "DM Sans", letterSpacing: "0.04em" }}>
                  📲 Share on WhatsApp
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 60, fontSize: 12, color: "rgba(255,255,255,0.15)", fontFamily: "DM Sans", letterSpacing: "0.1em" }}>
          Created with ✦ AI Surprise Planner
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes orb1{0%,100%{transform:translate(0,0) scale(1)}40%{transform:translate(40px,-60px) scale(1.08)}70%{transform:translate(-30px,30px) scale(0.95)}}
        @keyframes orb2{0%,100%{transform:translate(0,0) scale(1)}35%{transform:translate(-50px,40px) scale(1.1)}65%{transform:translate(25px,-25px) scale(0.92)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        *{box-sizing:border-box;margin:0;padding:0}
      `}</style>
    </div>
  );
}
