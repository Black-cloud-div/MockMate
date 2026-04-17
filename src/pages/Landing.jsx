import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { ArrowRight, Play, Terminal, Cpu, Database, Command } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff", fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      {/* Hero Section */}
      <section style={{
        minHeight: "80vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
        textAlign: "center", padding: "4rem 2rem", position: "relative"
      }}>
        <div style={{
          position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)",
          width: "40vw", height: "40vw", background: "radial-gradient(circle, rgba(255, 255, 255, 0.03) 0%, transparent 70%)",
          zIndex: 0, pointerEvents: "none"
        }}></div>

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: '#111', padding: '6px 16px', borderRadius: '100px',
          border: '1px solid #222', fontSize: '0.85rem', fontWeight: 600,
          marginBottom: '2rem', color: '#888', zIndex: 1
        }}>
          <span style={{ color: '#fff' }}>New</span> v2.4 Live Audio Neural Analysis
        </div>

        <h1 style={{
          fontSize: "clamp(3.5rem, 8vw, 6rem)", fontWeight: 800, lineHeight: 1,
          marginBottom: "1.5rem", letterSpacing: '-4px', zIndex: 1
        }}>
          MockMate
        </h1>

        <p style={{ fontSize: "1.4rem", color: "#ccc", maxWidth: "750px", marginBottom: "1rem", lineHeight: 1.3, fontWeight: 500, letterSpacing: '-0.5px', zIndex: 1 }}>
          The AI-Native Technical Interview Console.
        </p>

        <p style={{ fontSize: "1.1rem", color: "#666", maxWidth: "600px", marginBottom: "3rem", lineHeight: 1.6, zIndex: 1 }}>
          Hone your technical delivery with high-fidelity voice AI, role-specific logic matrices, and precision performance metrics.
        </p>

        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", justifyContent: "center", zIndex: 1 }}>
          <button
            style={{
              display: "flex", alignItems: "center", gap: "10px", fontSize: "1rem", fontWeight: 800,
              padding: '1.2rem 2.5rem', borderRadius: '14px', background: '#fff', color: '#000',
              border: 'none', cursor: 'pointer', transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            onClick={() => navigate("/dashboard")}
          >
            Initialize Console <ArrowRight size={20} />
          </button>
          <button onClick={() => setShowDemo(true)} style={{
            background: "transparent", border: "1px solid #222",
            color: "#fff", padding: "1.2rem 2.5rem", borderRadius: "14px", fontSize: "1rem",
            fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "10px",
            transition: 'all 0.2s'
          }}
            onMouseEnter={(e) => e.target.style.borderColor = '#444'}
            onMouseLeave={(e) => e.target.style.borderColor = '#222'}
          >
            <Play size={18} fill="currentColor" /> System Demo
          </button>
        </div>
      </section>

      {/* Video Modal */}
      {showDemo && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          background: "rgba(0,0,0,0.95)", zIndex: 100,
          display: "flex", alignItems: "center", justifyContent: "center",
          backdropFilter: "blur(20px)"
        }} onClick={() => setShowDemo(false)}>
          <div style={{
            position: "relative", width: "90%", maxWidth: "1000px", aspectRatio: "16/9",
            background: "#111", borderRadius: "24px", overflow: "hidden", border: '1px solid #333'
          }} onClick={(e) => e.stopPropagation()}>
            <iframe
              width="100%" height="100%"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1"
              title="Demo Video" frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <button
              onClick={() => setShowDemo(false)}
              style={{
                position: "absolute", top: 20, right: 20,
                background: "#fff", color: "#000",
                border: "none", borderRadius: "50%", width: 36, height: 36,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 900
              }}
            >✕</button>
          </div>
        </div>
      )}

      {/* Stats Section */}
      <section style={{ padding: "4rem 2rem", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1.5rem", padding: "3rem", background: '#111', border: '1px solid #222', borderRadius: '32px'
        }}>
          <StatItem value="10k+" label="Neural Sessions" />
          <StatItem value="15+" label="Tech Matrices" />
          <StatItem value="92%" label="Deployment Rate" />
          <StatItem value="24/7" label="Upstream Access" />
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: "6rem 2rem", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "left", marginBottom: "5rem" }}>
          <h2 style={{ fontSize: "3rem", fontWeight: 800, marginBottom: "1rem", letterSpacing: '-2px' }}>Operational Toolkit</h2>
          <p style={{ color: "#666", fontSize: "1.2rem", maxWidth: '600px' }}>Precision-engineered modules for comprehensive technical validation.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
          <FeatureCard
            icon={<Terminal size={32} />}
            title="Voice AI Protocol"
            desc="Neural speech processing for real-time delivery analysis and dynamic follow-up generation."
          />
          <FeatureCard
            icon={<Cpu size={32} />}
            title="Domain Specificity"
            desc="Architecture-level question matrices for Frontend, Backend, System Design and AI roles."
          />
          <FeatureCard
            icon={<Database size={32} />}
            title="Persistence Engine"
            desc="Historical session analysis and performance heatmaps to track your evolution over cycles."
          />
          <FeatureCard
            icon={<Command size={32} />}
            title="Instant Synthesis"
            desc="Asynchronous feedback loops providing detailed metrics on logic, confidence and clarity."
          />
        </div>
      </section>

      <footer style={{ borderTop: "1px solid #111", padding: "4rem 2rem", textAlign: "center", color: "#333" }}>
        <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>© 2025 MockMate Systems. Optimized for Future Engineers.</p>
      </footer>
    </div >
  );
};

const StatItem = ({ value, label }) => (
  <div style={{ textAlign: "center" }}>
    <h3 style={{ fontSize: "2.5rem", fontWeight: 800, color: "#fff", margin: 0, letterSpacing: '-1.5px' }}>{value}</h3>
    <p style={{ color: "#444", fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginTop: '5px' }}>{label}</p>
  </div>
);

const FeatureCard = ({ icon, title, desc }) => (
  <div style={{
    background: '#050505', padding: '3rem', borderRadius: '24px', border: '1px solid #1a1a1a',
    transition: 'all 0.3s ease'
  }}
    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.background = '#080808'; }}
    onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#1a1a1a'; e.currentTarget.style.background = '#050505'; }}
  >
    <div style={{ color: '#fff', marginBottom: '1.5rem' }}>{icon}</div>
    <h3 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "0.8rem", letterSpacing: '-0.5px' }}>{title}</h3>
    <p style={{ color: "#555", lineHeight: 1.6, fontSize: '0.95rem' }}>{desc}</p>
  </div>
);

export default Landing;
