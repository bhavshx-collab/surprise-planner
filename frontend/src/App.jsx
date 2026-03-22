import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import AuthPage from "./AuthPage";
import MyPlans from "./MyPlans";
import ChatWidget from "./ChatWidget";
import "./App.css";
import VendorSignup from "./VendorSignup";
import AdminDashboard from "./AdminDashboard";
import VendorDirectory from "./VendorDirectory";
import LandingPage from "./LandingPage";

const INTERESTS = ["Music", "Travel", "Food", "Art", "Movies", "Fitness", "Books", "Nature", "Gaming", "Fashion"];
const OCCASIONS = ["Birthday", "Anniversary", "Valentine's Day", "Just Because", "Graduation", "Apology"];
const RELATIONSHIPS = ["Girlfriend", "Boyfriend", "Wife", "Husband", "Best Friend", "Parent", "Sibling"];
const TONES = ["Romantic", "Funny", "Luxury", "Minimal", "Emotional", "Adventurous"];


const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function App() {
  const [step, setStep] = useState(1);
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState("timeline");
  const [copied, setCopied] = useState(false);
  const [user, setUser] = useState(null);
  const [view, setView] = useState("landing");  // ← only one view state

  const [form, setForm] = useState({
    occasion: "Birthday",
    relationship: "Girlfriend",
    tone: "Romantic",
    description: "",
    interests: [],
    budget: "",
    city: "",
  });

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Session on load:", session);
      if (session?.user) {
        setUser(session.user);
        setView("app");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth event:", event);
        if (event === "SIGNED_IN" && session?.user) {
          setUser(session.user);
          setView("app");
        }
        if (event === "SIGNED_OUT") {
          setUser(null);
          setView("app");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const match = window.location.pathname.match(/^\/plan\/([a-f0-9-]+)$/);
    if (match) {
      const planId = match[1];
      setLoading(true);
      fetch(`${API}/api/surprise/plan/${planId}`)
        .then(r => r.json())
        .then(data => {
          if (!data.error) {
            setResult(data);
            if (data.form) setForm(f => ({ ...f, ...data.form }));
            setStep(4);
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, []);

  const toggleInterest = (item) => {
    setForm(f => ({
      ...f,
      interests: f.interests.includes(item)
        ? f.interests.filter(i => i !== item)
        : [...f.interests, item],
    }));
  };

  const handleGenerate = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`${API}/api/surprise/plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setResult(data);
      setStep(4);
      if (data.plan_id) {
        window.history.pushState({}, "", `/plan/${data.plan_id}`);
      }
    } catch (e) {
      alert("Something went wrong. Make sure the backend is running.");
    }
    setLoading(false);
  };

  const handleReset = () => {
    setStep(1);
    setResult(null);
    setActiveTab("timeline");
    setCopied(false);
    window.history.pushState({}, "", "/");
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyPlanText = () => {
    if (!result) return;
    const text = `AI Surprise Plan\n\n${result.idea}\n\n${result.message}\n\nBefore:\n${(result.timeline?.before || []).join("\n")}\n\nDuring:\n${(result.timeline?.during || []).join("\n")}\n\nAfter:\n${(result.timeline?.after || []).join("\n")}`;
    navigator.clipboard.writeText(text);
    alert("Plan copied!");
  };

  const whatsappPro = () => {
    const msg = encodeURIComponent(`Hi! I just created a surprise plan using AI and want your team to help execute it.\n\nIdea: ${result?.idea}\nBudget: Rs ${Number(form.budget).toLocaleString("en-IN")}\n\nPlan link: ${window.location.href}`);
    window.open(`https://wa.me/8875244255?text=${msg}`, "_blank");
  };
  const menuItemStyle = {
    display: "block", width: "100%", padding: "8px 12px",
    background: "none", border: "none", borderRadius: "6px",
    fontSize: "13px", color: "#333", cursor: "pointer",
    textAlign: "left", fontFamily: "inherit",
  };
  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest(".nav-avatar") && !e.target.closest("[data-menu]")) {
        setShowMenu(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return (
    <div className="app">
      {view === "landing" && (
        <LandingPage
          onPlan={() => setView("app")}
          onVendor={() => setView("auth")}
        />
      )}

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navbar-logo" onClick={() => setView("app")} style={{ cursor: "pointer" }}>
          AI Surprise Planner
        </div>
        <div className="navbar-right">
          <button className="nav-btn" onClick={() => setView("vendors")}>
            Find vendors
          </button>
          {user ? (
            <div style={{ position: "relative" }}>
              <div className="nav-avatar" onClick={() => setShowMenu(m => !m)}>
                {user.email?.[0]?.toUpperCase() || "U"}
              </div>
              {showMenu && (
                <div style={{
                  position: "absolute", top: "40px", right: 0,
                  background: "#fff", border: "0.5px solid #eee",
                  borderRadius: "10px", padding: "6px",
                  minWidth: "160px", zIndex: 200,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.08)"
                }}>
                  <div style={{ padding: "8px 12px", fontSize: "12px", color: "#999", borderBottom: "0.5px solid #eee", marginBottom: "4px" }}>
                    {user.email}
                  </div>
                  <button onClick={() => { setView("myplans"); setShowMenu(false); }} style={menuItemStyle}>
                    My plans
                  </button>
                  {user.email === "bhaveshkumawat330@gmail.com" && (
                    <button onClick={() => { setView("admin"); setShowMenu(false); }} style={menuItemStyle}>
                      Admin panel
                    </button>
                  )}
                  <button onClick={() => { setView("vendorsignup"); setShowMenu(false); }} style={menuItemStyle}>
                    List my business
                  </button>
                  <div style={{ borderTop: "0.5px solid #eee", marginTop: "4px", paddingTop: "4px" }}>
                    <button onClick={() => { supabase.auth.signOut(); setShowMenu(false); }} style={{ ...menuItemStyle, color: "#E24B4A" }}>
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button className="nav-btn-primary" onClick={() => setView("auth")}>
              Sign in
            </button>
          )}
        </div>
      </nav>

      {/* AUTH VIEW */}
      {view === "auth" && (
        <AuthPage onAuth={(u) => { setUser(u); setView("app"); }} />
      )}

      {/* MY PLANS VIEW */}
      {view === "myplans" && user && (
        <MyPlans
          user={user}
          onSelectPlan={(p) => { setResult(p.plan_data); setStep(4); setView("app"); }}
          onNewPlan={() => { handleReset(); setView("app"); }}
        />
      )}

      {/* VENDOR VIEWS */}
      {view === "vendorsignup" && <VendorSignup onBack={() => setView("app")} />}
      {view === "admin" && <AdminDashboard user={user} onBack={() => setView("app")} />}
      {view === "vendors" && (
        <VendorDirectory
          city={form.city}
          onBack={() => setView("app")}
          onVendorSignup={() => setView("vendorsignup")}
        />
      )}

      {/* MAIN APP VIEW */}
      {view === "app" && (
        <>
          {step !== 4 && !loading && (
            <header className="hero">
              <div className="hero-badge">AI-powered · Free to try</div>
              <h1>Plan a surprise they'll <span className="accent">never forget</span></h1>
              <p>Tell us about them — we'll craft a fully personalized surprise plan in seconds.</p>
            </header>
          )}

          {step !== 4 && !loading && (
            <div className="progress-bar">
              {[1, 2, 3].map((s, i) => (
                <div key={s} className="progress-step-wrap">
                  <div className={`progress-dot ${step > s ? "done" : step === s ? "active" : "pending"}`}>{s}</div>
                  <span className={`progress-label ${step === s ? "active" : ""}`}>
                    {["Occasion", "About them", "Budget"][i]}
                  </span>
                  {i < 2 && <div className={`progress-line ${step > s ? "done" : ""}`} />}
                </div>
              ))}
            </div>
          )}

          {loading && (
            <div className="loading-card">
              <div className="loading-spinner" />
              <h2>Crafting your surprise...</h2>
              <p>Our AI is personalizing every detail just for them.</p>
              <div className="loading-dots"><span /><span /><span /></div>
            </div>
          )}

          {step === 1 && !loading && (
            <div className="card">
              <div className="card-label">Step 1 of 3 — The occasion</div>
              <div className="field-row">
                <div className="field">
                  <label>Occasion</label>
                  <select value={form.occasion} onChange={e => setForm({ ...form, occasion: e.target.value })}>
                    {OCCASIONS.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label>Relationship</label>
                  <select value={form.relationship} onChange={e => setForm({ ...form, relationship: e.target.value })}>
                    {RELATIONSHIPS.map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
              </div>
              <div className="field">
                <label>Vibe / tone</label>
                <div className="pill-group">
                  {TONES.map(t => (
                    <span key={t} className={`pill ${form.tone === t ? "selected" : ""}`} onClick={() => setForm({ ...form, tone: t })}>{t}</span>
                  ))}
                </div>
              </div>
              <div className="nav-row">
                <button className="btn-next" onClick={() => setStep(2)}>Next →</button>
              </div>
            </div>
          )}

          {step === 2 && !loading && (
            <div className="card">
              <div className="card-label">Step 2 of 3 — Tell us about them</div>
              <div className="field">
                <label>Describe them</label>
                <textarea
                  placeholder="She loves old Bollywood songs, spontaneous road trips, sunsets from rooftops..."
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Interests (pick all that apply)</label>
                <div className="pill-group">
                  {INTERESTS.map(item => (
                    <span key={item} className={`pill ${form.interests.includes(item) ? "selected" : ""}`} onClick={() => toggleInterest(item)}>{item}</span>
                  ))}
                </div>
              </div>
              <div className="field">
                <label>City (optional)</label>
                <input type="text" placeholder="Mumbai, Delhi, Bangalore..." value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
              </div>
              <div className="nav-row two">
                <button className="btn-back" onClick={() => setStep(1)}>← Back</button>
                <button className="btn-next" onClick={() => setStep(3)}>Next →</button>
              </div>
            </div>
          )}

          {step === 3 && !loading && (
            <div className="card">
              <div className="card-label">Step 3 of 3 — Budget</div>
              <div className="field">
                <label>Your budget (Rs)</label>
                <input type="number" placeholder="e.g. 5000, 20000, 200000" value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })} />
              </div>
              <div className="budget-hint">
                {[["Tight budget", "Rs 500 - Rs 3,000"], ["Comfortable", "Rs 3,000 - Rs 15,000"], ["Go all out", "Rs 15,000+"]].map(([l, v]) => (
                  <div key={l} className="budget-hint-row"><span>{l}</span><span className="hint-tag">{v}</span></div>
                ))}
              </div>
              <div className="nav-row two">
                <button className="btn-back" onClick={() => setStep(2)}>← Back</button>
                <button className="btn-generate" onClick={handleGenerate} disabled={!form.budget}>Generate my surprise</button>
              </div>
            </div>
          )}

          {step === 4 && result && !loading && (
            <div className="result-view">
              <div className="result-hero">
                <div className="result-badge">{form.tone} · {form.occasion} · Rs {Number(form.budget).toLocaleString("en-IN")}</div>
                <h2>{result.idea}</h2>
                <p>{result.message}</p>
              </div>

              {result.plan_id && (
                <div className="share-banner">
                  <div className="share-banner-left">
                    <span className="share-icon">link</span>
                    <div>
                      <div className="share-banner-title">Your plan is saved</div>
                      <div className="share-banner-url">{window.location.host}/plan/{result.plan_id.slice(0, 8)}...</div>
                    </div>
                  </div>
                  <button className="share-copy-btn" onClick={copyShareLink}>
                    {copied ? "Copied!" : "Copy link"}
                  </button>
                </div>
              )}

              <div className="card result-card">
                <div className="tab-bar">
                  {["timeline", "budget", "message"].map(t => (
                    <button key={t} className={`tab ${activeTab === t ? "active" : ""}`} onClick={() => setActiveTab(t)}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>

                {activeTab === "timeline" && (
                  <div className="timeline">
                    {[
                      { label: "Before", color: "#7F77DD", items: result.timeline?.before || [] },
                      { label: "On the day", color: "#1D9E75", items: result.timeline?.during || [] },
                      { label: "After", color: "#BA7517", items: result.timeline?.after || [] },
                    ].map(section => (
                      <div key={section.label} className="tl-section">
                        <div className="tl-header" style={{ color: section.color }}>
                          <div className="tl-dot" style={{ background: section.color }} />
                          {section.label}
                        </div>
                        {section.items.map((item, i) => (
                          <div key={i} className="tl-item">{item.replace(/^[-•]\s*/, "")}</div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "budget" && (
                  <div className="budget-section">
                    <p className="budget-note">{result.explanation}</p>
                    {result.budget_breakdown
                      ? Object.entries(result.budget_breakdown).map(([k, v]) => (
                        <div key={k} className="budget-row">
                          <span className="budget-label">{k}</span>
                          <div className="budget-bar-wrap">
                            <div className="budget-bar" style={{ width: `${Math.min(100, (Number(v) / Number(form.budget)) * 100)}%` }} />
                          </div>
                          <span className="budget-val">Rs {Number(v).toLocaleString("en-IN")}</span>
                        </div>
                      ))
                      : <p className="budget-note">Budget breakdown not available for this plan.</p>
                    }
                  </div>
                )}

                {activeTab === "message" && (
                  <div className="message-section">
                    <p className="message-text">"{result.message}"</p>
                    <p className="explanation-text">{result.explanation}</p>
                  </div>
                )}
              </div>

              <div className="action-grid">
                <button className="action-btn" onClick={copyPlanText}>Copy plan</button>
                <button className="action-btn" onClick={copyShareLink}>{copied ? "Copied!" : "Share link"}</button>
              </div>

              <button className="action-btn" onClick={() => setView("vendors")} style={{ width: "100%", marginBottom: "10px" }}>
                Find vendors in {form.city || "your city"}
              </button>

              <button className="whatsapp-pro-btn" onClick={whatsappPro}>
                Want a pro to make this happen? Message us on WhatsApp
              </button>

              <div className="reset-row">
                <button className="reset-btn" onClick={handleReset}>Plan another surprise</button>
              </div>
            </div>
          )}

          {result && <ChatWidget plan={result} />}
        </>
      )}

    </div>
  );
}