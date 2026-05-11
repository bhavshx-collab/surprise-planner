import { useState } from "react";

const ACTIVITY_TYPES = [
  { id: "board_games", emoji: "🎲", name: "Board Game Night", desc: "Curated games, no experience needed. Strategy, laughter, and zero awkward silences.", energy: "low", color: "#FFFFFF", bg: "rgba(255,255,255,0.08)" },
  { id: "coffee_trail", emoji: "☕", name: "Quiet Coffee Trail", desc: "Three indie cafés, one afternoon. The kind of conversation you actually remember.", energy: "low", color: "#D4AF37", bg: "rgba(212,175,55,0.08)" },
  { id: "art_workshop", emoji: "🎨", name: "Art Workshop", desc: "Pottery, watercolour, or collage. Work side by side. Take home what you make.", energy: "low", color: "#E85D75", bg: "rgba(232,93,117,0.08)" },
  { id: "nature_walk", emoji: "🌿", name: "Nature Walk", desc: "Cubbon Park at golden hour. Birdsong, fresh air, and an ending chai.", energy: "medium", color: "#FFFFFF", bg: "rgba(255,255,255,0.08)" },
  { id: "book_swap", emoji: "📚", name: "Book Swap", desc: "Bring a book you love. Leave with one you've never heard of. Talk about both.", energy: "low", color: "#D4AF37", bg: "rgba(212,175,55,0.08)" },
  { id: "cook_together", emoji: "🍳", name: "Cook Together", desc: "One kitchen, one dish, four strangers. The meal is just the excuse to connect.", energy: "medium", color: "#E85D75", bg: "rgba(232,93,117,0.08)" },
];

const STEPS = [
  { n: "01", icon: "🧭", title: "Tell us your vibe", desc: "Energy level, interests, what makes a perfect Saturday for you." },
  { n: "02", icon: "🤖", title: "AI matches you", desc: "We find 2–3 people in Bangalore with overlapping energy and interests." },
  { n: "03", icon: "🎁", title: "Mystery plan created", desc: "An AI-generated secret itinerary — venue revealed 30 min before." },
  { n: "04", icon: "✨", title: "Show up, connect", desc: "Arrive alone. Leave with people you actually want to see again." },
];

const STATS = [
  ["347", "Connections made"],
  ["89", "Events this month"],
  ["4", "People max per event"],
  ["4.8★", "Average rating"],
];

export default function IntrovertLanding({ onJoin, onBrowse, onCreateProfile }) {
  const [hoveredActivity, setHoveredActivity] = useState(null);

  return (
    <div style={{ minHeight: "100vh", background: "#080808", color: "#fff", fontFamily: "'Inter', sans-serif", overflowX: "hidden" }}>

      {/* BG Image and Overlay */}
      <div style={{ position: "fixed", inset: 0, backgroundImage: "url('/adventure-bg.png')", backgroundSize: "cover", backgroundPosition: "center", zIndex: 0 }} />
      <div style={{ position: "fixed", inset: 0, background: "linear-gradient(to bottom, rgba(5,5,5,0.4) 0%, rgba(5,5,5,0.8) 60%, #050505 100%)", zIndex: 0 }} />

      {/* HERO */}
      <section style={{ position: "relative", zIndex: 10, maxWidth: "1200px", margin: "0 auto", padding: "clamp(60px, 10vh, 120px) clamp(24px, 5vw, 80px) clamp(60px, 8vh, 100px)", textAlign: "center" }}>

        <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", marginBottom: "36px", padding: "6px 20px", border: "1px solid rgba(255,255,255,0.25)", borderRadius: "40px", background: "rgba(255,255,255,0.06)" }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#FFFFFF", animation: "pulse 2s infinite" }} />
          <span style={{ fontSize: "11px", letterSpacing: "0.22em", color: "#FFFFFF", textTransform: "uppercase" }}>New · Bangalore · Beta</span>
        </div>

        <h1 style={{ fontFamily: "'Outfit', serif", fontSize: "clamp(48px, 6vw, 96px)", fontWeight: "300", lineHeight: "1.0", letterSpacing: "-0.02em", marginBottom: "28px", textShadow: "0 4px 24px rgba(0,0,0,0.6)" }}>
          <span style={{ display: "block", color: "#fff" }}>Meet your people.</span>
          <span style={{ display: "block", color: "#FFFFFF", fontStyle: "italic" }}>The introvert way.</span>
        </h1>

        <p style={{ fontSize: "clamp(15px, 1.8vw, 18px)", color: "rgba(255,255,255,0.7)", lineHeight: "1.9", maxWidth: "560px", margin: "0 auto 56px", fontWeight: "400", textShadow: "0 2px 12px rgba(0,0,0,0.8)" }}>
          You moved to Bangalore. You have work friends. What you're missing are real connections — people who enjoy the same quiet, meaningful, slightly nerdy things you do.
        </p>

        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={onCreateProfile} style={{ padding: "16px 48px", background: "#FFFFFF", border: "none", color: "#080808", fontSize: "13px", letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "'Inter', sans-serif", fontWeight: "700", cursor: "pointer", transition: "all 0.3s" }}
            onMouseEnter={e => { e.target.style.background = "#22d68a"; e.target.style.transform = "translateY(-3px)"; e.target.style.boxShadow = "0 12px 32px rgba(255,255,255,0.3)"; }}
            onMouseLeave={e => { e.target.style.background = "#FFFFFF"; e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "none"; }}
          >Find my people →</button>
          <button onClick={onBrowse} style={{ padding: "16px 32px", background: "none", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.6)", fontSize: "13px", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'Inter', sans-serif", cursor: "pointer", transition: "all 0.2s" }}
            onMouseEnter={e => { e.target.style.borderColor = "rgba(255,255,255,0.4)"; e.target.style.color = "#fff"; }}
            onMouseLeave={e => { e.target.style.borderColor = "rgba(255,255,255,0.15)"; e.target.style.color = "rgba(255,255,255,0.6)"; }}
          >Browse events</button>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", justifyContent: "center", gap: "clamp(28px, 5vw, 64px)", marginTop: "72px", paddingTop: "48px", borderTop: "1px solid rgba(255,255,255,0.06)", flexWrap: "wrap" }}>
          {STATS.map(([n, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Outfit', serif", fontSize: "clamp(24px, 3vw, 36px)", fontWeight: "300", color: "#FFFFFF" }}>{n}</div>
              <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)", letterSpacing: "0.14em", textTransform: "uppercase", marginTop: "6px" }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ position: "relative", zIndex: 10, background: "rgba(255,255,255,0.015)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "clamp(60px, 8vh, 100px) clamp(24px, 5vw, 80px)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <div style={{ fontSize: "10px", letterSpacing: "0.3em", color: "#FFFFFF", textTransform: "uppercase", marginBottom: "16px", opacity: 0.8 }}>How it works</div>
            <h2 style={{ fontFamily: "'Outfit', serif", fontSize: "clamp(32px, 4vw, 56px)", fontWeight: "300" }}>
              Four steps to <span style={{ color: "#FFFFFF", fontStyle: "italic" }}>real connections</span>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "2px", background: "rgba(255,255,255,0.05)" }} className="ia-steps-grid">
            {STEPS.map((s) => (
              <div key={s.n} style={{ background: "#080808", padding: "clamp(28px, 3vw, 44px) clamp(20px, 2.5vw, 36px)", transition: "background 0.3s" }}
                onMouseEnter={e => e.currentTarget.style.background = "#0d0d0d"}
                onMouseLeave={e => e.currentTarget.style.background = "#080808"}
              >
                <div style={{ fontSize: "10px", letterSpacing: "0.28em", color: "#FFFFFF", marginBottom: "20px", opacity: 0.65 }}>{s.n}</div>
                <div style={{ fontSize: "28px", marginBottom: "16px" }}>{s.icon}</div>
                <div style={{ fontFamily: "'Outfit', serif", fontSize: "clamp(18px, 2vw, 22px)", fontWeight: "300", color: "#fff", marginBottom: "12px" }}>{s.title}</div>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", lineHeight: "1.85" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ACTIVITY TYPES */}
      <section style={{ position: "relative", zIndex: 10, maxWidth: "1200px", margin: "0 auto", padding: "clamp(60px, 8vh, 100px) clamp(24px, 5vw, 80px)" }}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <div style={{ fontSize: "10px", letterSpacing: "0.3em", color: "#FFFFFF", textTransform: "uppercase", marginBottom: "16px", opacity: 0.8 }}>What we do</div>
          <h2 style={{ fontFamily: "'Outfit', serif", fontSize: "clamp(32px, 4vw, 56px)", fontWeight: "300" }}>
            Six kinds of <span style={{ color: "#FFFFFF", fontStyle: "italic" }}>low-pressure magic</span>
          </h2>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.3)", marginTop: "16px", lineHeight: 1.8, maxWidth: "480px", margin: "16px auto 0" }}>
            All activities are chosen to be comfortable for introverts — structured enough to kill awkwardness, open enough for real conversation.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2px", background: "rgba(255,255,255,0.05)" }} className="ia-activities-grid">
          {ACTIVITY_TYPES.map((act) => (
            <div key={act.id}
              onMouseEnter={() => setHoveredActivity(act.id)}
              onMouseLeave={() => setHoveredActivity(null)}
              onClick={onBrowse}
              style={{
                background: hoveredActivity === act.id ? act.bg : "#080808",
                padding: "clamp(28px, 3vw, 44px)", cursor: "pointer",
                transition: "all 0.35s ease", position: "relative", overflow: "hidden",
                border: hoveredActivity === act.id ? `1px solid ${act.color}30` : "1px solid transparent",
              }}
            >
              <div style={{ fontSize: "40px", marginBottom: "20px" }}>{act.emoji}</div>
              <div style={{ fontSize: "clamp(16px, 2vw, 19px)", fontWeight: "500", color: hoveredActivity === act.id ? act.color : "#fff", marginBottom: "10px", transition: "color 0.3s" }}>{act.name}</div>
              <div style={{ display: "inline-block", fontSize: "10px", letterSpacing: "0.14em", color: act.color, textTransform: "uppercase", marginBottom: "14px", padding: "3px 10px", border: `1px solid ${act.color}40`, borderRadius: "20px", background: `${act.color}10` }}>
                {act.energy === "low" ? "🌙 Chill" : "⚡ Moderate"} energy
              </div>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.38)", lineHeight: "1.85" }}>{act.desc}</p>
              <div style={{ marginTop: "20px", fontSize: "11px", letterSpacing: "0.12em", color: hoveredActivity === act.id ? act.color : "rgba(255,255,255,0.25)", textTransform: "uppercase", transition: "color 0.3s" }}>
                See events →
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY THIS WORKS */}
      <section style={{ position: "relative", zIndex: 10, background: "rgba(255,255,255,0.04)", borderTop: "1px solid rgba(255,255,255,0.1)", borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "clamp(60px, 8vh, 100px) clamp(24px, 5vw, 80px)" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }} className="ia-why-grid">
          <div>
            <div style={{ fontSize: "10px", letterSpacing: "0.3em", color: "#FFFFFF", textTransform: "uppercase", marginBottom: "20px", opacity: 0.8 }}>Designed for introverts</div>
            <h2 style={{ fontFamily: "'Outfit', serif", fontSize: "clamp(32px, 4vw, 52px)", fontWeight: "300", lineHeight: "1.1", marginBottom: "20px" }}>
              Not a networking event.<br /><span style={{ color: "#FFFFFF", fontStyle: "italic" }}>Not a dating app.</span>
            </h2>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.38)", lineHeight: "1.9", marginBottom: "32px" }}>
              We designed every part of this for people who find "small talk" draining. The activities give you something to do. The AI picks people with genuinely overlapping interests. The group caps at 4 — so it never feels like a crowd.
            </p>
            <button onClick={onCreateProfile} style={{ padding: "14px 36px", background: "#FFFFFF", border: "none", color: "#080808", fontSize: "12px", letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "'Inter', sans-serif", fontWeight: "700", cursor: "pointer", transition: "all 0.25s" }}
              onMouseEnter={e => { e.target.style.background = "#22d68a"; e.target.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.target.style.background = "#FFFFFF"; e.target.style.transform = "translateY(0)"; }}
            >Build my profile →</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              ["🔒", "Max 4 people", "Every event is capped at 4 people. Intimate by design."],
              ["🎯", "Matched by vibe", "AI pairs you based on energy, interests, and conversational style."],
              ["🎁", "Mystery venue", "Location revealed 30 minutes before. The mystery is part of the fun."],
              ["🛡️", "Safety first", "All profiles verified. One-tap reporting. Real humans review events."],
            ].map(([icon, title, desc]) => (
              <div key={title} style={{ display: "flex", gap: "16px", padding: "20px", border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.03)", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
              >
                <span style={{ fontSize: "22px", flexShrink: 0, lineHeight: 1.3 }}>{icon}</span>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: "600", color: "rgba(255,255,255,0.85)", marginBottom: "4px" }}>{title}</div>
                  <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", lineHeight: "1.7" }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ position: "relative", zIndex: 10, maxWidth: "700px", margin: "0 auto", padding: "clamp(80px, 10vh, 120px) clamp(24px, 5vw, 40px)", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Outfit', serif", fontSize: "clamp(36px, 4.5vw, 64px)", fontWeight: "300", lineHeight: "1.1", marginBottom: "20px" }}>
          You don't have to<br />explore alone.
        </h2>
        <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.35)", lineHeight: 1.85, marginBottom: "48px" }}>
          Hundreds of people like you are in Bangalore right now, looking for the same thing. The only difference is they signed up.
        </p>
        <button onClick={onCreateProfile} style={{ padding: "18px 60px", background: "#FFFFFF", border: "none", color: "#080808", fontSize: "13px", letterSpacing: "0.16em", textTransform: "uppercase", fontFamily: "'Inter', sans-serif", fontWeight: "700", cursor: "pointer", transition: "all 0.3s" }}
          onMouseEnter={e => { e.target.style.background = "#22d68a"; e.target.style.transform = "translateY(-3px)"; e.target.style.boxShadow = "0 12px 32px rgba(255,255,255,0.3)"; }}
          onMouseLeave={e => { e.target.style.background = "#FFFFFF"; e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "none"; }}
        >Find my people — it's free →</button>
        <div style={{ marginTop: "20px", fontSize: "12px", color: "rgba(255,255,255,0.2)" }}>Free to join · Bangalore only · ₹99 deposit for events</div>
      </section>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        @keyframes orb1 { 0%,100%{transform:translate(0,0) scale(1)} 40%{transform:translate(40px,-60px) scale(1.08)} 70%{transform:translate(-30px,30px) scale(0.95)} }
        @keyframes orb2 { 0%,100%{transform:translate(0,0) scale(1)} 35%{transform:translate(-50px,40px) scale(1.1)} 65%{transform:translate(25px,-25px) scale(0.92)} }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.7)} }
        * { box-sizing: border-box; }
        @media (max-width: 900px) {
          .ia-steps-grid { grid-template-columns: 1fr 1fr !important; }
          .ia-activities-grid { grid-template-columns: 1fr 1fr !important; }
          .ia-why-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
        @media (max-width: 600px) {
          .ia-steps-grid { grid-template-columns: 1fr !important; }
          .ia-activities-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
