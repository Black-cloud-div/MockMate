require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { sequelize } = require("./models");

const authRoutes = require("./routes/authRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// Middleware
app.use(
    cors({
        origin: true,
        credentials: true
    })
);
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/interview", interviewRoutes);
app.use("/admin", adminRoutes);
app.use("/voice", require("./routes/voiceRoutes"));
app.use("/test", require("./routes/testRoutes"));

// Health check
app.get("/health", (_req, res) => {
    res.json({ message: "AI Mock Interview API running" });
});

// Serve Static Frontend (Integration)
const frontendPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendPath));

// Catch-all route to serve React App
app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});

const PORT = 5000;

// Sync Database and then start Server
sequelize
    .sync({ alter: true })
    .then(() => {
        console.log("SQLite Database connected & synced");
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Database connection error:", err);
    });
