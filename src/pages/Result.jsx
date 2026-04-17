import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../utils/api";
import Loader from "../components/Loader";
import {
    RadialBarChart, RadialBar, ResponsiveContainer,
    Tooltip, BarChart, Bar, XAxis, YAxis, Cell
} from "recharts";

const Result = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResult = async () => {
            try {
                const res = await api.get(`/interview/result/${id}`);
                setResult(res.data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchResult();
    }, [id]);

    if (loading) return (
        <div style={{ minHeight: "100vh", background: "#000", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Loader />
        </div>
    );

    if (!result) return (
        <div style={{ minHeight: "100vh", background: "#000", color: "#fff" }}>
            <Navbar />
            <p style={{ textAlign: "center", marginTop: "4rem" }}>Result not found.</p>
        </div>
    );

    const scoreData = [
        { name: 'Score', value: result.overallScore, fill: '#fff' },
        { name: 'Max', value: 10, fill: 'transparent' }
    ];

    const getScore = (metricName) => {
        if (!result.dimensions) return 0;
        if (Array.isArray(result.dimensions)) {
            const found = result.dimensions.find(d =>
                d.metric && d.metric.toLowerCase().includes(metricName.toLowerCase())
            );
            return found ? found.value : 0;
        }
        return result.dimensions[metricName] || result.dimensions[metricName.toLowerCase()] || 0;
    };

    const dimensionData = [
        { name: 'Clarity', score: getScore('clarity') || getScore('accuracy') },
        { name: 'Technical', score: getScore('technical') },
        { name: 'Comms', score: getScore('communication') },
        { name: 'Logic', score: getScore('problem') },
    ];

    return (
        <div style={{ minHeight: "100vh", background: "#000", color: "#fff", fontFamily: "'Inter', sans-serif" }}>
            <Navbar />
            <main style={{ maxWidth: 1000, margin: "0 auto", padding: "4rem 2rem" }}>

                <div style={{ marginBottom: "4rem" }}>
                    <h1 style={{ fontSize: "2.8rem", fontWeight: 800, margin: "0 0 1rem 0", letterSpacing: '-1.5px' }}>Performance Brief</h1>
                    <p style={{ color: "#666", fontSize: "1.1rem", margin: 0 }}>Analytical breakdown of candidate response sequence.</p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>

                    {/* Score Card */}
                    <div style={{ background: '#111', borderRadius: '32px', border: '1px solid #222', padding: '3rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <h3 style={{ fontSize: "1rem", color: "#444", fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2rem' }}>Aggregate Score</h3>
                        <div style={{ width: 220, height: 220, position: 'relative' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <RadialBarChart cx="50%" cy="50%" innerRadius="75%" outerRadius="100%" barSize={12} data={scoreData} startAngle={90} endAngle={-270}>
                                    <RadialBar background={{ fill: '#050505' }} clockWise dataKey="value" cornerRadius={10} />
                                    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" style={{ fill: '#fff', fontSize: '3.5rem', fontWeight: 800 }}>
                                        {result.overallScore}
                                    </text>
                                </RadialBarChart>
                            </ResponsiveContainer>
                        </div>
                        <div style={{ marginTop: '2.5rem', fontSize: '0.9rem', fontWeight: 700, color: result.overallScore >= 7 ? '#fff' : '#666' }}>
                            STATUS: {result.overallScore >= 7 ? 'VALIDATED' : 'NEEDS REFINEMENT'}
                        </div>
                    </div>

                    {/* Dimensions Chart */}
                    <div style={{ background: '#111', borderRadius: '32px', border: '1px solid #222', padding: '3rem' }}>
                        <h3 style={{ fontSize: "1rem", color: "#444", fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2.5rem' }}>Metric Distribution</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={dimensionData} layout="vertical" margin={{ left: -20, right: 10 }}>
                                <XAxis type="number" domain={[0, 10]} hide />
                                <YAxis dataKey="name" type="category" width={80} tick={{ fill: '#444', fontSize: 11, fontWeight: 700 }} />
                                <Bar dataKey="score" barSize={16} radius={[0, 8, 8, 0]}>
                                    {dimensionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.score >= 7 ? '#fff' : '#222'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "1.5rem", marginBottom: "4rem" }}>
                    <FeedbackBox title="Neural Strengths" items={result.strengths} color="#fff" />
                    <FeedbackBox title="Structural Delta" items={result.improvements} color="#666" />
                </div>

                <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem" }}>
                    <button
                        onClick={() => navigate("/dashboard")}
                        style={{ flex: 1, padding: "1.2rem", borderRadius: "14px", border: "1px solid #222", background: "transparent", color: "#666", fontWeight: 700, cursor: "pointer", transition: 'all 0.2s' }}
                    >
                        Return to Console
                    </button>
                    <button
                        onClick={() => navigate("/mock-interview")}
                        style={{ flex: 1, padding: "1.2rem", borderRadius: "14px", background: "#fff", color: "#000", border: "none", fontWeight: 800, cursor: "pointer", transition: 'all 0.2s' }}
                    >
                        Initialize New Matrix
                    </button>
                </div>
            </main>
        </div>
    );
};

const FeedbackBox = ({ title, items, color }) => (
    <div style={{ background: '#050505', borderRadius: '28px', border: '1px solid #1a1a1a', padding: '3rem' }}>
        <h3 style={{ fontSize: "0.8rem", color: "#444", fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '2rem' }}>{title}</h3>
        <ul style={{ padding: 0, listStyle: 'none', margin: 0 }}>
            {items && items.length > 0 ? (
                items.map((s, i) => (
                    <li key={i} style={{ marginBottom: "1.2rem", color: color, lineHeight: "1.6", display: 'flex', gap: '15px', fontSize: '0.95rem' }}>
                        <span style={{ color: '#222', fontWeight: 900 }}>—</span> {s}
                    </li>
                ))
            ) : (
                <p style={{ color: "#222" }}>No data points isolated.</p>
            )}
        </ul>
    </div>
);

export default Result;
