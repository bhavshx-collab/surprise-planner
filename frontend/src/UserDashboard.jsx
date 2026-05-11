// UserDashboard.jsx — Full premium user dashboard
// Shows plan stats, history, pro status, settings, and quick actions
import { useState, useEffect } from "react";
import { supabase } from "./supabase";

export default function UserDashboard({ user, onSelectPlan, onNewPlan, onBack, onUpgrade }) {
  const [tab, setTab] = useState("plans");
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPro, setIsPro] = useState(false);
  const [stats, setStats] = useState({ total: 0, occasions: {}, topOccasion: "", saved: 0 });

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from("plans")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      const ps = data || [];
      setPlans(ps);

      // Compute stats
      const occasions = {};
      ps.forEach((p) => { if (p.occasion) occasions[p.occasion] = (occasions[p.occasion] || 0) + 1; });
      const topOccasion = Object.entries(occasions).sort((a, b) => b[1] - a[1])[0]?.[0] || "";
      const totalBudget = ps.reduce((s, p) => s + (Number(p.budget) || 0), 0);
      setStats({ total: ps.length, occasions, topOccasion, saved: totalBudget });

      // Check pro
      const { data: pro } = await supabase.from("pro_users").select("expires_at").eq("email", user.email).maybeSingle();
      if (pro?.expires_at) {
        const expires = new Date(pro.expires_at.replace("Z", "+00:00"));
        setIsPro(expires > new Date());
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchData(); }, [user]);

  const deletePlan = async (id, e) => {
    e.stopPropagation();
    if (!confirm("Delete this plan?")) return;
    await supabase.from("plans").delete().eq("id", id);
    setPlans((p) => p.filter((x) => x.id !== id));
  };

  const TABS = [
    { id: "plans", label: "📋 My Plans" },
    { id: "stats", label: "📊 Stats" },
    { id: "account", label: "👤 Account" },
  ];

  return (
    <div style={{ maxWidth: "780px", margin: "0 auto", padding: "28px 20px 80px", fontFamily: "DM Sans, sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <button onClick={onBack} style={backBtn}>← Back</button>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "12px", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                width: "44px", height: "44px", borderRadius: "50%",
                background: "linear-gradient(135deg, rgba(255,255,255,0.3), rgba(212,175,55,0.2))",
                border: "1px solid rgba(212,175,55,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "18px", fontWeight: "700", color: "#D4AF37",
              }}>{user.email?.[0]?.toUpperCase() || "U"}</div>
              <div>
                <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#fff", margin: 0 }}>My Dashboard</h1>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>{user.email}</div>
              </div>
            </div>
          </div>
          {isPro ? (
            <div style={{
              display: "flex", alignItems: "center", gap: "6px", padding: "6px 14px",
              background: "rgba(212,175,55,0.12)", border: "1px solid rgba(212,175,55,0.35)",
              borderRadius: "20px",
            }}>
              <span style={{ fontSize: "13px" }}>⭐</span>
              <span style={{ fontSize: "12px", fontWeight: "700", color: "#D4AF37" }}>Pro Member</span>
            </div>
          ) : (
            <button onClick={onUpgrade} style={{
              padding: "7px 16px", borderRadius: "20px", border: "1px solid rgba(212,175,55,0.4)",
              background: "rgba(212,175,55,0.1)", color: "#D4AF37",
              fontSize: "12px", fontWeight: "700", cursor: "pointer", fontFamily: "DM Sans, sans-serif",
            }}>⭐ Upgrade to Pro</button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "4px", borderBottom: "1px solid rgba(255,255,255,0.07)", marginBottom: "24px" }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: "10px 18px", background: "none", border: "none",
              borderBottom: `2px solid ${tab === t.id ? "#D4AF37" : "transparent"}`,
              color: tab === t.id ? "#D4AF37" : "rgba(255,255,255,0.4)",
              fontSize: "13px", fontWeight: "600", cursor: "pointer",
              fontFamily: "DM Sans, sans-serif", transition: "all 0.2s", marginBottom: "-1px",
            }}
          >{t.label}</button>
        ))}
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: "4rem 0" }}>
          <LoadingSpinner />
          <p style={{ color: "rgba(255,255,255,0.3)", marginTop: "1rem", fontSize: "13px" }}>Loading...</p>
        </div>
      )}

      {/* PLANS TAB */}
      {!loading && tab === "plans" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>
              {plans.length} plan{plans.length !== 1 ? "s" : ""} saved
            </div>
            <button onClick={onNewPlan} style={{
              padding: "8px 16px", borderRadius: "10px", border: "none",
              background: "linear-gradient(135deg, #E8C84A, #D4AF37)",
              color: "#080808", fontSize: "13px", fontWeight: "700", cursor: "pointer",
              fontFamily: "DM Sans, sans-serif",
            }}>+ New Plan</button>
          </div>

          {plans.length === 0 ? (
            <div style={{ ...glassCard, textAlign: "center", padding: "3.5rem 2rem" }}>
              <div style={{ fontSize: "48px", marginBottom: "1rem" }}>🎁</div>
              <div style={{ fontSize: "16px", fontWeight: "600", color: "#fff", marginBottom: "8px" }}>No plans yet</div>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", lineHeight: "1.7", marginBottom: "1.5rem" }}>
                Create your first AI-generated surprise plan in seconds.
              </p>
              <button onClick={onNewPlan} style={{
                padding: "12px 24px", borderRadius: "10px", border: "none",
                background: "linear-gradient(135deg, #E8C84A, #D4AF37)",
                color: "#080808", fontFamily: "DM Sans, sans-serif", fontSize: "14px", fontWeight: "700", cursor: "pointer",
              }}>Plan a surprise</button>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "12px" }}>
              {plans.map((plan) => <PlanCard key={plan.id} plan={plan} onSelect={onSelectPlan} onDelete={deletePlan} />)}
            </div>
          )}
        </div>
      )}

      {/* STATS TAB */}
      {!loading && tab === "stats" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "20px" }}>
            <MetricCard icon="🎁" label="Plans Created" value={stats.total} color="#FFFFFF" />
            <MetricCard icon="🎉" label="Top Occasion" value={stats.topOccasion || "—"} color="#D4AF37" small />
            <MetricCard icon="💰" label="Total Budget" value={stats.saved > 0 ? `Rs ${Math.round(stats.saved / 1000)}k` : "—"} color="#FFFFFF" />
          </div>

          {/* Occasion breakdown */}
          {Object.keys(stats.occasions).length > 0 && (
            <div style={glassCard}>
              <div style={sectionLabel}>Occasions breakdown</div>
              {Object.entries(stats.occasions).sort((a, b) => b[1] - a[1]).map(([occasion, count]) => (
                <div key={occasion} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)", width: "100px", flexShrink: 0 }}>{occasion}</div>
                  <div style={{ flex: 1, height: "5px", background: "rgba(255,255,255,0.05)", borderRadius: "99px", overflow: "hidden" }}>
                    <div style={{
                      height: "100%", borderRadius: "99px",
                      background: "linear-gradient(90deg, #FFFFFF, #D4AF37)",
                      width: `${(count / stats.total) * 100}%`,
                      transition: "width 0.8s ease",
                      boxShadow: "0 0 6px rgba(255,255,255,0.4)",
                    }} />
                  </div>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", width: "20px", textAlign: "right", flexShrink: 0 }}>{count}</div>
                </div>
              ))}
            </div>
          )}

          {/* Recent activity */}
          {plans.length > 0 && (
            <div style={glassCard}>
              <div style={sectionLabel}>Recent activity</div>
              {plans.slice(0, 5).map((p) => (
                <div
                  key={p.id}
                  onClick={() => onSelectPlan(p)}
                  style={{
                    display: "flex", alignItems: "center", gap: "12px",
                    padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)",
                    cursor: "pointer",
                  }}
                >
                  <div style={{
                    width: "36px", height: "36px", borderRadius: "10px", flexShrink: 0,
                    background: "rgba(255,255,255,0.12)", display: "flex",
                    alignItems: "center", justifyContent: "center", fontSize: "16px",
                  }}>🎁</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "13px", fontWeight: "600", color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {p.plan_data?.idea || "Surprise plan"}
                    </div>
                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", marginTop: "2px" }}>
                      {p.occasion} · {p.relationship}
                    </div>
                  </div>
                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", flexShrink: 0 }}>
                    {new Date(p.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ACCOUNT TAB */}
      {!loading && tab === "account" && (
        <div>
          <div style={glassCard}>
            <div style={sectionLabel}>Account details</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <AccountRow label="Email" value={user.email} />
              <AccountRow label="Member since" value={new Date(user.created_at || Date.now()).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} />
              <AccountRow label="Plan" value={isPro ? "✨ Pro" : "Free"} valueColor={isPro ? "#D4AF37" : "rgba(255,255,255,0.6)"} />
            </div>
          </div>

          {!isPro && (
            <div style={{
              ...glassCard,
              background: "linear-gradient(135deg, rgba(212,175,55,0.08), rgba(255,255,255,0.05))",
              border: "1px solid rgba(212,175,55,0.2)",
            }}>
              <div style={{ fontSize: "20px", marginBottom: "10px" }}>⭐</div>
              <div style={{ fontSize: "16px", fontWeight: "700", color: "#fff", marginBottom: "8px" }}>Upgrade to Pro</div>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: "1.7", marginBottom: "16px" }}>
                Unlock PDF exports, priority plan generation, remove branding, and more.
              </p>
              <ul style={{ listStyle: "none", marginBottom: "16px", display: "flex", flexDirection: "column", gap: "7px" }}>
                {["PDF export of plans", "Priority AI generation", "Unlimited plan saves", "Remove branding"].map((f) => (
                  <li key={f} style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ color: "#D4AF37" }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <button onClick={onUpgrade} style={{
                width: "100%", padding: "13px", borderRadius: "10px", border: "none",
                background: "linear-gradient(135deg, #E8C84A, #D4AF37)",
                color: "#080808", fontFamily: "DM Sans, sans-serif", fontSize: "14px", fontWeight: "700", cursor: "pointer",
              }}>Upgrade Now</button>
            </div>
          )}

          <div style={glassCard}>
            <div style={sectionLabel}>Danger zone</div>
            <button
              onClick={() => supabase.auth.signOut()}
              style={{
                width: "100%", padding: "12px", borderRadius: "10px",
                border: "1px solid rgba(255,107,107,0.25)", background: "rgba(255,107,107,0.06)",
                color: "#ff6b6b", fontFamily: "DM Sans, sans-serif", fontSize: "13px", fontWeight: "600", cursor: "pointer",
              }}
            >Sign Out</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────

function PlanCard({ plan, onSelect, onDelete }) {
  const data = plan.plan_data || {};
  return (
    <div
      onClick={() => onSelect(plan)}
      style={{
        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "14px", padding: "16px", cursor: "pointer",
        transition: "all 0.2s", backdropFilter: "blur(12px)",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(212,175,55,0.25)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.transform = "none"; }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {plan.occasion && <Badge label={plan.occasion} color="#FFFFFF" />}
          {plan.tone && <Badge label={plan.tone} color="rgba(255,255,255,0.35)" />}
        </div>
        <button
          onClick={(e) => onDelete(plan.id, e)}
          style={{
            background: "none", border: "none", color: "rgba(255,255,255,0.2)",
            cursor: "pointer", fontSize: "16px", padding: "2px", lineHeight: 1, transition: "color 0.2s",
          }}
          onMouseEnter={(e) => { e.target.style.color = "#ff6b6b"; }}
          onMouseLeave={(e) => { e.target.style.color = "rgba(255,255,255,0.2)"; }}
        >×</button>
      </div>
      <div style={{
        fontSize: "14px", fontFamily: "Playfair Display, serif", fontStyle: "italic",
        color: "#fff", lineHeight: "1.4", marginBottom: "10px",
        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
      }}>{data.idea || "Surprise plan"}</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>
          {plan.relationship}{plan.city && ` · ${plan.city}`}
        </div>
        <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)" }}>
          {new Date(plan.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, color, small }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: "14px", padding: "18px 14px", textAlign: "center",
      borderTop: `2px solid ${color}40`,
    }}>
      <div style={{ fontSize: "22px", marginBottom: "8px" }}>{icon}</div>
      <div style={{
        fontSize: small ? "16px" : "24px", fontWeight: "800", color, fontFamily: "DM Sans, sans-serif",
        lineHeight: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
      }}>{value}</div>
      <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", marginTop: "6px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
    </div>
  );
}

function AccountRow({ label, value, valueColor }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</span>
      <span style={{ fontSize: "13px", color: valueColor || "rgba(255,255,255,0.7)", fontWeight: "600" }}>{value}</span>
    </div>
  );
}

function Badge({ label, color }) {
  return (
    <span style={{
      fontSize: "10px", fontWeight: "700", padding: "3px 8px", borderRadius: "10px",
      background: `${color}18`, color, border: `1px solid ${color}30`,
      textTransform: "uppercase", letterSpacing: "0.05em",
    }}>{label}</span>
  );
}

function LoadingSpinner() {
  return (
    <div style={{
      width: "38px", height: "38px", borderRadius: "50%",
      border: "2px solid rgba(255,255,255,0.07)",
      borderTop: "2px solid #D4AF37", borderRight: "2px solid #FFFFFF",
      animation: "spin 0.9s linear infinite", margin: "0 auto",
    }} />
  );
}

const glassCard = {
  background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "16px", padding: "20px 18px", marginBottom: "14px",
  backdropFilter: "blur(20px)",
};

const sectionLabel = {
  fontSize: "11px", fontWeight: "700", color: "#D4AF37",
  textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "14px", opacity: 0.85,
};

const backBtn = {
  background: "none", border: "none", fontSize: "13px",
  color: "rgba(255,255,255,0.4)", cursor: "pointer", padding: 0,
  fontFamily: "DM Sans, sans-serif",
};
