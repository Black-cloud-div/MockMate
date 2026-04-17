import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../utils/api";
import Loader from "../components/Loader";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff", fontFamily: "'Inter', sans-serif", display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {/* Left Side: Illustration */}
        <div style={{
          flex: 1,
          background: '#000',
          backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.3), transparent, rgba(0,0,0,0.9)), url("/cline_side.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          borderRight: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '2rem'
        }}>
        </div>

        {/* Right Side: Login Form */}
        <div style={{
          width: '550px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4rem',
          background: '#000',
          position: 'relative'
        }}>
          <div style={{ marginBottom: "3rem", textAlign: "center" }}>
            <h1 style={{ fontSize: "2.4rem", fontWeight: 800, margin: 0, letterSpacing: '-1.5px' }}>Welcome to MockMate</h1>
            <p style={{ color: '#666', marginTop: '0.5rem' }}>Login to your technical environment.</p>
          </div>

          <div style={{ width: "100%", maxWidth: '400px' }}>
            <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1.5rem" }}>
              <div>
                <label style={{ fontSize: "0.75rem", color: "#666", display: "block", marginBottom: "0.8rem", fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Domain Email</label>
                <input
                  name="email"
                  type="email"
                  placeholder="name@company.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%", background: "#050505", border: "1px solid #222",
                    padding: "1.1rem", borderRadius: "12px", color: "#fff", fontSize: "1rem",
                    outline: 'none', transition: 'all 0.2s'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.75rem", color: "#666", display: "block", marginBottom: "0.8rem", fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Secret Key</label>
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%", background: "#050505", border: "1px solid #222",
                    padding: "1.1rem", borderRadius: "12px", color: "#fff", fontSize: "1rem",
                    outline: 'none', transition: 'all 0.2s'
                  }}
                />
              </div>

              {error && (
                <p style={{ fontSize: "0.9rem", color: "#ef4444", margin: '-0.5rem 0 0.5rem 0', textAlign: 'center', fontWeight: 600 }}>{error}</p>
              )}

              <button
                type="submit"
                style={{
                  width: "100%", background: "#fff", color: "#000",
                  padding: "1.1rem", borderRadius: "12px", fontWeight: 800,
                  fontSize: "1rem", cursor: "pointer", border: 'none',
                  transition: 'all 0.2s'
                }}
                disabled={loading}
              >
                {loading ? <Loader /> : "Initialize Access"}
              </button>
            </form>

            <p style={{ marginTop: "3rem", fontSize: "0.95rem", color: "#444", textAlign: "center" }}>
              New operative? <Link to="/register" style={{ color: "#fff", textDecoration: 'none', fontWeight: 700 }}>Generate Account</Link>
            </p>
          </div>

          <div style={{ position: 'absolute', bottom: '2rem', fontSize: '0.75rem', color: '#222', textAlign: 'center', width: '100%' }}>
            MockMate Security Standard v2.4 <br />
            <span style={{ opacity: 0.5 }}>Compliance & Privacy Protected</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
