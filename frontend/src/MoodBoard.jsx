// MoodBoard.jsx — AI-generated cinematic moodboard with framer-motion
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function MoodBoard({ plan, form }) {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!plan?.idea) return;
    setLoading(true);
    setUrls([]);
    fetch(`${API}/api/moodboard`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idea: plan.idea, tone: form?.tone || "Romantic", occasion: form?.occasion || "Surprise" }),
    })
      .then(r => r.json())
      .then(d => setUrls(d.urls || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [plan?.idea]);

  if (!loading && urls.length === 0) return null;

  return (
    <div style={{ marginBottom: "20px" }}>
      <div style={{ fontSize: "11px", fontWeight: "700", color: "var(--gold)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "12px", opacity: 0.8 }}>
        ✦ Moodboard
      </div>

      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          {[1,2,3,4].map(i => (
            <div key={i} style={{ height: "110px", borderRadius: "10px", background: "rgba(255,255,255,0.04)", animation: "shimmer 1.5s ease-in-out infinite" }} />
          ))}
        </div>
      ) : (
        <motion.div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}
          initial="hidden" animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
        >
          {urls.map((url, i) => (
            <motion.div
              key={i}
              variants={{ hidden: { opacity: 0, scale: 0.92 }, visible: { opacity: 1, scale: 1 } }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              onClick={() => setSelected(url)}
              style={{ cursor: "pointer", borderRadius: "10px", overflow: "hidden", position: "relative", aspectRatio: "4/3" }}
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
            >
              <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 60%)", borderRadius: "10px" }} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", cursor: "zoom-out" }}
          >
            <motion.img
              src={selected} alt=""
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ maxWidth: "100%", maxHeight: "90vh", borderRadius: "12px", objectFit: "contain" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
