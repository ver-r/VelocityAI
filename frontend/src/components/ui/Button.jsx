// src/components/ui/Button.jsx
export default function Button({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "linear-gradient(135deg, #3B82F6, #10B981)",
        color: "#0B0F19",
        border: "none",
        padding: "0.9rem 1.8rem",
        borderRadius: "999px",
        fontSize: "1rem",
        fontWeight: 600,
        cursor: "pointer",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        boxShadow: "0 0 30px rgba(59,130,246,0.35)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow =
          "0 0 45px rgba(59,130,246,0.6)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow =
          "0 0 30px rgba(59,130,246,0.35)";
      }}
    >
      {children}
    </button>
  );
}