import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { fetchWithAuth } from "../../services/api";


export default function Overview() {
  const { user } = useUser();
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchWithAuth("/api/users/me")
      .then(setData)
      .catch((err) => {
        console.error(err);
        setError(true);
      });
  }, []);

  if (error) {
    return <p style={{ color: "red" }}>Failed to load snapshot.</p>;
  }

  if (!data) {
    return <p>Loading snapshot…</p>;
  }

  const {
    readiness = 0,
    role = "Unknown role",
    skills = [],
    aiInsights,
    firstName,
    lastName,
  } = data;

  const displayName =
    user?.firstName ||
    firstName ||
    "User";

  /* ✅ ROADMAP REDIRECT FUNCTION */
  const openRoadmap = (roleName) => {
    const known = encodeURIComponent(skills.join(","));
    const roleParam = encodeURIComponent(roleName);

    window.open(
      `http://localhost:5050/viewer?role=${roleParam}&known=${known}`,
      "_blank"
    );
  };

  const resilienceLabel =
    readiness >= 75
      ? "highly resilient"
      : readiness >= 50
      ? "moderately resilient"
      : "at risk";

  return (
    <>
      <p style={eyebrow}>CAREER SNAPSHOT</p>

      <h1 style={title}>
        {displayName}, your career path is{" "}
        <span style={highlight}>{resilienceLabel}</span>
      </h1>


      <p style={subtitle}>
        Based on your skills and current market signals for{" "}
        <strong>{role}</strong>
      </p>

      <div style={grid}>

        <div style={card}>
          <h3>Your current skills</h3>
          {skills.length === 0 ? (
            <p style={muted}>No skills selected yet</p>
          ) : (
            skills.slice(0, 6).map((skill) => (
              <Pill key={skill} title={skill} />
            ))
          )}
        </div>
      </div>

      {/* 🔥 CLICKABLE AI ROLE MATCHES */}
      {aiInsights?.matched_roles?.length > 0 && (
        <div style={{ marginTop: "3.5rem" }}>
          <h3>AI-recommended career paths</h3>

          <div style={{ marginTop: "1.5rem", display: "grid", gap: "1rem" }}>
            {aiInsights.matched_roles.slice(0, 5).map((item, i) => (
              <div
                key={i}
                style={{
                  ...card,
                  cursor: "pointer",
                  transition: "transform .15s ease",
                }}
                onClick={() => openRoadmap(item.role)}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-2px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "none")
                }
              >
                <h4>{item.role}</h4>
                <p style={muted}>
                  Match confidence: {(item.similarity_score * 100).toFixed(1)}%
                </p>
                <p style={{ marginTop: "0.5rem", color: "#60A5FA" }}>
                  View learning roadmap →
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🔥 SKILL RISK SECTION */}
      {aiInsights?.skill_decline_risk?.length > 0 && (
        <div style={{ marginTop: "3.5rem" }}>
          <h3>Skill decline risk (AI)</h3>

          {aiInsights.skill_decline_risk.slice(0, 5).map((risk, i) => (
            <div key={i} style={weak}>
              <strong>{risk.skill}</strong>
              <p style={muted}>
                Risk: {(risk.decline_risk_probability * 100).toFixed(1)}%
              </p>
            </div>
          ))}
        </div>
      )}


    </>
  );
}

/* ===== SMALL COMPONENTS ===== */

function Pill({ title }) {
  return (
    <div style={pill}>
      <strong>{title}</strong>
    </div>
  );
}

/* ===== STYLES ===== */

// const eyebrow = {
//   color: "#3B82F6",
//   letterSpacing: "0.25em",
//   fontSize: "0.75rem",
// };

// const title = {
//   fontSize: "2.6rem",
//   marginTop: "0.8rem",
// };

// const highlight = {
//   background: "linear-gradient(135deg,#3B82F6,#10B981)",
//   WebkitBackgroundClip: "text",
//   WebkitTextFillColor: "transparent",
// };

// const subtitle = {
//   marginTop: "0.8rem",
//   color: "#9CA3AF",
// };

// const grid = {
//   marginTop: "3rem",
//   display: "grid",
//   gridTemplateColumns: "1fr 1fr",
//   gap: "2rem",
// };

// const card = {
//   padding: "2.2rem",
//   borderRadius: "22px",
//   background:
//     "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
//   border: "1px solid rgba(255,255,255,0.12)",
//   boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
// };

// const ring = {
//   marginTop: "1rem",
//   fontSize: "2.2rem",
//   fontWeight: 700,
// };

// const muted = {
//   marginTop: "0.4rem",
//   color: "#9CA3AF",
// };

// const pill = {
//   marginTop: "0.6rem",
//   padding: "0.6rem 1rem",
//   borderRadius: "999px",
//   border: "1px solid rgba(59,130,246,0.5)",
//   display: "inline-block",
//   marginRight: "0.5rem",
// };

// const weak = {
//   marginTop: "1rem",
//   padding: "1.1rem 1.2rem",
//   borderRadius: "16px",
//   border: "1px solid rgba(245,158,11,0.4)",
//   background: "rgba(245,158,11,0.08)",
// };

// const ctaWrap = {
//   marginTop: "4rem",
//   display: "flex",
//   justifyContent: "center",
// };

// const cta = {
//   padding: "0.95rem 2.6rem",
//   borderRadius: "999px",
//   fontWeight: 600,
//   background: "linear-gradient(135deg,#3B82F6,#10B981)",
//   border: "none",
//   cursor: "pointer",
//   boxShadow: "0 12px 40px rgba(59,130,246,0.45)",
// };



/* ===== UPDATED OVERVIEW STYLES ===== */

const eyebrow = {
  color: "#3B82F6",
  letterSpacing: "0.2em",
  fontSize: "0.75rem",
  marginBottom: "0.6rem",
};

const title = {
  fontSize: "2.8rem",
  marginTop: "1rem",
  lineHeight: 1.2,
  maxWidth: "900px",
};

const highlight = {
  background: "linear-gradient(135deg,#3B82F6,#10B981)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

const subtitle = {
  marginTop: "0.9rem",
  color: "#94A3B8",
  fontSize: "1rem",
};

const grid = {
  marginTop: "3rem",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))",
  gap: "2.5rem",
};

const card = {
  padding: "2.4rem",
  borderRadius: "20px",
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.015))",
  border: "1px solid rgba(255,255,255,0.08)",
  backdropFilter: "blur(6px)",
  boxShadow: "0 25px 70px rgba(0,0,0,0.45)",
  transition: "all 0.25s ease",
};

const ring = {
  marginTop: "1.2rem",
  fontSize: "2.6rem",
  fontWeight: 700,
  background: "linear-gradient(135deg,#3B82F6,#10B981)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

const muted = {
  marginTop: "0.5rem",
  color: "#94A3B8",
};

const pill = {
  marginTop: "0.6rem",
  padding: "0.6rem 1.1rem",
  borderRadius: "999px",
  border: "1px solid rgba(59,130,246,0.35)",
  display: "inline-block",
  marginRight: "0.6rem",
  background: "rgba(59,130,246,0.08)",
  transition: "all 0.2s ease",
};

const weak = {
  marginTop: "1rem",
  padding: "1.2rem 1.4rem",
  borderRadius: "20px",
  border: "1px solid rgba(245,158,11,0.35)",
  background: "rgba(245,158,11,0.06)",
  backdropFilter: "blur(10px)",
};

const ctaWrap = {
  marginTop: "4.5rem",
  display: "flex",
  justifyContent: "center",
};

const cta = {
  padding: "1rem 2.8rem",
  borderRadius: "999px",
  fontWeight: 600,
  fontSize: "0.95rem",
  background: "linear-gradient(135deg,#3B82F6,#10B981)",
  border: "none",
  cursor: "pointer",
  boxShadow: "0 18px 50px rgba(59,130,246,0.4)",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
};