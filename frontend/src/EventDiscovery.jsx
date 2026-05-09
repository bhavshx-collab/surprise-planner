import { useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const MOCK_EVENTS = [
  {
    id: "evt-1", emoji: "☕", activity_type: "coffee_trail",
    title: "Quiet Coffee Trail", area: "Koramangala",
    datetime: "Sun, May 18 · 4:00 PM", slots_total: 3, slots_taken: 2,
    energy: "low", color: "#D4AF37", bg: "rgba(212,175,55,0.06)", price: 49,
    teaser: "Three indie cafés, one lazy Sunday afternoon. The kind of conversation you actually remember.",
    tags: ["Coffee", "Indie music", "Walking"],
    host_name: "Priya M.",
  },
  {
    id: "evt-2", emoji: "🎲", activity_type: "board_games",
    title: "Board Game Night", area: "Indiranagar",
    datetime: "Sat, May 17 · 7:00 PM", slots_total: 4, slots_taken: 1,
    energy: "low", color: "#7B6EE8", bg: "rgba(123,110,232,0.06)", price: 49,
    teaser: "Curated board games, craft coffee, and no awkward small talk. We handle the rest.",
    tags: ["Board games", "Gaming", "Philosophy"],
    host_name: "Arjun K.",
  },
  {
    id: "evt-3", emoji: "🎨", activity_type: "art_workshop",
    title: "Pottery Workshop", area: "HSR Layout",
    datetime: "Sat, May 17 · 11:00 AM", slots_total: 4, slots_taken: 3,
    energy: "low", color: "#E85D75", bg: "rgba(232,93,117,0.06)", price: 49,
    teaser: "Hands in clay, music in the background, strangers becoming friends over something they made.",
    tags: ["Art", "Design", "Creativity"],
    host_name: "Sneha R.",
  },
  {
    id: "evt-4", emoji: "🌿", activity_type: "nature_walk",
    title: "Cubbon Park Sunrise Walk", area: "MG Road",
    datetime: "Sun, May 18 · 6:30 AM", slots_total: 4, slots_taken: 2,
    energy: "medium", color: "#1DB375", bg: "rgba(29,179,117,0.06)", price: 49,
    teaser: "Golden light through the trees. The city wakes up slowly. You'll be glad you came.",
    tags: ["Nature", "Photography", "Yoga"],
    host_name: "Dev S.",
  },
  {
    id: "evt-5", emoji: "📚", activity_type: "book_swap",
    title: "Book Swap Café", area: "Koramangala",
    datetime: "Sun, May 18 · 3:00 PM", slots_total: 3, slots_taken: 1,
    energy: "low", color: "#D4AF37", bg: "rgba(212,175,55,0.06)", price: 49,
    teaser: "Bring a book you'd lend to a friend. Leave with one you've never heard of. Talk about both.",
    tags: ["Reading", "Writing", "Podcasts"],
    host_name: "Ananya T.",
  },
  {
    id: "evt-6", emoji: "🍳", activity_type: "cook_together",
    title: "Cook Together", area: "Whitefield",
    datetime: "Sun, May 18 · 12:00 PM", slots_total: 4, slots_taken: 2,
    energy: "medium", color: "#E85D75", bg: "rgba(232,93,117,0.06)", price: 49,
    teaser: "A community kitchen, a shared recipe, and four people who've never met. The meal is the excuse.",
    tags: ["Cooking", "Food", "Sustainability"],
    host_name: "Rahul P.",
  },
];

const ACTIVITY_FILTERS = [
  { id: "all", label: "All" },
  { id: "coffee_trail", label: "☕ Coffee" },
  { id: "board_games", label: "🎲 Board Games" },
  { id: "art_workshop", label: "🎨 Art" },
  { id: "nature_walk", label: "🌿 Nature" },
  { id: "book_swap", label: "📚 Books" },
  { id: "cook_together", label: "🍳 Cooking" },
  { id: "custom", label: "✨ Custom" },
];

const ENERGY_FILTERS = [
  { id: "all", label: "Any energy" },
  { id: "low", label: "🌙 Chill" },
  { id: "medium", label: "⚡ Moderate" },
  { id: "high", label: "🔥 Active" },
];

export default function EventDiscovery({ onEventSelect, onBack, onCreateProfile, onHostAdventure, user }) {
  const [activityFilter, setActivityFilter] = useState("all");
  const [energyFilter, setEnergyFilter] = useState("all");
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [events, setEvents] = useState(MOCK_EVENTS);

  useEffect(() => {
    fetch(`${API}/api/social/events?city=Bangalore`)
      .then(r => r.json())
      .then(data => {
        if (data.events && data.events.length > 0) {
          const mapped = data.events.map(e => ({
            id: e.id,
            emoji: e.emoji || e.ai_plan?.activity_info?.emoji || "✨",
            activity_type: e.activity_type,
            title: e.title,
            area: e.area || e.city || "Bangalore",
            datetime: new Date(e.date_time).toLocaleString("en-IN", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }),
            slots_total: e.max_members || 4,
            slots_taken: 0,
            energy: e.energy || e.ai_plan?.activity_info?.energy || "medium",
            color: "#1DB375",
            bg: "rgba(29,179,117,0.06)",
            price: e.deposit_amount || 49,
            teaser: e.description || e.ai_plan?.teaser || "A mystery event awaits.",
            tags: Array.isArray(e.tags) ? e.tags : [e.activity_type?.replace("_", " ")],
            host_name: e.host_name || "Anonymous",
            isReal: true,
          }));
          setEvents([...mapped, ...MOCK_EVENTS]);
        }
      })
      .catch(e => console.error(e));
  }, []);

  const filtered = events.filter(e => {
    if (activityFilter !== "all" && e.activity_type !== activityFilter) return false;
    if (energyFilter !== "all" && e.energy !== energyFilter) return false;
    return true;
  });

  return (
    <div style={{ minHeight: "100vh", background: "#080808", fontFamily: "'DM Sans', sans-serif", color: "#fff" }}>

      {/* BG */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", width: "700px", height: "700px", borderRadius: "50%", top: "-300px", right: "-200px", background: "radial-gradient(circle, rgba(29,179,117,0.07) 0%, transparent 65%)", animation: "orb1 14s ease-in-out infinite" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: "1200px", margin: "0 auto", padding: "clamp(36px, 5vh, 60px) clamp(24px, 5vw, 60px) clamp(60px, 8vh, 100px)" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "32px", flexWrap: "wrap", gap: "20px" }}>
          <div>
            <button onClick={onBack} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", fontSize: "13px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", padding: 0, marginBottom: "20px", display: "flex", alignItems: "center", gap: "6px" }}
              onMouseEnter={e => e.target.style.color = "rgba(255,255,255,0.7)"}
              onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.3)"}
            >← Back</button>
            <div style={{ fontSize: "10px", letterSpacing: "0.28em", color: "#1DB375", textTransform: "uppercase", marginBottom: "10px", opacity: 0.8 }}>
              Bangalore · Upcoming adventures
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px, 4vw, 52px)", fontWeight: "300", lineHeight: "1.1" }}>
              Find your <span style={{ color: "#1DB375", fontStyle: "italic" }}>next adventure</span>
            </h1>
          </div>
          <div style={{ display: "flex", gap: "12px", alignSelf: "flex-end", flexWrap: "wrap" }}>
            {user ? (
              <button onClick={onHostAdventure} style={{
                padding: "12px 24px", background: "#1DB375", border: "none",
                color: "#080808", fontSize: "12px", letterSpacing: "0.12em",
                textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif",
                fontWeight: "700", cursor: "pointer", transition: "all 0.25s",
              }}
                onMouseEnter={e => { e.target.style.background = "#22d68a"; e.target.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.target.style.background = "#1DB375"; e.target.style.transform = "translateY(0)"; }}
              >
                + Host an Adventure
              </button>
            ) : (
              <button onClick={onCreateProfile} style={{ padding: "12px 24px", background: "#1DB375", border: "none", color: "#080808", fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", fontWeight: "700", cursor: "pointer", transition: "all 0.25s" }}
                onMouseEnter={e => { e.target.style.background = "#22d68a"; e.target.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.target.style.background = "#1DB375"; e.target.style.transform = "translateY(0)"; }}
              >Join the community →</button>
            )}
          </div>
        </div>

        {/* ── HOST BANNER ── */}
        <div style={{
          marginBottom: "36px", padding: "20px 24px",
          background: "linear-gradient(135deg, rgba(29,179,117,0.08) 0%, rgba(123,110,232,0.06) 100%)",
          border: "1px solid rgba(29,179,117,0.2)", borderRadius: "4px",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px", flexWrap: "wrap",
        }}>
          <div>
            <div style={{ fontSize: "14px", fontWeight: "600", marginBottom: "4px" }}>
              🌿 Have an adventure idea?
            </div>
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: "1.6" }}>
              Host it for ₹49 deposit (refunded after completion). You set the activity, group size, date, and rules.
            </div>
          </div>
          <button onClick={user ? onHostAdventure : onCreateProfile} style={{
            padding: "10px 22px", background: "none", border: "1px solid rgba(29,179,117,0.5)",
            color: "#1DB375", fontSize: "12px", fontWeight: "700", letterSpacing: "0.1em",
            textTransform: "uppercase", cursor: "pointer", fontFamily: "DM Sans",
            transition: "all 0.2s", whiteSpace: "nowrap",
          }}
            onMouseEnter={e => { e.target.style.background = "rgba(29,179,117,0.1)"; }}
            onMouseLeave={e => { e.target.style.background = "none"; }}
          >
            {user ? "Create Now →" : "Sign in to host →"}
          </button>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: "16px", marginBottom: "36px", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {ACTIVITY_FILTERS.map(f => (
              <button key={f.id} onClick={() => setActivityFilter(f.id)} style={{
                padding: "7px 16px",
                border: `1px solid ${activityFilter === f.id ? "rgba(29,179,117,0.5)" : "rgba(255,255,255,0.1)"}`,
                background: activityFilter === f.id ? "rgba(29,179,117,0.08)" : "transparent",
                color: activityFilter === f.id ? "#1DB375" : "rgba(255,255,255,0.4)",
                fontSize: "12px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                transition: "all 0.2s", borderRadius: "40px",
              }}>{f.label}</button>
            ))}
          </div>
          <div style={{ width: "1px", height: "20px", background: "rgba(255,255,255,0.08)" }} />
          <div style={{ display: "flex", gap: "6px" }}>
            {ENERGY_FILTERS.map(f => (
              <button key={f.id} onClick={() => setEnergyFilter(f.id)} style={{
                padding: "7px 16px",
                border: `1px solid ${energyFilter === f.id ? "rgba(29,179,117,0.4)" : "rgba(255,255,255,0.08)"}`,
                background: energyFilter === f.id ? "rgba(29,179,117,0.06)" : "transparent",
                color: energyFilter === f.id ? "#1DB375" : "rgba(255,255,255,0.35)",
                fontSize: "12px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                transition: "all 0.2s", borderRadius: "40px",
              }}>{f.label}</button>
            ))}
          </div>
        </div>

        {/* Event Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "rgba(255,255,255,0.2)" }}>
            <div style={{ fontSize: "36px", marginBottom: "16px" }}>🔍</div>
            <div style={{ fontSize: "16px" }}>No adventures match these filters</div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2px", background: "rgba(255,255,255,0.05)" }} className="events-grid">
            {filtered.map(event => {
              const spotsLeft = event.slots_total - event.slots_taken;
              const isFull = spotsLeft <= 0;
              const isHot = spotsLeft === 1;
              return (
                <div key={event.id}
                  onMouseEnter={() => setHoveredEvent(event.id)}
                  onMouseLeave={() => setHoveredEvent(null)}
                  onClick={() => !isFull && onEventSelect(event)}
                  style={{
                    background: hoveredEvent === event.id ? event.bg : "#080808",
                    padding: "clamp(24px, 3vw, 36px)",
                    cursor: isFull ? "not-allowed" : "pointer",
                    transition: "all 0.3s", position: "relative",
                    opacity: isFull ? 0.5 : 1,
                    border: hoveredEvent === event.id ? `1px solid ${event.color}30` : "1px solid transparent",
                  }}
                >
                  {isHot && <div style={{ position: "absolute", top: "16px", right: "16px", background: "#E85D75", color: "#fff", fontSize: "10px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", padding: "3px 10px", borderRadius: "20px" }}>1 spot left!</div>}
                  {isFull && <div style={{ position: "absolute", top: "16px", right: "16px", background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.3)", fontSize: "10px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", padding: "3px 10px", borderRadius: "20px" }}>Full</div>}

                  <div style={{ fontSize: "32px", marginBottom: "16px" }}>{event.emoji}</div>
                  <div style={{ fontSize: "11px", letterSpacing: "0.18em", color: event.color, textTransform: "uppercase", marginBottom: "10px", opacity: 0.8 }}>{event.title}</div>
                  <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.65)", marginBottom: "6px", fontWeight: "500" }}>{event.datetime}</div>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)", marginBottom: "4px" }}>📍 {event.area}, Bangalore</div>
                  {event.host_name && (
                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)", marginBottom: "14px" }}>Hosted by {event.host_name}</div>
                  )}
                  <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.38)", lineHeight: "1.75", marginBottom: "20px" }}>{event.teaser}</p>

                  {/* Tags */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "20px" }}>
                    {(Array.isArray(event.tags) ? event.tags : []).map(tag => (
                      <span key={tag} style={{ fontSize: "10px", padding: "3px 10px", border: `1px solid ${event.color}30`, color: event.color, borderRadius: "20px", background: `${event.color}08` }}>{tag}</span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)", marginBottom: "4px" }}>
                        {event.energy === "low" ? "🌙 Chill" : event.energy === "high" ? "🔥 Active" : "⚡ Moderate"} energy
                      </div>
                      <div style={{ display: "flex", gap: "4px" }}>
                        {Array(event.slots_total).fill(0).map((_, i) => (
                          <div key={i} style={{ width: "20px", height: "20px", borderRadius: "50%", background: i < event.slots_taken ? event.color : "rgba(255,255,255,0.08)", border: `1px solid ${i < event.slots_taken ? event.color : "rgba(255,255,255,0.1)"}`, transition: "all 0.2s" }} />
                        ))}
                        <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", marginLeft: "4px", lineHeight: "20px" }}>{spotsLeft} left</span>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "18px", fontWeight: "600", color: event.color }}>₹{event.price}</div>
                      <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)" }}>refundable deposit</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom note */}
        <div style={{ textAlign: "center", marginTop: "48px", padding: "24px", border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.015)" }}>
          <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)", lineHeight: "1.75" }}>
            🔒 Venue revealed 30 min before · ₹49 deposit refunded when you show up · Max group size set by host
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        @keyframes orb1 { 0%,100%{transform:translate(0,0) scale(1)} 40%{transform:translate(40px,-60px) scale(1.08)} 70%{transform:translate(-30px,30px) scale(0.95)} }
        * { box-sizing: border-box; }
        @media (max-width: 900px) { .events-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 600px) { .events-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
