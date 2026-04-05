// Scrapbook.jsx — Post-event memory scrapbook with AI story generation
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "./supabase";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Scrapbook({ plan, user }) {
  const [photos, setPhotos] = useState([]);
  const [howItWent, setHowItWent] = useState("");
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const handleFiles = async (files) => {
    if (!files?.length) return;
    const fileArr = Array.from(files).slice(0, 3 - photos.length);
    const newPhotos = [...photos];

    for (const file of fileArr) {
      // Preview locally
      const url = URL.createObjectURL(file);
      newPhotos.push({ url, file, uploaded: false });
    }
    setPhotos(newPhotos);

    // Upload to Supabase storage if logged in
    if (user && plan?.plan_id) {
      setUploading(true);
      for (let i = 0; i < newPhotos.length; i++) {
        const p = newPhotos[i];
        if (p.uploaded) continue;
        try {
          const path = `${plan.plan_id}/${Date.now()}_${p.file.name}`;
          const { data } = await supabase.storage.from("scrapbook").upload(path, p.file, { upsert: true });
          if (data) {
            const { data: pub } = supabase.storage.from("scrapbook").getPublicUrl(path);
            newPhotos[i] = { ...p, url: pub.publicUrl, uploaded: true };
          }
        } catch (e) { console.error(e); }
      }
      setPhotos([...newPhotos]);
      setUploading(false);
    }
  };

  const generateStory = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/scrapbook/story`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: plan?.idea, occasion: plan?.form?.occasion, how_it_went: howItWent }),
      });
      const d = await res.json();
      setStory(d.story || "");
    } catch {
      setStory("A beautiful memory was made today. 💫");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "0.5rem 0" }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, color: "var(--text-2, rgba(255,255,255,0.52))", lineHeight: 1.6 }}>
          The surprise has passed 🎉 Add photos and let AI write your memory story.
        </div>
      </div>

      {/* Photo upload */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--gold, #D4AF37)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10, opacity: 0.8 }}>Photos ({photos.length}/3)</div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 12 }}>
          {photos.map((p, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ aspectRatio: "1", borderRadius: 10, overflow: "hidden", position: "relative", border: "1px solid rgba(255,255,255,0.09)" }}>
              <img src={p.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <button onClick={() => setPhotos(photos.filter((_, j) => j !== i))} style={{ position: "absolute", top: 4, right: 4, width: 22, height: 22, borderRadius: "50%", background: "rgba(0,0,0,0.7)", border: "none", color: "#fff", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
            </motion.div>
          ))}
          {photos.length < 3 && (
            <div onClick={() => fileRef.current?.click()} style={{ aspectRatio: "1", borderRadius: 10, border: "2px dashed rgba(255,255,255,0.12)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", gap: 6, transition: "all 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(212,175,55,0.4)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"}
            >
              <div style={{ fontSize: 24 }}>📸</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "DM Sans" }}>Add photo</div>
            </div>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={e => handleFiles(e.target.files)} />
        {uploading && <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", fontFamily: "DM Sans" }}>Uploading...</div>}
      </div>

      {/* Notes */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--gold, #D4AF37)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8, opacity: 0.8 }}>How did it go? (optional)</div>
        <textarea
          value={howItWent}
          onChange={e => setHowItWent(e.target.value)}
          placeholder="They were completely surprised when... The best moment was..."
          style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.09)", background: "rgba(255,255,255,0.03)", color: "#fff", fontFamily: "DM Sans", fontSize: 14, resize: "none", height: 80, outline: "none", lineHeight: 1.6 }}
        />
      </div>

      {/* Generate Button */}
      <button
        onClick={generateStory}
        disabled={loading}
        style={{ width: "100%", padding: "13px", borderRadius: 10, border: "none", background: loading ? "rgba(212,175,55,0.3)" : "linear-gradient(135deg, #E8C84A, #D4AF37)", color: "#080808", fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "DM Sans", marginBottom: 16, transition: "all 0.2s" }}
      >
        {loading ? "✨ Writing your story..." : "✨ Generate Memory Story"}
      </button>

      {/* Story Output */}
      <AnimatePresence>
        {story && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 14, padding: "20px 18px", marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#D4AF37", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12, opacity: 0.8 }}>✦ Your Memory Story</div>
            <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 18, fontWeight: 300, fontStyle: "italic", color: "rgba(255,255,255,0.9)", lineHeight: 1.85 }}>{story}</p>
            <button
              onClick={() => navigator.clipboard.writeText(story)}
              style={{ marginTop: 16, padding: "7px 16px", borderRadius: 20, border: "1px solid rgba(212,175,55,0.3)", background: "none", color: "#D4AF37", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "DM Sans" }}
            >
              Copy story
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
