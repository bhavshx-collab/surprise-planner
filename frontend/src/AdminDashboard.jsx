// AdminDashboard.jsx
// Place in frontend/src/AdminDashboard.jsx
// Only accessible to you — protected by your email

import { useState, useEffect } from "react";
import { supabase } from "./supabase";

// Change this to YOUR email — only you can access admin
const ADMIN_EMAIL = "bhaveshkumawat330@gmail.com";

export default function AdminDashboard({ user, onBack }) {

  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");

  // Block non-admins
  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div style={{ textAlign: "center", padding: "4rem 1rem" }}>
        <h2 style={{ fontSize: "18px", color: "#333" }}>Access denied</h2>
        <p style={{ color: "#999", marginTop: "8px" }}>You don't have permission to view this page.</p>
        <button className="btn-back" onClick={onBack} style={{ marginTop: "1rem" }}>Go back</button>
      </div>
    );
  }

  useEffect(() => {
    fetchVendors();
  }, [filter]);

  const fetchVendors = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("vendors")
      .select("*")
      .eq("status", filter)
      .order("created_at", { ascending: false });
    setVendors(data || []);
    setLoading(false);
  };

  const updateStatus = async (id, status) => {
    await supabase.from("vendors").update({
      status,
      approved_at: status === "approved" ? new Date().toISOString() : null,
    }).eq("id", id);
    setVendors(v => v.filter(vendor => vendor.id !== id));
  };

  const deleteVendor = async (id) => {
    if (!confirm("Delete this vendor permanently?")) return;
    await supabase.from("vendors").delete().eq("id", id);
    setVendors(v => v.filter(vendor => vendor.id !== id));
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "1.5rem 1rem 4rem" }}>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div>
          <button onClick={onBack} style={{ background: "none", border: "none", fontSize: "13px", color: "#999", cursor: "pointer", marginBottom: "6px", padding: 0 }}>← Back</button>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: "500" }}>Vendor dashboard</h1>
        </div>
        <div style={{ fontSize: "12px", color: "#999" }}>{vendors.length} {filter}</div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "1.25rem" }}>
        {["pending", "approved", "rejected"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "6px 16px",
              borderRadius: "20px",
              border: "0.5px solid",
              borderColor: filter === f ? "#534AB7" : "#ddd",
              background: filter === f ? "#EEEDFE" : "transparent",
              color: filter === f ? "#534AB7" : "#666",
              fontSize: "13px",
              fontWeight: filter === f ? "500" : "400",
              cursor: "pointer",
              fontFamily: "inherit",
              textTransform: "capitalize",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {loading && <p style={{ color: "#999", fontSize: "14px" }}>Loading...</p>}

      {!loading && vendors.length === 0 && (
        <div style={{ textAlign: "center", padding: "3rem", color: "#999" }}>
          <p>No {filter} vendors</p>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {vendors.map(v => (
          <div key={v.id} style={{
            background: "#fff",
            border: "0.5px solid #eee",
            borderRadius: "12px",
            padding: "1.25rem",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
              <div>
                <div style={{ fontSize: "15px", fontWeight: "500", marginBottom: "4px" }}>{v.name}</div>
                <div style={{ fontSize: "12px", color: "#888" }}>
                  {v.category} · {v.city} · {v.price_range || "No price range"}
                </div>
              </div>
              <span style={{
                fontSize: "11px", fontWeight: "500", padding: "3px 10px",
                borderRadius: "10px",
                background: v.status === "approved" ? "#E1F5EE" : v.status === "rejected" ? "#FCEBEB" : "#FAEEDA",
                color: v.status === "approved" ? "#0F6E56" : v.status === "rejected" ? "#A32D2D" : "#854F0B",
              }}>
                {v.status}
              </span>
            </div>

            {v.description && (
              <p style={{ fontSize: "13px", color: "#555", lineHeight: "1.6", marginBottom: "10px" }}>
                {v.description}
              </p>
            )}

            <div style={{ fontSize: "12px", color: "#888", marginBottom: "12px", display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <span>{v.email}</span>
              <span>{v.phone}</span>
              {v.instagram && <span>{v.instagram}</span>}
              {v.min_budget && <span>Rs {v.min_budget.toLocaleString("en-IN")} – Rs {v.max_budget?.toLocaleString("en-IN")}</span>}
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              {v.status !== "approved" && (
                <button
                  onClick={() => updateStatus(v.id, "approved")}
                  style={{
                    padding: "7px 16px", borderRadius: "6px", border: "none",
                    background: "#1D9E75", color: "#fff", fontSize: "13px",
                    fontWeight: "500", cursor: "pointer", fontFamily: "inherit",
                  }}
                >
                  Approve
                </button>
              )}
              {v.status !== "rejected" && (
                <button
                  onClick={() => updateStatus(v.id, "rejected")}
                  style={{
                    padding: "7px 16px", borderRadius: "6px",
                    border: "0.5px solid #ddd", background: "transparent",
                    color: "#666", fontSize: "13px", cursor: "pointer", fontFamily: "inherit",
                  }}
                >
                  Reject
                </button>
              )}
              {v.status === "approved" && v.whatsapp && (
                <a
                  href={`https://wa.me/${v.whatsapp.replace(/\D/g, "")}?text=Hi ${v.name}, your listing on AI Surprise Planner has been approved!`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    padding: "7px 16px", borderRadius: "6px", border: "none",
                    background: "#25D366", color: "#fff", fontSize: "13px",
                    fontWeight: "500", cursor: "pointer", textDecoration: "none", fontFamily: "inherit",
                  }}
                >
                  Notify on WhatsApp
                </a>
              )}
              <button
                onClick={() => deleteVendor(v.id)}
                style={{
                  padding: "7px 12px", borderRadius: "6px",
                  border: "0.5px solid #fcc", background: "transparent",
                  color: "#E24B4A", fontSize: "13px", cursor: "pointer",
                  marginLeft: "auto", fontFamily: "inherit",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}