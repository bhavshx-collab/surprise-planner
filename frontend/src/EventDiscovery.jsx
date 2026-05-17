import { useState, useEffect } from "react";
import { supabase } from "./supabase";

const ACTIVITY_FILTERS = [
  { id: "all", label: "All" },
  { id: "coffee_trail", label: "☕ Coffee" },
  { id: "board_games", label: "🎲 Board Games" },
  { id: "art_workshop", label: "🎨 Art" },
  { id: "nature_walk", label: "🌿 Nature" },
  { id: "book_swap", label: "📚 Books" },
  { id: "cook_together", label: "🍳 Cooking" },
  { id: "custom", label: "✨ Other" },
];

const ENERGY_FILTERS = [
  { id: "all", label: "Any energy" },
  { id: "low", label: "🌙 Chill" },
  { id: "medium", label: "⚡ Moderate" },
  { id: "high", label: "🔥 Active" },
];

const ACCENT_COLORS = ["#D4AF37", "#FFFFFF", "#22d68a", "#a78bfa", "#60a5fa", "#f472b6"];

function getColor(activityType) {
  const map = {
    coffee_trail: "#D4AF37",
    board_games: "#a78bfa",
    art_workshop: "#f472b6",
    nature_walk: "#22d68a",
    book_swap: "#60a5fa",
    cook_together: "#fb923c",
    custom: "#FFFFFF",
  };
  return map[activityType] || "#D4AF37";
}

export default function EventDiscovery({ onEventSelect, onBack, onCreateProfile, onHostAdventure, onMyAdventures, user }) {
  const [activityFilter, setActivityFilter] = useState("all");
  const [energyFilter, setEnergyFilter] = useState("all");
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myJoinedIds, setMyJoinedIds] = useState(new Set());

  // Fetch events from Supabase directly for real-time accuracy
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("mystery_events")
          .select("*, event_members(count)")
          .in("status", ["open", "full"])
          .gte("date_time", new Date().toISOString())
          .order("date_time", { ascending: true });

        if (error) { console.error(error); setLoading(false); return; }

        const mapped = (data || []).map(e => ({
          id: e.id,
          emoji: e.emoji || "✨",
          activity_type: e.activity_type,
          title: e.title,
          area: e.area || e.city || "Bangalore",
          date_time: e.date_time,
          datetime: new Date(e.date_time).toLocaleString("en-IN", {
            weekday: "short", month: "short", day: "numeric",
            hour: "numeric", minute: "2-digit",
          }),
          slots_total: e.max_members || 4,
          slots_taken: e.event_members?.[0]?.count || 0,
          energy: e.energy || "medium",
          color: getColor(e.activity_type),
          bg: `${getColor(e.activity_type)}10`,
          price: 0,
          teaser: e.description || "A curated adventure awaits.",
          tags: Array.isArray(e.tags) ? e.tags : [e.activity_type?.replace("_", " ")].filter(Boolean),
          host_name: e.host_name || "Anonymous",
          host_user_id: e.host_user_id,
          status: e.status,
          isReal: true,
        }));

        setEvents(mapped);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    fetchEvents();

    // Also check which events the current user has joined
    const fetchMyJoined = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("event_members")
        .select("event_id")
        .eq("user_id", user.id);
      if (data) setMyJoinedIds(new Set(data.map(m => m.event_id)));
    };
    fetchMyJoined();
  }, [user]);

  const filtered = events.filter(e => {
    if (activityFilter !== "all" && e.activity_type !== activityFilter) return false;
    if (energyFilter !== "all" && e.energy !== energyFilter) return false;
    return true;
  });

  return (
    <div style={{ minHeight: "100vh", background: "#050505", fontFamily: "'Inter', sans-serif", color: "#fff" }}>
      {/* BG Image and Overlay */}
      <div style={{ position: "fixed", inset: 0, backgroundImage: "url('/planner-bg.png')", backgroundSize: "cover", backgroundPosition: "center", zIndex: 0 }} />
      <div style={{ position: "fixed", inset: 0, background: "linear-gradient(to bottom, rgba(5,5,5,0.4) 0%, rgba(5,5,5,0.85) 55%, #050505 100%)", zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: "1200px", margin: "0 auto", padding: "clamp(36px, 5vh, 60px) clamp(24px, 5vw, 60px) clamp(60px, 8vh, 100px)" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "32px", flexWrap: "wrap", gap: "20px" }}>
          <div>
            <button onClick={onBack} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", fontSize: "13px", cursor: "pointer", fontFamily: "'Inter', sans-serif", padding: 0, marginBottom: "20px", display: "flex", alignItems: "center", gap: "6px" }}
              onMouseEnter={e => e.target.style.color = "rgba(255,255,255,0.7)"}
              onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.3)"}
            >← Back</button>
            <div style={{ fontSize: "10px", letterSpacing: "0.28em", color: "#D4AF37", textTransform: "uppercase", marginBottom: "10px", opacity: 0.9 }}>
              Bangalore · Free community adventures
            </div>
            <h1 style={{ fontFamily: "'Outfit', serif", fontSize: "clamp(32px, 4vw, 52px)", fontWeight: "300", lineHeight: "1.1", textShadow: "0 4px 24px rgba(0,0,0,0.6)" }}>
              Find your <span style={{ color: "#D4AF37", fontStyle: "italic" }}>next adventure</span>
            </h1>
          </div>
          <div style={{ display: "flex", gap: "12px", alignSelf: "flex-end", flexWrap: "wrap" }}>
            {/* My Adventures button — only for logged in users */}
            {user && (
              <button onClick={onMyAdventures} style={{
                padding: "12px 20px", background: "transparent", border: "1px solid rgba(212,175,55,0.5)",
                color: "#D4AF37", fontSize: "12px", letterSpacing: "0.1em",
                textTransform: "uppercase", fontFamily: "'Inter', sans-serif",
                fontWeight: "600", cursor: "pointer", transition: "all 0.25s",
              }}
                onMouseEnter={e => { e.target.style.background = "rgba(212,175,55,0.1)"; }}
                onMouseLeave={e => { e.target.style.background = "transparent"; }}
              >📋 My Adventures</button>
            )}
            <button onClick={user ? onHostAdventure : onCreateProfile} style={{
              padding: "12px 24px", background: "#FFFFFF", border: "none",
              color: "#080808", fontSize: "12px", letterSpacing: "0.12em",
              textTransform: "uppercase", fontFamily: "'Inter', sans-serif",
              fontWeight: "700", cursor: "pointer", transition: "all 0.25s",
            }}
              onMouseEnter={e => { e.target.style.background = "#D4AF37"; e.target.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.target.style.background = "#FFFFFF"; e.target.style.transform = "translateY(0)"; }}
            >+ Host Free</button>
          </div>
        </div>

        {/* ── HOST BANNER ── */}
        <div style={{
          marginBottom: "36px", padding: "20px 28px",
          background: "linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(212,175,55,0.04) 100%)",
          border: "1px solid rgba(212,175,55,0.2)", borderRadius: "4px",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px", flexWrap: "wrap",
        }}>
          <div>
            <div style={{ fontSize: "14px", fontWeight: "600", marginBottom: "4px" }}>
              🌿 Have an adventure idea?
            </div>
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: "1.6" }}>
              Host it for free — you set the activity, group size, and time. No payment needed.
            </div>
          </div>
          <button onClick={user ? onHostAdventure : onCreateProfile} style={{
            padding: "10px 22px", background: "none", border: "1px solid rgba(212,175,55,0.5)",
            color: "#D4AF37", fontSize: "12px", fontWeight: "700", letterSpacing: "0.1em",
            textTransform: "uppercase", cursor: "pointer", fontFamily: "'Inter', sans-serif",
            transition: "all 0.2s", whiteSpace: "nowrap",
          }}
            onMouseEnter={e => { e.target.style.background = "rgba(212,175,55,0.1)"; }}
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
                border: `1px solid ${activityFilter === f.id ? "rgba(212,175,55,0.6)" : "rgba(255,255,255,0.1)"}`,
                background: activityFilter === f.id ? "rgba(212,175,55,0.1)" : "transparent",
                color: activityFilter === f.id ? "#D4AF37" : "rgba(255,255,255,0.4)",
                fontSize: "12px", cursor: "pointer", fontFamily: "'Inter', sans-serif",
                transition: "all 0.2s", borderRadius: "40px",
              }}>{f.label}</button>
            ))}
          </div>
          <div style={{ width: "1px", height: "20px", background: "rgba(255,255,255,0.08)" }} />
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {ENERGY_FILTERS.map(f => (
              <button key={f.id} onClick={() => setEnergyFilter(f.id)} style={{
                padding: "7px 16px",
                border: `1px solid ${energyFilter === f.id ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.08)"}`,
                background: energyFilter === f.id ? "rgba(255,255,255,0.06)" : "transparent",
                color: energyFilter === f.id ? "#FFFFFF" : "rgba(255,255,255,0.35)",
                fontSize: "12px", cursor: "pointer", fontFamily: "'Inter', sans-serif",
                transition: "all 0.2s", borderRadius: "40px",
              }}>{f.label}</button>
            ))}
          </div>
        </div>

        {/* Event Grid / States */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ fontSize: "32px", marginBottom: "16px", animation: "spin 1.5s linear infinite", display: "inline-block" }}>✦</div>
            <div style={{ fontSize: "15px", color: "rgba(255,255,255,0.3)" }}>Finding adventures near you...</div>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ fontSize: "40px", marginBottom: "20px" }}>🔭</div>
            <div style={{ fontFamily: "'Outfit', serif", fontSize: "22px", fontWeight: "300", marginBottom: "12px" }}>
              {activityFilter === "all" && energyFilter === "all"
                ? "No adventures yet in Bangalore."
                : "No adventures match these filters."}
            </div>
            <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.3)", marginBottom: "32px", maxWidth: "400px", margin: "0 auto 32px" }}>
              {activityFilter === "all" && energyFilter === "all"
                ? "Be the first! Host a free adventure and start the community."
                : "Try removing a filter, or host your own adventure."}
            </div>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              {(activityFilter !== "all" || energyFilter !== "all") && (
                <button onClick={() => { setActivityFilter("all"); setEnergyFilter("all"); }} style={{ padding: "12px 28px", background: "none", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.6)", fontFamily: "'Inter', sans-serif", fontSize: "13px", cursor: "pointer" }}>
                  Clear Filters
                </button>
              )}
              <button onClick={user ? onHostAdventure : onCreateProfile} style={{ padding: "12px 32px", background: "#D4AF37", border: "none", color: "#080808", fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}>
                Host First Adventure →
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2px", background: "rgba(255,255,255,0.04)" }} className="events-grid">
            {filtered.map(event => {
              const spotsLeft = event.slots_total - event.slots_taken;
              const isFull = spotsLeft <= 0;
              const isHot = spotsLeft === 1 && !isFull;
              const iJoined = myJoinedIds.has(event.id);
              const iAmHost = user && event.host_user_id === user.id;
              return (
                <div key={event.id}
                  onMouseEnter={() => setHoveredEvent(event.id)}
                  onMouseLeave={() => setHoveredEvent(null)}
                  onClick={() => onEventSelect(event)}
                  style={{
                    background: hoveredEvent === event.id ? event.bg : "#080808",
                    padding: "clamp(24px, 3vw, 36px)",
                    cursor: "pointer",
                    transition: "all 0.3s", position: "relative",
                    border: hoveredEvent === event.id ? `1px solid ${event.color}30` : "1px solid transparent",
                  }}
                >
                  {/* Badges */}
                  <div style={{ position: "absolute", top: "16px", right: "16px", display: "flex", flexDirection: "column", gap: "6px", alignItems: "flex-end" }}>
                    {iJoined && <span style={{ background: "rgba(34,214,138,0.15)", color: "#22d68a", fontSize: "10px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", padding: "3px 10px", borderRadius: "20px", border: "1px solid rgba(34,214,138,0.3)" }}>✓ Joined</span>}
                    {iAmHost && <span style={{ background: "rgba(212,175,55,0.15)", color: "#D4AF37", fontSize: "10px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", padding: "3px 10px", borderRadius: "20px", border: "1px solid rgba(212,175,55,0.3)" }}>⭐ Hosting</span>}
                    {isHot && !iJoined && !iAmHost && <span style={{ background: "#E85D75", color: "#fff", fontSize: "10px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", padding: "3px 10px", borderRadius: "20px" }}>1 spot left!</span>}
                    {isFull && <span style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.3)", fontSize: "10px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", padding: "3px 10px", borderRadius: "20px" }}>Full</span>}
                  </div>

                  <div style={{ fontSize: "32px", marginBottom: "16px" }}>{event.emoji}</div>
                  <div style={{ fontSize: "11px", letterSpacing: "0.18em", color: event.color, textTransform: "uppercase", marginBottom: "10px", opacity: 0.9 }}>{event.title}</div>
                  <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)", marginBottom: "4px", fontWeight: "500" }}>{event.datetime}</div>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)", marginBottom: "4px" }}>📍 {event.area}, Bangalore</div>
                  {event.host_name && (
                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)", marginBottom: "14px" }}>Hosted by {event.host_name}</div>
                  )}
                  <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: "1.75", marginBottom: "20px" }}>{event.teaser}</p>

                  {/* Tags */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "20px" }}>
                    {(Array.isArray(event.tags) ? event.tags : []).slice(0, 3).map(tag => (
                      <span key={tag} style={{ fontSize: "10px", padding: "3px 10px", border: `1px solid ${event.color}30`, color: event.color, borderRadius: "20px", background: `${event.color}08` }}>{tag}</span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)", marginBottom: "6px" }}>
                        {event.energy === "low" ? "🌙 Chill" : event.energy === "high" ? "🔥 Active" : "⚡ Moderate"} energy
                      </div>
                      <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                        {Array(event.slots_total).fill(0).map((_, i) => (
                          <div key={i} style={{ width: "18px", height: "18px", borderRadius: "50%", background: i < event.slots_taken ? event.color : "rgba(255,255,255,0.07)", border: `1px solid ${i < event.slots_taken ? event.color : "rgba(255,255,255,0.1)"}`, transition: "all 0.2s" }} />
                        ))}
                        <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", marginLeft: "4px", lineHeight: "18px" }}>
                          {isFull ? "Full" : `${spotsLeft} open`}
                        </span>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "18px", fontWeight: "700", color: event.color }}>Free</div>
                      <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)", textTransform: "uppercase", letterSpacing: "0.08em" }}>community</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom note */}
        {!loading && filtered.length > 0 && (
          <div style={{ textAlign: "center", marginTop: "48px", padding: "24px", border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.015)" }}>
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)", lineHeight: "1.75" }}>
              🔒 Venue revealed before event · 100% Free Community · Max group size set by host
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        @media (max-width: 900px) { .events-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 600px) { .events-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
