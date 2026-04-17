import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import api from "../utils/api";
import Loader from "../components/Loader";

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [questionForm, setQuestionForm] = useState({
        role: "Frontend Developer",
        difficulty: "medium",
        text: ""
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [msg, setMsg] = useState("");

    const fetchData = async () => {
        try {
            const [usersRes, questionsRes] = await Promise.all([
                api.get("/admin/users"),
                api.get("/admin/questions")
            ]);
            setUsers(usersRes.data);
            setQuestions(questionsRes.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleChange = (e) =>
        setQuestionForm({ ...questionForm, [e.target.name]: e.target.value });

    const handleAddQuestion = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setMsg("");
        try {
            await api.post("/admin/add-question", {
                ...questionForm,
                tags: []
            });
            setMsg("Question added successfully!");
            setQuestionForm({ role: "", difficulty: "medium", text: "" });
            // Refresh list
            const res = await api.get("/admin/questions");
            setQuestions(res.data);
            setTimeout(() => setMsg(""), 3000);
        } catch (e) {
            console.error(e);
            setMsg(e.response?.data?.message || "Error adding question.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteQuestion = async (id) => {
        if (!confirm("Are you sure you want to delete this question?")) return;
        try {
            await api.delete(`/admin/question/${id}`);
            setQuestions(questions.filter((q) => q.id !== id));
        } catch (e) {
            console.error(e);
            alert("Failed to delete");
        }
    };

    return (
        <div style={{ minHeight: "100vh" }}>
            <Navbar />
            <main
                style={{
                    maxWidth: 1100,
                    margin: "0 auto",
                    padding: "2rem 1.5rem"
                }}
            >
                <h2 style={{ fontSize: "1.5rem", marginBottom: 6 }}>Admin Dashboard</h2>
                <p style={{ fontSize: "0.9rem", color: "#94a3b8", marginBottom: 24 }}>
                    Manage users and system content.
                </p>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
                        gap: "1.5rem"
                    }}
                >
                    {/* Add Question Form */}
                    <Card>
                        <div className="glass-inner" style={{ padding: "1.5rem" }}>
                            <h3 style={{ fontSize: "1.1rem", marginBottom: 12 }}>Add Interview Question</h3>
                            <form
                                onSubmit={handleAddQuestion}
                                style={{ display: "grid", gap: "0.9rem", fontSize: "0.9rem" }}
                            >
                                <div>
                                    <label style={{ fontSize: "0.8rem", color: "#cbd5e1" }}>Role</label>
                                    <select
                                        name="role"
                                        value={questionForm.role}
                                        onChange={handleChange}
                                        style={{ width: "100%", marginTop: 4, padding: "0.5rem" }}
                                    >
                                        <option value="" disabled>Select a role</option>
                                        {[
                                            "Frontend Developer",
                                            "Backend Developer",
                                            "Full‑Stack Developer",
                                            "Mobile App Developer",
                                            "AI/ML Engineer",
                                            "Data Scientist",
                                            "Data Engineer",
                                            "DevOps Engineer",
                                            "Cloud Engineer",
                                            "Cybersecurity Engineer",
                                            "Blockchain Developer"
                                        ].map((r) => (
                                            <option key={r} value={r}>
                                                {r}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: "0.8rem", color: "#cbd5e1" }}>Difficulty</label>
                                    <select
                                        name="difficulty"
                                        value={questionForm.difficulty}
                                        onChange={handleChange}
                                        style={{ width: "100%", marginTop: 4, padding: "0.5rem" }}
                                    >
                                        <option value="easy">Easy</option>
                                        <option value="medium">Medium</option>
                                        <option value="hard">Hard</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: "0.8rem", color: "#cbd5e1" }}>Question text</label>
                                    <textarea
                                        name="text"
                                        rows={3}
                                        placeholder="Enter the question here..."
                                        value={questionForm.text}
                                        onChange={handleChange}
                                        style={{ width: "100%", marginTop: 4, padding: "0.5rem" }}
                                        required
                                    />
                                </div>
                                {msg && <p style={{ color: msg.includes("Error") ? "#f87171" : "#4ade80", fontSize: "0.85rem" }}>{msg}</p>}
                                <button
                                    className="btn-gradient"
                                    type="submit"
                                    disabled={submitting}
                                    style={{ marginTop: 4 }}
                                >
                                    {submitting ? "Adding..." : "Add Question"}
                                </button>
                            </form>
                        </div>
                    </Card>

                    {/* Users List */}
                    <Card>
                        <div className="glass-inner" style={{ padding: "1.5rem" }}>
                            <h3 style={{ fontSize: "1.1rem", marginBottom: 12 }}>Registered Users ({users.length})</h3>
                            {loading ? (
                                <Loader />
                            ) : (
                                <ul style={{ fontSize: "0.9rem", maxHeight: 350, overflowY: "auto", paddingRight: 4 }}>
                                    {users.map((u) => (
                                        <li
                                            key={u.id}
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                padding: "0.6rem 0",
                                                borderBottom: "1px solid rgba(148,163,184,0.15)"
                                            }}
                                        >
                                            <span style={{ fontWeight: 500 }}>{u.name}</span>
                                            <span style={{ color: "#94a3b8", fontSize: "0.85rem" }}>{u.email}</span>
                                        </li>
                                    ))}
                                    {users.length === 0 && <p style={{ color: "#94a3b8" }}>No users found.</p>}
                                </ul>
                            )}
                        </div>
                    </Card>

                    {/* Questions List (Full Width) */}
                    <div style={{ gridColumn: "1 / -1" }}>
                        <Card>
                            <div className="glass-inner" style={{ padding: "1.5rem" }}>
                                <h3 style={{ fontSize: "1.1rem", marginBottom: 12 }}>Existing Questions ({questions.length})</h3>
                                {loading ? (
                                    <Loader />
                                ) : (
                                    <div style={{ maxHeight: 400, overflowY: "auto" }}>
                                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                                            <thead>
                                                <tr style={{ textAlign: "left", borderBottom: "1px solid rgba(148,163,184,0.2)" }}>
                                                    <th style={{ padding: "0.8rem 0.5rem", color: "#cbd5e1" }}>Role</th>
                                                    <th style={{ padding: "0.8rem 0.5rem", color: "#cbd5e1" }}>Difficulty</th>
                                                    <th style={{ padding: "0.8rem 0.5rem", color: "#cbd5e1" }}>Text</th>
                                                    <th style={{ padding: "0.8rem 0.5rem", width: 80 }}>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {questions.map((q) => (
                                                    <tr key={q.id} style={{ borderBottom: "1px solid rgba(148,163,184,0.1)" }}>
                                                        <td style={{ padding: "0.8rem 0.5rem" }}>{q.role}</td>
                                                        <td style={{ padding: "0.8rem 0.5rem" }}>
                                                            <span style={{
                                                                padding: "0.2rem 0.6rem", borderRadius: 99, fontSize: "0.75rem",
                                                                background: q.difficulty === 'hard' ? 'rgba(248,113,113,0.2)' : q.difficulty === 'medium' ? 'rgba(250,204,21,0.2)' : 'rgba(74,222,128,0.2)',
                                                                color: q.difficulty === 'hard' ? '#fca5a5' : q.difficulty === 'medium' ? '#fde047' : '#86efac'
                                                            }}>
                                                                {q.difficulty}
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: "0.8rem 0.5rem", color: "#e2e8f0" }}>{q.text}</td>
                                                        <td style={{ padding: "0.8rem 0.5rem" }}>
                                                            <button
                                                                onClick={() => handleDeleteQuestion(q.id)}
                                                                style={{
                                                                    background: "transparent",
                                                                    border: "none",
                                                                    color: "#f87171",
                                                                    cursor: "pointer",
                                                                    fontSize: "0.85rem",
                                                                    textDecoration: "underline"
                                                                }}
                                                            >
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {questions.length === 0 && (
                                                    <tr>
                                                        <td colSpan="4" style={{ padding: "1rem", textAlign: "center", color: "#94a3b8" }}>
                                                            No questions available.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminPanel;
