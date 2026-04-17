import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const isActive = (path) => location.pathname === path;

    return (
        <header
            style={{
                padding: "1rem 2.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                position: "sticky",
                top: 0,
                zIndex: 40,
                background: "#000",
                borderBottom: "1px solid rgba(255,255,255,0.08)"
            }}
        >
            <Link to="/" style={{ fontWeight: 800, fontSize: "1.2rem", display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                    width: '32px', height: '32px', background: '#fff', borderRadius: '8px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <img src="/logo.png" alt="Icon" style={{ width: '22px', height: '22px' }} onError={(e) => e.target.style.display = 'none'} />
                </div>
                <span style={{ color: "#fff", letterSpacing: '-0.5px' }}>MockMate</span>
            </Link>

            <nav style={{ display: "flex", gap: "2.5rem", fontSize: "0.9rem" }}>
                {token && (
                    <>
                        <NavLink to="/dashboard" text="Console" active={isActive("/dashboard")} />
                        <NavLink to="/interview" text="AI Session" active={isActive("/interview") || isActive("/mock-interview")} />
                        <NavLink to="/mock-test" text="Practice" active={isActive("/mock-test")} />
                    </>
                )}
            </nav>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                {token ? (
                    <button
                        style={{
                            background: 'transparent', color: '#9ca3af', border: 'none',
                            fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                            transition: 'color 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.color = '#fff'}
                        onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
                        onClick={handleLogout}
                    >
                        Sign Out
                    </button>
                ) : (
                    <button
                        style={{
                            background: '#fff', color: '#000', border: 'none',
                            padding: '0.7rem 1.4rem', borderRadius: '10px', fontSize: '0.85rem',
                            fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.03)'}
                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </button>
                )}
            </div>
        </header>
    );
};

const NavLink = ({ to, text, active }) => (
    <Link
        to={to}
        style={{
            color: active ? "#fff" : "#666",
            fontWeight: active ? 800 : 500,
            textDecoration: 'none',
            fontSize: '0.9rem',
            transition: 'color 0.2s',
            borderBottom: active ? '2px solid #fff' : '2px solid transparent',
            paddingBottom: '4px'
        }}
        onMouseEnter={(e) => e.target.style.color = '#fff'}
        onMouseLeave={(e) => e.target.style.color = active ? "#fff" : "#666"}
    >
        {text}
    </Link>
);

export default Navbar;
