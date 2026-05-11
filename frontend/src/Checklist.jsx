// Checklist.jsx — Execution checklist with Supabase realtime + framer-motion
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "./supabase";

function getKey(planId) { return `checklist_${planId || "default"}`; }

export default function Checklist({ plan, planId, user }) {
  const allSteps = [
    ...(plan.timeline?.before || []).map((s, i) => ({ id: `b${i}`, label: s.replace(/^[-•]\s*/, ""), phase: "Before" })),
    ...(plan.timeline?.during || []).map((s, i) => ({ id: `d${i}`, label: s.replace(/^[-•]\s*/, ""), phase: "On the day" })),
    ...(plan.timeline?.after  || []).map((s, i) => ({ id: `a${i}`, label: s.replace(/^[-•]\s*/, ""), phase: "After" })),
  ];

  const [checked, setChecked] = useState(() => {
    try { return JSON.parse(localStorage.getItem(getKey(planId))) || {}; }
    catch { return {}; }
  });
  const [isLive, setIsLive] = useState(false);

  // Supabase realtime sync if logged in + plan saved
  useEffect(() => {
    if (!planId || !user) return;
    // Load
    supabase.from("plan_checklist").select("checked_ids").eq("plan_id", planId).eq("user_id", user.id).maybeSingle()
      .then(({ data }) => { if (data) setChecked(data.checked_ids || {}); });
    // Subscribe
    const channel = supabase.channel(`checklist:${planId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "plan_checklist", filter: `plan_id=eq.${planId}` },
        payload => { if (payload.new?.checked_ids) setChecked(payload.new.checked_ids); })
      .subscribe(status => setIsLive(status === "SUBSCRIBED"));
    return () => supabase.removeChannel(channel);
  }, [planId, user]);

  const toggle = async (id) => {
    const next = { ...checked, [id]: !checked[id] };
    setChecked(next);
    if (planId && user) {
      await supabase.from("plan_checklist").upsert(
        { plan_id: planId, user_id: user.id, checked_ids: next, updated_at: new Date().toISOString() },
        { onConflict: "plan_id,user_id" }
      );
    } else {
      localStorage.setItem(getKey(planId), JSON.stringify(next));
    }
  };

  const doneCount = allSteps.filter(s => checked[s.id]).length;
  const percent = Math.round((doneCount / allSteps.length) * 100);
  const allDone = doneCount === allSteps.length && allSteps.length > 0;
  const phases = ["Before", "On the day", "After"];
  const phaseColors = { "Before": "var(--purple-light)", "On the day": "var(--green)", "After": "var(--amber)" };

  return (
    <div style={{ padding: "0.5rem 0" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <div style={{ fontSize: "13px", color: "var(--text-2)" }}>{doneCount} of {allSteps.length} steps done</div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {isLive && <span style={{ fontSize: "10px", fontWeight: "700", color: "var(--green)", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)", padding: "2px 8px", borderRadius: "20px", letterSpacing: "0.06em" }}>● LIVE</span>}
          <div style={{ fontSize: "13px", fontWeight: "700", color: allDone ? "var(--green)" : "var(--gold)" }}>{percent}%</div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: "4px", background: "rgba(255,255,255,0.06)", borderRadius: "99px", marginBottom: "20px", overflow: "hidden" }}>
        <motion.div
          style={{ height: "100%", borderRadius: "99px", background: allDone ? "var(--green)" : "linear-gradient(90deg, var(--purple), var(--gold))" }}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>

      {/* Celebration */}
      <AnimatePresence>
        {allDone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.08))", border: "1px solid rgba(255,255,255,0.3)", borderRadius: "12px", padding: "16px", marginBottom: "16px", textAlign: "center" }}
          >
            <div style={{ fontSize: "24px", marginBottom: "6px" }}>🎉</div>
            <div style={{ fontWeight: "700", fontSize: "14px", color: "var(--green)" }}>You did it! The surprise is ready!</div>
            <div style={{ fontSize: "12px", color: "var(--text-2)", marginTop: "4px" }}>They're going to love this.</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Steps */}
      {phases.map(phase => {
        const steps = allSteps.filter(s => s.phase === phase);
        if (!steps.length) return null;
        return (
          <div key={phase} style={{ marginBottom: "18px" }}>
            <div style={{ fontSize: "10px", fontWeight: "700", color: phaseColors[phase], textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>{phase}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              {steps.map(step => (
                <motion.label
                  key={step.id}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    display: "flex", alignItems: "flex-start", gap: "10px", padding: "10px 12px",
                    borderRadius: "8px", cursor: "pointer", transition: "all 0.15s",
                    background: checked[step.id] ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.02)",
                    border: checked[step.id] ? "1px solid rgba(212,175,55,0.15)" : "1px solid var(--glass-border)",
                  }}
                >
                  <input type="checkbox" checked={!!checked[step.id]} onChange={() => toggle(step.id)} style={{ marginTop: "2px", accentColor: "var(--gold)", flexShrink: 0 }} />
                  <span style={{ fontSize: "13px", lineHeight: "1.55", color: checked[step.id] ? "var(--text-3)" : "var(--text-2)", textDecoration: checked[step.id] ? "line-through" : "none", transition: "all 0.2s" }}>
                    {step.label}
                  </span>
                </motion.label>
              ))}
            </div>
          </div>
        );
      })}

      <button onClick={() => setChecked({})} style={{ background: "none", border: "none", fontSize: "12px", color: "var(--text-3)", cursor: "pointer", padding: "4px", transition: "color 0.2s" }}
        onMouseEnter={e => e.target.style.color = "var(--text-2)"} onMouseLeave={e => e.target.style.color = "var(--text-3)"}>
        Reset checklist
      </button>
    </div>
  );
}
