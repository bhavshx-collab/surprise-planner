// MyPlans.jsx
// Place in frontend/src/MyPlans.jsx

import { useState, useEffect } from "react";
import { supabase } from "./supabase";

export default function MyPlans({ user, onSelectPlan, onNewPlan }) {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, [user]);

  const fetchPlans = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("plans")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error) setPlans(data || []);
    setLoading(false);
  };

  const deletePlan = async (id, e) => {
    e.stopPropagation();
    if (!confirm("Delete this plan?")) return;
    await supabase.from("plans").delete().eq("id", id);
    setPlans((p) => p.filter((plan) => plan.id !== id));
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric"
    });
  };

  return (
    <div className="myplans-page">
      <div className="myplans-header">
        <div>
          <h2 className="myplans-title">My surprise plans</h2>
          <p className="myplans-sub">{plans.length} plan{plans.length !== 1 ? "s" : ""} saved</p>
        </div>
        <button className="myplans-new-btn" onClick={onNewPlan}>
          + New plan
        </button>
      </div>

      {loading && (
        <div className="myplans-loading">
          {[1, 2, 3].map((i) => (
            <div key={i} className="myplans-skeleton" />
          ))}
        </div>
      )}

      {!loading && plans.length === 0 && (
        <div className="myplans-empty">
          <div className="myplans-empty-icon">🎁</div>
          <h3>No plans yet</h3>
          <p>Create your first surprise plan</p>
          <button className="auth-primary-btn" onClick={onNewPlan} style={{ marginTop: "1rem" }}>
            Plan a surprise
          </button>
        </div>
      )}

      <div className="myplans-grid">
        {plans.map((plan) => {
          const data = plan.plan_data || {};
          return (
            <div
              key={plan.id}
              className="myplan-card"
              onClick={() => onSelectPlan(plan)}
            >
              <div className="myplan-card-top">
                <div className="myplan-badges">
                  {plan.occasion && (
                    <span className="myplan-badge occasion">{plan.occasion}</span>
                  )}
                  {plan.tone && (
                    <span className="myplan-badge tone">{plan.tone}</span>
                  )}
                </div>
                <button
                  className="myplan-delete-btn"
                  onClick={(e) => deletePlan(plan.id, e)}
                  title="Delete plan"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>

              <div className="myplan-idea">
                {data.idea || "Surprise plan"}
              </div>

              <div className="myplan-meta">
                <span>{plan.relationship || "Someone special"}</span>
                {plan.budget && <span>₹{Number(plan.budget).toLocaleString("en-IN")}</span>}
                {plan.city && <span>{plan.city}</span>}
              </div>

              <div className="myplan-date">
                {formatDate(plan.created_at)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}