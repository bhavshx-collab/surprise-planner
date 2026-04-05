import { useState } from "react";

const MOCK_EVENTS = [
  {
    id: "evt-1",
    emoji: "☕",
    activity_type: "coffee_trail",
    title: "Quiet Coffee Trail",
    area: "Koramangala",
    datetime: "Sun, Apr 13 · 4:00 PM",
    slots_total: 3,
    slots_taken: 2,
    energy: "low",
    color: "#D4AF37",
    bg: "rgba(212,175,55,0.06)",
    price: 99,
    teaser: "Three indie cafés, one lazy Sunday afternoon. The kind of conversation you actually remember.",
    tags: ["Coffee", "Indie music", "Walking"],
  },
  {
    id: "evt-2",
    emoji: "🎲",
    activity_type: "board_games",
    title: "Board Game Night",
    area: "Indiranagar",
    datetime: "Sat, Apr 12 · 7:00 PM",
    slots_total: 4,
    slots_taken: 1,
    energy: "low",
    color: "#7B6EE8",
    bg: "rgba(123,110,232,0.06)",
    price: 99,
    teaser: "Curated board games, craft coffee, and no awkward small talk. We handle the rest.",
    tags: ["Board games", "Gaming", "Philosophy"],
  },
  {
    id: "evt-3",
    emoji: "🎨",
    activity_type: "art_workshop",
    title: "Pottery Workshop",
    area: "HSR Layout",
    datetime: "Sat, Apr 12 · 11:00 AM",
    slots_total: 4,
    slots_taken: 3,
    energy: "low",
    color: "#E85D75",
    bg: "rgba(232,93,117,0.06)",
    price: 149,
    teaser: "Hands in clay, music in the background, strangers becoming friends over something they made.",
    tags: ["Art", "Design", "Creativity"],
  },
  {
    id: "evt-4",
    emoji: "🌿",
    activity_type: "nature_walk",
    title: "Cubbon Park Sunrise Walk",
    area: "MG Road",
    datetime: "Sun, Apr 13 · 6:30 AM",
    slots_total: 4,
    slots_taken: 2,
    energy: "medium",
    color: "#1DB375",
    bg: "rgba(29,179,117,0.06)",
    price: 99,
    teaser: "Golden light through the trees. The city wakes up slowly. You'll be glad you came.",
    tags: ["Nature", "Photography", "Yoga"],
  },
  {
    id: "evt-5",
    emoji: "📚",
    activity_type: "book_swap",
    title: "Book Swap Café",
    area: "Koramangala",
    datetime: "Sun, Apr 13 · 3:00 PM",
    slots_total: 3,
    slots_taken: 1,
    energy: "low",
    color: "#D4AF37",
    bg: "rgba(212,175,55,0.06)",
    price: 99,
    teaser: "Bring a book you'd lend to a friend. Leave with one you've never heard of. Talk about both.",
    tags: ["Reading", "Writing", "Podcasts"],
  },
  {
    id: "evt-6",
    emoji: "🍳",
    activity_type: "cook_together",
    title: "Cook Together",
    area: "Whitefield",
    datetime: "Sun, Apr 13 · 12:00 PM",
    slots_total: 4,
    slots_taken: 2,
    energy: "medium",
    color: "#E85D75",
    bg: "rgba(232,93,117,0.06)",
    price: 149,
    teaser: "A community kitchen, a shared recipe, and four people who've never met. The meal is the excuse.",
    tags: ["Cooking", "Food", "Sustainability"],
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
];

const ENERGY_FILTERS = [
  { id: "all", label: "Any energy" },
  { id: "low", label: "🌙 Chill" },
  { id: "medium", label: "⚡ Moderate" },
];

export default function EventDiscovery({ onEventSelect, onBack, onCreateProfile, user }) {
  const [activityFilter, setActivityFilter] = useState("all");
  const [energyFilter, setEnergyFilter] = useState("all");
  const [hoveredEvent, setHoveredEvent] = useState(null);

  const filtered = MOCK_EVENTS.filter(e => {
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
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "48px", flexWrap: "wrap", gap: "20px" }}>
          <div>
            <button onClick={onBack} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", fontSize: "13px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", padding: 0, marginBottom: "20px", display: "flex", alignItems: "center", gap: "6px", transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color = "rgba(255,255,255,0.7)"}
              onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.3)"}
            >← Back</button>
            <div style={{ fontSize: "10px", letterSpacing: "0.28em", color: "#1DB375", textTransform: "uppercase", marginBottom: "10px", opacity: 0.8 }}>Bangalore · Upcoming events</div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px, 4vw, 52px)", fontWeight: "300", lineHeight: "1.1" }}>
              Find your <span style={{ color: "#1DB375", fontStyle: "italic" }}>mystery event</span>
            </h1>
          </div>
          {!user ? (
            <button onClick={onCreateProfile} style={{ padding: "12px 28px", background: "#1DB375", border: "none", color: "#080808", fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", fontWeight: "700", cursor: "pointer", transition: "all 0.25s", alignSelf: "flex-end" }}
              onMouseEnter={e => { e.target.style.background = "#22d68a"; e.target.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.target.style.background = "#1DB375"; e.target.style.transform = "translateY(0)"; }}
            >Build profile to join →</button>
          ) : (
            <div style={{ padding: "10px 18px", border: "1px solid rgba(29,179,117,0.25)", background: "rgba(29,179,117,0.06)", fontSize: "13px", color: "#1DB375", alignSelf: "flex-end" }}>
              🌿 Profile ready
            </div>
          )}
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: "16px", marginBottom: "36px", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {ACTIVITY_FILTERS.map(f => (
              <button key={f.id} onClick={() => setActivityFilter(f.id)} style={{ padding: "7px 16px", border: `1px solid ${activityFilter === f.id ? "rgba(29,179,117,0.5)" : "rgba(255,255,255,0.1)"}`, background: activityFilter === f.id ? "rgba(29,179,117,0.08)" : "transparent", color: activityFilter === f.id ? "#1DB375" : "rgba(255,255,255,0.4)", fontSize: "12px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s", borderRadius: "40px" }}>{f.label}</button>
            ))}
          </div>
          <div style={{ width: "1px", height: "20px", background: "rgba(255,255,255,0.08)" }} />
          <div style={{ display: "flex", gap: "6px" }}>
            {ENERGY_FILTERS.map(f => (
              <button key={f.id} onClick={() => setEnergyFilter(f.id)} style={{ padding: "7px 16px", border: `1px solid ${energyFilter === f.id ? "rgba(29,179,117,0.4)" : "rgba(255,255,255,0.08)"}`, background: energyFilter === f.id ? "rgba(29,179,117,0.06)" : "transparent", color: energyFilter === f.id ? "#1DB375" : "rgba(255,255,255,0.35)", fontSize: "12px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s", borderRadius: "40px" }}>{f.label}</button>
            ))}
          </div>
        </div>

        {/* Event Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "rgba(255,255,255,0.2)" }}>
            <div style={{ fontSize: "36px", marginBottom: "16px" }}>🔍</div>
            <div style={{ fontSize: "16px" }}>No events match these filters</div>
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
                  <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.65)", marginBottom: "8px", fontWeight: "500" }}>{event.datetime}</div>
                  <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)", marginBottom: "16px" }}>📍 {event.area}, Bangalore</div>
                  <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.38)", lineHeight: "1.75", marginBottom: "20px" }}>{event.teaser}</p>

                  {/* Tags */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "20px" }}>
                    {event.tags.map(tag => (
                      <span key={tag} style={{ fontSize: "10px", padding: "3px 10px", border: `1px solid ${event.color}30`, color: event.color, borderRadius: "20px", background: `${event.color}08` }}>{tag}</span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)", marginBottom: "4px" }}>
                        {event.energy === "low" ? "🌙 Chill" : "⚡ Moderate"} energy
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
                      <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)" }}>curation fee</div>
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
            🔒 Venue revealed 30 min before the event · Max 4 people · ₹99 deposit refunded if you show up
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
