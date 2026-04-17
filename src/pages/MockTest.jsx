import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import api from "../utils/api";
import Loader from "../components/Loader";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MockTest = () => {
    const [step, setStep] = useState(1); // 1=Setup, 2=Test, 3=Result
    const [role, setRole] = useState("Frontend Developer");
    const [questionCount, setQuestionCount] = useState(5);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(false);
    const [score, setScore] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) navigate("/login");
    }, [navigate]);

    const fetchTest = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get(`/test/${role}?count=${questionCount}`);
            setQuestions(res.data);
            setStep(2);
        } catch (e) {
            setError("Failed to initialize test console. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (qId, optionIdx) => {
        setAnswers(prev => ({ ...prev, [qId]: optionIdx }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await api.post("/test/submit", { role, answers });
            setScore(res.data.score);
            setStep(3);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const progress = Math.round((Object.keys(answers).length / (questions.length || 1)) * 100) || 0;

    return (
        <div style={{ minHeight: "100vh", background: "#000", color: "#fff", fontFamily: "'Inter', sans-serif" }}>
            <Navbar />
            <main style={{ maxWidth: 1000, margin: "0 auto", padding: "4rem 2rem" }}>

                {step === 1 && (
                    <div style={{ maxWidth: 600, margin: "4rem auto", textAlign: "center" }}>
                        <div style={{
                            width: 64, height: 64, background: '#fff', borderRadius: '16px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem',
                            boxShadow: '0 0 40px rgba(255,255,255,0.1)'
                        }}>
                            <CheckCircle size={32} color="#000" />
                        </div>
                        <h1 style={{ fontSize: "2.8rem", fontWeight: 800, marginBottom: "1rem", letterSpacing: '-1.5px' }}>Technical Assessment</h1>
                        <p style={{ color: "#666", fontSize: "1.1rem", marginBottom: "3rem" }}>
                            Standardized MCQ matrix to evaluate technical proficiency.
                        </p>

                        <div style={{ background: '#111', padding: '3rem', borderRadius: '24px', border: '1px solid #222', textAlign: 'left' }}>
                            <label style={{ fontSize: '0.75rem', color: '#666', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '12px' }}>Skill Domain</label>
                            <select
                                style={{ width: '100%', padding: '1rem', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '12px', marginBottom: '2rem', outline: 'none' }}
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <option>Frontend Developer</option>
                                <option>Backend Developer</option>
                                <option>Full-Stack Developer</option>
                                <option>AI/ML Engineer</option>
                                <option>Data Scientist</option>
                                <option>DevOps Engineer</option>
                                <option>Cloud Architect</option>
                                <option>Cybersecurity Analyst</option>
                                <option>Product Manager</option>
                                <option>Mobile Developer (iOS/Android)</option>
                                <option>Database Administrator</option>
                                <option>Embedded Systems Engineer</option>
                            </select>

                            <div style={{ marginBottom: "2.5rem" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: '12px' }}>
                                    <label style={{ fontSize: '0.75rem', color: '#666', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Evaluation Depth</label>
                                    <span style={{ color: '#fff', fontWeight: 800 }}>{questionCount} Questions</span>
                                </div>
                                <input
                                    type="range" min="3" max="20" value={questionCount}
                                    onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                                    style={{ width: "100%", cursor: "pointer", accentColor: '#fff' }}
                                />
                            </div>

                            <button
                                onClick={fetchTest}
                                style={{
                                    width: '100%', padding: '1.2rem', borderRadius: '14px', background: '#fff', color: '#000',
                                    border: 'none', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                            >
                                {loading ? <Loader /> : "Initialize Assessment"}
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: "2.5rem" }}>
                            <div>
                                <h1 style={{ fontSize: "2.2rem", fontWeight: 800, margin: 0, letterSpacing: '-1px' }}>{role} Console</h1>
                                <p style={{ color: "#666", margin: '0.5rem 0 0 0' }}>Ensure all parameters are addressed before transmission.</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: "2rem", fontWeight: 800 }}>{progress}%</div>
                                <div style={{ fontSize: "0.75rem", color: '#444', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Coverage</div>
                            </div>
                        </div>

                        <div style={{ width: '100%', height: 4, background: '#111', borderRadius: 2, marginBottom: "4rem", overflow: 'hidden' }}>
                            <div style={{ width: `${progress}%`, height: '100%', background: '#fff', transition: 'width 0.4s' }}></div>
                        </div>

                        <div style={{ display: 'grid', gap: "1.5rem" }}>
                            {questions.map((q, idx) => (
                                <div key={q.id} style={{ background: '#050505', borderRadius: '20px', border: '1px solid #1a1a1a', padding: '2.5rem' }}>
                                    <h3 style={{ fontSize: "1.2rem", marginBottom: "2rem", color: '#fff', fontWeight: 600, lineHeight: 1.5 }}>
                                        <span style={{ color: '#333', marginRight: '1rem', fontFamily: 'monospace' }}>[{idx + 1}]</span>
                                        {q.question}
                                    </h3>
                                    <div style={{ display: 'grid', gap: '0.8rem' }}>
                                        {q.options.map((opt, i) => {
                                            const isSelected = answers[q.id] === i;
                                            return (
                                                <div
                                                    key={i}
                                                    onClick={() => handleSelect(q.id, i)}
                                                    style={{
                                                        padding: "1.2rem 1.5rem", borderRadius: "12px",
                                                        border: isSelected ? "1px solid #fff" : "1px solid #111",
                                                        background: isSelected ? "#fff" : "#0a0a0a",
                                                        color: isSelected ? "#000" : "#666",
                                                        cursor: "pointer", display: 'flex', alignItems: 'center', gap: '1.2rem',
                                                        transition: 'all 0.2s', fontWeight: isSelected ? 700 : 500
                                                    }}
                                                >
                                                    <div style={{
                                                        width: 20, height: 20, borderRadius: '50%',
                                                        border: `2px solid ${isSelected ? '#000' : '#222'}`,
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                    }}>
                                                        {isSelected && <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#000' }} />}
                                                    </div>
                                                    {opt}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ marginTop: "4rem", textAlign: "center" }}>
                            <button
                                onClick={handleSubmit}
                                disabled={Object.keys(answers).length !== questions.length || loading}
                                style={{
                                    padding: '1.2rem 4rem', borderRadius: '16px',
                                    background: (Object.keys(answers).length !== questions.length) ? '#111' : '#fff',
                                    color: (Object.keys(answers).length !== questions.length) ? '#333' : '#000',
                                    border: 'none', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer'
                                }}
                            >
                                {loading ? <Loader /> : "Authorize Submission"}
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div style={{ textAlign: "center", maxWidth: 500, margin: "4rem auto" }}>
                        <div style={{ marginBottom: '3rem' }}>
                            <h2 style={{ fontSize: "3rem", fontWeight: 800, letterSpacing: '-2px' }}>Performance</h2>
                            <p style={{ color: "#666", fontSize: '1.1rem' }}>Data packets processed. Here is your evaluation.</p>
                        </div>

                        <div style={{ padding: '4rem', background: '#111', borderRadius: '32px', border: '1px solid #222', marginBottom: '3rem' }}>
                            <div style={{ fontSize: "6rem", fontWeight: 800, color: "#fff", lineHeight: 1 }}>{score}</div>
                            <div style={{ fontSize: "1.2rem", color: "#444", fontWeight: 700, marginTop: '1rem' }}>AGGREGATE SCORE / 10</div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                onClick={() => navigate("/dashboard")}
                                style={{ flex: 1, padding: '1.2rem', borderRadius: '14px', background: '#fff', color: '#000', border: 'none', fontWeight: 800, cursor: 'pointer' }}
                            >
                                Console Home
                            </button>
                            <button
                                onClick={() => setStep(1)}
                                style={{ flex: 1, padding: '1.2rem', borderRadius: '14px', background: 'transparent', color: '#fff', border: '1px solid #222', fontWeight: 600, cursor: 'pointer' }}
                            >
                                Restart Matrix
                            </button>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
};

export default MockTest;
