import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import api from "../utils/api";
import Loader from "../components/Loader";
import Webcam from 'react-webcam';
import { Mic, MicOff, Play, Briefcase, Target, User } from "lucide-react";

// AI Interviewer Component with Talking Mechanism
const RecruiterVideo = ({ isSpeaking, isThinking }) => {
    const videoTalkingRef = useRef(null);
    const videoIdleRef1 = useRef(null);
    const videoIdleRef2 = useRef(null);
    const [activeIdle, setActiveIdle] = useState(1);
    const [imgSrc, setImgSrc] = useState("/sydney.jpg");

    // Seamless Gapless Loop Engine
    useEffect(() => {
        if (isSpeaking) return;

        const interval = setInterval(() => {
            const nextActive = activeIdle === 1 ? 2 : 1;
            const nextRef = nextActive === 1 ? videoIdleRef1.current : videoIdleRef2.current;

            if (nextRef) {
                nextRef.currentTime = 0;
                nextRef.play().catch(() => { });
            }

            // Precisely timed swap for maximum smoothness
            setTimeout(() => {
                setActiveIdle(nextActive);
            }, 400);
        }, 3400); // Reset early for long cross-fade overlap

        return () => clearInterval(interval);
    }, [isSpeaking, activeIdle]);

    useEffect(() => {
        if (isSpeaking) {
            if (videoTalkingRef.current) {
                videoTalkingRef.current.currentTime = 0;
                videoTalkingRef.current.play().catch(() => { });
            }
        } else {
            // Force play both to ensure ready-to-swap state
            videoIdleRef1.current?.play().catch(() => { });
            videoIdleRef2.current?.play().catch(() => { });
        }
    }, [isSpeaking]);

    const handleImgError = () => {
        const fallbacks = [
            "https://image.tmdb.org/t/p/w600_and_h900_bestv2/vS99n5rQY8p2k8p9r9D5Wc0U8.jpg",
            "https://m.media-amazon.com/images/M/MV5BMjA1MDg5NDYwNV5BMl5BanBnXkFtZTgwNjUxNTE4NjM@._V1_FMjpg_UX1000_.jpg"
        ];
        const nextIdx = fallbacks.indexOf(imgSrc) + 1;
        if (nextIdx < fallbacks.length) setImgSrc(fallbacks[nextIdx]);
    };

    return (
        <div style={{
            position: 'relative', width: '320px', height: '320px', borderRadius: '48px',
            overflow: 'hidden',
            border: isSpeaking ? '6px solid #ef4444' : (isThinking ? '4px solid #38bdf8' : '2px solid rgba(255,255,255,0.08)'),
            transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
            background: '#0f172a',
            boxShadow: isSpeaking ? '0 0 80px rgba(239, 68, 68, 0.4)' : (isThinking ? '0 0 60px rgba(56,189,248,0.3)' : '0 20px 50px rgba(0,0,0,0.6)'),
            flexShrink: 0,
            animation: isThinking ? 'pulse 1.5s infinite alternate' : 'none'
        }}>
            <style>{`
                @keyframes sydney-nod {
                    0%, 100% { transform: scale(1.5) translateY(0); }
                    50% { transform: scale(1.5) translateY(4px); }
                }
            `}</style>

            {/* The Base Image */}
            <img
                src={imgSrc}
                alt="Sydney Sweeney Base"
                onError={handleImgError}
                style={{
                    width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%',
                    position: 'absolute', inset: 0, zIndex: 0,
                    filter: isThinking ? 'grayscale(0.5) blur(4px)' : 'none',
                    transition: 'filter 1.5s ease-in-out'
                }}
            />

            {/* SEAMLESS IDLE LAYER 1 */}
            <video
                ref={videoIdleRef1}
                playsInline muted
                style={{
                    width: '100%', height: '100%', objectFit: 'cover',
                    objectPosition: 'center 15%',
                    position: 'absolute', inset: 0, zIndex: 1,
                    opacity: (!isSpeaking && activeIdle === 1) ? 1 : 0,
                    filter: isSpeaking ? 'blur(8px)' : 'none',
                    transition: 'opacity 1.5s ease-in-out, filter 1.5s ease-in-out',
                    animation: !isSpeaking ? 'sydney-nod 4s infinite ease-in-out' : 'none',
                    pointerEvents: 'none'
                }}
            >
                <source src="/idle.mp4" type="video/mp4" />
            </video>

            {/* SEAMLESS IDLE LAYER 2 */}
            <video
                ref={videoIdleRef2}
                playsInline muted
                style={{
                    width: '100%', height: '100%', objectFit: 'cover',
                    objectPosition: 'center 15%',
                    position: 'absolute', inset: 0, zIndex: 1,
                    opacity: (!isSpeaking && activeIdle === 2) ? 1 : 0,
                    filter: isSpeaking ? 'blur(8px)' : 'none',
                    transition: 'opacity 1.5s ease-in-out, filter 1.5s ease-in-out',
                    animation: !isSpeaking ? 'sydney-nod 4s infinite ease-in-out' : 'none',
                    pointerEvents: 'none'
                }}
            >
                <source src="/idle.mp4" type="video/mp4" />
            </video>

            {/* TALKING VIDEO */}
            <video
                ref={videoTalkingRef}
                playsInline muted loop
                style={{
                    width: '100%', height: '100%', objectFit: 'cover',
                    position: 'absolute', inset: 0, zIndex: 2,
                    opacity: isSpeaking ? 1 : 0,
                    transform: isSpeaking ? 'scale(1)' : 'scale(1.05)',
                    filter: !isSpeaking ? 'blur(8px)' : 'none',
                    transition: 'opacity 1.5s cubic-bezier(0.4, 0, 0.2, 1), transform 1.5s cubic-bezier(0.4, 0, 0.2, 1), filter 1.5s ease-in-out',
                    pointerEvents: 'none',
                    background: 'transparent'
                }}
            >
                <source src="/sydney.mp4" type="video/mp4" />
            </video>

            {/* Premium Branding Tag */}
            <div style={{
                position: 'absolute', top: '25px', left: '25px',
                background: 'rgba(239, 68, 68, 0.9)', backdropFilter: 'blur(12px)',
                padding: '10px 22px', borderRadius: '100px',
                fontSize: '0.8rem', fontWeight: 800, color: '#fff',
                display: 'flex', alignItems: 'center', gap: '12px', zIndex: 10,
                letterSpacing: '1px', boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                pointerEvents: 'none'
            }}>
                <div style={{
                    width: 10, height: 10, borderRadius: '50%', background: '#fff',
                    animation: isSpeaking ? 'pulse 0.6s infinite alternate' : 'none'
                }} />
                SYDNEY SWEENEY AI
            </div>

            {/* Audio Waves */}
            {isSpeaking && (
                <div style={{ position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px', zIndex: 10 }}>
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="v-bar" style={{
                            height: '20px', width: '4px', background: '#ef4444',
                            borderRadius: '20px', animation: 'v-pulse 0.4s infinite alternate ease-in-out',
                            animationDelay: `${i * 0.1}s`
                        }} />
                    ))}
                </div>
            )}
        </div>
    );
};

const MockInterview = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const webcamRef = useRef(null);
    const recognitionRef = useRef(null);

    const queryParams = new URLSearchParams(location.search);
    const initialMode = queryParams.get('mode') || 'video';

    const [step, setStep] = useState(1);
    const [mode, setMode] = useState(initialMode);
    const [role, setRole] = useState("Frontend Developer");
    const [difficulty, setDifficulty] = useState("medium");
    const [resumeText, setResumeText] = useState("");
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [qIndex, setQIndex] = useState(1);
    const [loading, setLoading] = useState(false);
    const [isThinking, setIsThinking] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isRecording, setIsRecording] = useState(false);

    useEffect(() => {
        if ('webkitSpeechRecognition' in window) {
            const SpeechRecognition = window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (e) => {
                let accumulated = '';
                for (let i = 0; i < e.results.length; i++) {
                    accumulated += e.results[i][0].transcript;
                }
                setAnswer(accumulated);
            };

            recognitionRef.current.onerror = (e) => {
                console.error("Speech Recognition Error:", e.error);
                setIsRecording(false);
            };

            recognitionRef.current.onend = () => {
                setIsRecording(false);
            };
        }

        const loadVoices = () => { window.speechSynthesis.getVoices(); };
        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;
    }, []);

    const speakText = (text) => {
        if (!text) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        const voices = window.speechSynthesis.getVoices();
        // Finding a more "Sydney-like" voice (articulate, professional female)
        const preferredVoices = voices.filter(v => v.name.includes('Google US English') || v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Zira'));
        if (preferredVoices.length > 0) utterance.voice = preferredVoices[0];
        utterance.rate = 1.05; // Slightly more energetic
        utterance.pitch = 1.0;
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
    };

    // AUTO-SPEAK on question change
    useEffect(() => {
        if (step === 2 && question && mode === 'video') {
            const timer = setTimeout(() => speakText(question), 600);
            return () => clearTimeout(timer);
        }
    }, [question, step]);

    const handleResume = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setLoading(true);
        try {
            const fd = new FormData();
            fd.append('resume', file);
            const res = await api.post('/interview/extract-resume', fd);
            setResumeText(res.data.text);
            alert("Resume and Skills Analyzed!");
        } catch (e) { alert("File error"); } finally { setLoading(false); }
    };

    const startInterview = async () => {
        setLoading(true);
        try {
            const res = await api.post("/interview/generate-question", { role, difficulty, resumeContext: resumeText });
            setQuestion(res.data.question);
            localStorage.setItem("currentInterviewId", res.data.interviewId);
            setStep(2);
        } catch (e) { alert("Backend error"); } finally { setLoading(false); }
    };

    const submitAnswer = async () => {
        if (!answer.trim()) return;
        setIsThinking(true);
        try {
            const id = localStorage.getItem("currentInterviewId");
            if (!id) throw new Error("Missing Interview ID");

            console.log(`Submitting Answer for Interview #${id}...`);
            await api.post("/interview/submit", {
                interviewId: Number(id),
                answerText: answer
            });

            if (qIndex < 5) {
                console.log("Generating Follow-up question...");
                const res = await api.post("/interview/generate-followup", {
                    role,
                    previousQuestion: question,
                    previousAnswer: answer
                });
                setQuestion(res.data.question);
                setAnswer("");
                setQIndex(q => q + 1);
            } else {
                console.log("Interview Complete. Navigating to results.");
                navigate(`/result/${id}`);
            }
        } catch (e) {
            console.error("Submission Failure:", e);
            alert(`Submission Error: ${e.response?.data?.detail || e.message}`);
        } finally {
            setIsThinking(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#000', color: '#fff', fontFamily: "'Inter', sans-serif" }}>
            <Navbar />
            <main style={{ maxWidth: 1100, margin: '0 auto', padding: '3rem 2rem' }}>
                <AnimatePresence mode="wait">
                    {step === 1 ? (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.4 }}
                            style={{ maxWidth: 800, margin: '0 auto' }}
                        >
                            <div style={{ marginBottom: '4rem' }}>
                                <h2 style={{ fontSize: '2.8rem', fontWeight: 800, margin: '0 0 1rem 0', letterSpacing: '-1.5px' }}>Configure Session</h2>
                                <p style={{ color: '#666', fontSize: '1.1rem' }}>Ready your technical environment for {mode} mode.</p>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                <div style={{ background: '#111', borderRadius: '24px', border: '1px solid #222', padding: '2.5rem' }}>
                                    <label style={{ fontSize: '0.75rem', color: '#666', display: 'block', marginBottom: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Position Title</label>
                                    <select value={role} onChange={e => setRole(e.target.value)} style={{ width: '100%', padding: '1rem', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '12px', marginBottom: '2rem', outline: 'none' }}>
                                        {[
                                            "Frontend Developer",
                                            "Backend Developer",
                                            "Full‑Stack Developer",
                                            "Data Scientist",
                                            "AI/ML Engineer",
                                            "DevOps Engineer",
                                            "Cloud Architect",
                                            "Cybersecurity Analyst",
                                            "Product Manager",
                                            "Mobile Developer (iOS/Android)",
                                            "Database Administrator",
                                            "Embedded Systems Engineer"
                                        ].map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                    <label style={{ fontSize: '0.75rem', color: '#666', display: 'block', marginBottom: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Complexity Level</label>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        {['easy', 'medium', 'hard'].map(l => (
                                            <button key={l} onClick={() => setDifficulty(l)} style={{ flex: 1, padding: '1rem', borderRadius: '12px', border: difficulty === l ? '2px solid #fff' : '1px solid #222', background: difficulty === l ? '#fff' : 'transparent', color: difficulty === l ? '#000' : '#666', textTransform: 'capitalize', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>{l}</button>
                                        ))}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div style={{ background: '#111', padding: '2.5rem', borderRadius: '24px', border: '1px solid #222' }}>
                                        <h4 style={{ fontWeight: 700, margin: '0 0 1rem 0', fontSize: '1.2rem' }}>Resume Persistence</h4>
                                        <input type="file" onChange={handleResume} style={{ color: '#444', fontSize: '0.9rem' }} title="Upload Resume" />
                                        <p style={{ fontSize: '0.85rem', color: '#444', marginTop: '1.5rem', lineHeight: 1.5 }}>Upload your PDF to enable project-specific technical deep dives.</p>
                                    </div>
                                    <button onClick={startInterview} style={{ padding: '1.4rem', borderRadius: '16px', background: '#fff', color: '#000', border: 'none', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'} onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}>
                                        {loading ? <Loader /> : "Initialize Interview"}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.4 }}
                            style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
                        >
                            {mode === 'video' && (
                                <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
                                    <div style={{ flex: 1, aspectRatio: '16/9', background: '#000', borderRadius: '32px', overflow: 'hidden', border: '1px solid #222', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
                                        <Webcam ref={webcamRef} audio={false} mirrored style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div style={{ width: '320px', height: '320px', flexShrink: 0 }}>
                                        <RecruiterVideo isSpeaking={isSpeaking} isThinking={isThinking} />
                                    </div>
                                </div>
                            )}

                            <div style={{ background: '#111', borderRadius: '32px', padding: '3.5rem', border: '1px solid #222' }}>
                                <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem' }}>
                                    <span style={{ padding: '6px 16px', background: '#222', color: '#fff', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>SEQUENCE {qIndex}/5</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem', gap: '3rem' }}>
                                    <h3 style={{ fontSize: '2rem', fontWeight: 700, color: '#fff', lineHeight: 1.3, letterSpacing: '-0.5px' }}>{isThinking ? "Evaluating logic..." : question}</h3>
                                    {mode === 'video' && (
                                        <button onClick={() => speakText(question)} style={{ flexShrink: 0, padding: '0.8rem 1.4rem', background: 'transparent', color: '#fff', border: '1px solid #333', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <Play size={16} fill="#fff" /> Re-trigger
                                        </button>
                                    )}
                                </div>

                                <div style={{ background: '#000', borderRadius: '24px', padding: '2rem', border: '1px solid #222', marginBottom: '2.5rem' }}>
                                    {mode === 'video' ? (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                            <div style={{ flex: 1 }}>
                                                <p style={{ color: answer ? '#fff' : '#444', fontStyle: 'italic', fontSize: '1.1rem', margin: 0, lineHeight: 1.6 }}>{answer || "Waiting for voice input..."}</p>
                                            </div>
                                            <button
                                                onClick={() => { if (!recognitionRef.current) return; if (isRecording) { recognitionRef.current.stop(); setIsRecording(false); } else { setAnswer(""); recognitionRef.current.start(); setIsRecording(true); } }}
                                                style={{
                                                    minWidth: '160px', padding: '1.2rem', borderRadius: '16px',
                                                    background: isRecording ? '#ef4444' : '#fff',
                                                    color: isRecording ? '#fff' : '#000',
                                                    border: 'none', fontWeight: 800, fontSize: '1rem', cursor: 'pointer',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                {isRecording ? "Stop Recording" : "Start Answer"}
                                            </button>
                                        </div>
                                    ) : (
                                        <textarea value={answer} onChange={e => setAnswer(e.target.value)} rows={7} placeholder="Console your technical response..." style={{ width: '100%', background: 'transparent', border: 'none', color: '#fff', fontSize: '1.2rem', resize: 'none', outline: 'none', lineHeight: 1.6 }} />
                                    )}
                                </div>

                                <button onClick={submitAnswer} disabled={isThinking || !answer} style={{ width: '100%', padding: '1.4rem', borderRadius: '16px', background: isThinking ? '#222' : '#fff', color: isThinking ? '#666' : '#000', border: 'none', fontWeight: 800, fontSize: '1.1rem', cursor: (isThinking || !answer) ? 'not-allowed' : 'pointer' }}>
                                    {isThinking ? <Loader /> : "Transmit Response"}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
            <style>{` 
                .v-bar { width: 4px; height: 12px; background: #fff; border-radius: 2px; } 
                @keyframes pulse { 0% { opacity: 1; transform: scale(1); } 100% { opacity: 0.5; transform: scale(1.05); } }
                @keyframes v-pulse { from { height: 4px; } to { height: 28px; } }
            `}</style>
        </div>
    );
};
export default MockInterview;
