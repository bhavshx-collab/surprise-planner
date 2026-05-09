// VendorDashboard.jsx
// Place in frontend/src/VendorDashboard.jsx
// Shows after a vendor logs in — they manage their listing and see inquiries

import { useState, useEffect } from "react";
import { supabase } from "./supabase";

const CATEGORIES = [
  "Cafe & Restaurant", "Hotel & Resort", "Florist",
  "Photography Studio", "Spa & Wellness", "Adventure & Experience",
  "Gift Shop", "Event Venue", "Other",
];

const PRICE_RANGES = [
  "Budget (under Rs 1,000)",
  "Affordable (Rs 1,000 - Rs 5,000)",
  "Mid-range (Rs 5,000 - Rs 20,000)",
  "Premium (Rs 20,000 - Rs 50,000)",
  "Luxury (Rs 50,000+)",
];

export default function VendorDashboard({ user, onBack }) {
  const [tab, setTab] = useState("listing");
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [inquiries, setInquiries] = useState([]);
  const [form, setForm] = useState({
    name: "", category: "", description: "", city: "",
    address: "", phone: "", whatsapp: "", email: "",
    website: "", instagram: "", price_range: "",
    min_budget: "", max_budget: "",
  });

  const fetchListing = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("vendors")
      .select("*")
      .eq("email", user.email)
      .single();

    if (data) {
      setListing(data);
      setForm({
        name: data.name || "",
        category: data.category || "",
        description: data.description || "",
        city: data.city || "",
        address: data.address || "",
        phone: data.phone || "",
        whatsapp: data.whatsapp || "",
        email: data.email || "",
        website: data.website || "",
        instagram: data.instagram || "",
        price_range: data.price_range || "",
        min_budget: data.min_budget || "",
        max_budget: data.max_budget || "",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchListing();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = async () => {
    setSaving(true);
    if (listing) {
      await supabase.from("vendors").update({
        ...form,
        min_budget: form.min_budget ? parseInt(form.min_budget) : null,
        max_budget: form.max_budget ? parseInt(form.max_budget) : null,
      }).eq("id", listing.id);
    } else {
      await supabase.from("vendors").insert({
        ...form,
        min_budget: form.min_budget ? parseInt(form.min_budget) : null,
        max_budget: form.max_budget ? parseInt(form.max_budget) : null,
        status: "pending",
      });
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    fetchListing();
    setSaving(false);
  };

  const update = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const statusColor = {
    approved: { bg: "#E1F5EE", color: "#0F6E56" },
    pending: { bg: "#FAEEDA", color: "#854F0B" },
    rejected: { bg: "#FCEBEB", color: "#A32D2D" },
  };

  if (loading) return (
    <div style={{ textAlign: "center", padding: "4rem", color: "#999" }}>
      <div className="loading-spinner" style={{ margin: "0 auto 1rem" }} />
      Loading your dashboard...
    </div>
  );

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "1.5rem 1rem 4rem" }}>

      {/* Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", fontSize: "13px", color: "#999", cursor: "pointer", marginBottom: "8px", padding: 0 }}>
          ← Back
        </button>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: "500", marginBottom: "4px" }}>
              {listing ? listing.name : "My Business"}
            </h1>
            <p style={{ fontSize: "13px", color: "#999" }}>{user.email}</p>
          </div>
          {listing && (
            <span style={{
              fontSize: "12px", fontWeight: "500", padding: "4px 12px",
              borderRadius: "20px",
              background: statusColor[listing.status]?.bg || "#eee",
              color: statusColor[listing.status]?.color || "#666",
            }}>
              {listing.status}
            </span>
          )}
        </div>
      </div>

      {/* No listing yet */}
      {!listing && (
        <div style={{
          background: "#EEEDFE", border: "0.5px solid rgba(83,74,183,0.2)",
          borderRadius: "12px", padding: "1.25rem", marginBottom: "1.5rem",
          fontSize: "13px", color: "#534AB7", lineHeight: "1.6",
        }}>
          You don't have a listing yet. Fill in your business details below and submit — we'll review and approve within 24 hours.
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "0.5px solid #eee", marginBottom: "1.5rem" }}>
        {["listing", "inquiries"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: "10px 0", background: "none",
            border: "none", borderBottom: tab === t ? "2px solid #534AB7" : "2px solid transparent",
            color: tab === t ? "#534AB7" : "#999", fontSize: "13px",
            fontWeight: tab === t ? "500" : "400", cursor: "pointer",
            fontFamily: "inherit", textTransform: "capitalize", marginBottom: "-1px",
          }}>
            {t === "listing" ? "My listing" : "Inquiries"}
          </button>
        ))}
      </div>

      {/* LISTING TAB */}
      {tab === "listing" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          <div className="card">
            <div className="card-label">Business details</div>
            <div className="field">
              <label>Business name</label>
              <input type="text" value={form.name} onChange={e => update("name", e.target.value)} placeholder="The Cozy Corner Cafe" />
            </div>
            <div className="field">
              <label>Category</label>
              <div className="pill-group">
                {CATEGORIES.map(c => (
                  <span key={c} className={`pill ${form.category === c ? "selected" : ""}`} onClick={() => update("category", c)}>{c}</span>
                ))}
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label>City</label>
                <input type="text" value={form.city} onChange={e => update("city", e.target.value)} placeholder="Mumbai" />
              </div>
              <div className="field">
                <label>Address</label>
                <input type="text" value={form.address} onChange={e => update("address", e.target.value)} placeholder="Street, area..." />
              </div>
            </div>
            <div className="field">
              <label>Description</label>
              <textarea value={form.description} onChange={e => update("description", e.target.value)} placeholder="What makes your place special for surprises and celebrations?" style={{ height: "80px" }} />
            </div>
          </div>

          <div className="card" style={{ marginTop: "10px" }}>
            <div className="card-label">Contact & pricing</div>
            <div className="field-row">
              <div className="field">
                <label>Phone</label>
                <input type="tel" value={form.phone} onChange={e => update("phone", e.target.value)} placeholder="+91 98765 43210" />
              </div>
              <div className="field">
                <label>WhatsApp</label>
                <input type="tel" value={form.whatsapp} onChange={e => update("whatsapp", e.target.value)} placeholder="+91 98765 43210" />
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label>Instagram</label>
                <input type="text" value={form.instagram} onChange={e => update("instagram", e.target.value)} placeholder="@yourbusiness" />
              </div>
              <div className="field">
                <label>Website</label>
                <input type="url" value={form.website} onChange={e => update("website", e.target.value)} placeholder="https://..." />
              </div>
            </div>
            <div className="field">
              <label>Price range</label>
              <div className="pill-group">
                {PRICE_RANGES.map(p => (
                  <span key={p} className={`pill ${form.price_range === p ? "selected" : ""}`} onClick={() => update("price_range", p)}>{p}</span>
                ))}
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label>Min budget (Rs)</label>
                <input type="number" value={form.min_budget} onChange={e => update("min_budget", e.target.value)} placeholder="500" />
              </div>
              <div className="field">
                <label>Max budget (Rs)</label>
                <input type="number" value={form.max_budget} onChange={e => update("max_budget", e.target.value)} placeholder="50000" />
              </div>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving || !form.name || !form.category || !form.city}
            className="btn-generate"
            style={{ marginTop: "12px", width: "100%", padding: "13px" }}
          >
            {saving ? "Saving..." : saved ? "Saved!" : listing ? "Save changes" : "Submit listing"}
          </button>

          {listing?.status === "pending" && (
            <p style={{ fontSize: "12px", color: "#999", textAlign: "center", marginTop: "12px" }}>
              Your listing is under review. We'll notify you once approved.
            </p>
          )}
        </div>
      )}

      {/* INQUIRIES TAB */}
      {tab === "inquiries" && (
        <div>
          {inquiries.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "#999" }}>
              <div style={{ fontSize: "32px", marginBottom: "1rem" }}>📬</div>
              <p style={{ fontSize: "14px" }}>No inquiries yet.</p>
              <p style={{ fontSize: "13px", marginTop: "6px", color: "#bbb" }}>
                Once your listing is approved and users find you, inquiries will appear here.
              </p>
            </div>
          ) : (
            inquiries.map((inq, i) => (
              <div key={i} style={{ background: "#fff", border: "0.5px solid #eee", borderRadius: "10px", padding: "1rem", marginBottom: "8px" }}>
                <div style={{ fontSize: "14px", fontWeight: "500" }}>{inq.name}</div>
                <div style={{ fontSize: "12px", color: "#888", marginTop: "4px" }}>{inq.message}</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}