import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';

const LiveScores = ({ scores, proTip }) => {
    const radarData = [
        { skill: 'Communication', value: scores.communication || 0 },
        { skill: 'Technical', value: scores.technical || 0 },
        { skill: 'Confidence', value: scores.confidence || 0 },
    ];

    const getScoreColor = (score) => {
        if (score >= 8) return '#22c55e'; // Green
        if (score >= 6) return '#f59e0b'; // Orange
        return '#ef4444'; // Red
    };

    const ScoreBar = ({ label, value, max = 10 }) => {
        const percentage = (value / max) * 100;
        return (
            <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>{label}</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: getScoreColor(value) }}>
                        {value}/{max}
                    </span>
                </div>
                <div style={{
                    width: '100%',
                    height: '8px',
                    background: 'rgba(148, 163, 184, 0.2)',
                    borderRadius: '4px',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        width: `${percentage}%`,
                        height: '100%',
                        background: getScoreColor(value),
                        transition: 'width 0.5s ease',
                        borderRadius: '4px'
                    }} />
                </div>
            </div>
        );
    };

    return (
        <div style={{
            padding: '1.5rem',
            background: 'rgba(10, 14, 26, 0.8)',
            borderRadius: '16px',
            border: '1px solid rgba(148, 163, 184, 0.15)',
            height: '100%'
        }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem', color: '#e2e8f0' }}>
                Live Scores
            </h3>

            {/* Radar Chart */}
            <div style={{ marginBottom: '2rem' }}>
                <ResponsiveContainer width="100%" height={200}>
                    <RadarChart data={radarData}>
                        <PolarGrid stroke="rgba(148, 163, 184, 0.2)" />
                        <PolarAngleAxis dataKey="skill" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                        <Radar
                            name="Scores"
                            dataKey="value"
                            stroke="#3b82f6"
                            fill="#3b82f6"
                            fillOpacity={0.6}
                            animationDuration={500}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>

            {/* Score Bars */}
            <div style={{ marginBottom: '2rem' }}>
                <ScoreBar label="Communication" value={scores.communication || 0} />
                <ScoreBar label="Technical" value={scores.technical || 0} />
                <ScoreBar label="Confidence" value={scores.confidence || 0} />
            </div>

            {/* Pro Tip */}
            {proTip && (
                <div style={{
                    padding: '1rem',
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '12px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '1.2rem' }}>💡</span>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#60a5fa' }}>Pro Tip:</span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
                        {proTip}
                    </p>
                </div>
            )}
        </div>
    );
};

export default LiveScores;
