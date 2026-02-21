export default function Card({ title, children }) {
  return (
    <div
      style={{
        background: "#0f172a",
        border: "1px solid rgba(255,255,255,0.05)",
        borderRadius: "16px",
        padding: "1.2rem 1.4rem",
        marginBottom: "1.5rem",
      }}
    >
      <h3 style={{ fontSize: "1.1rem", fontWeight: 600 }}>{title}</h3>
      {children}
    </div>
  );
}