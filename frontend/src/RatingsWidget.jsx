// RatingsWidget.jsx
// Place in frontend/src/RatingsWidget.jsx
// Shows average rating and recent reviews — embed in LandingPage.jsx

import { useState, useEffect } from "react";
import { supabase } from "./supabase";


export default function RatingsWidget() {
  const [stats, setStats] = useState({ avg: 0, count: 0 });
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRatings();
  }, []);

  const fetchRatings = async () => {
    const { data } = await supabase
      .from("ratings")
      .select("rating, review, occasion, created_at")
      .order("created_at", { ascending: false })
      .limit(20);

    if (data && data.length > 0) {
      const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length;
      setStats({ avg: avg.toFixed(1), count: data.length });
      setReviews(data.filter(r => r.review).slice(0, 3));
    }
    setLoading(false);
  };

  if (loading || stats.count === 0) return null;

  return (
    <div style={{ padding: "0 1rem 1.5rem" }}>
      {/* Average rating */}
      <div style={{
        display: "flex", alignItems: "center", gap: "12px",
        marginBottom: "1rem",
      }}>
        <div style={{ fontSize: "36px", fontWeight: "300", color: "#534AB7", fontFamily: "'Playfair Display', serif" }}>
          {stats.avg}
        </div>
        <div>
          <div style={{ display: "flex", gap: "2px", marginBottom: "4px" }}>
            {[1,2,3,4,5].map(s => (
              <span key={s} style={{ fontSize: "16px", filter: s <= Math.round(stats.avg) ? "none" : "grayscale(1) opacity(0.3)" }}>⭐</span>
            ))}
          </div>
          <div style={{ fontSize: "12px", color: "#999" }}>
            from {stats.count} surprise{stats.count !== 1 ? "s" : ""} planned
          </div>
        </div>
      </div>

      {/* Reviews */}
      {reviews.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {reviews.map((r, i) => (
            <div key={i} style={{
              background: "#fafafa", borderRadius: "10px",
              padding: "12px 14px", border: "0.5px solid #eee",
            }}>
              <div style={{ display: "flex", gap: "2px", marginBottom: "6px" }}>
                {[1,2,3,4,5].map(s => (
                  <span key={s} style={{ fontSize: "12px", filter: s <= r.rating ? "none" : "grayscale(1) opacity(0.3)" }}>⭐</span>
                ))}
                {r.occasion && (
                  <span style={{ fontSize: "11px", color: "#999", marginLeft: "8px", alignSelf: "center" }}>
                    {r.occasion}
                  </span>
                )}
              </div>
              <p style={{ fontSize: "13px", color: "#555", lineHeight: "1.6", fontStyle: "italic" }}>
                "{r.review}"
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}