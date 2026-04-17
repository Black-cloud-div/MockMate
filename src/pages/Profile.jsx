import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import api from "../utils/api";
import Loader from "../components/Loader";
import { User, Mail, Target, Briefcase, Bell, Globe, Shield } from "lucide-react";

const Profile = () => {
    const [user, setUser] = useState({
        name: "",
        email: "",
        careerGoal: "Senior Software Engineer",
        experienceLevel: "0-2 Years (Junior)",
        emailNotifs: true,
        publicProfile: false
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get("/auth/profile");
                setUser(prev => ({ ...prev, ...res.data }));
            } catch (e) {
                console.error("Failed to fetch profile", e);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await api.put("/auth/profile", user);
            setUser(prev => ({ ...prev, ...res.data }));
            alert("Profile Configuration Updated.");
        } catch (e) {
            console.error(e);
            alert("Update failed.");
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    if (loading) return (
        <div style={{ minHeight: '100vh', background: '#000', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Loader />
        </div>
    );

    return (
        <div style={{ minHeight: "100vh", background: "#000", color: "#fff", fontFamily: "'Inter', sans-serif" }}>
            <Navbar />
            <main style={{ maxWidth: 900, margin: "0 auto", padding: "4rem 2rem" }}>

                <div style={{ marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: "2.8rem", fontWeight: 800, margin: '0 0 1rem 0', letterSpacing: '-1.5px' }}>Operator Profile</h2>
                    <p style={{ color: "#666", fontSize: "1.1rem" }}>Configure your professional parameters and system preferences.</p>
                </div>

                <div style={{ display: "grid", gap: "1.5rem" }}>

                    {/* Identity Matrix */}
                    <div style={{ background: '#111', borderRadius: '32px', border: '1px solid #222', padding: '3rem', display: 'flex', alignItems: 'center', gap: '3rem', flexWrap: 'wrap' }}>
                        <div style={{ position: "relative" }}>
                            <div style={{
                                width: 120, height: 120, borderRadius: "32px",
                                background: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: "3rem", fontWeight: 800, color: "#000",
                                boxShadow: "0 20px 40px rgba(0,0,0,0.5)"
                            }}>
                                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                            </div>
                            <div style={{
                                position: "absolute", bottom: -5, right: -5,
                                width: 32, height: 32, borderRadius: "10px",
                                background: "#fff", border: "4px solid #111",
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <Shield size={14} color="#000" />
                            </div>
                        </div>

                        <div>
                            <h3 style={{ fontSize: "2rem", fontWeight: 800, margin: '0 0 0.5rem 0', letterSpacing: '-1px' }}>{user.name}</h3>
                            <p style={{ color: "#666", marginBottom: "1.5rem", fontSize: '1.1rem' }}>{user.email}</p>
                            <div style={{ display: "flex", gap: "10px" }}>
                                <Badge text="Primary Operative" />
                                <Badge text="v2.4 Core Access" />
                            </div>
                        </div>
                    </div>

                    {/* Configuration Form */}
                    <div style={{ background: '#111', borderRadius: '32px', border: '1px solid #222', padding: '3rem' }}>
                        <h3 style={{ fontSize: "1rem", color: "#444", fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Target size={18} /> Core Parameters
                        </h3>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
                            <InputField label="Full Name" name="name" value={user.name} onChange={handleChange} icon={<User size={16} />} />
                            <InputField label="Email Address" value={user.email} disabled icon={<Mail size={16} />} />

                            <div>
                                <label style={{ display: "block", color: "#444", fontSize: "0.75rem", fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: "1rem" }}>Career Objective</label>
                                <select name="careerGoal" value={user.careerGoal} onChange={handleChange} style={inputStyles}>
                                    <option>Senior Software Engineer</option>
                                    <option>Tech Lead</option>
                                    <option>Engineering Manager</option>
                                    <option>Product Manager</option>
                                    <option>Frontend Developer</option>
                                    <option>Backend Developer</option>
                                    <option>Full-Stack Developer</option>
                                    <option>Data Scientist</option>
                                    <option>AI/ML Engineer</option>
                                    <option>DevOps Engineer</option>
                                    <option>Cloud Architect</option>
                                    <option>Cybersecurity Analyst</option>
                                    <option>Mobile Developer</option>
                                    <option>Database Administrator</option>
                                    <option>Embedded Systems Engineer</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: "block", color: "#444", fontSize: "0.75rem", fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: "1rem" }}>Experience Tier</label>
                                <select name="experienceLevel" value={user.experienceLevel} onChange={handleChange} style={inputStyles}>
                                    <option>0-2 Years (Junior)</option>
                                    <option>3-5 Years (Mid-Level)</option>
                                    <option>5+ Years (Senior)</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ marginTop: "3rem", display: "flex", justifyContent: "flex-end" }}>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                style={{
                                    padding: '1.2rem 3rem', borderRadius: '14px', background: '#fff', color: '#000',
                                    border: 'none', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', transition: 'transform 0.2s'
                                }}
                                onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                            >
                                {saving ? <Loader /> : "Commit Changes"}
                            </button>
                        </div>
                    </div>

                    {/* Protocols */}
                    <div style={{ background: '#111', borderRadius: '32px', border: '1px solid #222', padding: '3rem' }}>
                        <h3 style={{ fontSize: "1rem", color: "#444", fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Bell size={18} /> System Protocols
                        </h3>
                        <ProtocolToggle
                            title="Matrix Notifications"
                            desc="Receive analytical summaries of performance cycles."
                            active={user.emailNotifs}
                            onClick={() => setUser(prev => ({ ...prev, emailNotifs: !prev.emailNotifs }))}
                        />
                        <ProtocolToggle
                            title="Public Deployment"
                            desc="Allow external entities to view performance metrics."
                            active={user.publicProfile}
                            onClick={() => setUser(prev => ({ ...prev, publicProfile: !prev.publicProfile }))}
                        />
                    </div>

                </div>
            </main>
        </div>
    );
};

const Badge = ({ text }) => (
    <span style={{
        background: "#050505", color: "#fff",
        padding: "6px 14px", borderRadius: "8px", fontSize: "0.75rem", fontWeight: 700, border: "1px solid #222", textTransform: 'uppercase', letterSpacing: '0.5px'
    }}>
        {text}
    </span>
);

const inputStyles = {
    width: "100%", background: "#050505", border: "1px solid #222",
    padding: "1.1rem", borderRadius: "12px", color: "#fff", fontSize: "1rem", outline: 'none'
};

const InputField = ({ label, name, value, onChange, disabled, icon }) => (
    <div>
        <label style={{ display: "block", color: "#444", fontSize: "0.75rem", fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: "1rem" }}>{label}</label>
        <div style={{ position: 'relative' }}>
            <input name={name} value={value} onChange={onChange} disabled={disabled} style={{ ...inputStyles, opacity: disabled ? 0.4 : 1 }} />
        </div>
    </div>
);

const ProtocolToggle = ({ title, desc, active, onClick }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem", paddingBottom: "2rem", borderBottom: "1px solid #1a1a1a" }}>
        <div>
            <p style={{ fontWeight: 800, margin: '0 0 5px 0', fontSize: '1.1rem' }}>{title}</p>
            <p style={{ fontSize: "0.9rem", color: "#555", margin: 0 }}>{desc}</p>
        </div>
        <div onClick={onClick} style={{
            width: 52, height: 28, background: active ? "#fff" : "#1a1a1a",
            borderRadius: 99, position: "relative", cursor: "pointer", transition: "all 0.3s"
        }}>
            <div style={{
                position: "absolute", left: active ? 26 : 4, top: 4, width: 20, height: 20,
                background: active ? "#000" : "#444", borderRadius: "50%", transition: "all 0.3s"
            }}></div>
        </div>
    </div>
);

export default Profile;
