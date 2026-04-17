const Card = ({ children, style }) => (
    <div className="glass-card" style={style}>
        <div className="glass-inner">{children}</div>
    </div>
);

export default Card;
