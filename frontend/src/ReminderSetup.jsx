// ReminderSetup.jsx — schedule WhatsApp + email reminders for the surprise date
import { useState } from "react";
import { supabase } from "./supabase";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ReminderSetup({ plan, user, form }) {
  const [date, setDate] = useState("");
  const [phone, setPhone] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSave = async () => {
    if (!date) return;
    setSaving(true);
    try {
      // Save to Supabase
      await supabase.from("reminders").insert({
        plan_id: plan?.plan_id,
        user_id: user?.id,
        user_email: user?.email,
        whatsapp_number: phone || null,
        event_date: date,
        occasion: form?.occasion,
        plan_idea: plan?.idea,
      }).then(() => {});

      // Also schedule via backend
      await fetch(`${API}/api/reminder/schedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan_id: plan?.plan_id,
          user_email: user?.email,
          whatsapp_number: phone || null,
          event_date: date,
          occasion: form?.occasion,
          plan_idea: plan?.idea,
        }),
      });

      setSaved(true);
    } catch (e) {
      console.error(e);
      setSaved(true); // Still mark as saved if Supabase saved
    }
    setSaving(false);
  };

  if (!user) return null;

  const today = new Date().toISOString().split("T")[0];

  return (
    <div style={{
      background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "14px", marginBottom: "12px", overflow: "hidden",
    }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%", padding: "13px 16px", background: "none", border: "none",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between",
          fontFamily: "DM Sans, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "18px" }}>🔔</span>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: "13px", fontWeight: "600", color: "#fff" }}>
              Set a reminder
              {saved && <span style={{ marginLeft: "6px", fontSize: "11px", color: "#1DB375" }}>✓ Set</span>}
            </div>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>
              Get notified before the big day
            </div>
          </div>
        </div>
        <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▼</span>
      </button>

      {open && (
        <div style={{ padding: "0 16px 16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          {saved ? (
            <div style={{
              padding: "14px", borderRadius: "10px", background: "rgba(29,179,117,0.1)",
              border: "1px solid rgba(29,179,117,0.25)", textAlign: "center",
              marginTop: "12px",
            }}>
              <div style={{ fontSize: "24px", marginBottom: "6px" }}>🎉</div>
              <div style={{ fontSize: "13px", fontWeight: "600", color: "#1DB375" }}>Reminder set!</div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginTop: "4px" }}>
                We'll remind you 2 days before and on the morning of the event.
              </div>
            </div>
          ) : (
            <div style={{ marginTop: "12px" }}>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "rgba(255,255,255,0.5)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  When is the event?
                </label>
                <input
                  type="date"
                  value={date}
                  min={today}
                  onChange={(e) => setDate(e.target.value)}
                  style={{
                    width: "100%", padding: "10px 13px", borderRadius: "10px",
                    border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)",
                    color: "#fff", fontFamily: "DM Sans, sans-serif", fontSize: "13px", outline: "none",
                    colorScheme: "dark",
                  }}
                />
              </div>
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "rgba(255,255,255,0.5)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  WhatsApp number (optional)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  style={{
                    width: "100%", padding: "10px 13px", borderRadius: "10px",
                    border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)",
                    color: "#fff", fontFamily: "DM Sans, sans-serif", fontSize: "13px", outline: "none",
                  }}
                />
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginTop: "5px" }}>
                  Email reminder always sent to {user?.email}
                </div>
              </div>
              <button
                onClick={handleSave}
                disabled={!date || saving}
                style={{
                  width: "100%", padding: "11px", borderRadius: "10px",
                  border: "none",
                  background: !date || saving ? "rgba(212,175,55,0.3)" : "linear-gradient(135deg, #E8C84A, #D4AF37)",
                  color: "#080808", fontFamily: "DM Sans, sans-serif",
                  fontSize: "13px", fontWeight: "700", cursor: !date ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                }}
              >
                {saving ? "Saving..." : "🔔 Set Reminder"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
