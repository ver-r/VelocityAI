export default function Badge({ label, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "0.45rem 0.9rem",
        borderRadius: "999px",
        border: selected
          ? "1px solid transparent"
          : "1px solid rgba(255,255,255,0.15)",
        background: selected
          ? "linear-gradient(135deg, #3B82F6, #10B981)"
          : "rgba(255,255,255,0.03)",
        color: selected ? "#0b0f19" : "white",
        fontSize: "0.85rem",
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        if (!selected) {
          e.currentTarget.style.border = "1px solid #3B82F6";
          e.currentTarget.style.boxShadow =
            "0 0 12px rgba(59,130,246,0.35)";
          e.currentTarget.style.transform = "translateY(-1px)";
        }
      }}
      onMouseLeave={(e) => {
        if (!selected) {
          e.currentTarget.style.border =
            "1px solid rgba(255,255,255,0.15)";
          e.currentTarget.style.boxShadow = "none";
          e.currentTarget.style.transform = "translateY(0)";
        }
      }}
    >
      {label}
    </button>
  );
}