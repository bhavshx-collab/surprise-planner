import { useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ACTIVITY_OPTIONS = [
  { id: "coffee_trail",  emoji: "☕", name: "Coffee Trail",    desc: "Visit indie cafés, great conversations" },
  { id: "board_games",   emoji: "🎲", name: "Board Games",     desc: "Strategy games, zero awkwardness" },
  { id: "art_workshop",  emoji: "🎨", name: "Art Workshop",    desc: "Pottery, watercolour, collage" },
  { id: "nature_walk",   emoji: "🌿", name: "Nature Walk",     desc: "Parks, sunrise, fresh air" },
  { id: "book_swap",     emoji: "📚", name: "Book Swap",       desc: "Bring a book, leave with one" },
  { id: "cook_together", emoji: "🍳", name: "Cook Together",   desc: "One kitchen, four strangers" },
  { id: "custom",        emoji: "✨", name: "Custom Adventure","desc": "Something entirely your own" },
];

const ENERGY_OPTIONS = [
  { id: "low",    label: "🌙 Chill",    desc: "Relaxed, low-key, no pressure" },
  { id: "medium", label: "⚡ Moderate", desc: "A bit of movement or effort" },
  { id: "high",   label: "🔥 Active",   desc: "Physical, energetic, outdoors" },
];

const STEP_LABELS = ["Activity", "Details", "Rules", "Review & Pay"];

const ACT_COLOR = {
  coffee_trail: "#D4AF37", board_games: "#FFFFFF", art_workshop: "#E85D75",
  nature_walk: "#FFFFFF",  book_swap: "#D4AF37",   cook_together: "#E85D75", custom: "#9D93F0",
};

export default function HostAdventure({ user, onBack, onSuccess }) {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [err, setErr] = useState("");

  const [form, setForm] = useState({
    activity_type: "",
    title: "",
    description: "",
    what_to_expect: "",
    what_to_bring: "",
    date: "",
    time: "",
    city: "Bangalore",
    area: "",
    max_members: 4,
    energy: "medium",
    tags: "",
    emoji: "",
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const selectedAct = ACTIVITY_OPTIONS.find(a => a.id === form.activity_type);
  const color = ACT_COLOR[form.activity_type] || "#FFFFFF";

  const canNext1 = !!form.activity_type;
  const canNext2 = form.title.trim() && form.date && form.time && form.area.trim();
  const canNext3 = form.what_to_expect.trim();

  const handleSubmit = async () => {
    if (!user) { setErr("Please sign in to host an adventure."); return; }
    setSubmitting(true);
    setErr("");
    try {
      const payload = {
        ...form,
        tags: form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
        emoji: form.emoji || selectedAct?.emoji || "🌿",
        date_time: `${form.date}T${form.time}:00`,
        host_user_id: user.id,
        host_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Anonymous",
        host_email: user.email,
        deposit_amount: 0,
      };
      const res = await fetch(`${API}/api/adventure/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.error) { setErr(data.error); setSubmitting(false); return; }
      setSubmitted(true);
    } catch {
      setErr("Connection error. Please check your backend is running.");
    }
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", background: "#080808", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif", color: "#fff", padding: "24px" }}>
        <div style={{ textAlign: "center", maxWidth: "480px" }}>
          <div style={{ fontSize: "64px", marginBottom: "24px" }}>🎉</div>
          <div style={{ fontFamily: "'Outfit', serif", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: "300", marginBottom: "16px" }}>
            Adventure <span style={{ color: "#FFFFFF", fontStyle: "italic" }}>Published!</span>
          </div>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.45)", lineHeight: "1.8", marginBottom: "32px" }}>
            Your adventure is now live. People can discover and join it. 🙌
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={onSuccess} style={{ padding: "14px 32px", background: "#FFFFFF", border: "none", color: "#080808", fontSize: "13px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", fontFamily: "DM Sans" }}>
              Browse all adventures →
            </button>
            <button onClick={onBack} style={{ padding: "14px 24px", background: "none", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.6)", fontSize: "13px", cursor: "pointer", fontFamily: "DM Sans" }}>
              Back
            </button>
          </div>
        </div>
        <Style />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#080808", fontFamily: "'Inter', sans-serif", color: "#fff" }}>

      {/* Ambient BG */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: "720px", margin: "0 auto", padding: "clamp(40px,6vh,80px) clamp(20px,5vw,48px) 100px" }}>

        {/* Back */}
        <button onClick={onBack} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", fontSize: "13px", cursor: "pointer", padding: 0, marginBottom: "32px", display: "flex", alignItems: "center", gap: "6px" }}
          onMouseEnter={e => e.target.style.color = "rgba(255,255,255,0.7)"}
          onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.3)"}
        >← Back to Adventures</button>

        {/* Header */}
        <div style={{ marginBottom: "40px" }}>
          <div style={{ fontSize: "10px", letterSpacing: "0.3em", color: color, textTransform: "uppercase", marginBottom: "12px", transition: "color 0.4s" }}>
            Create · Free to host
          </div>
          <h1 style={{ fontFamily: "'Outfit', serif", fontSize: "clamp(32px,4vw,52px)", fontWeight: "300", lineHeight: "1.1", marginBottom: "12px" }}>
            Host an <span style={{ color, fontStyle: "italic", transition: "color 0.4s" }}>Adventure</span>
          </h1>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.3)", lineHeight: "1.8" }}>
            Create a real-world adventure for strangers to join. Pay ₹49 to publish — fully refunded after your event completes.
          </p>
        </div>

        {/* Step Progress */}
        <div style={{ display: "flex", gap: "0", marginBottom: "48px" }}>
          {STEP_LABELS.map((label, i) => {
            const s = i + 1;
            const done = step > s;
            const active = step === s;
            return (
              <div key={label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                  {i > 0 && <div style={{ flex: 1, height: "1px", background: done ? color : "rgba(255,255,255,0.1)", transition: "background 0.3s" }} />}
                  <div style={{
                    width: "28px", height: "28px", borderRadius: "50%", flexShrink: 0,
                    background: done ? color : active ? "transparent" : "transparent",
                    border: `1.5px solid ${done || active ? color : "rgba(255,255,255,0.15)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "11px", fontWeight: "700", color: done ? "#080808" : active ? color : "rgba(255,255,255,0.3)",
                    transition: "all 0.3s",
                  }}>
                    {done ? "✓" : s}
                  </div>
                  {i < STEP_LABELS.length - 1 && <div style={{ flex: 1, height: "1px", background: done ? color : "rgba(255,255,255,0.1)", transition: "background 0.3s" }} />}
                </div>
                <div style={{ fontSize: "10px", color: active ? color : "rgba(255,255,255,0.25)", marginTop: "6px", letterSpacing: "0.05em", transition: "color 0.3s", textAlign: "center" }}>{label}</div>
              </div>
            );
          })}
        </div>

        {/* ── STEP 1: Activity ── */}
        {step === 1 && (
          <div>
            <Label color={color}>What kind of adventure?</Label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px", background: "rgba(255,255,255,0.04)", marginBottom: "32px" }} className="ha-grid">
              {ACTIVITY_OPTIONS.map(act => (
                <div key={act.id}
                  onClick={() => { set("activity_type", act.id); set("emoji", act.emoji); }}
                  style={{
                    padding: "20px", cursor: "pointer", background: form.activity_type === act.id ? `${ACT_COLOR[act.id]}12` : "#080808",
                    border: `1px solid ${form.activity_type === act.id ? ACT_COLOR[act.id] + "60" : "transparent"}`,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={e => { if (form.activity_type !== act.id) e.currentTarget.style.background = "#0d0d0d"; }}
                  onMouseLeave={e => { if (form.activity_type !== act.id) e.currentTarget.style.background = "#080808"; }}
                >
                  <div style={{ fontSize: "28px", marginBottom: "8px" }}>{act.emoji}</div>
                  <div style={{ fontSize: "14px", fontWeight: "600", color: form.activity_type === act.id ? ACT_COLOR[act.id] : "#fff", marginBottom: "4px", transition: "color 0.2s" }}>{act.name}</div>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", lineHeight: "1.5" }}>{act.desc}</div>
                </div>
              ))}
            </div>

            {form.activity_type === "custom" && (
              <div style={{ marginBottom: "24px" }}>
                <Label color={color}>Custom emoji (optional)</Label>
                <input value={form.emoji} onChange={e => set("emoji", e.target.value)} placeholder="🎯" style={inputStyle} maxLength={2} />
              </div>
            )}

            <Label color={color}>Energy level</Label>
            <div style={{ display: "flex", gap: "2px", background: "rgba(255,255,255,0.04)", marginBottom: "32px" }}>
              {ENERGY_OPTIONS.map(en => (
                <div key={en.id} onClick={() => set("energy", en.id)} style={{
                  flex: 1, padding: "16px", cursor: "pointer", textAlign: "center",
                  background: form.energy === en.id ? `${color}10` : "#080808",
                  border: `1px solid ${form.energy === en.id ? color + "50" : "transparent"}`,
                  transition: "all 0.2s",
                }}>
                  <div style={{ fontSize: "13px", fontWeight: "600", color: form.energy === en.id ? color : "rgba(255,255,255,0.6)", marginBottom: "4px" }}>{en.label}</div>
                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)" }}>{en.desc}</div>
                </div>
              ))}
            </div>

            <NavRow>
              <Next color={color} disabled={!canNext1} onClick={() => setStep(2)}>Next: Details →</Next>
            </NavRow>
          </div>
        )}

        {/* ── STEP 2: Details ── */}
        {step === 2 && (
          <div>
            <Label color={color}>Adventure title</Label>
            <input value={form.title} onChange={e => set("title", e.target.value)} placeholder={selectedAct ? `e.g. "${selectedAct.name} in ${form.city}"` : "Give it a name..."} style={{ ...inputStyle, marginBottom: "20px" }} />

            <Label color={color}>Description (sell the vibe)</Label>
            <textarea value={form.description} onChange={e => set("description", e.target.value)}
              placeholder="What makes this adventure special? What will people feel or experience?"
              style={{ ...inputStyle, minHeight: "90px", resize: "vertical", marginBottom: "20px" }}
            />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }} className="ha-two-col">
              <div>
                <Label color={color}>Date</Label>
                <input type="date" value={form.date} onChange={e => set("date", e.target.value)} style={{ ...inputStyle, colorScheme: "dark" }} />
              </div>
              <div>
                <Label color={color}>Time</Label>
                <input type="time" value={form.time} onChange={e => set("time", e.target.value)} style={{ ...inputStyle, colorScheme: "dark" }} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }} className="ha-two-col">
              <div>
                <Label color={color}>City</Label>
                <input value={form.city} onChange={e => set("city", e.target.value)} placeholder="Bangalore" style={inputStyle} />
              </div>
              <div>
                <Label color={color}>Area / Neighbourhood</Label>
                <input value={form.area} onChange={e => set("area", e.target.value)} placeholder="Koramangala, HSR Layout..." style={inputStyle} />
              </div>
            </div>

            <Label color={color}>Group size</Label>
            <div style={{ display: "flex", gap: "8px", marginBottom: "8px", flexWrap: "wrap" }}>
              {[2, 3, 4, 5, 6, 8].map(n => (
                <button key={n} onClick={() => set("max_members", n)} style={{
                  padding: "8px 18px", border: `1px solid ${form.max_members === n ? color : "rgba(255,255,255,0.12)"}`,
                  background: form.max_members === n ? `${color}15` : "transparent",
                  color: form.max_members === n ? color : "rgba(255,255,255,0.45)",
                  fontSize: "13px", cursor: "pointer", borderRadius: "6px", fontFamily: "DM Sans", fontWeight: "600",
                  transition: "all 0.2s",
                }}>
                  {n}
                </button>
              ))}
            </div>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)", marginBottom: "20px" }}>
              Max number of people who can join (including you)
            </div>

            <Label color={color}>Tags (optional, comma separated)</Label>
            <input value={form.tags} onChange={e => set("tags", e.target.value)} placeholder="Coffee, Indie music, Walking, Art..." style={{ ...inputStyle, marginBottom: "32px" }} />

            <NavRow>
              <Back onClick={() => setStep(1)}>← Back</Back>
              <Next color={color} disabled={!canNext2} onClick={() => setStep(3)}>Next: Rules →</Next>
            </NavRow>
          </div>
        )}

        {/* ── STEP 3: Rules / Expectations ── */}
        {step === 3 && (
          <div>
            <Label color={color}>What to expect</Label>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)", marginBottom: "12px", lineHeight: "1.7" }}>
              Tell joiners exactly what will happen — step by step. This replaces the generic description on the event page.
            </p>
            <textarea value={form.what_to_expect} onChange={e => set("what_to_expect", e.target.value)}
              placeholder={"1. Meet at the café entrance at 4 PM\n2. We'll walk to 3 indie cafés nearby\n3. Each stop has a conversation prompt\n4. Ends around 6:30 PM with chai"}
              style={{ ...inputStyle, minHeight: "130px", resize: "vertical", marginBottom: "24px" }}
            />

            <Label color={color}>What to bring (optional)</Label>
            <input value={form.what_to_bring} onChange={e => set("what_to_bring", e.target.value)}
              placeholder="Comfortable shoes, a book you love, camera..."
              style={{ ...inputStyle, marginBottom: "32px" }}
            />

            <div style={{ padding: "20px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "8px", marginBottom: "32px" }}>
              <div style={{ fontSize: "12px", color: "#FFFFFF", fontWeight: "700", marginBottom: "8px" }}>📋 Host Responsibilities</div>
              <ul style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: "2", paddingLeft: "16px", margin: 0 }}>
                <li>Be present and punctual at the start</li>
                <li>Ensure everyone feels welcome</li>
                <li>Notify members 24h before if you need to cancel</li>
                <li>Mark event as complete in your dashboard when done</li>
              </ul>
            </div>

            <NavRow>
              <Back onClick={() => setStep(2)}>← Back</Back>
              <Next color={color} disabled={!canNext3} onClick={() => setStep(4)}>Review →</Next>
            </NavRow>
          </div>
        )}

        {/* ── STEP 4: Review & Pay ── */}
        {step === 4 && (
          <div>
            {/* Preview card */}
            <div style={{ padding: "28px", border: `1px solid ${color}30`, background: `${color}05`, marginBottom: "24px", borderRadius: "4px" }}>
              <div style={{ display: "flex", gap: "16px", alignItems: "flex-start", marginBottom: "20px" }}>
                <div style={{ fontSize: "36px" }}>{form.emoji || selectedAct?.emoji || "🌿"}</div>
                <div>
                  <div style={{ fontSize: "11px", letterSpacing: "0.2em", color, textTransform: "uppercase", marginBottom: "6px" }}>
                    {selectedAct?.name || "Custom Adventure"} · {form.energy === "low" ? "🌙 Chill" : form.energy === "high" ? "🔥 Active" : "⚡ Moderate"}
                  </div>
                  <div style={{ fontSize: "20px", fontWeight: "600", marginBottom: "4px" }}>{form.title || "Untitled Adventure"}</div>
                  <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>
                    📍 {form.area}, {form.city} · 📅 {form.date} {form.time} · 👥 Max {form.max_members}
                  </div>
                </div>
              </div>
              {form.description && <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: "1.75", marginBottom: "16px" }}>{form.description}</p>}
              {form.what_to_expect && (
                <div>
                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", marginBottom: "6px", letterSpacing: "0.1em", textTransform: "uppercase" }}>What to expect</div>
                  <pre style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", lineHeight: "1.8", fontFamily: "DM Sans", whiteSpace: "pre-wrap" }}>{form.what_to_expect}</pre>
                </div>
              )}
            </div>

            {/* Free Hosting Note */}
            <div style={{ padding: "24px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", marginBottom: "24px", borderRadius: "4px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div>
                  <div style={{ fontSize: "16px", fontWeight: "600" }}>Hosting is 100% Free</div>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", marginTop: "4px" }}>Start building your community today.</div>
                </div>
                <div style={{ fontFamily: "'Outfit', serif", fontSize: "36px", color }}>₹0</div>
              </div>
            </div>

            {err && (
              <div style={{ padding: "12px 16px", background: "rgba(232,93,117,0.1)", border: "1px solid rgba(232,93,117,0.3)", color: "#E85D75", fontSize: "13px", marginBottom: "16px", borderRadius: "4px" }}>
                {err}
              </div>
            )}

            <NavRow>
              <Back onClick={() => setStep(3)}>← Back</Back>
              <button onClick={handleSubmit} disabled={submitting} style={{
                flex: 1, padding: "16px", background: submitting ? `${color}60` : color,
                border: "none", color: "#080808", fontSize: "13px", fontWeight: "700",
                letterSpacing: "0.1em", textTransform: "uppercase", cursor: submitting ? "not-allowed" : "pointer",
                fontFamily: "DM Sans", transition: "all 0.2s", borderRadius: "4px",
              }}>
                {submitting ? "Publishing..." : "Publish Adventure — ₹49 →"}
              </button>
            </NavRow>

            <div style={{ textAlign: "center", marginTop: "16px", fontSize: "11px", color: "rgba(255,255,255,0.18)" }}>
              Payment simulated for now · Razorpay wired in Phase 2
            </div>
          </div>
        )}

      </div>
      <Style />
    </div>
  );
}

// ── Small helpers ──────────────────────────────
function Label({ children, color }) {
  return (
    <div style={{ fontSize: "10px", letterSpacing: "0.22em", color: color || "#FFFFFF", textTransform: "uppercase", marginBottom: "10px", fontWeight: "700", opacity: 0.85 }}>
      {children}
    </div>
  );
}
function NavRow({ children }) {
  return <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>{children}</div>;
}
function Back({ onClick, children }) {
  return (
    <button onClick={onClick} style={{ padding: "14px 20px", background: "none", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.4)", fontSize: "13px", cursor: "pointer", fontFamily: "DM Sans", borderRadius: "4px" }}>
      {children}
    </button>
  );
}
function Next({ onClick, disabled, color, children }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      flex: 1, padding: "14px 24px", background: disabled ? "rgba(255,255,255,0.04)" : color,
      border: `1px solid ${disabled ? "rgba(255,255,255,0.08)" : "transparent"}`,
      color: disabled ? "rgba(255,255,255,0.2)" : "#080808",
      fontSize: "13px", fontWeight: "700", letterSpacing: "0.08em",
      cursor: disabled ? "not-allowed" : "pointer", fontFamily: "DM Sans",
      transition: "all 0.2s", borderRadius: "4px",
    }}>
      {children}
    </button>
  );
}
const inputStyle = {
  width: "100%", padding: "12px 14px", background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: "14px",
  fontFamily: "'Inter', sans-serif", outline: "none", boxSizing: "border-box",
  borderRadius: "4px", transition: "border 0.2s",
};
function Style() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300&family=DM+Sans:wght@300;400;500;600;700&display=swap');
      * { box-sizing: border-box; }
      input:focus, textarea:focus { border-color: rgba(255,255,255,0.3) !important; }
      @media (max-width: 600px) {
        .ha-grid { grid-template-columns: 1fr !important; }
        .ha-two-col { grid-template-columns: 1fr !important; }
      }
    `}</style>
  );
}
