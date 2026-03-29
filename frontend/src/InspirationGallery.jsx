// InspirationGallery.jsx
// Place in frontend/src/InspirationGallery.jsx
// Public page showing anonymized past plans for inspiration

import { useState, useEffect } from "react";
import { supabase } from "./supabase";

const OCCASIONS = ["All", "Birthday", "Anniversary", "Valentine's Day", "Just Because", "Graduation", "Apology"];
const TONES = ["All", "Romantic", "Funny", "Luxury", "Minimal", "Emotional", "Adventurous"];

export default function InspirationGallery({ onUsePlan, onBack }) {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [occasion, setOccasion] = useState("All");
  const [tone, setTone] = useState("All");
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("plans")
      .select("id, occasion, tone, budget, city, plan_data, created_at")
      .not("plan_data", "is", null)
      .order("created_at", { ascending: false })
      .limit(50);
    setPlans(data || []);
    setLoading(false);
  };

  const filtered = plans.filter(p => {
    const matchOccasion = occasion === "All" || p.occasion === occasion;
    const matchTone = tone === "All" || p.tone === tone;
    return matchOccasion && matchTone;
  });

  const formatDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "1.5rem 1rem 4rem" }}>

      {/* Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", fontSize: "13px", color: "#999", cursor: "pointer", marginBottom: "8px", padding: 0 }}>
          ← Back
        </button>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "26px", fontWeight: "500", marginBottom: "6px" }}>
          Surprise inspiration
        </h1>
        <p style={{ fontSize: "14px", color: "#999" }}>
          Real plans created by others — use them as inspiration or as a starting point.
        </p>
      </div>

      {/* Filters */}
      <div style={{ marginBottom: "1.25rem" }}>
        <div style={{ fontSize: "12px", color: "#999", marginBottom: "8px", fontWeight: "500", textTransform: "uppercase", letterSpacing: "0.06em" }}>Occasion</div>
        <div className="pill-group" style={{ marginBottom: "12px" }}>
          {OCCASIONS.map(o => (
            <span key={o} className={`pill ${occasion === o ? "selected" : ""}`} onClick={() => setOccasion(o)}>{o}</span>
          ))}
        </div>
        <div style={{ fontSize: "12px", color: "#999", marginBottom: "8px", fontWeight: "500", textTransform: "uppercase", letterSpacing: "0.06em" }}>Vibe</div>
        <div className="pill-group">
          {TONES.map(t => (
            <span key={t} className={`pill ${tone === t ? "selected" : ""}`} onClick={() => setTone(t)}>{t}</span>
          ))}
        </div>
      </div>

      {/* Count */}
      <div style={{ fontSize: "13px", color: "#999", marginBottom: "1rem" }}>
        {filtered.length} plans found
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          {[1,2,3,4].map(i => <div key={i} className="myplans-skeleton" style={{ height: "160px" }} />)}
        </div>
      )}

      {/* Empty */}
      {!loading && filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "3rem", color: "#999" }}>
          <div style={{ fontSize: "32px", marginBottom: "1rem" }}>✨</div>
          <p>No plans yet for this filter.</p>
          <button className="btn-next" style={{ marginTop: "1rem", width: "auto", padding: "10px 24px" }} onClick={onBack}>
            Create the first one
          </button>
        </div>
      )}

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        {filtered.map(p => {
          const data = p.plan_data || {};
          const isExpanded = expanded === p.id;
          return (
            <div
              key={p.id}
              style={{
                background: "#fff",
                border: isExpanded ? "0.5px solid #7F77DD" : "0.5px solid #eee",
                borderRadius: "12px",
                padding: "1.25rem",
                cursor: "pointer",
                transition: "all 0.2s",
                gridColumn: isExpanded ? "1 / -1" : "auto",
              }}
              onClick={() => setExpanded(isExpanded ? null : p.id)}
            >
              {/* Badges */}
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "10px" }}>
                {p.occasion && (
                  <span style={{ fontSize: "11px", fontWeight: "500", padding: "2px 8px", borderRadius: "10px", background: "#EEEDFE", color: "#534AB7" }}>
                    {p.occasion}
                  </span>
                )}
                {p.tone && (
                  <span style={{ fontSize: "11px", fontWeight: "500", padding: "2px 8px", borderRadius: "10px", background: "#E1F5EE", color: "#0F6E56" }}>
                    {p.tone}
                  </span>
                )}
                {p.budget && (
                  <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "10px", background: "#f5f5f5", color: "#888" }}>
                    Rs {Number(p.budget).toLocaleString("en-IN")}
                  </span>
                )}
              </div>

              {/* Idea */}
              <div style={{ fontSize: "15px", fontWeight: "500", color: "#111", marginBottom: "8px", lineHeight: "1.4" }}>
                {data.idea || "Surprise plan"}
              </div>

              {/* Message preview */}
              <p style={{ fontSize: "13px", color: "#888", lineHeight: "1.6", marginBottom: "10px" }}>
                {data.message
                  ? (data.message.length > 80 ? data.message.slice(0, 80) + "..." : data.message)
                  : ""}
              </p>

              {/* Expanded content */}
              {isExpanded && (
                <div style={{ borderTop: "0.5px solid #eee", paddingTop: "16px", marginTop: "8px" }}>

                  {/* Timeline */}
                  {data.timeline && (
                    <div style={{ marginBottom: "16px" }}>
                      {[
                        { label: "Before", color: "#7F77DD", items: data.timeline.before || [] },
                        { label: "On the day", color: "#1D9E75", items: data.timeline.during || [] },
                        { label: "After", color: "#BA7517", items: data.timeline.after || [] },
                      ].map(s => s.items.length > 0 && (
                        <div key={s.label} style={{ marginBottom: "12px" }}>
                          <div style={{ fontSize: "11px", fontWeight: "600", color: s.color, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>
                            {s.label}
                          </div>
                          {s.items.map((item, i) => (
                            <div key={i} style={{ fontSize: "13px", color: "#555", paddingLeft: "12px", borderLeft: `2px solid ${s.color}`, marginBottom: "4px", lineHeight: "1.5" }}>
                              {item.replace(/^[-•]\s*/, "")}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); onUsePlan && onUsePlan(p); }}
                      className="btn-next"
                      style={{ flex: 1, padding: "10px" }}
                    >
                      Use this as inspiration
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setExpanded(null); }}
                      className="btn-back"
                      style={{ padding: "10px 16px" }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}

              {/* Footer */}
              {!isExpanded && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", color: "#bbb" }}>{formatDate(p.created_at)}</span>
                  <span style={{ fontSize: "12px", color: "#7F77DD" }}>View plan →</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      {!loading && filtered.length > 0 && (
        <div style={{
          marginTop: "2rem", textAlign: "center", padding: "1.5rem",
          borderTop: "0.5px solid #eee",
        }}>
          <p style={{ fontSize: "14px", color: "#999", marginBottom: "12px" }}>
            Don't see what you're looking for?
          </p>
          <button className="btn-generate" style={{ padding: "12px 32px" }} onClick={onBack}>
            Create a custom plan
          </button>
        </div>
      )}
    </div>
  );
}