import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { supabase } from "./supabase";
import AuthPage from "./AuthPage";
import MyPlans from "./MyPlans";
import ChatWidget from "./ChatWidget";
import "./App.css";
import VendorSignup from "./VendorSignup";
import AdminDashboard from "./AdminDashboard";
import VendorDirectory from "./VendorDirectory";
import LandingPage from "./LandingPage";
import PricingPage from "./PricingPage";
import IntrovertLanding from "./IntrovertLanding";
import SocialProfileForm from "./SocialProfileForm";
import EventDiscovery from "./EventDiscovery";
import EventDetail from "./EventDetail";
import FeedbackModal from "./FeedbackModal";
import InspirationGallery from "./InspirationGallery";
import Checklist from "./Checklist";
import PrintablePlan from "./PrintablePlan";
import { useReactToPrint } from "react-to-print";
import { downloadCalendar } from "./calendarUtils";
import MoodBoard from "./MoodBoard";
import MatchedVendors from "./MatchedVendors";
import RevealPage from "./RevealPage";
import Scrapbook from "./Scrapbook";
import RequestQuoteModal from "./RequestQuoteModal";
import PaymentModal from "./PaymentModal";
import { useProStatus } from "./useProStatus";
const INTERESTS = ["Music", "Travel", "Food", "Art", "Movies", "Fitness", "Books", "Nature", "Gaming", "Fashion"];
const OCCASIONS = ["Birthday", "Anniversary", "Valentine's Day", "Just Because", "Graduation", "Apology"];
const RELATIONSHIPS = ["Girlfriend", "Boyfriend", "Wife", "Husband", "Best Friend", "Parent", "Sibling"];
const TONES = ["Romantic", "Funny", "Luxury", "Minimal", "Emotional", "Adventurous"];


const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function App() {
  const [step, setStep] = useState(1);
  const [showMenu, setShowMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState("timeline");
  const [copied, setCopied] = useState(false);
  const [user, setUser] = useState(null);
  const [view, setView] = useState("landing");
  const [showFeedback, setShowFeedback] = useState(false);
  const [eventDate, setEventDate] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [remixing, setRemixing] = useState(false);
  const [tweakText, setTweakText] = useState("");
  const [tweaking, setTweaking] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [revealPlanId, setRevealPlanId] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const printRef = useRef(null);
  const { isPro } = useProStatus(user);

  const handlePrint = useReactToPrint({ contentRef: printRef });

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
    // Detect reveal URL: /plan/:id/reveal
    const revealMatch = window.location.pathname.match(/^\/plan\/([a-f0-9-]+)\/reveal$/);
    if (revealMatch) { setRevealPlanId(revealMatch[1]); return; }
    // Detect plan share URL: /plan/:id
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
      // 🎉 Confetti celebration!
      setTimeout(() => {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 }, colors: ["#D4AF37", "#E8C84A", "#7B6EE8", "#9D93F0", "#fff"] });
        setTimeout(() => confetti({ particleCount: 60, spread: 120, origin: { y: 0.4 }, colors: ["#D4AF37", "#fff", "#1DB375"] }), 350);
      }, 200);
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
    setEventDate("");
    setShowDatePicker(false);
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

  const shareOnWhatsApp = () => {
    const msg = encodeURIComponent(`🎉 I just planned the perfect surprise using AI!\n\n"${result?.idea}"\n\nSee the full plan: ${window.location.href}`);
    window.open(`https://wa.me/?text=${msg}`, "_blank");
  };

  const handleRemix = async () => {
    setRemixing(true);
    setResult(null);
    setTimeout(async () => {
      try {
        const res = await fetch(`${API}/api/surprise/plan`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, _remix: Date.now() }),
        });
        const data = await res.json();
        setResult(data);
        setActiveTab("timeline");
        if (data.plan_id) window.history.pushState({}, "", `/plan/${data.plan_id}`);
      } catch {}
      setRemixing(false);
    }, 300);
  };

  const handleCalendarExport = () => {
    if (!eventDate) { setShowDatePicker(true); return; }
    downloadCalendar(result, eventDate);
  };

  const handleTweak = async () => {
    if (!tweakText.trim() || !result) return;
    setTweaking(true);
    try {
      const res = await fetch(`${API}/api/surprise/tweak`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: result, instruction: tweakText }),
      });
      const updated = await res.json();
      setResult(updated);
      setTweakText("");
    } catch (e) { console.error(e); }
    setTweaking(false);
  };

  const shareRevealLink = () => {
    if (!result?.plan_id) return;
    const link = `${window.location.origin}/plan/${result.plan_id}/reveal`;
    navigator.clipboard.writeText(link);
    alert(`Reveal link copied! Share it with your special person 🎁\n${link}`);
  };

  const menuItemStyle = {
    display: "block", width: "100%", padding: "8px 12px",
    background: "none", border: "none", borderRadius: "6px",
    fontSize: "13px", color: "var(--text-1, #fff)", cursor: "pointer",
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

  if (revealPlanId) {
    return <RevealPage planId={revealPlanId} />;
  }

  if (view === "landing") {
    return (
      <LandingPage
        onPlan={() => setView("app")}
        onVendor={() => setView("vendorsignup")}
        onPricing={() => setView("pricing")}
        onAuth={() => setView("auth")}
        onSocial={() => setView("social")}
      />
    );
  }

  return (
    <div className="app">

      {/* AUTH VIEW — full screen overlay */}
      {view === "auth" && (
        <AuthPage onAuth={(u) => { setUser(u); setView("app"); }} />
      )}

      {/* PRICING VIEW */}
      {view === "pricing" && (
        <PricingPage onBack={() => setView("landing")} user={user} />
      )}

      {/* INTROVERT ADVENTURES VIEWS */}
      {view === "social" && (
        <IntrovertLanding
          onJoin={() => setView("social-events")}
          onBrowse={() => setView("social-events")}
          onCreateProfile={() => user ? setView("social-profile") : setView("auth")}
        />
      )}
      {view === "social-profile" && (
        <SocialProfileForm
          user={user}
          onBack={() => setView("social")}
          onComplete={() => setView("social-events")}
        />
      )}
      {view === "social-events" && (
        <EventDiscovery
          user={user}
          onBack={() => setView("social")}
          onEventSelect={(ev) => { setSelectedEvent(ev); setView("social-event-detail"); }}
          onCreateProfile={() => user ? setView("social-profile") : setView("auth")}
        />
      )}
      {view === "social-event-detail" && (
        <EventDetail
          event={selectedEvent}
          user={user}
          onBack={() => setView("social-events")}
          onJoin={() => setView("auth")}
        />
      )}

      {/* APP NAVBAR — shown for all non-special views */}
      {!['landing','auth','pricing','social','social-profile','social-events','social-event-detail'].includes(view) && (

        <>
          <nav className="navbar">
            <div className="navbar-logo" onClick={() => setView("app")} style={{ cursor: "pointer" }}>
              ✦ AI Surprise Planner
            </div>
            <div className="navbar-right">
              <button className="nav-btn" onClick={() => setView("social")} style={{ color: "#1DB375", borderColor: "rgba(29,179,117,0.3)" }}>🌿 Adventures</button>
              <button className="nav-btn" onClick={() => setView("gallery")}>Inspiration</button>
              <button className="nav-btn" onClick={() => setView("vendors")}>Vendors</button>
              <button className="nav-btn" onClick={() => setView("pricing")}>Pricing</button>
              {user ? (
                <div style={{ position: "relative" }}>
                  <div className="nav-avatar" onClick={() => setShowMenu(m => !m)}>
                    {user.email?.[0]?.toUpperCase() || "U"}
                  </div>
                  {showMenu && (
                    <div style={{
                      position: "absolute", top: "44px", right: 0,
                      background: "rgba(13,13,26,0.98)", border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px", padding: "8px",
                      minWidth: "180px", zIndex: 200,
                      boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                      backdropFilter: "blur(24px)",
                    }}>
                      <div style={{ padding: "8px 12px", fontSize: "11px", color: "rgba(255,255,255,0.3)", borderBottom: "1px solid rgba(255,255,255,0.07)", marginBottom: "4px", letterSpacing: "0.03em" }}>
                        {user.email}
                      </div>
                      {[
                        ["📋 My plans", () => setView("myplans")],
                        ["🏪 My business", () => setView("vendordashboard")],
                        ["✦ List my business", () => setView("vendorsignup")],
                        ...(user.email === "bhaveshkumawat330@gmail.com" ? [["⚙️ Admin panel", () => setView("admin")]] : []),
                      ].map(([label, action]) => (
                        <button key={label} onClick={() => { action(); setShowMenu(false); }} style={{ display: "block", width: "100%", padding: "9px 12px", background: "none", border: "none", borderRadius: "8px", fontSize: "13px", color: "rgba(255,255,255,0.7)", cursor: "pointer", textAlign: "left", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s" }}
                          onMouseEnter={e => { e.target.style.background = "rgba(255,255,255,0.06)"; e.target.style.color = "#fff"; }}
                          onMouseLeave={e => { e.target.style.background = "none"; e.target.style.color = "rgba(255,255,255,0.7)"; }}
                        >{label}</button>
                      ))}
                      <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", marginTop: "4px", paddingTop: "4px" }}>
                        <button onClick={() => { supabase.auth.signOut(); setShowMenu(false); }} style={{ display: "block", width: "100%", padding: "9px 12px", background: "none", border: "none", borderRadius: "8px", fontSize: "13px", color: "#ff6b6b", cursor: "pointer", textAlign: "left", fontFamily: "'DM Sans', sans-serif" }}>Sign out</button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button className="nav-btn-primary" onClick={() => setView("auth")}>Sign in</button>
              )}
            </div>
          </nav>
        </>
      )}
      {
        view === "myplans" && user && (
          <MyPlans
            user={user}
            onSelectPlan={(p) => { setResult(p.plan_data); setStep(4); setView("app"); }}
            onNewPlan={() => { handleReset(); setView("app"); }}
          />
        )
      }

      {/* VENDOR VIEWS */}
      {view === "vendorsignup" && <VendorSignup onBack={() => setView("app")} />}
      {view === "admin" && <AdminDashboard user={user} onBack={() => setView("app")} />}
      {
        view === "vendors" && (
          <VendorDirectory
            city={form.city}
            onBack={() => setView("app")}
            onVendorSignup={() => setView("vendorsignup")}
          />
        )
      }
      {
        view === "vendordashboard" && user && (
          <VendorDashboard user={user} onBack={() => setView("app")} />
        )
      }
      {
        view === "gallery" && (
          <InspirationGallery
            onBack={() => setView("app")}
            onUsePlan={(p) => { setResult(p.plan_data); setStep(4); setView("app"); }}
          />
        )
      }

      {/* MAIN APP VIEW */}
      {
        view === "app" && (
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
                      <span className="share-icon">🔗</span>
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

                {/* Remix + WhatsApp row */}
                <div style={{ display: "flex", gap: "8px", marginBottom: "14px", flexWrap: "wrap" }}>
                  <button
                    onClick={handleRemix}
                    disabled={remixing}
                    style={{
                      flex: 1, minWidth: "140px", padding: "10px 16px", borderRadius: "8px",
                      border: "1.5px solid rgba(212,175,55,0.4)", background: "var(--gold-bg)",
                      color: "var(--gold)", fontSize: "13px", fontWeight: "600",
                      cursor: remixing ? "not-allowed" : "pointer", fontFamily: "inherit",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                      transition: "all 0.2s",
                    }}
                  >
                    {remixing ? "✨ Remixing..." : "✨ Try another idea"}
                  </button>
                  <button
                    onClick={shareOnWhatsApp}
                    style={{
                      flex: 1, minWidth: "140px", padding: "10px 16px", borderRadius: "8px",
                      border: "none", background: "linear-gradient(135deg,#25D366,#1aa84f)",
                      color: "#fff", fontSize: "13px", fontWeight: "600",
                      cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
                    }}
                  >
                    📲 Share on WhatsApp
                  </button>
                </div>

                {/* AI Moodboard */}
                <MoodBoard plan={result} form={form} />

                {/* Matched vendors */}
                <MatchedVendors
                  vendors={result.matched_vendors}
                  onBrowse={() => setView("vendors")}
                />

                <div className="card result-card">
                  <div className="tab-bar">
                    {[
                      { id: "timeline", label: "Timeline" },
                      { id: "budget", label: "Budget" },
                      { id: "message", label: "Message" },
                      { id: "checklist", label: "✅ Tasks" },
                      ...(eventDate && new Date(eventDate) < new Date() ? [{ id: "scrapbook", label: "📸 Memory" }] : []),
                    ].map(t => (
                      <button key={t.id} className={`tab ${activeTab === t.id ? "active" : ""}`} onClick={() => setActiveTab(t.id)}>
                        {t.label}
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

                  {activeTab === "checklist" && (
                    <Checklist plan={result} planId={result?.plan_id} user={user} />
                  )}

                  {activeTab === "scrapbook" && (
                    <Scrapbook plan={result} user={user} />
                  )}
                </div>

                {/* Tweak this plan */}
                <div style={{ background: "var(--glass)", border: "1px solid var(--glass-border)", borderRadius: "12px", padding: "14px 16px", marginBottom: "12px", backdropFilter: "blur(16px)" }}>
                  <div style={{ fontSize: "11px", fontWeight: "700", color: "var(--gold)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "10px", opacity: 0.8 }}>✏️ Tweak this plan</div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <input
                      value={tweakText}
                      onChange={e => setTweakText(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleTweak()}
                      placeholder='e.g. "Make it cheaper" or "Add a dinner reservation"'
                      style={{ flex: 1, padding: "10px 13px", borderRadius: "8px", border: "1px solid var(--glass-border)", background: "rgba(255,255,255,0.03)", color: "var(--text-1)", fontFamily: "DM Sans", fontSize: "13px", outline: "none" }}
                    />
                    <button
                      onClick={handleTweak}
                      disabled={tweaking || !tweakText.trim()}
                      style={{ padding: "10px 16px", borderRadius: "8px", border: "none", background: tweaking ? "rgba(212,175,55,0.3)" : "var(--gold)", color: "#080808", fontSize: "13px", fontWeight: "700", cursor: "pointer", whiteSpace: "nowrap", fontFamily: "DM Sans", transition: "all 0.2s" }}
                    >
                      {tweaking ? "..." : "Apply"}
                    </button>
                  </div>
                </div>

                <div className="action-grid">
                  <button className="action-btn" onClick={copyPlanText}>📋 Copy plan</button>
                  <button className="action-btn" onClick={shareRevealLink}>🎁 Reveal link</button>
                  <button className="action-btn" onClick={() => isPro ? handlePrint() : setShowPaymentModal(true)}>🖨️ PDF {!isPro && "(Pro)"}</button>
                  <button className="action-btn" onClick={handleCalendarExport}>📅 Calendar</button>
                  {result.matched_vendors?.filter(v => v.whatsapp || v.phone).length > 0 && (
                    <button className="action-btn" style={{ gridColumn: "1/-1", borderColor: "rgba(212,175,55,0.25)", color: "var(--gold)" }} onClick={() => setShowQuoteModal(true)}>📩 Request quotes from vendors</button>
                  )}
                </div>

                {/* Calendar date picker */}
                {showDatePicker && (
                  <div style={{ background: "#f7f9ff", border: "0.5px solid #e0def8", borderRadius: "10px", padding: "14px 16px", marginBottom: "10px" }}>
                    <div style={{ fontSize: "13px", color: "#534AB7", fontWeight: "600", marginBottom: "8px" }}>📅 When is the occasion?</div>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <input
                        type="date"
                        value={eventDate}
                        onChange={e => setEventDate(e.target.value)}
                        style={{ flex: 1, padding: "8px 10px", borderRadius: "6px", border: "0.5px solid #ddd", fontSize: "13px", fontFamily: "inherit" }}
                      />
                      <button
                        onClick={() => { if (eventDate) { downloadCalendar(result, eventDate); setShowDatePicker(false); } }}
                        disabled={!eventDate}
                        style={{ padding: "8px 14px", borderRadius: "6px", background: "#534AB7", color: "#fff", border: "none", fontSize: "13px", cursor: "pointer", fontFamily: "inherit" }}
                      >
                        Download
                      </button>
                    </div>
                  </div>
                )}

                <button className="action-btn" onClick={() => setView("vendors")} style={{ width: "100%", marginBottom: "10px" }}>
                  Find vendors in {form.city || "your city"}
                </button>

                <button className="whatsapp-pro-btn" onClick={whatsappPro}>
                  Want a pro to make this happen? Message us on WhatsApp
                </button>

                <div className="reset-row">
                  <button className="reset-btn" onClick={handleReset}>Plan another surprise</button>
                </div>
                <button
                  className="action-btn"
                  onClick={() => setShowFeedback(true)}
                  style={{ width: "100%", marginTop: "8px" }}
                >
                  Rate this surprise ⭐
                </button>

                {showFeedback && (
                  <FeedbackModal
                    planId={result?.plan_id}
                    onClose={() => setShowFeedback(false)}
                  />
                )}

                {/* Hidden printable version */}
                <div style={{ display: "none" }}>
                  <PrintablePlan ref={printRef} result={result} form={form} />
                </div>
              </div>
            )}

            {result && <ChatWidget plan={result} />}

            {/* Quote Modal */}
            <AnimatePresence>
              {showQuoteModal && result?.matched_vendors?.length > 0 && (
                <RequestQuoteModal
                  vendors={result.matched_vendors}
                  plan={result}
                  onClose={() => setShowQuoteModal(false)}
                />
              )}
            </AnimatePresence>

            {/* Payment / Pro Modal */}
            <AnimatePresence>
              {showPaymentModal && (
                <PaymentModal
                  user={user}
                  onClose={() => setShowPaymentModal(false)}
                  onSuccess={() => window.location.reload()}
                />
              )}
            </AnimatePresence>
          </>
        )
      }

    </div>
  );
}