import { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import api from "../utils/api";
import Loader from "../components/Loader";
import useSpeechToText from "../hooks/useSpeechToText";
import { Mic, Square, Volume2, Award, Zap } from "lucide-react";
import Timer from "../components/Timer";

const VoiceInterview = () => {
    const [step, setStep] = useState(1); // 1=Setup, 2=Interview, 3=Review
    const [role, setRole] = useState("Frontend Developer");
    const [qData, setQData] = useState(null); // { question, id }
    const { isListening, transcript, startListening, stopListening, resetTranscript } = useSpeechToText();
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState(null);

    // Waveform Animation logic
    const [bars, setBars] = useState(new Array(20).fill(10));
    useEffect(() => {
        if (!isListening) return;
        const interval = setInterval(() => {
            setBars(prev => prev.map(() => Math.random() * 40 + 10));
        }, 100);
        return () => clearInterval(interval);
    }, [isListening]);

    const startInterview = async () => {
        setLoading(true);
        try {
            // Use existing endpoint to generate a question for now
            const res = await api.post("/interview/generate-question", { role, difficulty: 'medium' });
            setQData(res.data);
            setStep(2);
            resetTranscript();
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const finishAnswer = async () => {
        stopListening();
        setLoading(true);
        try {
            // Send transcript to backend for real AI analysis
            const res = await api.post("/voice/process", {
                role,
                question: qData?.question || "Introduction",
                answerText: transcript
            });

            setFeedback({
                ...res.data,
                userTranscript: transcript
            });
            setStep(3);
        } catch (e) {
            console.error(e);
            setFeedback({
                transcript: transcript,
                feedback: "Error connecting to AI. Please check backend logs.",
                scores: { clarity: 0, confidence: 0, overall: 0 }
            });
            setStep(3);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: "100vh" }}>
            <Navbar />
            <main style={{ maxWidth: 1000, margin: "0 auto", padding: "2rem 1.5rem" }}>

                {step === 1 && (
                    <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                        <div style={{
                            width: 120, height: 120, margin: "0 auto 2rem", borderRadius: "50%",
                            background: "linear-gradient(135deg, #6366f1, #d946ef)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            boxShadow: "0 0 50px rgba(99, 102, 241, 0.4)"
                        }}>
                            <Mic size={60} color="white" />
                        </div>
                        <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem", fontWeight: 700 }}>Voice AI Interview</h1>
                        <p style={{ color: "#94a3b8", marginBottom: "2rem", fontSize: "1.1rem" }}>
                            Practice speaking confidently with our real-time AI voice coach.
                        </p>

                        <div style={{ maxWidth: 400, margin: "0 auto 2rem", textAlign: "left" }}>
                            <label style={{ display: 'block', marginBottom: 8, color: '#cbd5e1' }}>Select Role</label>
                            <select style={{ width: '100%', padding: '0.8rem' }} value={role} onChange={(e) => setRole(e.target.value)}>
                                <option>Frontend Developer</option>
                                <option>Backend Developer</option>
                                <option>Full-Stack Developer</option>
                                <option>Mobile App Developer</option>
                                <option>AI/ML Engineer</option>
                                <option>Data Scientist</option>
                                <option>Data Engineer</option>
                                <option>DevOps Engineer</option>
                                <option>Cloud Engineer</option>
                                <option>Cybersecurity Engineer</option>
                                <option>Blockchain Developer</option>
                            </select>
                        </div>

                        <button className="btn-gradient" style={{ fontSize: "1.1rem", padding: "1rem 3rem" }} onClick={startInterview}>
                            {loading ? <Loader /> : "Start Session"}
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div style={{ marginTop: "2rem" }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: "2rem" }}>
                            <span style={{ color: '#94a3b8' }}>Question 1/1</span>
                            <Timer duration={120} onTimeUp={() => { }} />
                        </div>

                        <h2 style={{ fontSize: "1.8rem", textAlign: "center", marginBottom: "3rem", lineHeight: 1.4 }}>
                            {qData?.question || "Tell me about yourself."}
                        </h2>

                        {/* Visualizer */}
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 4, height: 60, alignItems: 'center', marginBottom: "3rem" }}>
                            {bars.map((h, i) => (
                                <div key={i} style={{
                                    width: 6,
                                    height: isListening ? h : 4,
                                    background: isListening ? '#38bdf8' : '#334155',
                                    borderRadius: 99,
                                    transition: 'all 0.1s ease'
                                }} />
                            ))}
                        </div>

                        <div style={{ textAlign: "center" }}>
                            {!isListening ? (
                                <button className="btn-gradient" style={{ borderRadius: "50%", width: 80, height: 80, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }} onClick={startListening}>
                                    <Mic size={32} />
                                </button>
                            ) : (
                                <button style={{
                                    borderRadius: "50%", width: 80, height: 80, border: "2px solid #ef4444", background: "transparent", color: "#ef4444",
                                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                                }} onClick={finishAnswer}>
                                    <Square size={32} fill="currentColor" />
                                </button>
                            )}
                            <p style={{ marginTop: "1rem", color: "#94a3b8" }}>
                                {isListening ? "Listening... (Speak clearly)" : "Tap microphone to answer"}
                            </p>

                            {/* Live Transcript Preview */}
                            {transcript && (
                                <div style={{ marginTop: "2rem", padding: "1rem", background: "rgba(30,41,59,0.5)", borderRadius: 8, color: "#e2e8f0" }}>
                                    "{transcript}"
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {step === 3 && feedback && (
                    <div style={{ animation: "fadeIn 0.5s" }}>
                        <h2 style={{ fontSize: "2rem", textAlign: "center", marginBottom: "2rem" }}>Analysis Complete</h2>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
                            <Card>
                                <div className="glass-inner" style={{ padding: "1.5rem", textAlign: "center" }}>
                                    <Volume2 size={30} color="#38bdf8" style={{ marginBottom: 10 }} />
                                    <h3 style={{ fontSize: "2rem", fontWeight: 700 }}>{feedback.scores?.clarity}/10</h3>
                                    <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>Clarity</p>
                                </div>
                            </Card>
                            <Card>
                                <div className="glass-inner" style={{ padding: "1.5rem", textAlign: "center" }}>
                                    <Award size={30} color="#a855f7" style={{ marginBottom: 10 }} />
                                    <h3 style={{ fontSize: "2rem", fontWeight: 700 }}>{feedback.scores?.confidence}/10</h3>
                                    <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>Confidence</p>
                                </div>
                            </Card>
                            <Card>
                                <div className="glass-inner" style={{ padding: "1.5rem", textAlign: "center" }}>
                                    <Zap size={30} color="#fbbf24" style={{ marginBottom: 10 }} />
                                    <h3 style={{ fontSize: "2rem", fontWeight: 700 }}>{feedback.scores?.overall}/10</h3>
                                    <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>Overall</p>
                                </div>
                            </Card>
                        </div>

                        <Card>
                            <div className="glass-inner" style={{ padding: "2rem" }}>
                                <h3 style={{ fontSize: "1.2rem", color: "#e2e8f0", marginBottom: "1rem" }}>AI Coach Feedback</h3>
                                <p style={{ lineHeight: 1.6, color: "#cbd5e1" }}>
                                    {feedback.feedback}
                                </p>
                                <div style={{ marginTop: "1.5rem", padding: "1rem", background: "rgba(15,23,42,0.4)", borderRadius: 8 }}>
                                    <p style={{ fontSize: "0.9rem", color: "#94a3b8", marginBottom: 4 }}>You said:</p>
                                    <p style={{ fontStyle: "italic", color: "#e2e8f0" }}>"{feedback.userTranscript || transcript}"</p>
                                </div>
                            </div>
                        </Card>

                        <div style={{ marginTop: "2rem", textAlign: "center" }}>
                            <button className="btn-gradient" onClick={() => setStep(1)}>Practice Another Question</button>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
};

export default VoiceInterview;
