import { useState } from "react";
import { supabase } from "./supabase";

export default function AuthPage({ onAuth }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleMagicLink = async () => {
    if (!email) return setError("Please enter your email");
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });
    if (error) setError(error.message);
    else setSent(true);
    setLoading(false);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      display: "flex", alignItems: "stretch",
      background: "#080808",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {/* BG orbs */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", width: "700px", height: "700px", borderRadius: "50%", top: "-200px", left: "-200px", background: "radial-gradient(circle, rgba(123,110,232,0.12) 0%, transparent 65%)", animation: "authOrb1 12s ease-in-out infinite" }} />
        <div style={{ position: "absolute", width: "500px", height: "500px", borderRadius: "50%", bottom: "-150px", right: "-100px", background: "radial-gradient(circle, rgba(212,175,55,0.09) 0%, transparent 65%)", animation: "authOrb2 16s ease-in-out infinite" }} />
      </div>

      {/* Left panel — brand */}
      <div className="auth-left-panel" style={{
        flex: "1", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start",
        padding: "clamp(40px, 6vw, 100px)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        position: "relative", zIndex: 1,
      }}>
        <div style={{ marginBottom: "64px" }}>
          <div style={{ fontSize: "11px", letterSpacing: "0.25em", color: "#D4AF37", textTransform: "uppercase", marginBottom: "24px", opacity: 0.7 }}>✦ AI Surprise Planner</div>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(36px, 4vw, 60px)", fontWeight: "300", lineHeight: "1.1",
            color: "#fff", letterSpacing: "-0.01em", marginBottom: "20px",
          }}>
            Save plans.<br />
            <span style={{ color: "#D4AF37", fontStyle: "italic" }}>Revisit magic.</span>
          </h2>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.35)", lineHeight: "1.85", maxWidth: "380px" }}>
            Sign in to save all your surprise plans, access your vendor shortlist, unlock the memory scrapbook, and get personalised recommendations.
          </p>
        </div>

        {/* Feature list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {[
            ["✨", "Unlimited AI surprise plans"],
            ["📋", "Save & revisit all your plans"],
            ["📸", "Memory scrapbook after the event"],
            ["🏪", "Direct vendor connections"],
            ["🎁", "Custom reveal link for the recipient"],
          ].map(([icon, text]) => (
            <div key={text} style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0 }}>{icon}</div>
              <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.45)", lineHeight: 1.4 }}>{text}</span>
            </div>
          ))}
        </div>

        {/* Floating plan preview card */}
        <div style={{
          marginTop: "56px", padding: "20px 24px",
          border: "1px solid rgba(212,175,55,0.15)",
          background: "rgba(212,175,55,0.03)",
          borderRadius: "2px", maxWidth: "380px",
          backdropFilter: "blur(16px)",
        }}>
          <div style={{ fontSize: "10px", letterSpacing: "0.2em", color: "#D4AF37", textTransform: "uppercase", marginBottom: "10px", opacity: 0.65 }}>Sample plan · Birthday · Mumbai</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "16px", fontStyle: "italic", color: "rgba(255,255,255,0.75)", lineHeight: 1.5 }}>
            "Rooftop sunset picnic with her favourite playlist, handwritten letters from friends, and a custom stargazing kit."
          </div>
          <div style={{ display: "flex", gap: "4px", marginTop: "12px" }}>
            {["🌅 Timeline", "💸 Budget", "📍 Vendors"].map(tag => (
              <span key={tag} style={{ fontSize: "10px", padding: "3px 10px", border: "1px solid rgba(212,175,55,0.15)", color: "rgba(212,175,55,0.55)", borderRadius: "20px", fontFamily: "'DM Sans', sans-serif" }}>{tag}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{
        width: "clamp(360px, 40%, 520px)",
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "clamp(40px, 5vw, 80px)",
        position: "relative", zIndex: 1,
      }} className="auth-right-panel">

        <div style={{ marginBottom: "48px" }}>
          <div style={{ fontSize: "11px", letterSpacing: "0.22em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", marginBottom: "16px" }}>Welcome back</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px, 3vw, 40px)", fontWeight: "300", color: "#fff", lineHeight: 1.2, marginBottom: "12px" }}>
            Sign in to your<br /><span style={{ color: "#D4AF37", fontStyle: "italic" }}>account</span>
          </h1>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.3)", lineHeight: 1.7 }}>We'll send you a magic link — no password needed.</p>
        </div>

        {!sent ? (
          <>
            <div style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>Email address</label>
              <input
                type="email"
                placeholder="you@gmail.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleMagicLink()}
                autoFocus
                style={{
                  width: "100%", padding: "14px 16px",
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "2px", color: "#fff", fontFamily: "'DM Sans', sans-serif",
                  fontSize: "15px", outline: "none", transition: "all 0.2s", boxSizing: "border-box",
                }}
                onFocus={e => { e.target.style.borderColor = "rgba(212,175,55,0.5)"; e.target.style.background = "rgba(212,175,55,0.03)"; }}
                onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.background = "rgba(255,255,255,0.04)"; }}
              />
            </div>

            {error && (
              <div style={{ fontSize: "13px", color: "#ff6b6b", padding: "10px 14px", background: "rgba(255,107,107,0.08)", border: "1px solid rgba(255,107,107,0.2)", marginBottom: "14px" }}>
                {error}
              </div>
            )}

            <button onClick={handleMagicLink} disabled={loading || !email} style={{
              width: "100%", padding: "15px",
              background: loading || !email ? "rgba(212,175,55,0.25)" : "linear-gradient(135deg, #E8C84A, #D4AF37)",
              border: "none", color: loading || !email ? "rgba(8,8,8,0.4)" : "#080808",
              fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: "700",
              letterSpacing: "0.1em", textTransform: "uppercase", cursor: loading || !email ? "not-allowed" : "pointer",
              transition: "all 0.25s", marginBottom: "16px",
            }}
              onMouseEnter={e => { if (!loading && email) { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 24px rgba(212,175,55,0.3)"; } }}
              onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "none"; }}
            >
              {loading ? "Sending magic link..." : "✉ Send magic link"}
            </button>

            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", textAlign: "center", lineHeight: 1.6 }}>
              Free to use · No spam · Cancel anytime<br />
              <span style={{ color: "rgba(255,255,255,0.13)" }}>By signing in, you agree to our Terms & Privacy Policy</span>
            </p>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "2rem 0" }}>
            <div style={{ fontSize: "56px", marginBottom: "24px" }}>📬</div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "28px", fontWeight: "300", color: "#fff", marginBottom: "12px" }}>Check your inbox</h3>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", lineHeight: "1.75" }}>
              We sent a magic link to<br /><strong style={{ color: "rgba(255,255,255,0.7)" }}>{email}</strong>.<br /><br />
              Click the link to sign in — it expires in 10 minutes.
            </p>
            <button onClick={() => { setSent(false); setEmail(""); }} style={{ marginTop: "28px", fontSize: "12px", color: "rgba(255,255,255,0.25)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: "3px", fontFamily: "'DM Sans', sans-serif" }}>
              Try a different email
            </button>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        @keyframes authOrb1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(40px,-40px)} }
        @keyframes authOrb2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-30px,30px)} }
        @media (max-width: 768px) {
          .auth-left-panel { display: none !important; }
          .auth-right-panel { width: 100% !important; }
        }
      `}</style>
    </div>
  );
}