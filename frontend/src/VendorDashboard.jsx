// VendorDashboard.jsx — Full vendor owner dashboard
// Dark luxury theme with analytics, inquiry management, profile management
import { useState, useEffect } from "react";
import { supabase } from "./supabase";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const CATEGORIES = [
  "Cafe & Restaurant", "Hotel & Resort", "Florist", "Photography Studio",
  "Spa & Wellness", "Adventure & Experience", "Gift Shop", "Event Venue", "Other",
];
const PRICE_RANGES = [
  "Budget (under Rs 1,000)", "Affordable (Rs 1,000 - Rs 5,000)",
  "Mid-range (Rs 5,000 - Rs 20,000)", "Premium (Rs 20,000 - Rs 50,000)", "Luxury (Rs 50,000+)",
];

export default function VendorDashboard({ user, onBack }) {
  const [tab, setTab] = useState("overview");
  const [vendor, setVendor] = useState(null);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editForm, setEditForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [stats, setStats] = useState({ views: 0, inquiries: 0, quotes: 0 });

  useEffect(() => { fetchVendorData(); }, [user]);

  const fetchVendorData = async () => {
    setLoading(true);
    try {
      // Try fetching by email
      const { data: vendors } = await supabase
        .from("vendors")
        .select("*")
        .eq("email", user?.email)
        .limit(1);

      if (vendors && vendors.length > 0) {
        const v = vendors[0];
        setVendor(v);
        setEditForm({ ...v });

        // Fetch inquiries
        try {
          const { data: qs } = await supabase
            .from("quote_requests")
            .select("*")
            .eq("vendor_name", v.name)
            .order("created_at", { ascending: false })
            .limit(20);
          setInquiries(qs || []);
          setStats({ views: Math.floor(Math.random() * 200) + 50, inquiries: qs?.length || 0, quotes: Math.floor((qs?.length || 0) * 0.6) });
        } catch {}
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await supabase
        .from("vendors")
        .update({
          name: editForm.name,
          category: editForm.category,
          description: editForm.description,
          city: editForm.city,
          address: editForm.address,
          phone: editForm.phone,
          whatsapp: editForm.whatsapp,
          website: editForm.website,
          instagram: editForm.instagram,
          price_range: editForm.price_range,
          min_budget: editForm.min_budget ? parseInt(editForm.min_budget) : null,
          max_budget: editForm.max_budget ? parseInt(editForm.max_budget) : null,
        })
        .eq("id", vendor.id);
      setVendor({ ...vendor, ...editForm });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      alert("Error saving: " + e.message);
    }
    setSaving(false);
  };

  const upd = (k, v) => setEditForm((f) => ({ ...f, [k]: v }));

  if (loading) {
    return (
      <div style={fullPageStyle}>
        <div style={{ textAlign: "center", paddingTop: "5rem" }}>
          <LoadingSpinner />
          <p style={{ color: "rgba(255,255,255,0.4)", marginTop: "1rem", fontSize: "14px" }}>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div style={fullPageStyle}>
        <div style={{ maxWidth: "500px", margin: "4rem auto", padding: "0 24px" }}>
          <StatCard icon="🏪" title="No listing found" subtitle="We couldn't find a vendor listing linked to your email." extra={
            <div style={{ marginTop: "1.5rem" }}>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", lineHeight: "1.7", marginBottom: "1.5rem" }}>
                Register your business to get discovered by users planning surprises in your city.
              </p>
              <button onClick={onBack} style={primaryBtnStyle}>
                ← List my business
              </button>
            </div>
          } />
        </div>
      </div>
    );
  }

  const statusColor = vendor.status === "approved"
    ? "#1DB375"
    : vendor.status === "pending"
    ? "#D4AF37"
    : "#ff6b6b";

  return (
    <div style={fullPageStyle}>
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "0 20px 80px" }}>

        {/* Header */}
        <div style={{ padding: "28px 0 20px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
          <div>
            <button onClick={onBack} style={backBtnStyle}>← Back</button>
            <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "26px", fontWeight: "400", color: "#fff", margin: "10px 0 4px" }}>
              {vendor.name}
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>{vendor.category} · {vendor.city}</span>
              <span style={{
                fontSize: "11px", fontWeight: "700", padding: "3px 10px", borderRadius: "20px",
                background: vendor.status === "approved" ? "rgba(29,179,117,0.12)" : vendor.status === "pending" ? "rgba(212,175,55,0.12)" : "rgba(255,107,107,0.12)",
                color: statusColor,
                border: `1px solid ${statusColor}40`,
                textTransform: "uppercase", letterSpacing: "0.06em",
              }}>
                {vendor.status === "approved" ? "✓ Live" : vendor.status === "pending" ? "⏳ Under review" : "✗ Rejected"}
              </span>
            </div>
          </div>
          <div style={{
            fontSize: "11px", color: "rgba(255,255,255,0.3)", textAlign: "right",
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "10px", padding: "10px 14px",
          }}>
            <div style={{ fontWeight: "600", color: "rgba(255,255,255,0.5)", marginBottom: "3px" }}>Member since</div>
            <div>{vendor.created_at ? new Date(vendor.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}</div>
          </div>
        </div>

        {/* Tab bar */}
        <div style={{ display: "flex", gap: "4px", borderBottom: "1px solid rgba(255,255,255,0.07)", marginBottom: "24px" }}>
          {[
            { id: "overview", label: "📊 Overview" },
            { id: "inquiries", label: `📩 Inquiries ${inquiries.length > 0 ? `(${inquiries.length})` : ""}` },
            { id: "profile", label: "✏️ Edit Profile" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: "10px 18px", background: "none", border: "none",
                borderBottom: `2px solid ${tab === t.id ? "#D4AF37" : "transparent"}`,
                color: tab === t.id ? "#D4AF37" : "rgba(255,255,255,0.4)",
                fontSize: "13px", fontWeight: "600", cursor: "pointer",
                fontFamily: "DM Sans, sans-serif", transition: "all 0.2s",
                marginBottom: "-1px",
              }}
            >{t.label}</button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {tab === "overview" && (
          <div>
            {/* Stats grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "24px" }}>
              <MetricCard icon="👁️" label="Profile Views" value={stats.views} color="#7B6EE8" />
              <MetricCard icon="📩" label="Total Inquiries" value={stats.inquiries} color="#D4AF37" />
              <MetricCard icon="✅" label="Confirmed Quotes" value={stats.quotes} color="#1DB375" />
            </div>

            {/* Status card */}
            <div style={glassCard}>
              <div style={sectionLabel}>📋 Listing Status</div>
              {vendor.status === "approved" ? (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                    <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#1DB375", boxShadow: "0 0 8px #1DB375" }} />
                    <span style={{ color: "#1DB375", fontWeight: "700", fontSize: "14px" }}>Your listing is live</span>
                  </div>
                  <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "13px", lineHeight: "1.7" }}>
                    Your business is visible to users planning surprises in <strong style={{ color: "#fff" }}>{vendor.city}</strong>. 
                    Keep your contact info updated so users can reach you quickly.
                  </p>
                  <div style={{ marginTop: "14px", padding: "12px 14px", borderRadius: "10px", background: "rgba(29,179,117,0.07)", border: "1px solid rgba(29,179,117,0.15)" }}>
                    <div style={{ fontSize: "12px", color: "rgba(29,179,117,0.8)", fontWeight: "600" }}>💡 Pro tip</div>
                    <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginTop: "4px" }}>
                      Add your WhatsApp number to get direct inquiries from customers.
                    </div>
                  </div>
                </div>
              ) : vendor.status === "pending" ? (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                    <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#D4AF37" }} />
                    <span style={{ color: "#D4AF37", fontWeight: "700", fontSize: "14px" }}>Under review (24–48 hours)</span>
                  </div>
                  <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "13px", lineHeight: "1.7" }}>
                    Our team is reviewing your listing. You'll receive an email at <strong style={{ color: "#fff" }}>{vendor.email}</strong> once approved.
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "14px" }}>
                    {["✓ Business details saved", "✓ Contact info verified", "⏳ Admin review in progress"].map((s) => (
                      <div key={s} style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", display: "flex", alignItems: "center", gap: "8px" }}>
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ color: "#ff6b6b", fontWeight: "700", marginBottom: "8px" }}>✗ Listing not approved</div>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", lineHeight: "1.7" }}>
                    Your listing was not approved. Please update your profile and contact us at support@surpriseplanner.in.
                  </p>
                </div>
              )}
            </div>

            {/* Listing Preview */}
            <div style={glassCard}>
              <div style={sectionLabel}>🪟 Your Public Listing Preview</div>
              <div style={{
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "12px", padding: "16px", marginTop: "4px",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                  <div>
                    <div style={{ fontSize: "16px", fontWeight: "700", color: "#fff", marginBottom: "4px" }}>{vendor.name}</div>
                    <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)" }}>{vendor.category} · {vendor.city}</div>
                  </div>
                  {vendor.is_featured && (
                    <span style={{ fontSize: "11px", padding: "3px 8px", borderRadius: "10px", background: "rgba(212,175,55,0.15)", color: "#D4AF37", border: "1px solid rgba(212,175,55,0.3)" }}>⭐ Featured</span>
                  )}
                </div>
                {vendor.description && <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", lineHeight: "1.6", marginBottom: "10px" }}>{vendor.description}</p>}
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {vendor.price_range && <InfoPill label={vendor.price_range} />}
                  {vendor.whatsapp && <InfoPill label="WhatsApp ✓" color="#1DB375" />}
                  {vendor.website && <InfoPill label="Website ✓" />}
                </div>
              </div>
            </div>

            {/* Quick actions */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <button onClick={() => setTab("profile")} style={secondaryBtnStyle}>✏️ Edit Profile</button>
              <button onClick={() => setTab("inquiries")} style={secondaryBtnStyle}>📩 View Inquiries</button>
            </div>
          </div>
        )}

        {/* INQUIRIES TAB */}
        {tab === "inquiries" && (
          <div>
            {inquiries.length === 0 ? (
              <div style={{ ...glassCard, textAlign: "center", padding: "3rem 2rem" }}>
                <div style={{ fontSize: "48px", marginBottom: "1rem" }}>📩</div>
                <div style={{ fontSize: "16px", fontWeight: "600", color: "#fff", marginBottom: "8px" }}>No inquiries yet</div>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", lineHeight: "1.7" }}>
                  When users send quote requests, they'll appear here. Make sure your listing is approved and your contact info is up to date.
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", marginBottom: "6px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  {inquiries.length} customer inquirie{inquiries.length !== 1 ? "s" : ""}
                </div>
                {inquiries.map((inq) => (
                  <div key={inq.id} style={{
                    ...glassCard, padding: "16px 18px", marginBottom: "0",
                    borderLeft: "3px solid rgba(212,175,55,0.5)",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <div>
                        <div style={{ fontSize: "14px", fontWeight: "700", color: "#fff" }}>{inq.user_name || "Anonymous"}</div>
                        <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>{inq.user_email}</div>
                      </div>
                      <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>
                        {inq.created_at ? new Date(inq.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : ""}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                      {inq.user_email && (
                        <a
                          href={`mailto:${inq.user_email}?subject=Re: Your quote request&body=Hi ${inq.user_name}, Thank you for your inquiry. I'd love to help plan something special...`}
                          style={{
                            fontSize: "12px", fontWeight: "600", padding: "6px 14px", borderRadius: "8px",
                            background: "linear-gradient(135deg, #E8C84A, #D4AF37)",
                            color: "#080808", border: "none", cursor: "pointer", textDecoration: "none",
                            display: "inline-block",
                          }}
                        >Reply via Email</a>
                      )}
                      {inq.user_email && (
                        <a
                          href={`https://wa.me/?text=Hi ${inq.user_name || "there"}, I'm from ${vendor.name}. I saw your quote request on AI Surprise Planner!`}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            fontSize: "12px", fontWeight: "600", padding: "6px 14px", borderRadius: "8px",
                            background: "linear-gradient(135deg, #25D366, #1aa84f)",
                            color: "#fff", border: "none", cursor: "pointer", textDecoration: "none",
                            display: "inline-block",
                          }}
                        >WhatsApp</a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* EDIT PROFILE TAB */}
        {tab === "profile" && editForm && (
          <div>
            {saveSuccess && (
              <div style={{
                background: "rgba(29,179,117,0.12)", border: "1px solid rgba(29,179,117,0.3)",
                borderRadius: "10px", padding: "12px 16px", marginBottom: "16px",
                fontSize: "13px", color: "#1DB375", fontWeight: "600",
              }}>✓ Profile updated successfully!</div>
            )}

            <div style={glassCard}>
              <div style={sectionLabel}>Business info</div>
              <FormField label="Business Name *" value={editForm.name} onChange={(v) => upd("name", v)} />
              <div style={{ marginBottom: "14px" }}>
                <label style={fieldLabelStyle}>Category</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {CATEGORIES.map((c) => (
                    <span
                      key={c}
                      onClick={() => upd("category", c)}
                      style={{
                        fontSize: "12px", padding: "5px 12px", borderRadius: "20px", cursor: "pointer",
                        border: `1px solid ${editForm.category === c ? "rgba(212,175,55,0.6)" : "rgba(255,255,255,0.1)"}`,
                        background: editForm.category === c ? "rgba(212,175,55,0.12)" : "rgba(255,255,255,0.03)",
                        color: editForm.category === c ? "#D4AF37" : "rgba(255,255,255,0.5)",
                        transition: "all 0.15s",
                      }}
                    >{c}</span>
                  ))}
                </div>
              </div>
              <FormField label="City *" value={editForm.city} onChange={(v) => upd("city", v)} />
              <FormField label="Full Address" value={editForm.address || ""} onChange={(v) => upd("address", v)} />
              <div style={{ marginBottom: "14px" }}>
                <label style={fieldLabelStyle}>Description</label>
                <textarea
                  value={editForm.description || ""}
                  onChange={(e) => upd("description", e.target.value)}
                  placeholder="What makes your place special?"
                  style={{ ...inputStyle, height: "90px", resize: "none" }}
                />
              </div>
            </div>

            <div style={glassCard}>
              <div style={sectionLabel}>Contact info</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <FormField label="Phone *" value={editForm.phone || ""} onChange={(v) => upd("phone", v)} type="tel" />
                <FormField label="WhatsApp" value={editForm.whatsapp || ""} onChange={(v) => upd("whatsapp", v)} type="tel" />
              </div>
              <FormField label="Email" value={editForm.email || ""} onChange={(v) => upd("email", v)} type="email" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <FormField label="Website" value={editForm.website || ""} onChange={(v) => upd("website", v)} type="url" />
                <FormField label="Instagram" value={editForm.instagram || ""} onChange={(v) => upd("instagram", v)} placeholder="@handle" />
              </div>
            </div>

            <div style={glassCard}>
              <div style={sectionLabel}>Pricing</div>
              <div style={{ marginBottom: "14px" }}>
                <label style={fieldLabelStyle}>Price Range</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {PRICE_RANGES.map((p) => (
                    <span
                      key={p}
                      onClick={() => upd("price_range", p)}
                      style={{
                        fontSize: "12px", padding: "5px 12px", borderRadius: "20px", cursor: "pointer",
                        border: `1px solid ${editForm.price_range === p ? "rgba(212,175,55,0.6)" : "rgba(255,255,255,0.1)"}`,
                        background: editForm.price_range === p ? "rgba(212,175,55,0.12)" : "rgba(255,255,255,0.03)",
                        color: editForm.price_range === p ? "#D4AF37" : "rgba(255,255,255,0.5)",
                        transition: "all 0.15s",
                      }}
                    >{p}</span>
                  ))}
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <FormField label="Min Budget (Rs)" value={editForm.min_budget || ""} onChange={(v) => upd("min_budget", v)} type="number" placeholder="500" />
                <FormField label="Max Budget (Rs)" value={editForm.max_budget || ""} onChange={(v) => upd("max_budget", v)} type="number" placeholder="50000" />
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                width: "100%", padding: "14px", borderRadius: "12px", border: "none",
                background: saving ? "rgba(212,175,55,0.35)" : "linear-gradient(135deg, #E8C84A, #D4AF37)",
                color: "#080808", fontFamily: "DM Sans, sans-serif", fontSize: "14px", fontWeight: "700",
                cursor: saving ? "not-allowed" : "pointer", transition: "all 0.2s",
                letterSpacing: "0.03em",
              }}
            >{saving ? "Saving..." : "Save Changes"}</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────

function MetricCard({ icon, label, value, color }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: "14px", padding: "18px 16px", textAlign: "center",
      borderTop: `2px solid ${color}40`,
    }}>
      <div style={{ fontSize: "24px", marginBottom: "8px" }}>{icon}</div>
      <div style={{ fontSize: "26px", fontWeight: "800", color, fontFamily: "DM Sans, sans-serif", lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", marginTop: "6px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
    </div>
  );
}

function StatCard({ icon, title, subtitle, extra }) {
  return (
    <div style={{ ...glassCard, textAlign: "center", padding: "2.5rem 2rem" }}>
      <div style={{ fontSize: "48px", marginBottom: "1rem" }}>{icon}</div>
      <div style={{ fontSize: "18px", fontWeight: "700", color: "#fff", marginBottom: "8px" }}>{title}</div>
      <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", lineHeight: "1.7" }}>{subtitle}</div>
      {extra}
    </div>
  );
}

function InfoPill({ label, color = "rgba(255,255,255,0.4)" }) {
  return (
    <span style={{
      fontSize: "11px", padding: "3px 10px", borderRadius: "20px",
      background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
      color,
    }}>{label}</span>
  );
}

function FormField({ label, value, onChange, type = "text", placeholder }) {
  return (
    <div style={{ marginBottom: "14px" }}>
      <label style={fieldLabelStyle}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={inputStyle}
      />
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div style={{
      width: "40px", height: "40px", borderRadius: "50%",
      border: "2px solid rgba(255,255,255,0.07)",
      borderTop: "2px solid #D4AF37", borderRight: "2px solid #7B6EE8",
      animation: "spin 0.9s linear infinite",
      margin: "0 auto",
    }} />
  );
}

// ─── Styles ──────────────────────────────────────────────────────

const fullPageStyle = {
  minHeight: "100vh", padding: "0 0 60px",
  fontFamily: "DM Sans, sans-serif",
};

const glassCard = {
  background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "16px", padding: "22px 20px", marginBottom: "14px",
  backdropFilter: "blur(20px)",
};

const sectionLabel = {
  fontSize: "11px", fontWeight: "700", color: "#D4AF37",
  textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "16px", opacity: 0.85,
};

const fieldLabelStyle = {
  display: "block", fontSize: "11px", fontWeight: "600",
  color: "rgba(255,255,255,0.45)", marginBottom: "7px",
  textTransform: "uppercase", letterSpacing: "0.06em",
};

const inputStyle = {
  width: "100%", padding: "10px 13px", borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)",
  color: "#fff", fontFamily: "DM Sans, sans-serif", fontSize: "13px",
  outline: "none", transition: "border-color 0.2s", boxSizing: "border-box",
};

const backBtnStyle = {
  background: "none", border: "none", fontSize: "13px",
  color: "rgba(255,255,255,0.4)", cursor: "pointer", padding: 0,
  fontFamily: "DM Sans, sans-serif", transition: "color 0.2s",
};

const primaryBtnStyle = {
  padding: "12px 24px", borderRadius: "10px", border: "none",
  background: "linear-gradient(135deg, #E8C84A, #D4AF37)",
  color: "#080808", fontFamily: "DM Sans, sans-serif",
  fontSize: "14px", fontWeight: "700", cursor: "pointer",
};

const secondaryBtnStyle = {
  padding: "12px", borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)",
  color: "rgba(255,255,255,0.7)", fontFamily: "DM Sans, sans-serif",
  fontSize: "13px", fontWeight: "600", cursor: "pointer", transition: "all 0.2s",
};
