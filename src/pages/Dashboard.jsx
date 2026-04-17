import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../utils/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get("/interview/history");
        setHistory(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this session?")) return;
    try {
      await api.delete(`/interview/${id}`);
      setHistory(prev => prev.filter(h => h.id !== id));
    } catch (e) {
      alert("Failed to delete session.");
    }
  };

  const scoredInterviews = history.filter(h => h.overallScore !== null && h.overallScore !== undefined);
  const avgScore = scoredInterviews.length > 0
    ? (scoredInterviews.reduce((a, b) => a + b.overallScore, 0) / scoredInterviews.length).toFixed(1)
    : "0.0";

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff", fontFamily: "'Inter', sans-serif" }}>
      <Navbar />
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "4rem 2rem" }}>

        {/* Header Section */}
        <div style={{ marginBottom: "4rem" }}>
          <h1 style={{ fontSize: "2.8rem", fontWeight: 800, margin: "0 0 1rem 0", letterSpacing: '-1.5px' }}>Your Console</h1>
          <p style={{ color: "#666", fontSize: "1.1rem", margin: 0 }}>Practice, perform, and analyze your progress.</p>
        </div>

        {/* Mode Selector */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "1.5rem", marginBottom: "4rem" }}>
          <ModeCard
            title="AI Video Session"
            description="Engage in a live technical interview with Sydney Sweeney. Real-time voice and face analysis."
            icon="👩‍💼"
            onClick={() => navigate('/mock-interview?mode=video')}
            primary
          />
          <ModeCard
            title="Technical Assessment"
            description="Focused descriptive interview for deep-dive technical logic and system design mapping."
            icon="📝"
            onClick={() => navigate('/mock-interview?mode=descriptive')}
          />
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
          <StatBox label="Average Performance" value={avgScore} unit="/10" color="#fff" />
          <StatBox label="Sessions Conducted" value={history.length} color="#666" />
          <StatBox label="Global Rank" value="Top 5%" color="#666" />
        </div>

        {/* Activity Feed */}
        <div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.5rem', letterSpacing: '-0.5px' }}>Historical Activity</h3>
          <div style={{ background: '#111', borderRadius: '24px', border: '1px solid #222', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #222', textAlign: 'left' }}>
                  <th style={tableHeaderStyle}>Role / Experience</th>
                  <th style={tableHeaderStyle}>Difficulty</th>
                  <th style={tableHeaderStyle}>Final Score</th>
                  <th style={tableHeaderStyle}>Action</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #1a1a1a' }}>
                    <td style={tableCellStyle}>
                      <div style={{ fontWeight: 600 }}>{h.role}</div>
                      <div style={{ fontSize: '0.8rem', color: '#555' }}>{new Date(h.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td style={tableCellStyle}>
                      <span style={badgeStyle}>{h.difficulty}</span>
                    </td>
                    <td style={{ ...tableCellStyle, fontWeight: 800, color: h.overallScore ? '#fff' : '#444' }}>
                      {h.overallScore ? `${h.overallScore}/10` : 'Pending'}
                    </td>
                    <td style={tableCellStyle}>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                          onClick={() => navigate(`/result/${h.id}`)}
                          style={{ background: 'none', border: 'none', color: '#6366f1', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                        >
                          Details
                        </button>
                        <button
                          onClick={() => handleDelete(h.id)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: 600, cursor: 'pointer', padding: 0, fontSize: '0.85rem' }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {history.length === 0 && (
              <div style={{ padding: '4rem', textAlign: 'center', color: '#444' }}>No session data available. Start practicing to see results.</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

const ModeCard = ({ title, description, icon, onClick, primary }) => (
  <div
    onClick={onClick}
    style={{
      background: primary ? '#fff' : '#111',
      color: primary ? '#000' : '#fff',
      padding: '2.5rem',
      borderRadius: '24px',
      border: primary ? 'none' : '1px solid #222',
      cursor: 'pointer',
      transition: 'all 0.2s',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    }}
    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
  >
    <div style={{ fontSize: '3rem' }}>{icon}</div>
    <h3 style={{ fontSize: '1.5rem', margin: 0, fontWeight: 700 }}>{title}</h3>
    <p style={{ margin: 0, fontSize: '0.95rem', opacity: 0.8, lineHeight: 1.6 }}>{description}</p>
    <button style={{
      marginTop: 'auto', padding: '0.8rem', borderRadius: '12px',
      background: primary ? '#000' : '#fff', color: primary ? '#fff' : '#000',
      border: 'none', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer'
    }}>
      Launch Session
    </button>
  </div>
);

const StatBox = ({ label, value, unit, color }) => (
  <div style={{ background: '#111', padding: '2rem', borderRadius: '24px', border: '1px solid #222' }}>
    <div style={{ fontSize: '0.8rem', color: '#666', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.5rem' }}>{label}</div>
    <div style={{ fontSize: '2.2rem', fontWeight: 800, color: color }}>
      {value}
      {unit && <span style={{ fontSize: '1rem', color: '#444' }}>{unit}</span>}
    </div>
  </div>
);

const tableHeaderStyle = { padding: '1.2rem', fontSize: '0.75rem', color: '#555', textTransform: 'uppercase', letterSpacing: '1px' };
const tableCellStyle = { padding: '1.2rem' };
const badgeStyle = { px: '8px', py: '2px', background: '#222', color: '#aaa', borderRadius: '6px', fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 700, padding: '4px 8px' };

export default Dashboard;
