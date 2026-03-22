import { useState } from "react";
import { supabase } from "./supabase";

export default function AuthPage({ onAuth }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleMagicLink = async () => {
    if (!email) return setError("Please enter your email");
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">AI Surprise Planner</div>
          <p className="auth-sub">Sign in to save and revisit your plans</p>
        </div>

        {!sent ? (
          <>
            <div className="auth-field">
              <label style={{ fontSize: "13px", fontWeight: "500", color: "#555", display: "block", marginBottom: "6px" }}>
                Email address
              </label>
              <input
                type="email"
                placeholder="you@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleMagicLink()}
                autoFocus
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "0.5px solid #ddd",
                  background: "#fafafa",
                  fontSize: "14px",
                  fontFamily: "inherit",
                  outline: "none",
                  boxSizing: "border-box",
                  color: "#111", 
                }}
              />
            </div>

            {error && <div className="auth-error">{error}</div>}

            <button
              className="auth-primary-btn"
              onClick={handleMagicLink}
              disabled={loading || !email}
            >
              {loading ? "Sending..." : "Send magic link"}
            </button>

            <p style={{ fontSize: "12px", color: "#aaa", textAlign: "center", marginTop: "12px" }}>
              We will email you a link — no password needed
            </p>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "1rem 0" }}>
            <div style={{ fontSize: "40px", marginBottom: "1rem" }}>📬</div>
            <h3 style={{ fontSize: "16px", fontWeight: "500", marginBottom: "8px" }}>Check your email!</h3>
            <p style={{ fontSize: "14px", color: "#666", lineHeight: "1.6" }}>
              We sent a magic link to <strong>{email}</strong>.<br />
              Click the link in the email to sign in.
            </p>
            <button
              style={{ marginTop: "1.5rem", fontSize: "13px", color: "#999", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
              onClick={() => { setSent(false); setEmail(""); }}
            >
              Use a different email
            </button>
          </div>
        )}

        <p className="auth-footer">Free to use · No spam · Cancel anytime</p>
      </div>
    </div>
  );
}