import { useState } from "react";

const ENERGY_LEVELS = [
  { id: "low", label: "🌙 Low key", desc: "I prefer quiet places and small groups" },
  { id: "medium", label: "⚡ Moderate", desc: "I'm comfortable in small, structured activities" },
  { id: "high", label: "🔥 Social butterfly", desc: "I'm fine with bigger groups but love meaning" },
];

const INTRO_STYLES = [
  { id: "one_on_one", label: "One-on-one", desc: "Deep conversations > group dynamics" },
  { id: "small_group", label: "Small group (3–4)", desc: "I like groups with a purpose" },
  { id: "either", label: "Either works", desc: "Depends on my mood honestly" },
];

const ALL_INTERESTS = [
  "Board games", "Indie music", "Coffee", "Reading", "Hiking", "Art",
  "Cooking", "Astronomy", "Cinema", "Photography", "Yoga", "Plants",
  "Tech", "Design", "Writing", "History", "Travel", "Podcasts",
  "Anime", "Cats", "Philosophy", "Sustainability", "Startups", "Food",
];

const CITIES = ["Bangalore", "Pune", "Hyderabad", "Mumbai", "Delhi", "Chennai"];

export default function SocialProfileForm({ onComplete, onBack, user }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: user?.user_metadata?.full_name || "",
    city: "Bangalore",
    energy_level: "",
    intro_style: "",
    interests: [],
    perfect_saturday: "",
    bail_reason: "",
    phone: "",
  });

  const toggleInterest = (item) => {
    setForm(f => ({
      ...f,
      interests: f.interests.includes(item)
        ? f.interests.filter(i => i !== item)
        : [...f.interests, item],
    }));
  };

  const handleSubmit = async () => {
    if (!user) { setError("Please sign in first."); return; }
    setLoading(true);
    setError("");
    try {
      const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${API}/api/social/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, user_id: user.id, email: user.email }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      onComplete(data);
    } catch (e) {
      setError(e.message || "Something went wrong. Try again.");
    }
    setLoading(false);
  };

  const canNext = {
    1: form.name && form.city && form.energy_level && form.intro_style,
    2: form.interests.length >= 3,
    3: form.perfect_saturday.trim().length > 10,
    4: true,
  };

  const stepTitles = ["The basics", "Your vibe", "In your words", "Almost there"];

  return (
    <div style={{ minHeight: "100vh", background: "#080808", fontFamily: "'Inter', sans-serif", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>

      {/* BG orb */}

      <div style={{ width: "100%", maxWidth: "560px", position: "relative", zIndex: 1 }}>

        {/* Back */}
        <button onClick={onBack} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", fontSize: "13px", cursor: "pointer", fontFamily: "'Inter', sans-serif", padding: 0, marginBottom: "36px", display: "flex", alignItems: "center", gap: "6px", transition: "color 0.2s" }}
          onMouseEnter={e => e.target.style.color = "rgba(255,255,255,0.7)"}
          onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.3)"}
        >← Back</button>

        {/* Header */}
        <div style={{ marginBottom: "40px" }}>
          <div style={{ fontSize: "10px", letterSpacing: "0.25em", color: "#FFFFFF", textTransform: "uppercase", marginBottom: "12px" }}>Step {step} of 4 — {stepTitles[step - 1]}</div>
          {/* Progress bar */}
          <div style={{ height: "2px", background: "rgba(255,255,255,0.07)", borderRadius: "99px", marginBottom: "24px" }}>
            <div style={{ height: "100%", width: `${(step / 4) * 100}%`, background: "linear-gradient(90deg, #FFFFFF, #22d68a)", borderRadius: "99px", transition: "width 0.5s ease" }} />
          </div>
          <h1 style={{ fontFamily: "'Outfit', serif", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: "300", lineHeight: "1.2", marginBottom: "8px" }}>
            {[
              <>Build your <span style={{ color: "#FFFFFF", fontStyle: "italic" }}>vibe profile</span></>,
              <>What gets you <span style={{ color: "#FFFFFF", fontStyle: "italic" }}>excited?</span></>,
              <>Tell us about <span style={{ color: "#FFFFFF", fontStyle: "italic" }}>you</span></>,
              <>Last step — <span style={{ color: "#FFFFFF", fontStyle: "italic" }}>trust & safety</span></>,
            ][step - 1]}
          </h1>
        </div>

        {/* STEP 1 — Basics */}
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>Your name</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="What should people call you?" style={inputStyle} onFocus={e => e.target.style.borderColor = "rgba(255,255,255,0.5)"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>City</label>
              <select value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} style={{ ...inputStyle, cursor: "pointer" }}>
                {CITIES.map(c => <option key={c} value={c} style={{ background: "#13131f" }}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>Energy level</label>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {ENERGY_LEVELS.map(e => (
                  <div key={e.id} onClick={() => setForm({ ...form, energy_level: e.id })} style={{ padding: "14px 16px", border: `1px solid ${form.energy_level === e.id ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.08)"}`, background: form.energy_level === e.id ? "rgba(255,255,255,0.06)" : "transparent", cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: "500", color: form.energy_level === e.id ? "#FFFFFF" : "rgba(255,255,255,0.8)", marginBottom: "3px" }}>{e.label}</div>
                      <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>{e.desc}</div>
                    </div>
                    <div style={{ width: "18px", height: "18px", borderRadius: "50%", border: `2px solid ${form.energy_level === e.id ? "#FFFFFF" : "rgba(255,255,255,0.2)"}`, background: form.energy_level === e.id ? "#FFFFFF" : "transparent", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {form.energy_level === e.id && <span style={{ background: "#080808", width: "6px", height: "6px", borderRadius: "50%" }} />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>Intro style</label>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {INTRO_STYLES.map(s => (
                  <div key={s.id} onClick={() => setForm({ ...form, intro_style: s.id })} style={{ padding: "14px 16px", border: `1px solid ${form.intro_style === s.id ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.08)"}`, background: form.intro_style === s.id ? "rgba(255,255,255,0.06)" : "transparent", cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: "500", color: form.intro_style === s.id ? "#FFFFFF" : "rgba(255,255,255,0.8)", marginBottom: "3px" }}>{s.label}</div>
                      <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>{s.desc}</div>
                    </div>
                    <div style={{ width: "18px", height: "18px", borderRadius: "50%", border: `2px solid ${form.intro_style === s.id ? "#FFFFFF" : "rgba(255,255,255,0.2)"}`, background: form.intro_style === s.id ? "#FFFFFF" : "transparent", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {form.intro_style === s.id && <span style={{ background: "#080808", width: "6px", height: "6px", borderRadius: "50%" }} />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 — Interests */}
        {step === 2 && (
          <div>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.35)", marginBottom: "24px", lineHeight: 1.7 }}>
              Pick at least 3. The more you pick, the better we can match you. (Current: <span style={{ color: "#FFFFFF" }}>{form.interests.length} selected</span>)
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {ALL_INTERESTS.map(item => {
                const selected = form.interests.includes(item);
                return (
                  <div key={item} onClick={() => toggleInterest(item)} style={{ padding: "9px 18px", border: `1px solid ${selected ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.1)"}`, background: selected ? "rgba(255,255,255,0.08)" : "transparent", color: selected ? "#FFFFFF" : "rgba(255,255,255,0.5)", fontSize: "13px", fontWeight: selected ? "600" : "400", borderRadius: "40px", cursor: "pointer", transition: "all 0.2s", userSelect: "none" }}>
                    {item}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3 — Open questions */}
        {step === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>What's your idea of a perfect Saturday?</label>
              <textarea value={form.perfect_saturday} onChange={e => setForm({ ...form, perfect_saturday: e.target.value })} placeholder="Be specific — 'watching documentaries with chai and my cat' is better than 'relaxing'" rows={4} style={{ ...inputStyle, resize: "vertical", lineHeight: "1.65" }} onFocus={e => e.target.style.borderColor = "rgba(255,255,255,0.5)"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>What would make you cancel plans?</label>
              <textarea value={form.bail_reason} onChange={e => setForm({ ...form, bail_reason: e.target.value })} placeholder="Honest answer — we use this to match you with people who understand (e.g. 'if it's too loud or crowded')" rows={3} style={{ ...inputStyle, resize: "vertical", lineHeight: "1.65" }} onFocus={e => e.target.style.borderColor = "rgba(255,255,255,0.5)"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
            </div>
          </div>
        )}

        {/* STEP 4 — Trust & Safety */}
        {step === 4 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={{ padding: "20px", border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.04)" }}>
              <div style={{ fontSize: "13px", fontWeight: "600", color: "#FFFFFF", marginBottom: "8px" }}>🛡️ Safety first</div>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: "1.75" }}>
                All profiles are reviewed before you can join events. Your phone number is never shared with other users — it's only used for event day coordination.
              </p>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>Phone number (optional but recommended)</label>
              <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" style={inputStyle} onFocus={e => e.target.style.borderColor = "rgba(255,255,255,0.5)"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)", marginTop: "6px" }}>Used only for event day coordination. Never shared.</p>
            </div>
            <div style={{ padding: "20px", border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}>
              <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: "1.75" }}>
                By creating a profile, you agree to our community guidelines:<br />
                <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px" }}>✓ Be kind. ✓ Show up if you commit. ✓ Respect everyone's comfort zone.</span>
              </div>
            </div>
            {error && <div style={{ fontSize: "13px", color: "#ff6b6b", padding: "10px 14px", background: "rgba(255,107,107,0.08)", border: "1px solid rgba(255,107,107,0.2)" }}>{error}</div>}
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: "flex", justifyContent: step > 1 ? "space-between" : "flex-end", marginTop: "36px", gap: "12px" }}>
          {step > 1 && (
            <button onClick={() => setStep(s => s - 1)} style={{ padding: "13px 24px", background: "none", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.45)", fontSize: "13px", cursor: "pointer", fontFamily: "'Inter', sans-serif", transition: "all 0.2s" }}
              onMouseEnter={e => { e.target.style.borderColor = "rgba(255,255,255,0.3)"; e.target.style.color = "#fff"; }}
              onMouseLeave={e => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.color = "rgba(255,255,255,0.45)"; }}
            >← Back</button>
          )}
          <button
            disabled={!canNext[step] || loading}
            onClick={step < 4 ? () => setStep(s => s + 1) : handleSubmit}
            style={{ padding: "14px 36px", background: canNext[step] ? "#FFFFFF" : "rgba(255,255,255,0.2)", border: "none", color: canNext[step] ? "#080808" : "rgba(255,255,255,0.4)", fontSize: "13px", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'Inter', sans-serif", fontWeight: "700", cursor: canNext[step] ? "pointer" : "not-allowed", transition: "all 0.25s", flex: step === 1 ? 1 : "auto" }}
            onMouseEnter={e => { if (canNext[step]) { e.target.style.background = "#22d68a"; e.target.style.transform = "translateY(-2px)"; } }}
            onMouseLeave={e => { if (canNext[step]) { e.target.style.background = "#FFFFFF"; e.target.style.transform = "translateY(0)"; } }}
          >
            {loading ? "Saving..." : step < 4 ? "Continue →" : "Find my people 🌿"}
          </button>
        </div>

        {step === 2 && form.interests.length < 3 && (
          <p style={{ textAlign: "center", fontSize: "12px", color: "rgba(255,255,255,0.2)", marginTop: "12px" }}>Pick at least {3 - form.interests.length} more to continue</p>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        @keyframes orb1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(40px,-40px) scale(1.1)} }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "13px 16px",
  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
  color: "#fff", fontFamily: "'Inter', sans-serif", fontSize: "14px",
  outline: "none", transition: "border-color 0.2s",
  boxSizing: "border-box", borderRadius: "2px",
};
