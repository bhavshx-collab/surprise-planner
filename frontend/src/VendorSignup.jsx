// VendorSignup.jsx
// Place in frontend/src/VendorSignup.jsx
// Route: /list-your-business

import { useState } from "react";
import { supabase } from "./supabase";

const CATEGORIES = [
  "Cafe & Restaurant",
  "Hotel & Resort",
  "Florist",
  "Photography Studio",
  "Spa & Wellness",
  "Adventure & Experience",
  "Gift Shop",
  "Event Venue",
  "Other",
];

const PRICE_RANGES = [
  "Budget (under Rs 1,000)",
  "Affordable (Rs 1,000 - Rs 5,000)",
  "Mid-range (Rs 5,000 - Rs 20,000)",
  "Premium (Rs 20,000 - Rs 50,000)",
  "Luxury (Rs 50,000+)",
];

export default function VendorSignup({ onBack }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    city: "",
    address: "",
    phone: "",
    whatsapp: "",
    email: "",
    website: "",
    instagram: "",
    price_range: "",
    min_budget: "",
    max_budget: "",
    tags: [],
  });

  const update = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.from("vendors").insert({
        ...form,
        min_budget: form.min_budget ? parseInt(form.min_budget) : null,
        max_budget: form.max_budget ? parseInt(form.max_budget) : null,
        status: "pending",
      });
      if (error) throw error;
      setSubmitted(true);
    } catch (e) {
      alert("Something went wrong: " + e.message);
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="auth-page">
        <div className="auth-card" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "1rem" }}>🎉</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", marginBottom: "0.75rem" }}>
            Application submitted!
          </h2>
          <p style={{ fontSize: "14px", color: "#666", lineHeight: "1.7", marginBottom: "1.5rem" }}>
            We'll review your listing and get back to you within 24 hours at <strong>{form.email}</strong>.
          </p>
          <button className="auth-primary-btn" onClick={onBack}>
            Back to app
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "1.5rem 1rem 4rem" }}>

      {/* Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <button
          onClick={onBack}
          style={{ background: "none", border: "none", fontSize: "13px", color: "#999", cursor: "pointer", marginBottom: "1rem", padding: 0 }}
        >
          ← Back
        </button>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "26px", fontWeight: "500", marginBottom: "0.5rem" }}>
          List your business
        </h1>
        <p style={{ fontSize: "14px", color: "#666" }}>
          Get discovered by people planning surprises in your city.
        </p>
      </div>

      {/* Progress */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "1.5rem" }}>
        {[1, 2, 3].map(s => (
          <div key={s} style={{
            flex: 1, height: "4px", borderRadius: "2px",
            background: step >= s ? "#534AB7" : "#eee",
            transition: "background 0.3s"
          }} />
        ))}
      </div>

      {/* Step 1 — Business basics */}
      {step === 1 && (
        <div className="card">
          <div className="card-label">Step 1 of 3 — Business details</div>

          <div className="field">
            <label>Business name *</label>
            <input
              type="text"
              placeholder="e.g. The Cozy Corner Cafe"
              value={form.name}
              onChange={e => update("name", e.target.value)}
            />
          </div>

          <div className="field">
            <label>Category *</label>
            <div className="pill-group">
              {CATEGORIES.map(c => (
                <span
                  key={c}
                  className={`pill ${form.category === c ? "selected" : ""}`}
                  onClick={() => update("category", c)}
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div className="field">
            <label>City *</label>
            <input
              type="text"
              placeholder="Mumbai, Delhi, Bangalore..."
              value={form.city}
              onChange={e => update("city", e.target.value)}
            />
          </div>

          <div className="field">
            <label>Full address</label>
            <input
              type="text"
              placeholder="Street, area, landmark"
              value={form.address}
              onChange={e => update("address", e.target.value)}
            />
          </div>

          <div className="field">
            <label>Tell customers about your business</label>
            <textarea
              placeholder="What makes your place special? What experiences do you offer for couples, celebrations, surprises?"
              value={form.description}
              onChange={e => update("description", e.target.value)}
              style={{ height: "100px" }}
            />
          </div>

          <div className="nav-row">
            <button
              className="btn-next"
              onClick={() => setStep(2)}
              disabled={!form.name || !form.category || !form.city}
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Step 2 — Contact & pricing */}
      {step === 2 && (
        <div className="card">
          <div className="card-label">Step 2 of 3 — Contact & pricing</div>

          <div className="field-row">
            <div className="field">
              <label>Phone number *</label>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={e => update("phone", e.target.value)}
              />
            </div>
            <div className="field">
              <label>WhatsApp number</label>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={form.whatsapp}
                onChange={e => update("whatsapp", e.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label>Email *</label>
            <input
              type="email"
              placeholder="hello@yourbusiness.com"
              value={form.email}
              onChange={e => update("email", e.target.value)}
            />
          </div>

          <div className="field-row">
            <div className="field">
              <label>Website</label>
              <input
                type="url"
                placeholder="https://..."
                value={form.website}
                onChange={e => update("website", e.target.value)}
              />
            </div>
            <div className="field">
              <label>Instagram</label>
              <input
                type="text"
                placeholder="@yourbusiness"
                value={form.instagram}
                onChange={e => update("instagram", e.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label>Price range</label>
            <div className="pill-group">
              {PRICE_RANGES.map(p => (
                <span
                  key={p}
                  className={`pill ${form.price_range === p ? "selected" : ""}`}
                  onClick={() => update("price_range", p)}
                >
                  {p}
                </span>
              ))}
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label>Min. budget (Rs)</label>
              <input
                type="number"
                placeholder="500"
                value={form.min_budget}
                onChange={e => update("min_budget", e.target.value)}
              />
            </div>
            <div className="field">
              <label>Max. budget (Rs)</label>
              <input
                type="number"
                placeholder="50000"
                value={form.max_budget}
                onChange={e => update("max_budget", e.target.value)}
              />
            </div>
          </div>

          <div className="nav-row two">
            <button className="btn-back" onClick={() => setStep(1)}>← Back</button>
            <button
              className="btn-next"
              onClick={() => setStep(3)}
              disabled={!form.phone || !form.email}
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Step 3 — Review & submit */}
      {step === 3 && (
        <div className="card">
          <div className="card-label">Step 3 of 3 — Review & submit</div>

          <div style={{ background: "#fafafa", borderRadius: "8px", padding: "1rem", marginBottom: "1rem", fontSize: "13px", lineHeight: "1.8", color: "#444" }}>
            <div><strong>{form.name}</strong></div>
            <div>{form.category} · {form.city}</div>
            <div>{form.email} · {form.phone}</div>
            {form.price_range && <div>{form.price_range}</div>}
            {form.description && <div style={{ marginTop: "8px", color: "#666" }}>{form.description}</div>}
          </div>

          <div style={{ background: "#EEEDFE", borderRadius: "8px", padding: "1rem", marginBottom: "1.25rem", fontSize: "13px", color: "#534AB7", lineHeight: "1.6" }}>
            <strong>What happens next?</strong><br />
            Our team reviews your listing within 24 hours. Once approved, your business appears to users planning surprises in {form.city}. Listing is free for now.
          </div>

          <div className="nav-row two">
            <button className="btn-back" onClick={() => setStep(2)}>← Back</button>
            <button
              className="btn-generate"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit listing"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}