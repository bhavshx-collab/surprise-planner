// PrivacyPolicy.jsx — Legal page
export default function PrivacyPolicy({ onBack }) {
  return (
    <div style={{ width: "100%", minHeight: "100vh", overflowX: "hidden", background: "#080808", color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>
      <nav style={{ position: "sticky", top: 0, zIndex: 90, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px clamp(24px, 5vw, 80px)", background: "rgba(8,8,8,0.92)", backdropFilter: "blur(24px)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div onClick={onBack} style={{ letterSpacing: "0.18em", color: "#D4AF37", cursor: "pointer", textTransform: "uppercase", fontFamily: "'Cormorant Garamond', serif", fontSize: "18px" }}>
          ✦ AI Surprise Planner
        </div>
        <button onClick={onBack} style={{ padding: "8px 20px", background: "none", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.5)", fontSize: "12px", cursor: "pointer", fontFamily: "inherit", borderRadius: "6px" }}>← Back</button>
      </nav>

      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "60px 24px 100px", boxSizing: "border-box" }}>
        <div style={{ fontSize: "10px", letterSpacing: "0.3em", color: "#D4AF37", textTransform: "uppercase", marginBottom: "16px", opacity: 0.7 }}>Legal</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px, 5vw, 52px)", fontWeight: "300", marginBottom: "16px" }}>
          Privacy <span style={{ color: "#D4AF37", fontStyle: "italic" }}>Policy</span>
        </h1>
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)", marginBottom: "48px" }}>Last updated: April 2026</p>

        {[
          { title: "1. Information We Collect", body: "When you use AI Surprise Planner, we collect:\n\n• Email address (for account creation via Supabase Auth)\n• Surprise plan details you provide (occasion, interests, budget, city)\n• Vendor listing information (business name, contact, location)\n• Payment information processed securely via Razorpay (we never store card details)\n• Usage analytics to improve the service" },
          { title: "2. How We Use Your Data", body: "Your data is used to:\n\n• Generate personalised AI surprise plans\n• Save and retrieve your plans\n• Match you with relevant local vendors\n• Send event reminders (email/WhatsApp) if you opt in\n• Process Pro subscriptions via Razorpay\n• Improve our AI models and user experience" },
          { title: "3. AI & Data Processing", body: "Your plan details are sent to Groq's LLaMA 3.1 API to generate personalised plans. We do not use your personal data to train AI models. Plan content is processed in real-time and not stored by the AI provider." },
          { title: "4. Data Storage", body: "All user data is stored securely in Supabase (PostgreSQL) with row-level security enabled. Data is encrypted in transit (TLS) and at rest. Our database is hosted on secure cloud infrastructure." },
          { title: "5. Third-Party Services", body: "We use the following third-party services:\n\n• Supabase — Authentication and database\n• Groq — AI plan generation\n• Razorpay — Payment processing\n• Vercel — Frontend hosting\n• Render — Backend hosting\n\nEach service has its own privacy policy." },
          { title: "6. Your Rights", body: "You have the right to:\n\n• Access your personal data\n• Request deletion of your account and data\n• Export your saved plans\n• Opt out of marketing communications\n• Request correction of inaccurate data\n\nContact us at bhaveshkumawat330@gmail.com to exercise these rights." },
          { title: "7. Cookies", body: "We use essential cookies for authentication sessions only. We do not use tracking cookies or third-party advertising cookies." },
          { title: "8. Contact", body: "For privacy-related questions, contact:\n\nEmail: bhaveshkumawat330@gmail.com\nAI Surprise Planner, India" },
        ].map((section) => (
          <div key={section.title} style={{ marginBottom: "40px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "600", color: "rgba(255,255,255,0.85)", marginBottom: "16px", letterSpacing: "0.01em" }}>{section.title}</h2>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.45)", lineHeight: "1.9", whiteSpace: "pre-line" }}>{section.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
