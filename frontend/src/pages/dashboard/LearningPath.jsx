import { useNavigate } from "react-router-dom";

const LEARNING_PATH = [
  {
    phase: "Foundation",
    tagline: "Build the base that everything stands on",
    skills: ["System Design", "CI/CD"],
  },
  {
    phase: "Core Strengthening",
    tagline: "Turn competence into confidence",
    skills: ["Redis", "Cloud Architecture"],
  },
  {
    phase: "Advanced Edge",
    tagline: "Operate at scale. Think like a senior.",
    skills: ["Distributed Systems", "Observability"],
  },
];

export default function LearningPath() {
  const navigate = useNavigate();

  return (
    <div style={page}>
      <div style={container}>
        {/* HEADER */}
        <div style={header}>
          <p style={eyebrow}>CAREER JOURNEY</p>
          <h1 style={title}>
            Your Path to Becoming a{" "} 
            
              <span style={highlight}>
                Back End Developer
              </span>
            
          </h1>
          <p style={subtitle}>
            Each phase builds toward long-term career resilience.
          </p>
        </div>

        {/* PATH */}
        <div style={pathWrapper}>
          {LEARNING_PATH.map((phase, index) => (
            <div key={phase.phase} style={phaseBlock}>
              {/* Circle Node */}
              <div style={circle}>
                {index + 1}
              </div>

              {/* Card */}
              <div
                style={card}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow =
                    "0 25px 60px rgba(59,130,246,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 10px 30px rgba(0,0,0,0.5)";
                }}
              >
                <h3 style={phaseTitle}>{phase.phase}</h3>
                <p style={tagline}>{phase.tagline}</p>

                <div style={skills}>
                  {phase.skills.map((skill) => (
                    <span key={skill} style={pill}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Connector Arrow */}
              {index !== LEARNING_PATH.length - 1 && (
                <div style={connector}>↓</div>
              )}
            </div>
          ))}
        </div>

        {/* BACK BUTTON */}
        <div style={{ marginTop: "4rem", textAlign: "center" }}>
          <button style={backBtn} onClick={() => navigate(-1)}>
            ← Return to Snapshot
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const page = {
  minHeight: "100vh",
  background:
    "radial-gradient(1000px 500px at 50% 0%, rgba(59,130,246,0.15), transparent 60%), #0b0f19",
  padding: "5rem 2rem",
  color: "white",
};

const container = {
  maxWidth: "800px",
  margin: "0 auto",
  textAlign: "center",
};

const header = {
  marginBottom: "4rem",
};

const eyebrow = {
  letterSpacing: "0.3em",
  fontSize: "0.75rem",
  color: "#3B82F6",
};

const title = {
  fontSize: "2.6rem",
  marginTop: "0.8rem",
};

const highlight = {
  background: "linear-gradient(135deg, #3B82F6, #10B981)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

const subtitle = {
  marginTop: "1rem",
  color: "#9CA3AF",
};

const pathWrapper = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "2.5rem",
};

const phaseBlock = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const circle = {
  width: "60px",
  height: "60px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #3B82F6, #10B981)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 700,
  fontSize: "1.2rem",
  marginBottom: "1.5rem",
  boxShadow: "0 0 30px rgba(59,130,246,0.6)",
};

const card = {
  width: "100%",
  background: "rgba(255,255,255,0.04)",
  borderRadius: "20px",
  padding: "2rem",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
  transition: "all 0.3s ease",
};

const phaseTitle = {
  fontSize: "1.5rem",
};

const tagline = {
  marginTop: "0.6rem",
  color: "#9CA3AF",
};

const skills = {
  marginTop: "1.2rem",
  display: "flex",
  justifyContent: "center",
  gap: "0.8rem",
  flexWrap: "wrap",
};

const pill = {
  padding: "0.5rem 1rem",
  borderRadius: "999px",
  border: "1px solid #3B82F6",
  fontSize: "0.85rem",
};

const connector = {
  fontSize: "2rem",
  marginTop: "1rem",
  color: "#3B82F6",
  opacity: 0.6,
};

const backBtn = {
  background: "transparent",
  border: "1px solid rgba(255,255,255,0.2)",
  padding: "0.7rem 1.6rem",
  borderRadius: "999px",
  color: "white",
  cursor: "pointer",
};