import { useEffect, useState } from "react";
import { fetchWithAuth } from "../../services/api";

export default function Overview() {
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
  } = data;

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
        Keerat, your career path is{" "}
        <span style={highlight}>{resilienceLabel}</span>
      </h1>

      <p style={subtitle}>
        Based on your skills and current market signals for{" "}
        <strong>{role}</strong>
      </p>

      <div style={grid}>
        <div style={card}>
          <h3>Career Readiness</h3>
          <div style={ring}>{readiness}%</div>
          <p style={muted}>
            Based on {skills.length} selected skills
          </p>
        </div>

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

      <div style={{ marginTop: "3.5rem" }}>
        <h3>Next improvement areas</h3>
        <Weak title="System Design" />
        <Weak title="Cloud Architecture" />
        <Weak title="Distributed Systems" />
      </div>

      <div style={ctaWrap}>
        <button style={cta}>
          Strengthen your weakest career pillar →
        </button>
      </div>
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

function Weak({ title }) {
  return <div style={weak}>{title}</div>;
}

/* ===== STYLES ===== */

const eyebrow = {
  color: "#3B82F6",
  letterSpacing: "0.25em",
  fontSize: "0.75rem",
};

const title = {
  fontSize: "2.6rem",
  marginTop: "0.8rem",
};

const highlight = {
  background: "linear-gradient(135deg,#3B82F6,#10B981)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

const subtitle = {
  marginTop: "0.8rem",
  color: "#9CA3AF",
};

const grid = {
  marginTop: "3rem",
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "2rem",
};

const card = {
  padding: "2rem",
  borderRadius: "20px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
};

const ring = {
  marginTop: "1rem",
  fontSize: "2.2rem",
  fontWeight: 700,
};

const muted = {
  marginTop: "0.4rem",
  color: "#9CA3AF",
};

const pill = {
  marginTop: "0.6rem",
  padding: "0.6rem 1rem",
  borderRadius: "999px",
  border: "1px solid rgba(59,130,246,0.5)",
  display: "inline-block",
  marginRight: "0.5rem",
};

const weak = {
  marginTop: "1rem",
  padding: "1rem",
  borderRadius: "14px",
  border: "1px solid rgba(245,158,11,0.5)",
};

const ctaWrap = {
  marginTop: "4rem",
  display: "flex",
  justifyContent: "center",
};

const cta = {
  padding: "0.9rem 2.4rem",
  borderRadius: "999px",
  fontWeight: 600,
  background: "linear-gradient(135deg,#3B82F6,#10B981)",
  border: "none",
  cursor: "pointer",
};