// AboutContact.jsx — About + Contact page
import { useState } from "react";

export default function AboutContact({ onBack }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSending(true);
    // For now, open mailto — can upgrade to backend endpoint later
    const subject = encodeURIComponent(`Contact from ${form.name} — AI Surprise Planner`);
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`);
    window.open(`mailto:bhaveshkumawat330@gmail.com?subject=${subject}&body=${body}`);
    setSent(true);
    setSending(false);
  };

  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const inputStyle = {
    width: "100%", padding: "12px 14px", borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)",
    color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: "14px",
    outline: "none", transition: "border-color 0.2s", boxSizing: "border-box",
  };

  return (
    <div style={{ width: "100%", minHeight: "100vh", overflowX: "hidden", background: "#080808", color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>
      <nav style={{ position: "sticky", top: 0, zIndex: 90, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px clamp(24px, 5vw, 80px)", background: "rgba(8,8,8,0.92)", backdropFilter: "blur(24px)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div onClick={onBack} style={{ letterSpacing: "0.18em", color: "#D4AF37", cursor: "pointer", textTransform: "uppercase", fontFamily: "'Cormorant Garamond', serif", fontSize: "18px" }}>
          ✦ AI Surprise Planner
        </div>
        <button onClick={onBack} style={{ padding: "8px 20px", background: "none", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.5)", fontSize: "12px", cursor: "pointer", fontFamily: "inherit", borderRadius: "6px" }}>← Back</button>
      </nav>

      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "60px 24px 100px", boxSizing: "border-box" }}>

        {/* About Section */}
        <div style={{ fontSize: "10px", letterSpacing: "0.3em", color: "#D4AF37", textTransform: "uppercase", marginBottom: "16px", opacity: 0.7 }}>About</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px, 5vw, 52px)", fontWeight: "300", marginBottom: "24px" }}>
          Built with <span style={{ color: "#D4AF37", fontStyle: "italic" }}>love</span>, in India
        </h1>
        <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.45)", lineHeight: "1.9", marginBottom: "40px" }}>
          AI Surprise Planner started as a simple idea — what if AI could help you plan something truly meaningful for the people you love? We believe surprises shouldn't be stressful. They should be joyful, personal, and effortless.
        </p>
        <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.45)", lineHeight: "1.9", marginBottom: "48px" }}>
          Today, we're a full platform connecting people with AI-crafted plans, local vendors, and tools to make every celebration unforgettable. Whether it's a ₹500 handwritten letter idea or a ₹50,000 luxury getaway — we make it personal.
        </p>

        {/* Founders */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "60px" }}>
          {[
            { name: "Bhavesh Kumar", role: "Founder & Developer", links: [
              { label: "LinkedIn", url: "https://linkedin.com/in/bhavesh-kumar-52b46a301" },
              { label: "GitHub", url: "https://github.com/bhavshx-collab" },
            ]},
            { name: "Rekharam", role: "Co-founder", links: [] },
          ].map(person => (
            <div key={person.name} style={{
              padding: "24px", border: "1px solid rgba(255,255,255,0.07)",
              background: "rgba(255,255,255,0.02)", borderRadius: "14px",
            }}>
              <div style={{
                width: "48px", height: "48px", borderRadius: "50%",
                background: "linear-gradient(135deg, #D4AF37, #7B6EE8)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "18px", fontWeight: "700", color: "#080808", marginBottom: "14px",
              }}>{person.name[0]}</div>
              <div style={{ fontSize: "16px", fontWeight: "600", color: "#fff", marginBottom: "4px" }}>{person.name}</div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", marginBottom: "12px" }}>{person.role}</div>
              <div style={{ display: "flex", gap: "10px" }}>
                {person.links.map(link => (
                  <a key={link.label} href={link.url} target="_blank" rel="noreferrer" style={{
                    fontSize: "11px", color: "#D4AF37", textDecoration: "none",
                    padding: "4px 10px", borderRadius: "6px", border: "1px solid rgba(212,175,55,0.25)",
                    background: "rgba(212,175,55,0.06)", transition: "all 0.2s",
                  }}>{link.label}</a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "48px" }}>
          <div style={{ fontSize: "10px", letterSpacing: "0.3em", color: "#D4AF37", textTransform: "uppercase", marginBottom: "16px", opacity: 0.7 }}>Contact</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: "300", marginBottom: "24px" }}>
            Get in <span style={{ color: "#D4AF37", fontStyle: "italic" }}>touch</span>
          </h2>

          {sent ? (
            <div style={{
              padding: "32px", borderRadius: "14px", textAlign: "center",
              background: "rgba(29,179,117,0.08)", border: "1px solid rgba(29,179,117,0.2)",
            }}>
              <div style={{ fontSize: "32px", marginBottom: "12px" }}>✉️</div>
              <div style={{ fontSize: "16px", fontWeight: "600", color: "#1DB375", marginBottom: "8px" }}>Message ready!</div>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>Your email client should have opened. We'll get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "rgba(255,255,255,0.4)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Name</label>
                <input value={form.name} onChange={e => upd("name", e.target.value)} placeholder="Your name" style={inputStyle} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "rgba(255,255,255,0.4)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Email</label>
                <input type="email" value={form.email} onChange={e => upd("email", e.target.value)} placeholder="you@email.com" style={inputStyle} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "rgba(255,255,255,0.4)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Message</label>
                <textarea value={form.message} onChange={e => upd("message", e.target.value)} placeholder="How can we help?" style={{ ...inputStyle, height: "120px", resize: "none" }} />
              </div>
              <button type="submit" disabled={sending || !form.name || !form.email || !form.message} style={{
                padding: "14px", borderRadius: "10px", border: "none",
                background: sending ? "rgba(212,175,55,0.3)" : "linear-gradient(135deg, #E8C84A, #D4AF37)",
                color: "#080808", fontFamily: "'DM Sans', sans-serif", fontSize: "14px", fontWeight: "700",
                cursor: sending ? "not-allowed" : "pointer", transition: "all 0.2s", letterSpacing: "0.03em",
              }}>
                {sending ? "Sending..." : "Send message"}
              </button>
            </form>
          )}

          <div style={{ marginTop: "32px", padding: "20px", borderRadius: "12px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", marginBottom: "10px" }}>Or reach us directly:</div>
            <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.55)" }}>📧 bhaveshkumawat330@gmail.com</div>
          </div>
        </div>
      </div>
    </div>
  );
}
