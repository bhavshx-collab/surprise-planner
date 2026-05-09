// VendorDirectory.jsx
// Place in frontend/src/VendorDirectory.jsx
// Shows approved vendors filtered by city and category

import { useState, useEffect } from "react";
import { supabase } from "./supabase";

const CATEGORIES = [
  "All",
  "Cafe & Restaurant",
  "Hotel & Resort",
  "Florist",
  "Photography Studio",
  "Spa & Wellness",
  "Adventure & Experience",
  "Gift Shop",
  "Event Venue",
];

export default function VendorDirectory({ city, onBack }) {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  const fetchVendors = async () => {
    setLoading(true);
    let query = supabase
      .from("vendors")
      .select("*")
      .eq("status", "approved")
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false });

    if (city) {
      query = query.ilike("city", `%${city}%`);
    }

    const { data } = await query;
    setVendors(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchVendors();
  }, [city]); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = vendors.filter(v => {
    const matchCat = category === "All" || v.category === category;
    const matchSearch = !search ||
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.description?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const openWhatsApp = (v) => {
    const num = (v.whatsapp || v.phone || "").replace(/\D/g, "");
    const msg = encodeURIComponent(`Hi ${v.name}! I found you on AI Surprise Planner and I'm interested in booking for a special occasion.`);
    window.open(`https://wa.me/${num}?text=${msg}`, "_blank");
  };

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "1.5rem 1rem 4rem" }}>

      {/* Header */}
      <div style={{ marginBottom: "1.25rem" }}>
        {onBack && (
          <button onClick={onBack} style={{ background: "none", border: "none", fontSize: "13px", color: "#999", cursor: "pointer", marginBottom: "8px", padding: 0 }}>
            ← Back to plan
          </button>
        )}
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: "500", marginBottom: "4px" }}>
          Vendors{city ? ` in ${city}` : ""}
        </h2>
        <p style={{ fontSize: "13px", color: "#999" }}>
          {filtered.length} businesses ready to make it happen
        </p>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search vendors..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{
          width: "100%", padding: "10px 14px", borderRadius: "8px",
          border: "0.5px solid #ddd", background: "#fafafa", fontSize: "14px",
          fontFamily: "inherit", outline: "none", marginBottom: "12px",
          boxSizing: "border-box", color: "#111",
        }}
      />

      {/* Category filter */}
      <div className="pill-group" style={{ marginBottom: "1.25rem", overflowX: "auto", flexWrap: "nowrap", paddingBottom: "4px" }}>
        {CATEGORIES.map(c => (
          <span
            key={c}
            className={`pill ${category === c ? "selected" : ""}`}
            onClick={() => setCategory(c)}
            style={{ whiteSpace: "nowrap" }}
          >
            {c}
          </span>
        ))}
      </div>

      {loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {[1, 2, 3].map(i => (
            <div key={i} className="myplans-skeleton" style={{ height: "120px" }} />
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "3rem", color: "#999" }}>
          <div style={{ fontSize: "32px", marginBottom: "1rem" }}>🔍</div>
          <p style={{ fontSize: "14px" }}>No vendors found{city ? ` in ${city}` : ""}.</p>
          <p style={{ fontSize: "13px", marginTop: "6px" }}>
            <a
              href="#list"
              style={{ color: "#534AB7", textDecoration: "underline", cursor: "pointer" }}
              onClick={() => window.dispatchEvent(new CustomEvent("openVendorSignup"))}
            >
              List your business here
            </a>
          </p>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {filtered.map(v => (
          <div key={v.id} style={{
            background: "#fff",
            border: v.is_featured ? "2px solid #7F77DD" : "0.5px solid #eee",
            borderRadius: "12px",
            padding: "1.25rem",
            position: "relative",
          }}>
            {v.is_featured && (
              <span style={{
                position: "absolute", top: "-1px", right: "12px",
                fontSize: "11px", fontWeight: "500", padding: "3px 10px",
                background: "#534AB7", color: "#fff", borderRadius: "0 0 8px 8px",
              }}>
                Featured
              </span>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
              <div>
                <div style={{ fontSize: "15px", fontWeight: "500", marginBottom: "3px" }}>{v.name}</div>
                <div style={{ fontSize: "12px", color: "#888" }}>
                  {v.category} · {v.city}
                  {v.price_range && ` · ${v.price_range}`}
                </div>
              </div>
              {v.min_budget && (
                <div style={{ fontSize: "12px", fontWeight: "500", color: "#534AB7", textAlign: "right", flexShrink: 0 }}>
                  From Rs {v.min_budget.toLocaleString("en-IN")}
                </div>
              )}
            </div>

            {v.description && (
              <p style={{ fontSize: "13px", color: "#555", lineHeight: "1.6", marginBottom: "12px" }}>
                {v.description.length > 120 ? v.description.slice(0, 120) + "..." : v.description}
              </p>
            )}

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {(v.whatsapp || v.phone) && (
                <button
                  onClick={() => openWhatsApp(v)}
                  style={{
                    padding: "8px 16px", borderRadius: "6px", border: "none",
                    background: "#25D366", color: "#fff", fontSize: "13px",
                    fontWeight: "500", cursor: "pointer", fontFamily: "inherit",
                  }}
                >
                  WhatsApp
                </button>
              )}
              {v.phone && (
                <a
                  href={`tel:${v.phone}`}
                  style={{
                    padding: "8px 16px", borderRadius: "6px",
                    border: "0.5px solid #ddd", background: "transparent",
                    color: "#333", fontSize: "13px", textDecoration: "none", fontFamily: "inherit",
                  }}
                >
                  Call
                </a>
              )}
              {v.instagram && (
                <a
                  href={`https://instagram.com/${v.instagram.replace("@", "")}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    padding: "8px 16px", borderRadius: "6px",
                    border: "0.5px solid #ddd", background: "transparent",
                    color: "#333", fontSize: "13px", textDecoration: "none", fontFamily: "inherit",
                  }}
                >
                  Instagram
                </a>
              )}
              {v.website && (
                <a
                  href={v.website}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    padding: "8px 16px", borderRadius: "6px",
                    border: "0.5px solid #ddd", background: "transparent",
                    color: "#333", fontSize: "13px", textDecoration: "none", fontFamily: "inherit",
                  }}
                >
                  Website
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* CTA for vendors at bottom */}
      <div style={{
        marginTop: "2rem", padding: "1.25rem", borderRadius: "12px",
        background: "#EEEDFE", border: "0.5px solid rgba(83,74,183,0.2)",
        textAlign: "center",
      }}>
        <div style={{ fontSize: "14px", fontWeight: "500", color: "#534AB7", marginBottom: "6px" }}>
          Own a business in this city?
        </div>
        <div style={{ fontSize: "13px", color: "#7F77DD", marginBottom: "12px" }}>
          Get discovered by people planning surprises. Free to list.
        </div>
        <button
          className="auth-primary-btn"
          style={{ width: "auto", padding: "8px 20px" }}
          onClick={() => window.dispatchEvent(new CustomEvent("openVendorSignup"))}
        >
          List your business
        </button>
      </div>
    </div>
  );
}