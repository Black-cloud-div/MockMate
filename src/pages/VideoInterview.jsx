import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import Navbar from '../components/Navbar';
import LiveScores from '../components/LiveScores';
import api from '../utils/api';
import Loader from "../components/Loader";
import { Mic, MicOff, Volume2, RefreshCw } from "lucide-react";

const InterviewerSquare = ({ isSpeaking, isThinking }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current) {
            if (isSpeaking) {
                videoRef.current.playbackRate = 1.0;
                videoRef.current.play().catch(e => console.log("Video play blocked"));
            } else {
                // Subtle "listening" movement
                videoRef.current.playbackRate = 0.5;
            }
        }
    }, [isSpeaking]);

    return (
        <div style={{
            position: 'relative',
            width: '320px',
            height: '320px',
            flexShrink: 0,
            borderRadius: '16px',
            overflow: 'hidden',
            border: isSpeaking ? '4px solid #38bdf8' : '2px solid rgba(255,255,255,0.1)',
            boxShadow: isSpeaking ? '0 0 30px rgba(56, 189, 248, 0.4)' : 'none',
            transition: 'all 0.3s ease',
            background: '#0f172a'
        }}>
            {/* Professional Female Interviewer Video Loop */}
            <video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                onError={() => {
                    console.error("Video failed to load, falling back to static image.");
                }}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    opacity: isThinking ? 0.6 : 1,
                    transition: 'opacity 0.5s ease',
                }}
            >
                {/* Active loop mirror 1 */}
                <source src="https://assets.mixkit.co/videos/preview/mixkit-young-woman-talking-on-video-call-at-home-43254-large.mp4" type="video/mp4" />
                {/* Active loop mirror 2 */}
                <source src="https://assets.mixkit.co/videos/preview/mixkit-confident-businesswoman-talking-to-camera-30113-large.mp4" type="video/mp4" />
                {/* Fallback to image */}
                <img src="/interviewer.png" alt="AI Interviewer" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </video>

            {isSpeaking && (
                <div style={{
                    position: 'absolute',
                    bottom: '15px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: '4px',
                    zIndex: 10
                }}>
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="voice-bar-small" style={{ animationDelay: `${i * 0.1}s` }} />
                    ))}
                </div>
            )}

            {isThinking && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(15, 23, 42, 0.6)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 11
                }}>
                    <div className="thinking-dots">
                        <span></span><span></span><span></span>
                    </div>
                </div>
            )}

            <div style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                background: 'rgba(0,0,0,0.6)',
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '0.65rem',
                fontWeight: 700,
                color: isSpeaking ? '#38bdf8' : '#cbd5e1',
                zIndex: 12,
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
            }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: isSpeaking ? '#38bdf8' : '#64748b' }} />
                RECRUITER
            </div>
        </div>
    );
};

const VideoInterview = () => {
    const navigate = useNavigate();
    const webcamRef = useRef(null);

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Setup State
    const [role, setRole] = useState('Frontend Developer');
    const [difficulty, setDifficulty] = useState('medium');
    const [resume, setResume] = useState(null);
    const [resumeText, setResumeText] = useState("");

    // Interview State
    const [capturing, setCapturing] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState('');
    const [questionNumber, setQuestionNumber] = useState(1);
    const [interviewId, setInterviewId] = useState(null);
    const totalQuestions = 5;

    const [scores, setScores] = useState({ communication: 0, technical: 0, confidence: 0 });
    const [proTip, setProTip] = useState('Maintain good eye contact with the camera and speak clearly.');
    const [transcript, setTranscript] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    const roles = [
        "Frontend Developer", "Backend Developer", "Full‑Stack Developer",
        "Mobile App Developer", "AI/ML Engineer", "Data Scientist",
        "Data Engineer", "DevOps Engineer", "Cloud Engineer",
        "Cybersecurity Engineer", "Blockchain Developer"
    ];

    const handleResumeUpload = async (file) => {
        if (file.size > 5 * 1024 * 1024) { alert("File size should be less than 5MB"); return; }
        setResume(file);
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('resume', file);
            const res = await api.post("/interview/extract-resume", formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            setResumeText(res.data.text);
        } catch (error) {
            console.error("Resume Analysis Error:", error);
            alert("Failed to analyze resume. Using general technical questions.");
        } finally { setLoading(false); }
    };

    // Speech Recognition
    useEffect(() => {
        if (step === 2 && 'webkitSpeechRecognition' in window) {
            const recognition = new window.webkitSpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.onresult = (event) => {
                let finalTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const t = event.results[i][0].transcript;
                    if (event.results[i].isFinal) finalTranscript += t + ' ';
                }
                if (finalTranscript) {
                    setTranscript(prev => prev + finalTranscript);
                    analyzeResponse(finalTranscript);
                }
            };
            if (capturing) { try { recognition.start(); } catch (e) { } }
            return () => { try { recognition.stop(); } catch (e) { } };
        }
    }, [capturing, step]);

    const analyzeResponse = (text) => {
        if (isAnalyzing) return;
        setIsAnalyzing(true);
        setTimeout(() => {
            setScores(prev => ({
                communication: parseFloat(Math.min(10, prev.communication + 0.3).toFixed(1)),
                technical: parseFloat(Math.min(10, prev.technical + 0.5).toFixed(1)),
                confidence: parseFloat(Math.min(10, prev.confidence + 0.2).toFixed(1))
            }));
            setIsAnalyzing(false);
        }, 1000);
    };

    const handleStartSession = async () => {
        setLoading(true);
        try {
            const res = await api.post('/interview/generate-question', { role, difficulty, resumeContext: resumeText || "" });
            setInterviewId(res.data.interviewId);
            setCurrentQuestion(res.data.question);
            setStep(2);
        } catch (e) {
            setCurrentQuestion("Welcome. Please tell me about your technical background and why you applied for this role.");
            setStep(2);
        } finally { setLoading(false); }
    };

    const handleNextQuestion = async () => {
        if (questionNumber < totalQuestions) {
            setLoading(true);
            const prevQ = currentQuestion;
            const prevA = transcript;
            setTranscript('');
            setQuestionNumber(prev => prev + 1);

            try {
                const res = await api.post('/interview/generate-followup', {
                    role,
                    previousQuestion: prevQ,
                    previousAnswer: prevA || "The candidate provided a technical response."
                });
                setCurrentQuestion(res.data.question);
            } catch (e) {
                const res = await api.post('/interview/generate-question', { role, difficulty });
                setCurrentQuestion(res.data.question);
            } finally { setLoading(false); }
        } else {
            setLoading(true);
            try {
                const overall = Math.round((scores.communication + scores.technical + scores.confidence) / 3);
                await api.post('/interview/submit', {
                    interviewId,
                    answerText: `Conversational interview completed. Final Transcript: ${transcript}`,
                    overallScore: overall
                });
                navigate('/dashboard');
            } catch (e) { navigate('/dashboard'); } finally { setLoading(false); }
        }
    };

    const speakQuestion = (text) => {
        if (!text) return;
        const synth = window.speechSynthesis;
        if (synth.speaking) synth.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        const voices = synth.getVoices();

        // Find a professional female voice
        const femaleVoice = voices.find(v =>
            v.name.includes('Google US English') ||
            v.name.includes('Samantha') ||
            v.name.includes('Female') ||
            v.name.includes('Zira') ||
            v.name.includes('Victoria')
        );

        if (femaleVoice) utterance.voice = femaleVoice;
        utterance.pitch = 1.1;
        utterance.rate = 0.95; // Slightly slower for professional feel

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        synth.speak(utterance);
    };

    useEffect(() => {
        if (currentQuestion && step === 2) {
            const timer = setTimeout(() => speakQuestion(currentQuestion), 800);
            return () => clearTimeout(timer);
        }
    }, [currentQuestion, step]);

    useEffect(() => {
        const loadVoices = () => {
            window.speechSynthesis.getVoices();
        };
        window.speechSynthesis.onvoiceschanged = loadVoices;
        loadVoices();
        return () => {
            window.speechSynthesis.onvoiceschanged = null;
            window.speechSynthesis.cancel();
        };
    }, []);

    return (
        <div style={{ minHeight: '100vh', background: '#020617', color: '#f8fafc' }}>
            <Navbar />
            <main style={{ padding: '2rem 1.5rem', maxWidth: '1400px', margin: '0 auto' }}>

                {step === 1 ? (
                    <div style={{ maxWidth: 600, margin: "2rem auto" }}>
                        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                            <h2 style={{ fontSize: "2.5rem", fontWeight: 800, background: 'linear-gradient(to right, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                Interactive AI Interview
                            </h2>
                            <p style={{ color: "#94a3b8", marginTop: '0.5rem' }}>Experience a real-time conversational interview with our AI Recruitment Lead</p>
                        </div>

                        <div className="glass-card" style={{ padding: "2.5rem", borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ marginBottom: "1.5rem" }}>
                                <label style={{ display: "block", marginBottom: "0.8rem", color: "#94a3b8", fontSize: '0.9rem' }}>Select Your Target Role</label>
                                <select value={role} onChange={(e) => setRole(e.target.value)}
                                    style={{ width: "100%", padding: "1rem", borderRadius: "12px", background: "#0f172a", color: "white", border: "1px solid rgba(148,163,184,0.1)" }}>
                                    {roles.map((r) => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>

                            <div style={{ marginBottom: "2rem" }}>
                                <label style={{ display: "block", marginBottom: "0.8rem", color: "#94a3b8", fontSize: '0.9rem' }}>Upload Resume (PDF)</label>
                                <div style={{ border: "2px dashed rgba(56,189,248,0.2)", borderRadius: "12px", padding: "2rem", textAlign: "center", background: "rgba(15,23,42,0.5)", cursor: "pointer" }}
                                    onClick={() => document.getElementById('resumeInput').click()}>
                                    <input id="resumeInput" type="file" accept=".pdf" style={{ display: "none" }} onChange={(e) => e.target.files[0] && handleResumeUpload(e.target.files[0])} />
                                    {resume ? <p style={{ color: "#4ade80", fontWeight: 600 }}>✅ {resume.name}</p> : <p style={{ color: "#64748b" }}>Click to upload for personalized questions</p>}
                                </div>
                            </div>

                            <div style={{ marginBottom: "2rem" }}>
                                <label style={{ display: "block", marginBottom: "0.8rem", color: "#94a3b8", fontSize: '0.9rem' }}>Difficulty</label>
                                <div style={{ display: "flex", gap: "1rem" }}>
                                    {["easy", "medium", "hard"].map((lvl) => (
                                        <button key={lvl} onClick={() => setDifficulty(lvl)}
                                            style={{ flex: 1, padding: "1rem", borderRadius: "12px", border: difficulty === lvl ? "2px solid #38bdf8" : "1px solid rgba(148,163,184,0.1)", background: difficulty === lvl ? "rgba(56,189,248,0.1)" : "transparent", color: difficulty === lvl ? "#38bdf8" : "#64748b", fontWeight: 600, textTransform: "capitalize" }}>
                                            {lvl}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button className="btn-gradient" onClick={handleStartSession} disabled={loading} style={{ width: "100%", padding: "1.2rem", fontSize: "1.1rem", borderRadius: '12px' }}>
                                {loading ? <Loader /> : "Start Interview Call"}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', alignItems: 'start' }}>
                        <div>
                            {/* VIDEO CALL INTERFACE - SIDE BY SIDE GRID */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 320px',
                                gap: '1.5rem',
                                marginBottom: '2rem',
                                background: 'rgba(15, 23, 42, 0.4)',
                                padding: '1.5rem',
                                borderRadius: '24px',
                                border: '1px solid rgba(255,255,255,0.05)',
                                alignItems: 'center'
                            }}>
                                {/* User (Webcam) */}
                                <div style={{
                                    position: 'relative',
                                    width: '100%',
                                    aspectRatio: '16/9',
                                    borderRadius: '16px',
                                    overflow: 'hidden',
                                    background: '#000',
                                    boxShadow: '0 4px 30px rgba(0,0,0,0.5)',
                                    border: '1px solid rgba(255,255,255,0.1)'
                                }}>
                                    <Webcam ref={webcamRef} audio={false} mirrored={true} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <div style={{ position: 'absolute', bottom: '15px', left: '15px', background: 'rgba(15, 23, 42, 0.8)', padding: '5px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600 }}>Candidate (You)</div>
                                </div>

                                {/* AI Interviewer (Fixed Square) */}
                                <div style={{ width: '320px', height: '320px' }}>
                                    <InterviewerSquare isSpeaking={isSpeaking} isThinking={loading} />
                                </div>
                            </div>

                            {/* Dialogue & Controls */}
                            <div style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.4), rgba(15, 23, 42, 0.6))', borderRadius: '24px', padding: '2.5rem', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.2rem', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <div style={{ background: '#38bdf8', height: '2px', width: '24px' }} />
                                        <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 800, letterSpacing: '0.1em' }}>MOCKMATE AI COACH • QUESTION {questionNumber}/{totalQuestions}</span>
                                    </div>
                                    {isSpeaking && <div style={{ display: 'flex', gap: '3px' }}>
                                        {[1, 2, 3].map(i => <div key={i} style={{ width: '3px', height: '12px', background: '#38bdf8', animation: 'voice-pulse-small 0.5s infinite alternate', animationDelay: `${i * 0.1}s` }} />)}
                                    </div>}
                                </div>

                                <h3 style={{ fontSize: '1.6rem', color: '#f1f5f9', lineHeight: 1.4, marginBottom: '2.5rem', fontWeight: 600 }}>
                                    {loading ? "One moment, syncing with your last response..." : currentQuestion}
                                </h3>

                                <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.03)' }}>
                                    <div style={{ flex: 1, minHeight: '50px', display: 'flex', alignItems: 'center', padding: '0 1rem' }}>
                                        <p style={{ color: transcript ? '#f8fafc' : '#475569', fontSize: '1rem', fontStyle: 'italic', fontWeight: 300 }}>
                                            {transcript || "AI is listening... (Click 'Start Mic' to speak)"}
                                        </p>
                                    </div>

                                    <div style={{ display: 'flex', gap: '0.8rem' }}>
                                        <button onClick={() => setCapturing(!capturing)} style={{
                                            padding: '0 1.5rem',
                                            height: '56px',
                                            borderRadius: '14px',
                                            background: capturing ? 'rgba(239, 68, 68, 0.2)' : 'rgba(56, 189, 248, 0.1)',
                                            color: capturing ? '#ef4444' : '#38bdf8',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            cursor: 'pointer',
                                            fontWeight: 700,
                                            border: capturing ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(56, 189, 248, 0.4)',
                                            transition: 'all 0.2s ease'
                                        }}>
                                            {capturing ? <MicOff size={20} /> : <Mic size={20} />}
                                            {capturing ? 'Stop Mic' : 'Start Mic'}
                                        </button>

                                        <button onClick={handleNextQuestion} disabled={loading || (!transcript && !capturing)} className="btn-gradient" style={{
                                            padding: '0 2rem',
                                            height: '56px',
                                            borderRadius: '14px',
                                            fontWeight: 800,
                                            fontSize: '1rem',
                                            boxShadow: '0 10px 25px -5px rgba(56, 189, 248, 0.4)',
                                            opacity: loading ? 0.6 : 1
                                        }}>
                                            {questionNumber < totalQuestions ? 'Send Answer' : 'End Interview'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <LiveScores scores={scores} proTip={proTip} />
                    </div>
                )}
            </main>

            <style>{`
                @keyframes voice-pulse-small { 0% { height: 4px; } 100% { height: 20px; } }
                .voice-bar-small { width: 4px; height: 10px; background: #38bdf8; border-radius: 2px; animation: voice-pulse-small 0.4s infinite alternate ease-in-out; }
                .thinking-dots { display: flex; gap: 6px; }
                .thinking-dots span { width: 10px; height: 10px; background: #38bdf8; border-radius: 50%; animation: dot-blink 1.4s infinite both; }
                .thinking-dots span:nth-child(2) { animation-delay: 0.2s; }
                .thinking-dots span:nth-child(3) { animation-delay: 0.4s; }
                @keyframes dot-blink { 0%, 80%, 100% { opacity: 0; } 40% { opacity: 1; } }
                .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
                @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
            `}</style>
        </div>
    );
};

export default VideoInterview;
