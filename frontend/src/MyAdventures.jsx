import { useState, useEffect } from "react";
import { supabase } from "./supabase";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

function timeUntil(dateStr) {
  const now = new Date();
  const then = new Date(dateStr);
  const diff = then - now;
  if (diff < 0) return "Completed";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  if (days > 0) return `in ${days}d ${hours}h`;
  if (hours > 0) return `in ${hours}h`;
  return "Happening now!";
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString("en-IN", {
    weekday: "short", month: "short", day: "numeric",
    hour: "numeric", minute: "2-digit",
  });
}

export default function MyAdventures({ user, onBack, onEventSelect }) {
  const [joined, setJoined] = useState([]);
  const [hosted, setHosted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("joined");

  useEffect(() => {
    if (!user) return;
    const fetchMyAdventures = async () => {
      setLoading(true);
      try {
        // Fetch events I have joined
        const { data: memberships } = await supabase
          .from("event_members")
          .select("event_id")
          .eq("user_id", user.id);

        if (memberships && memberships.length > 0) {
          const ids = memberships.map((m) => m.event_id);
          const { data: joinedEvents } = await supabase
            .from("mystery_events")
            .select("*")
            .in("id", ids)
            .order("date_time", { ascending: true });
          setJoined(joinedEvents || []);
        } else {
          setJoined([]);
        }

        // Fetch events I have hosted
        const { data: hostedEvents } = await supabase
          .from("mystery_events")
          .select("*")
          .eq("host_user_id", user.id)
          .order("date_time", { ascending: true });
        setHosted(hostedEvents || []);
      } catch (err) {
        console.error("Error fetching my adventures:", err);
      }
      setLoading(false);
    };
    fetchMyAdventures();
  }, [user]);

  const events = tab === "joined" ? joined : hosted;

  return (
    <div style={{ minHeight: "100vh", background: "#050505", fontFamily: "'Inter', sans-serif", color: "#fff" }}>
      {/* BG */}
      <div style={{ position: "fixed", inset: 0, backgroundImage: "url('/adventure-bg.png')", backgroundSize: "cover", backgroundPosition: "center", zIndex: 0 }} />
      <div style={{ position: "fixed", inset: 0, background: "linear-gradient(to bottom, rgba(5,5,5,0.55) 0%, rgba(5,5,5,0.9) 50%, #050505 100%)", zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: "900px", margin: "0 auto", padding: "clamp(36px,5vh,60px) clamp(24px,5vw,60px) 80px" }}>
        {/* Back */}
        <button onClick={onBack} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", fontSize: "13px", cursor: "pointer", fontFamily: "'Inter', sans-serif", padding: 0, marginBottom: "32px", display: "flex", alignItems: "center", gap: "6px" }}
          onMouseEnter={e => e.target.style.color = "rgba(255,255,255,0.7)"}
          onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.3)"}
        >← Adventures</button>

        {/* Header */}
        <div style={{ marginBottom: "40px" }}>
          <div style={{ fontSize: "10px", letterSpacing: "0.28em", color: "#D4AF37", textTransform: "uppercase", marginBottom: "10px" }}>My Activity</div>
          <h1 style={{ fontFamily: "'Outfit', serif", fontSize: "clamp(32px,4vw,52px)", fontWeight: "300", lineHeight: "1.1", textShadow: "0 4px 24px rgba(0,0,0,0.6)", marginBottom: "8px" }}>
            My Adventures
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>
            {user?.user_metadata?.full_name || user?.email?.split("@")[0] || "You"} · {joined.length} joined · {hosted.length} hosted
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "0", marginBottom: "32px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          {[["joined", `Joined (${joined.length})`], ["hosted", `Hosted (${hosted.length})`]].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} style={{
              padding: "12px 28px", background: "none", border: "none", borderBottom: `2px solid ${tab === id ? "#D4AF37" : "transparent"}`,
              color: tab === id ? "#D4AF37" : "rgba(255,255,255,0.35)",
              fontFamily: "'Inter', sans-serif", fontSize: "13px", letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s",
            }}>{label}</button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px", color: "rgba(255,255,255,0.2)" }}>
            <div style={{ fontSize: "28px", marginBottom: "12px" }}>⏳</div>
            Loading your adventures...
          </div>
        ) : events.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>{tab === "joined" ? "🎒" : "🌿"}</div>
            <div style={{ fontSize: "18px", fontFamily: "'Outfit', serif", fontWeight: "300", marginBottom: "8px" }}>
              {tab === "joined" ? "No adventures joined yet." : "You haven't hosted anything yet."}
            </div>
            <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.3)", marginBottom: "32px" }}>
              {tab === "joined" ? "Browse upcoming events and join one!" : "Create your first adventure — it's completely free."}
            </div>
            <button onClick={onBack} style={{
              padding: "12px 32px", background: "#D4AF37", border: "none", color: "#080808",
              fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: "700", letterSpacing: "0.12em",
              textTransform: "uppercase", cursor: "pointer",
            }}>Browse Adventures →</button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "2px", background: "rgba(255,255,255,0.04)" }}>
            {events.map(event => {
              const isPast = new Date(event.date_time) < new Date();
              const countdown = timeUntil(event.date_time);
              return (
                <div key={event.id}
                  onClick={() => onEventSelect && onEventSelect({ ...event, isReal: true })}
                  style={{
                    padding: "24px 28px", background: "#080808", cursor: "pointer", transition: "background 0.2s",
                    borderLeft: `3px solid ${isPast ? "rgba(255,255,255,0.1)" : "#D4AF37"}`, display: "flex", gap: "20px", alignItems: "flex-start",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                  onMouseLeave={e => e.currentTarget.style.background = "#080808"}
                >
                  <div style={{ fontSize: "28px", flexShrink: 0, marginTop: "2px" }}>{event.emoji || "✨"}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", flexWrap: "wrap" }}>
                      <div>
                        <div style={{ fontSize: "16px", fontFamily: "'Outfit', serif", fontWeight: "400", marginBottom: "4px" }}>{event.title}</div>
                        <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>
                          📅 {formatDate(event.date_time)} · 📍 {event.area}, Bangalore
                        </div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontSize: "13px", fontWeight: "600", color: isPast ? "rgba(255,255,255,0.2)" : "#D4AF37" }}>{countdown}</div>
                        <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)", marginTop: "2px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                          {tab === "hosted" ? "You're hosting" : "Joined"}
                        </div>
                      </div>
                    </div>
                    {!isPast && (
                      <div style={{ marginTop: "12px", display: "flex", gap: "8px", alignItems: "center" }}>
                        <div style={{ fontSize: "11px", padding: "3px 12px", border: "1px solid rgba(212,175,55,0.3)", color: "#D4AF37", borderRadius: "20px", background: "rgba(212,175,55,0.05)" }}>
                          💬 Group chat available
                        </div>
                        {event.status === "full" && (
                          <div style={{ fontSize: "11px", padding: "3px 12px", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.3)", borderRadius: "20px" }}>Full</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
