import { useState, useEffect } from "react";

const Timer = ({ duration = 60, onTimeUp }) => {
    const [timeLeft, setTimeLeft] = useState(duration);

    useEffect(() => {
        if (timeLeft <= 0) {
            onTimeUp && onTimeUp();
            return;
        }
        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft, onTimeUp]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? "0" : ""}${s}`;
    };

    return (
        <div
            style={{
                fontSize: "1.2rem",
                fontFamily: "monospace",
                color: timeLeft < 10 ? "#f87171" : "#e2e8f0",
                background: "rgba(15, 23, 42, 0.6)",
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                border: "1px solid rgba(148, 163, 184, 0.2)",
                display: "inline-block",
                marginBottom: "1rem"
            }}
        >
            Time Remaining: {formatTime(timeLeft)}
        </div>
    );
};

export default Timer;
