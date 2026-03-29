// FeedbackModal.jsx
// Place in frontend/src/FeedbackModal.jsx
// Shows after generating a plan — asks user to come back and rate it

import { useState } from "react";
import { supabase } from "./supabase";

export default function FeedbackModal({ planId, onClose }) {
  const [step, setStep] = useState("rate"); // rate | details | done
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [review, setReview] = useState("");
  const [occasion, setOccasion] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    await supabase.from("ratings").insert({
      plan_id: planId,
      rating,
      review,
      occasion,
      created_at: new Date().toISOString(),
    });
    setStep("done");
    setSubmitting(false);
  };

  const stars = [1, 2, 3, 4, 5];

  const messages = {
    1: "Sorry it didn't go well",
    2: "Could have been better",
    3: "It was decent!",
    4: "They loved it!",
    5: "Absolutely perfect!",
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 500,
      background: "rgba(0,0,0,0.4)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "1rem",
    }}>
      <div style={{
        background: "#fff", borderRadius: "16px",
        padding: "2rem", maxWidth: "400px", width: "100%",
        position: "relative",
      }}>
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: "16px", right: "16px",
            background: "none", border: "none", fontSize: "18px",
            color: "#999", cursor: "pointer", lineHeight: 1,
          }}
        >
          ×
        </button>

        {step === "rate" && (
          <>
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <div style={{ fontSize: "36px", marginBottom: "0.75rem" }}>🎉</div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: "500", marginBottom: "8px" }}>
                How did the surprise go?
              </h2>
              <p style={{ fontSize: "13px", color: "#999", lineHeight: "1.6" }}>
                Your feedback helps others plan better surprises.
              </p>
            </div>

            {/* Stars */}
            <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "16px" }}>
              {stars.map(s => (
                <span
                  key={s}
                  onMouseEnter={() => setHovered(s)}
                  onMouseLeave={() => setHovered(0)}
                  onClick={() => setRating(s)}
                  style={{
                    fontSize: "36px", cursor: "pointer",
                    filter: (hovered || rating) >= s ? "none" : "grayscale(1) opacity(0.3)",
                    transform: (hovered || rating) >= s ? "scale(1.15)" : "scale(1)",
                    transition: "all 0.15s",
                  }}
                >
                  ⭐
                </span>
              ))}
            </div>

            {/* Rating message */}
            <div style={{
              textAlign: "center", fontSize: "14px", fontWeight: "500",
              color: "#534AB7", height: "20px", marginBottom: "1.5rem",
              transition: "opacity 0.2s",
              opacity: (hovered || rating) ? 1 : 0,
            }}>
              {messages[hovered || rating]}
            </div>

            <button
              className="btn-next"
              onClick={() => setStep("details")}
              disabled={!rating}
              style={{ width: "100%" }}
            >
              Next →
            </button>

            <button
              onClick={onClose}
              style={{
                width: "100%", marginTop: "8px", padding: "10px",
                background: "none", border: "none", fontSize: "13px",
                color: "#bbb", cursor: "pointer",
              }}
            >
              Skip for now
            </button>
          </>
        )}

        {step === "details" && (
          <>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: "500", marginBottom: "6px" }}>
              Tell us more
            </h2>
            <p style={{ fontSize: "13px", color: "#999", marginBottom: "1.25rem" }}>
              Optional — but it helps others a lot.
            </p>

            <div className="field" style={{ marginBottom: "12px" }}>
              <label>What was the occasion?</label>
              <input
                type="text"
                placeholder="Birthday, Anniversary, Just because..."
                value={occasion}
                onChange={e => setOccasion(e.target.value)}
              />
            </div>

            <div className="field" style={{ marginBottom: "1.25rem" }}>
              <label>What happened? (optional)</label>
              <textarea
                placeholder="She cried happy tears when she saw the setup. The AI plan was surprisingly on point..."
                value={review}
                onChange={e => setReview(e.target.value)}
                style={{ height: "90px" }}
              />
            </div>

            <button
              className="btn-generate"
              onClick={handleSubmit}
              disabled={submitting}
              style={{ width: "100%" }}
            >
              {submitting ? "Submitting..." : "Submit feedback"}
            </button>
          </>
        )}

        {step === "done" && (
          <div style={{ textAlign: "center", padding: "1rem 0" }}>
            <div style={{ fontSize: "48px", marginBottom: "1rem" }}>💜</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: "500", marginBottom: "8px" }}>
              Thank you!
            </h2>
            <p style={{ fontSize: "14px", color: "#666", lineHeight: "1.7", marginBottom: "1.5rem" }}>
              Your {rating}-star rating helps others plan better surprises.
            </p>
            <button className="btn-next" onClick={onClose} style={{ width: "100%" }}>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}