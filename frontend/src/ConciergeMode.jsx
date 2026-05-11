// ConciergeMode.jsx — AI-powered conversational planning mode
import { useState, useRef, useEffect } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const INITIAL_MSG = {
  role: "assistant",
  content: "Hi! ✨ I'm your AI surprise planner. Let's plan something unforgettable together.\n\nWho is the surprise for? (e.g., \"my girlfriend\", \"my mom\", \"my best friend\")",
};

export default function ConciergeMode({ onComplete, onBack }) {
  const [messages, setMessages] = useState([INITIAL_MSG]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [detectedForm, setDetectedForm] = useState({});
  const [stage, setStage] = useState("chat"); // chat | generating | done
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (stage === "chat") inputRef.current?.focus();
  }, [stage]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");

    const userMsg = { role: "user", content: text };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/concierge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: newHistory }),
      });
      const data = await res.json();

      if (data.formData) {
        setDetectedForm((f) => ({ ...f, ...data.formData }));
      }

      if (data.readyToGenerate) {
        const merged = { ...detectedForm, ...data.formData };
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content:
              "✨ Perfect! I have everything I need. Generating your personalized surprise plan now...",
          },
        ]);
        setStage("generating");
        setTimeout(() => onComplete(merged), 1200);
      } else {
        setMessages((m) => [
          ...m,
          { role: "assistant", content: data.reply },
        ]);
      }
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: "Oops! Something went wrong. Try again?",
        },
      ]);
    }
    setLoading(false);
  };

  const QUICK_PICKS = [
    "Birthday for my girlfriend",
    "Anniversary for my wife",
    "Surprise for my best friend",
    "My mom's birthday",
  ];

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      height: "calc(100vh - 120px)", maxHeight: "680px",
      background: "rgba(13,13,26,0.96)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "20px", overflow: "hidden",
      backdropFilter: "blur(32px)",
      boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
    }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", gap: "12px",
        padding: "16px 20px",
        background: "linear-gradient(135deg, rgba(255,255,255,0.18), rgba(212,175,55,0.1))",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        flexShrink: 0,
      }}>
        <div style={{
          width: "40px", height: "40px", borderRadius: "50%",
          background: "linear-gradient(135deg, #FFFFFF, #D4AF37)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "18px", flexShrink: 0,
        }}>✦</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "14px", fontWeight: "700", color: "#fff", letterSpacing: "0.02em" }}>AI Concierge</div>
          <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)", display: "flex", alignItems: "center", gap: "5px" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#FFFFFF", display: "inline-block", animation: "pulse 2s infinite" }} />
            Planning your perfect surprise
          </div>
        </div>
        <button
          onClick={onBack}
          style={{
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.5)", borderRadius: "8px", padding: "6px 12px",
            fontSize: "12px", cursor: "pointer", fontFamily: "DM Sans, sans-serif",
          }}
        >Use form instead</button>
      </div>

      {/* Detected fields bar */}
      {Object.keys(detectedForm).length > 0 && (
        <div style={{
          padding: "8px 20px", background: "rgba(255,255,255,0.06)",
          borderBottom: "1px solid rgba(255,255,255,0.15)",
          display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center", flexShrink: 0,
        }}>
          <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.7)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em" }}>Detected:</span>
          {detectedForm.relationship && <Tag label={detectedForm.relationship} />}
          {detectedForm.occasion && <Tag label={detectedForm.occasion} />}
          {detectedForm.budget && <Tag label={`Rs ${Number(detectedForm.budget).toLocaleString("en-IN")}`} />}
          {detectedForm.city && <Tag label={detectedForm.city} />}
          {detectedForm.tone && <Tag label={detectedForm.tone} />}
        </div>
      )}

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px", display: "flex", flexDirection: "column", gap: "12px" }}>
        {messages.map((msg, i) => (
          <Bubble key={i} msg={msg} />
        ))}
        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Quick picks (only at start) */}
      {messages.length === 1 && !loading && (
        <div style={{ padding: "0 16px 12px", display: "flex", gap: "6px", flexWrap: "wrap", flexShrink: 0 }}>
          {QUICK_PICKS.map((q) => (
            <button
              key={q}
              onClick={() => { setInput(q); setTimeout(send, 50); }}
              style={{
                fontSize: "12px", padding: "6px 13px", borderRadius: "20px",
                border: "1px solid rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.1)",
                color: "rgba(147,133,240,1)", cursor: "pointer", fontFamily: "DM Sans, sans-serif",
                transition: "all 0.15s",
              }}
            >{q}</button>
          ))}
        </div>
      )}

      {/* Input */}
      {stage === "chat" && (
        <div style={{
          display: "flex", gap: "10px", padding: "14px 16px",
          borderTop: "1px solid rgba(255,255,255,0.07)", flexShrink: 0,
        }}>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Tell me about the person..."
            style={{
              flex: 1, padding: "11px 15px", borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)",
              color: "#fff", fontFamily: "DM Sans, sans-serif", fontSize: "14px", outline: "none",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.5)"; }}
            onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; }}
          />
          <button
            onClick={send}
            disabled={loading || !input.trim()}
            style={{
              width: "44px", height: "44px", borderRadius: "12px",
              border: "none", background: loading || !input.trim()
                ? "rgba(255,255,255,0.3)"
                : "linear-gradient(135deg, #FFFFFF, #5a4fc8)",
              color: "#fff", cursor: loading || !input.trim() ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "18px", flexShrink: 0, transition: "all 0.2s",
            }}
          >→</button>
        </div>
      )}

      {stage === "generating" && (
        <div style={{
          padding: "20px", textAlign: "center", flexShrink: 0,
          borderTop: "1px solid rgba(255,255,255,0.07)",
        }}>
          <div style={{ display: "flex", justifyContent: "center", gap: "6px" }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{
                width: "8px", height: "8px", borderRadius: "50%",
                background: i === 1 ? "#D4AF37" : "#FFFFFF",
                animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
              }} />
            ))}
          </div>
          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginTop: "8px" }}>
            Crafting your surprise...
          </div>
        </div>
      )}
    </div>
  );
}

function Bubble({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start" }}>
      {!isUser && (
        <div style={{
          width: "28px", height: "28px", borderRadius: "50%", flexShrink: 0, marginRight: "8px",
          background: "linear-gradient(135deg, #FFFFFF, #D4AF37)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "12px", alignSelf: "flex-end",
        }}>✦</div>
      )}
      <div style={{
        maxWidth: "78%",
        padding: "10px 14px",
        borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
        background: isUser
          ? "linear-gradient(135deg, #FFFFFF, #5a4fc8)"
          : "rgba(255,255,255,0.06)",
        border: isUser ? "none" : "1px solid rgba(255,255,255,0.08)",
        color: "#fff", fontSize: "14px", lineHeight: "1.6",
        whiteSpace: "pre-wrap",
      }}>
        {msg.content}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <div style={{
        width: "28px", height: "28px", borderRadius: "50%",
        background: "linear-gradient(135deg, #FFFFFF, #D4AF37)",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", flexShrink: 0,
      }}>✦</div>
      <div style={{
        padding: "12px 16px", borderRadius: "16px 16px 16px 4px",
        background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)",
        display: "flex", gap: "5px", alignItems: "center",
      }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{
            width: "6px", height: "6px", borderRadius: "50%", background: "#9D93F0",
            animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>
    </div>
  );
}

function Tag({ label }) {
  return (
    <span style={{
      fontSize: "11px", padding: "3px 10px", borderRadius: "10px",
      background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)",
      color: "rgba(255,255,255,0.9)", fontWeight: "600",
    }}>{label}</span>
  );
}
