// NotFound.jsx — Beautiful 404 page
export default function NotFound({ onHome }) {
  return (
    <div style={{
      width: "100vw", minHeight: "100vh", background: "#080808", color: "#fff",
      fontFamily: "'DM Sans', sans-serif",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      textAlign: "center", padding: "40px 24px", position: "relative", overflow: "hidden",
    }}>
      {/* Background orbs */}
      <div style={{ position: "absolute", width: "600px", height: "600px", borderRadius: "50%", top: "-200px", left: "-200px", background: "radial-gradient(circle, rgba(123,110,232,0.08) 0%, transparent 65%)", animation: "orb1 12s ease-in-out infinite" }} />
      <div style={{ position: "absolute", width: "500px", height: "500px", borderRadius: "50%", bottom: "-150px", right: "-150px", background: "radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 65%)", animation: "orb2 16s ease-in-out infinite" }} />

      <div style={{ position: "relative", zIndex: 10 }}>
        <div style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(100px, 15vw, 180px)",
          fontWeight: "300", lineHeight: 1,
          background: "linear-gradient(135deg, #D4AF37 0%, #7B6EE8 50%, #D4AF37 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          marginBottom: "16px",
          animation: "shimmer 3s ease-in-out infinite",
          backgroundSize: "200% 200%",
        }}>
          404
        </div>

        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(24px, 4vw, 36px)",
          fontWeight: "300", marginBottom: "16px", color: "rgba(255,255,255,0.85)",
        }}>
          This surprise doesn't exist <span style={{ color: "#D4AF37", fontStyle: "italic" }}>yet</span>
        </h1>

        <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.35)", lineHeight: "1.8", maxWidth: "420px", margin: "0 auto 40px" }}>
          The page you're looking for might have been moved, deleted, or maybe it was the surprise all along.
        </p>

        <button onClick={onHome} style={{
          padding: "14px 40px", background: "#D4AF37", border: "none",
          color: "#080808", fontSize: "12px", letterSpacing: "0.14em",
          textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif",
          fontWeight: "700", cursor: "pointer", transition: "all 0.25s",
        }}
          onMouseEnter={e => { e.target.style.background = "#E8C84A"; e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 24px rgba(212,175,55,0.3)"; }}
          onMouseLeave={e => { e.target.style.background = "#D4AF37"; e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "none"; }}
        >
          Go back home →
        </button>
      </div>

      <style>{`
        @keyframes orb1 { 0%,100%{transform:translate(0,0) scale(1)} 40%{transform:translate(40px,-60px) scale(1.08)} 70%{transform:translate(-30px,30px) scale(0.94)} }
        @keyframes orb2 { 0%,100%{transform:translate(0,0) scale(1)} 35%{transform:translate(-50px,40px) scale(1.1)} 65%{transform:translate(25px,-25px) scale(0.9)} }
        @keyframes shimmer { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
      `}</style>
    </div>
  );
}
