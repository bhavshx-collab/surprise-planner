import { useState, useEffect } from "react";

const ICEBREAKER_DEFAULTS = {
  starter_question: "What's one small thing that genuinely made you smile this week?",
  fun_fact_prompt: "Share one surprising fact about yourself that has nothing to do with work",
  group_challenge: "Describe your perfect Saturday in exactly 10 words — one word per person",
  conversation_sparks: [
    "What's a book / place / experience that genuinely changed how you see something?",
    "What's something you're slowly getting better at, that you never expected to enjoy?",
    "If you had a free long weekend with absolutely nothing planned, what would you do?",
  ],
  secret_role: "Each of you will be assigned a secret role when you arrive 🎭",
};

const MEMBER_AVATARS = [
  { initial: "P", color: "#7B6EE8" },
  { initial: "A", color: "#D4AF37" },
  { initial: "?", color: "rgba(255,255,255,0.15)" },
];

export default function EventDetail({ event, onBack, onJoin, user }) {
  const [joined, setJoined] = useState(false);
  const [joining, setJoining] = useState(false);
  const [showIcebreaker, setShowIcebreaker] = useState(false);
  const [countdown, setCountdown] = useState("2d 14h 32m");

  if (!event) return null;

  const spotsLeft = event.slots_total - event.slots_taken;
  const isFull = spotsLeft <= 0;

  const handleJoin = async () => {
    if (!user) { onJoin?.(); return; }
    setJoining(true);
    await new Promise(r => setTimeout(r, 1200));
    setJoined(true);
    setJoining(false);
    alert(`🎉 You're in! We'll confirm your spot by email. The venue will be revealed 30 min before the event.\n\n📍 Venue reveal: ${new Date(Date.now() + 86400000 * 2).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })} at the event start time.\n\n₹${event.price} curation fee (simulated — Razorpay coming soon)`);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080808", fontFamily: "'DM Sans', sans-serif", color: "#fff" }}>

      {/* BG */}
      <div style={{ position: "fixed", width: "700px", height: "700px", borderRadius: "50%", top: "-250px", right: "-200px", background: `radial-gradient(circle, ${event.color}12 0%, transparent 65%)`, pointerEvents: "none", animation: "orb1 14s ease-in-out infinite" }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: "900px", margin: "0 auto", padding: "clamp(36px, 5vh, 60px) clamp(24px, 5vw, 60px) clamp(80px, 10vh, 120px)" }}>

        {/* Back */}
        <button onClick={onBack} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", fontSize: "13px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", padding: 0, marginBottom: "40px", display: "flex", alignItems: "center", gap: "6px", transition: "color 0.2s" }}
          onMouseEnter={e => e.target.style.color = "rgba(255,255,255,0.7)"}
          onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.3)"}
        >← All events</button>

        {/* Hero */}
        <div style={{ marginBottom: "48px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px", flexWrap: "wrap" }}>
            <div style={{ fontSize: "11px", letterSpacing: "0.2em", color: event.color, textTransform: "uppercase", padding: "5px 14px", border: `1px solid ${event.color}40`, background: `${event.color}08` }}>
              {event.emoji} {event.title}
            </div>
            <div style={{ fontSize: "11px", letterSpacing: "0.14em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>
              {event.energy === "low" ? "🌙 Chill energy" : "⚡ Moderate energy"}
            </div>
            {spotsLeft === 1 && <div style={{ fontSize: "11px", letterSpacing: "0.1em", color: "#E85D75", textTransform: "uppercase", padding: "5px 14px", border: "1px solid rgba(232,93,117,0.4)", background: "rgba(232,93,117,0.08)" }}>⚡ 1 spot left!</div>}
          </div>

          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px, 5vw, 64px)", fontWeight: "300", lineHeight: "1.1", marginBottom: "20px" }}>
            {event.teaser}
          </h1>

          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "rgba(255,255,255,0.5)" }}>
              <span>📅</span> {event.datetime}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "rgba(255,255,255,0.5)" }}>
              <span>📍</span> {event.area}, Bangalore
              <span style={{ fontSize: "11px", padding: "2px 8px", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.25)", borderRadius: "20px" }}>Exact venue hidden</span>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "28px", alignItems: "start" }} className="ed-grid">

          {/* Left */}
          <div>
            {/* What to expect */}
            <div style={{ marginBottom: "32px", padding: "28px", border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}>
              <div style={{ fontSize: "11px", letterSpacing: "0.2em", color: event.color, textTransform: "uppercase", marginBottom: "20px", opacity: 0.8 }}>What to expect</div>
              {[
                "You arrive independently (no group entrance awkwardness)",
                "A curated activity drives the conversation naturally",
                "AI-generated icebreaker card on your table when you arrive",
                "2–3 hours of low-pressure time — leave when you're ready",
                "Group WhatsApp created after the event if you all want to connect",
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: "14px", marginBottom: "14px", alignItems: "flex-start" }}>
                  <span style={{ color: event.color, fontSize: "14px", marginTop: "1px", flexShrink: 0 }}>✦</span>
                  <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", lineHeight: "1.7" }}>{item}</span>
                </div>
              ))}
            </div>

            {/* Venue Reveal Countdown */}
            <div style={{ marginBottom: "32px", padding: "24px", border: `1px solid ${event.color}25`, background: `${event.color}05` }}>
              <div style={{ fontSize: "11px", letterSpacing: "0.2em", color: event.color, textTransform: "uppercase", marginBottom: "12px", opacity: 0.75 }}>
                🔒 Venue reveal countdown
              </div>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", lineHeight: "1.7", marginBottom: "16px" }}>
                The exact venue and address will appear in your app 30 minutes before the event starts. This is part of the mystery — and it keeps things exciting.
              </p>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "32px", color: event.color, letterSpacing: "0.05em" }}>
                {countdown}
              </div>
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)", marginTop: "4px" }}>until venue is revealed</div>
            </div>

            {/* Who's coming */}
            <div style={{ marginBottom: "32px", padding: "28px", border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}>
              <div style={{ fontSize: "11px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: "20px" }}>Who's coming ({event.slots_taken} confirmed)</div>
              <div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
                {Array(event.slots_total).fill(0).map((_, i) => {
                  const member = MEMBER_AVATARS[i];
                  const isTaken = i < event.slots_taken;
                  return (
                    <div key={i} style={{ textAlign: "center" }}>
                      <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: isTaken ? (member ? `${member.color}20` : "rgba(255,255,255,0.05)") : "rgba(255,255,255,0.04)", border: `1px solid ${isTaken ? (member?.color || "rgba(255,255,255,0.15)") : "rgba(255,255,255,0.08)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: "600", color: isTaken ? (member?.color || "rgba(255,255,255,0.4)") : "rgba(255,255,255,0.15)" }}>
                        {isTaken ? (member?.initial || "•") : "+"}
                      </div>
                      <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)", marginTop: "6px" }}>{isTaken ? "Confirmed" : "Open"}</div>
                    </div>
                  );
                })}
              </div>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", marginTop: "16px", lineHeight: "1.7" }}>
                Actual names and photos shared 1 hour before the event.
              </p>
            </div>

            {/* Icebreaker preview */}
            <div style={{ padding: "28px", border: `1px solid ${event.color}20`, background: `${event.color}04`, cursor: "pointer" }}
              onClick={() => setShowIcebreaker(!showIcebreaker)}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: "11px", letterSpacing: "0.2em", color: event.color, textTransform: "uppercase", opacity: 0.8 }}>🎴 Your icebreaker card (preview)</div>
                <span style={{ color: event.color, transform: showIcebreaker ? "rotate(90deg)" : "rotate(0)", transition: "transform 0.3s" }}>→</span>
              </div>
              {showIcebreaker && (
                <div style={{ marginTop: "20px" }}>
                  <div style={{ marginBottom: "16px" }}>
                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.1em" }}>Starter question</div>
                    <div style={{ fontSize: "15px", fontStyle: "italic", fontFamily: "'Cormorant Garamond', serif", color: "rgba(255,255,255,0.75)", lineHeight: "1.6" }}>"{ICEBREAKER_DEFAULTS.starter_question}"</div>
                  </div>
                  <div style={{ marginBottom: "16px" }}>
                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.1em" }}>Group challenge</div>
                    <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", lineHeight: "1.65" }}>{ICEBREAKER_DEFAULTS.group_challenge}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.1em" }}>Conversation sparks</div>
                    {ICEBREAKER_DEFAULTS.conversation_sparks.map((s, i) => (
                      <div key={i} style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", marginBottom: "8px", paddingLeft: "14px", borderLeft: `2px solid ${event.color}40`, lineHeight: "1.65" }}>{s}</div>
                    ))}
                  </div>
                  <div style={{ marginTop: "16px", fontSize: "12px", color: "rgba(255,255,255,0.2)", fontStyle: "italic" }}>
                    * Final icebreaker card tailored to your group after everyone joins
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right — Join card */}
          <div style={{ position: "sticky", top: "24px" }}>
            <div style={{ padding: "28px", border: `1px solid ${event.color}30`, background: `${event.color}05` }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "40px", color: event.color, marginBottom: "4px" }}>₹{event.price}</div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", marginBottom: "24px" }}>curation fee · refunded if you show up</div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
                {[
                  ["📅", event.datetime],
                  ["📍", `${event.area} area (exact venue hidden)`],
                  ["👥", `${event.slots_total} people max · ${spotsLeft} spot${spotsLeft !== 1 ? "s" : ""} left`],
                ].map(([icon, text]) => (
                  <div key={text} style={{ display: "flex", gap: "10px", fontSize: "13px", color: "rgba(255,255,255,0.45)" }}>
                    <span style={{ flexShrink: 0 }}>{icon}</span>
                    <span>{text}</span>
                  </div>
                ))}
              </div>

              {!joined ? (
                <button onClick={handleJoin} disabled={joining || isFull} style={{
                  width: "100%", padding: "15px",
                  background: isFull ? "rgba(255,255,255,0.05)" : "#1DB375",
                  border: "none", color: isFull ? "rgba(255,255,255,0.2)" : "#080808",
                  fontSize: "13px", letterSpacing: "0.1em", textTransform: "uppercase",
                  fontFamily: "'DM Sans', sans-serif", fontWeight: "700",
                  cursor: isFull || joining ? "not-allowed" : "pointer", transition: "all 0.25s",
                }}
                  onMouseEnter={e => { if (!isFull && !joining) { e.target.style.background = "#22d68a"; e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 24px rgba(29,179,117,0.3)"; } }}
                  onMouseLeave={e => { e.target.style.background = isFull ? "rgba(255,255,255,0.05)" : "#1DB375"; e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "none"; }}
                >
                  {joining ? "Reserving your spot..." : isFull ? "This event is full" : !user ? "Sign in to join →" : "Reserve my spot →"}
                </button>
              ) : (
                <div style={{ padding: "15px", background: "rgba(29,179,117,0.1)", border: "1px solid rgba(29,179,117,0.3)", textAlign: "center" }}>
                  <div style={{ fontSize: "20px", marginBottom: "6px" }}>🎉</div>
                  <div style={{ fontSize: "13px", color: "#1DB375", fontWeight: "600" }}>You're confirmed!</div>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", marginTop: "4px" }}>Check your email for details</div>
                </div>
              )}

              <div style={{ marginTop: "16px", fontSize: "11px", color: "rgba(255,255,255,0.2)", lineHeight: "1.65", textAlign: "center" }}>
                By joining you agree to show up or message the group 24h in advance.
              </div>
            </div>

            {/* Safety note */}
            <div style={{ marginTop: "16px", padding: "16px", border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.015)" }}>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)", lineHeight: "1.75" }}>
                🛡️ All attendees have verified profiles · One-tap report button at the event · Max 4 people
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        @keyframes orb1 { 0%,100%{transform:translate(0,0) scale(1)} 40%{transform:translate(40px,-60px) scale(1.08)} 70%{transform:translate(-30px,30px) scale(0.95)} }
        * { box-sizing: border-box; }
        @media (max-width: 800px) { .ed-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
